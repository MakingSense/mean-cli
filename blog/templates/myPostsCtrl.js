'use strict';

angular.module('mean').controller('myPostsCtrl', function($scope, $rootScope) {
    //get all elements
    if(!$rootScope.posts){
    $rootScope.posts = [{
        id: 1,
        title: 'Post 1',
        text:  'Text Post 1.'
    },
        {
            id: 2,
            title: 'Post 2',
            text:  'Text Post 2.'
        }];
    }
    $rootScope.cont = $rootScope.posts.length;
});