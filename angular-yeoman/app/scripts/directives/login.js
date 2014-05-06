'use strict';

app.directive('login', function() {
    return {
        templateUrl: 'templates/login.html',
        restrict: 'A',
        scope: true,
        link: function($scope) {
            $scope.showDialog = false;

            $scope.showLoginDialog = function() {
                $scope.showDialog = true;
            };

            $scope.$on('loggedIn.kbase', function() {
                $scope.showDialog = false;
            });
        },
    };
});