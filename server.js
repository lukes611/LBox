var express = require('express');
var fs = require('fs');
var mime = require('mime');
var bodyParser = require('body-parser');
var fileData = require('./helpers/fileData');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



var port = 8142;
var folder = '/home/luke';

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
    res.sendFile(req.query.filePath);
});


app.use(express.static('static'));

app.listen(port, function(){
    console.log('listening on port ' + port);
});