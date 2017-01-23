

var IndexApp = angular.module('IndexApp', ['LLocal']);

IndexApp.controller('IndexAppController', 
    ['$scope',
     '$http',
     'LLocal',
     function($scope, $http, LLocal){
         
         LLocal.clear('currentDirectory');
         
         $scope.listFiles = function(dir){
             $http.get('/fileList', {params: {dir : dir}}).then(function(response){
                 $scope.currentFiles = response.data.files;
             });
         };
         
         function setCurrentDirectory(newDirectory){
             $scope.currentDirectory = newDirectory;
             LLocal.set('currentDirectory', newDirectory);
             $scope.listFiles($scope.currentDirectory);  
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
             console.log(_, _.slice(0,-1));
             _ = _.slice(0,-1).join('/');
             setCurrentDirectory(_);
         };
     }
    ]
);