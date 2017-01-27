

angular.module('Edit', ['LLocal']).controller('EditController',
['$scope', '$http', '$window', 'LLocal',
function($scope, $http, $window, LLocal){
    $scope.file = LLocal.get('toEdit');
    $scope.prevContent = '';
    $scope.content = '';
    if($scope.file === undefined) $window.location.href = '/';
    
    $http.get('/downloadFile', {params:{filePath : $scope.file.path}}).then(function(response){
        $scope.content = response.data;
        $scope.prevContent = response.data + '';
    });
    
    $scope.goHome = function(){
        $window.location.href = '/';
    };
    
    $scope.save = function(){
        $http.post('/saveFile', {file:$scope.file,content:$scope.content}).then(function(response){
            if(!response.data.error)$scope.prevContent = $scope.content;
            else $window.alert('an error occurred whilst saving');
            
            //console.log(response.data);
        });
    };
    
}]).directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 500);
                $timeout(resize, 10);
            }
        };
    }
]);