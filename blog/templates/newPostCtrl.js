'use strict';

angular.module('mean').controller('newPostCtrl', function($scope, $rootScope, $location) {
    // Call to blogService.create()

    $scope.addPost = function() {   
        var postData = {
             id : ++$rootScope.cont,
            title : $scope.titlePost,
            text : $scope.bodyPost
        };
        if(!$rootScope.posts){
            $rootScope.posts = [];
        }
        $rootScope.posts.push(postData);
        $location.path("/posts");
    };
});