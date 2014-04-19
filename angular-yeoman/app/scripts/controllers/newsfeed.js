'use strict';

app.controller('NewsfeedCtrl', function($scope, $location, Auth) {
    $scope.username = Auth.getUsername();
});