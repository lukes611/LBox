

var IndexApp = angular.module('IndexApp', ['LLocal', 'BackgroundTab']);

IndexApp.controller('IndexAppController', 
    ['$scope',
     '$http',
     'LLocal',
     '$window',
     'BackgroundTab',
     function($scope, $http, LLocal, $window, BGTab){
         
         //LLocal.clear('currentDirectory');
         $scope.displayNotes = false;
         $scope.selectedList = [];
         $scope.showHiddenFiles = false;
         $scope.currentFiles = [];
         
         $scope.listFiles = function(dir){
             $http.get('/fileList', {params: {dir : dir}}).then(function(response){
                 $scope.currentFiles = response.data.files;
             });
         };
         
         function setCurrentDirectory(newDirectory){
             $http.get('/isSafe', {params : {dir:newDirectory}}).then(function(response){
                 if(response.data.isSafe){
                    $scope.currentDirectory = newDirectory;
                    LLocal.set('currentDirectory', newDirectory);
                    $scope.listFiles($scope.currentDirectory);          
                 }else{
                     $window.alert('warning: access denied');
                 }
             });
             
         };
         
         $scope.loadCurrentDirectory = function(){
             if(LLocal.get('currentDirectory') !== undefined) setCurrentDirectory(LLocal.get('currentDirectory'));
             else $http.get('/getCurrentDirectory').then(function(response){
                 setCurrentDirectory(response.data.response);
             });
         };
         
         $scope.loadCurrentDirectory();
         
         $scope.clickFile = function(file){
             if(file.isDirectory){
                 setCurrentDirectory($scope.currentDirectory + '/' + file.name);
             }else{
                 //window.location.href = file.link;
                 window.open(file.link);
             }
             $scope.unselect(file);
         };
         
         $scope.selectFile = function(file){
             if(!$scope.isSelected(file))$scope.selectedList.push(file);
             else $scope.unselect(file);
             
             console.log($scope.selectedList)
         };
         
         $scope.isSelected = function(file){
             for(var i = 0; i < $scope.selectedList.length; i++)
                 if($scope.selectedList[i].path == file.path) return true;
             return false;
         };
         
         $scope.unselect = function(file){
             var newList = [];
             for(var i = 0; i < $scope.selectedList.length; i++)
                 if($scope.selectedList[i].path != file.path)
                     newList.push($scope.selectedList[i]);
             $scope.selectedList = newList;
         };
         
         $scope.goUp = function(){
             var _ = $scope.currentDirectory.split('/');
             _ = _.slice(0,-1).join('/');
             setCurrentDirectory(_);
         };
         
         $scope.downloadFiles = function(){
             var i = 0;
             function action(){
                if(i >= $scope.selectedList.length) return;
                 window.open($scope.selectedList[i].link, '_blank', 'toolbar=0,location=0,menubar=0');
                 i++;
                 setTimeout(action, 500);
             }
             action();
             
         };
         
         $scope.filterFileName = function(file){
             //max should be 24
             if(file.name.length > 15){
                 if(file.isDirectory){
                     return file.name.substr(0,12) + '...';
                 }else{
                     return file.name.substr(0,9) + '...' + file.name.substr(file.name.length-3);
                 }
             }
             return file.name;
         };
         
         $scope.getFilesForDisplay = function(){
            var cp = $scope.currentFiles.map(x => x);
            cp.sort(function(f1, f2){
                var x = f1.isDirectory?0:1;
                var y = f2.isDirectory?0:1;
                if(x-y != 0) return x-y;
                return f1.name.toLowerCase().localeCompare(f2.name.toLowerCase());
            });
            return cp;
         };
         
         $scope.askForString = function(question){
             question = question || 'enter a string: ';
             var answer = $window.prompt(question, '');
             var output = '';
             for(var i = 0; i < answer.length; i++){
                 if('abcdefghijklmnopqrstuvwxyz1234567890. '.indexOf(answer[i].toLowerCase()) != -1) output += answer[i];
             }
             return output;
         };
         
         $scope.createNewFile = function(isDir){
             var type = isDir ? 'directory' : 'file';
             var name = $scope.askForString('enter a ' + type + ' name:');
             if(name.length == 0){
                 $window.alert('cannot create a ' + type + ' of that name');
                 return;
             }
             if($scope.currentFiles.filter(f => f.name.toLowerCase() == name.toLowerCase()).length > 0){
                 $window.alert('that name is taken');
                 return;
             }
                 
             $http.get('/createFile', {params : {isDir:isDir, name : name, dir : $scope.currentDirectory}}).then(function(response){
                 console.log(response.data);
             });
         };
         
     }
    ]
);