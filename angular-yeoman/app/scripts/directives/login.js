'use strict';

app.directive('login', function(Auth) {
    return {
        templateUrl: 'templates/login.html',
        restrict: 'A',
        scope: { 
        },
        link: function($scope, elem, attrs) {
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