

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
     }
    ]
);