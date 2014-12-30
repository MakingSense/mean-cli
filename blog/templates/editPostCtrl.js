angular.module('mean').controller('editPostCtrl', function($scope,$rootScope, $routeParams, $location) {
    //get the element by id
    if(!$rootScope.posts){
        $rootScope.posts = [];
    }
    $scope.current = _.find( $rootScope.posts, function(itemPost){return itemPost.id == $routeParams.postId});

    $scope.oldTiltle = $scope.current.title;
    $scope.oldText = $scope.current.text;

    $scope.updatePost = function() {
        //still same reference not need to update
        $location.path("/posts");
    };

    $scope.oldPost = function(){
        $scope.current.title = $scope.oldTiltle;
        $scope.current.text = $scope.oldText
    }
});