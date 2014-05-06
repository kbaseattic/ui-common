'use strict';

app.controller('AuthCtrl', function($scope, $location, Auth) {
    $scope.getUsername = function() {
        return Auth.getUsername();
    };

    $scope.getFullUsername = function() {
        return Auth.getFullUsername();
    };

    $scope.logIn = function(user, pw) {
        // if a user is already logged in, log them out first
        $scope.logOut();

        $scope.error = null;

        if (!user) {
            $scope.error = 'Please enter your username.';
        }
        else if (!pw) {
            $scope.error = 'Please enter your password.';
        }
        else {
            // actually perform login here
            Auth.logIn(user, pw).success(function() {
                $scope.$broadcast('loggedIn.kbase');
            })
            .error(function(error) {
                $scope.error = error.error_msg;
            });
        }
    };

    $scope.logOut = function() {
        Auth.logOut();
        $location.path('/');
    };

    $scope.loggedIn = function() {
        var isLoggedIn = Auth.loggedIn();
        if(isLoggedIn) {
            $scope.username = Auth.getUsername();
        }
        return isLoggedIn;
    };

    $scope.loggedIn();
});