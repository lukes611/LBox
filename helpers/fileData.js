var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

exports.pathIsSafe = function(root, pathInput){
    var truePath = path.resolve(pathInput);
    if((new RegExp('^'+root)).test(truePath)) return {error : false, path : truePath};
    return {error : true};
    
};

exports.getFiles = function(dir, callback, callbackError){
    
    fs.readdir(dir, function(err, files){
        if(err){
            callbackError();
            return;
        }
        fs.stat(dir + '/' + files[0], function(err, stats){
            console.log(stats, err);
        });
        
        var returnArray = [];
        (function addStats(){
            if(files.length == 0){
                console.log(returnArray.length);
                callback(returnArray);
                return;
            }
            var item = files.shift();
            fs.stat(dir + '/' + item, function(err, stats){
                if(!err) returnArray.push({
                    name : item,
                    size : stats.size,
                    isDirectory : stats.isDirectory(),
                    link : stats.isDirectory() ? '#' : '/downloadFile?' + querystring.stringify({filePath : dir + '/' + item}),
                    path : dir + '/' + item
                    
                });
                addStats();
            }); 
        })();
    });
};

exports.getSafeName = function(input){
    var output = '';
    for(var i = 0; i < input.length; i++){
        if('abcdefghijklmnopqrstuvwxyz1234567890. '.indexOf(input[i].toLowerCase()) != -1) output += input[i];
    }
    return output;
};