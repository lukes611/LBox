var express = require('express');
var fs = require('fs');
var mime = require('mime');
var bodyParser = require('body-parser');
var fileData = require('./helpers/fileData');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



var port = 8142;
var folder = __dirname.split('/').slice(0,-1).join('/');

if(process.argv.length > 2){
    folder = process.argv[2];
}

console.log('access to ', folder);

app.get('/getCurrentDirectory', function(req, res){
    res.json({response : folder, error : false});
});


app.get('/isSafe', function(req, res){
    var file = fileData.pathIsSafe(folder, req.query.dir);
    res.json({isSafe : !file.error});
});

app.get('/fileList', function(req, res){
    
    var dir = req.query.dir;
    var _ = fileData.pathIsSafe(folder, dir);
    if(_.error){
        res.json({error:true});
        return;
    }
    dir = _.path;
    
    fileData.getFiles(req.query.dir, function(files){
        res.json({files:files, error:false});
    }, function(){
        res.json({error:true});
    });
});

app.get('/downloadFile', function(req, res){
    var file = req.query.filePath;
    res.sendFile(file, {dotfiles:'allow'});
});

app.post('/saveFile', function(req, res){
    var path = req.body.file.path;
    var _ = fileData.pathIsSafe(folder, path);
    if(_.error){
        res.json({error:true});
        return;
    }
    path = _.path;
    //console.log('trying to save ', path);
    
    fs.writeFile(path, req.body.content || '', function(err){
        if(err) res.json({error:true});
        else res.json({error:false});
        
    });
});

app.get('/createFile', function(req, res){
    var name = fileData.getSafeName(req.query.name);
    var isDir = req.query.isDir;
    var dir = req.query.dir;
    var _ = fileData.pathIsSafe(folder, dir);
    if(_.error || name.length <= 0){
        res.json({error:true});
        return;
    }
    
    fileData.getFiles(dir, function(files){
        var exists = files.filter(function(f){ return f.name.toLowerCase() == name.toLowerCase();}).length > 0;
        if(!exists){
            if(isDir==true){
                fs.mkdir(dir + '/' + name, function(){
                    res.json({error:false});
                });
            }else{
                fs.closeSync(fs.openSync(dir+'/'+name, 'w'));
                res.json({error:false});
            }
            
        }else res.json({error:true});
    }, function(){
        res.json({error:true});
    });
    
    
});


app.use(express.static('static'));

app.listen(port, function(){
    console.log('listening on port ' + port);
});