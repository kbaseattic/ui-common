'use strict';

app.controller('AuthCtrl', function($scope, $location, Auth) {
    $scope.getUsername = function() {
        return Auth.getUsername();
    };

    $scope.getFullUsername = function() {
        return Auth.getFullUsername();
    };

    /**
     * Returns the Auth.logIn promise.
     * Once logging in occurs, the service will
     * keep a hold of the token and can be retrieved.
     */
    $scope.logIn = function(user, pw) {
        // if a user is already logged in, log them out first
        $scope.logOut();

        // actually perform login here
        $scope.error = null;

        Auth.logIn(user, pw).success(function() {
            $scope.username = Auth.getUsername();
            $scope.password = null;
            $scope.$broadcast('LOGGED_IN');

            $location.path('/newsfeed/');
        })
        .error(function(error) {
            $scope.error = error.error_msg;
        });
    };

    $scope.logOut = function() {
        Auth.logOut();
        $scope.username = Auth.getUsername();
        $scope.password = null;
        $location.path('/');
    };

    $scope.loggedIn = function() {
        var isLoggedIn = Auth.loggedIn();
        if(isLoggedIn) {
            $scope.username = Auth.getUsername();
        }
        return isLoggedIn;
    };

    $scope.showLoginDialog = function() {
        $scope.error = null;
    };
});