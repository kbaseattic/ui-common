'use strict';

app.directive('login', function() {
    return {
        templateUrl: 'templates/login.html',
        restrict: 'A',
        scope: true,
        link: function($scope, elem, attrs) {
            $scope.keystroke = 0;

            $scope.$watch('keystroke', function() {
                if ($scope.keystroke === 13) {
                    $scope.logIn($scope.username, $scope.password);
                    $scope.keystroke = 0;
                }
            });

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