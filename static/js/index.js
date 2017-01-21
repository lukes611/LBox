

var IndexApp = angular.module('IndexApp', ['LLocal']);

IndexApp.controller('IndexAppController', 
    ['$scope',
     '$http',
     'LLocal',
     function($scope, $http, LLocal){
         $scope.loadCurrentDirectory = function(){
             if(LLocal.get('currentDirectory') !== undefined) $scope.currentDirectory = LLocal.get('currentDirectory');
             else $http.get('/getCurrentDirectory').then(function(response){
                 $scope.currentDirectory = response.data.response;
                 LLocal.set('currentDirectory', $scope.currentDirectory);
             });
         };
         $scope.listFiles = function(dir){
             $http.get('/fileList', {params: {dir : dir}}).then(function(response){
                 console.log(response.data.files);
                 $scope.currentFiles = response.data.files;
             });
         };
         $scope.loadCurrentDirectory();
         $scope.listFiles($scope.currentDirectory);
     }
    ]
);