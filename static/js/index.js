

var IndexApp = angular.module('IndexApp', ['LLocal']);

IndexApp.controller('IndexAppController', 
    ['$scope',
     '$http',
     'LLocal',
     '$window',
     function($scope, $http, LLocal, $window){
         
         LLocal.clear('currentDirectory');
         
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
             console.log('clicked: ', file);
             if(file.isDirectory){
                 setCurrentDirectory($scope.currentDirectory + '/' + file.name);
             }else{
                 window.location.href = file.link;
                /*$http.post('/downloadFile', {filePath : $scope.currentDirectory + '/' + file.name}).then(function(response){
                    //location.href = response.data;
                    //console.log('downloaded', response.data);
                    var content = response.data;
                    var blob = new Blob([ content ], { type : 'binary' });
                    window.location.assign((window.URL || window.webkitURL).createObjectURL( blob ));
                });*/
             }
         };
         
         $scope.goUp = function(){
             var _ = $scope.currentDirectory.split('/');
             _ = _.slice(0,-1).join('/');
             setCurrentDirectory(_);
         };
     }
    ]
);