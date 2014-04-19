'use strict';

app.directive('login', function(Auth) {
    return {
        templateUrl: 'templates/login.html',
        restrict: 'A',
        scope: true,
        link: function($scope, elem, attrs) {
            $scope.$on('LOGGED_IN', function() {
                $scope.showDialog = false;
            });
            
            $scope.showLoginDialog = function() {
                console.log('showing dialog');
                $scope.showDialog = true;
            };
        },
    };
});