var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



var port = 8142;
var folder = '/home/luke';

app.get('/getCurrentDirectory', function(req, res){
    res.json({response : folder, error : false});
});

app.get('/fileList', function(req, res){
    console.log(req.query.dir);
    fs.readdir(req.query.dir, function(err, files){
        if(err){
            res.json({error:true, files:[]});
            return;
        }
        res.json({error:false, files:files});
    });
});


app.use(express.static('static'));

app.listen(port, function(){
    console.log('listening on port ' + port);
});