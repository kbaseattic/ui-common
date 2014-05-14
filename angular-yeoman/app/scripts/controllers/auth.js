'use strict';

/**
 * A Controller for dealing with authentication.
 * This puts the user token apparatus into scope.
 * Fetching the token itself should be done directly from the Auth service -
 * this is meant to give login/logout controls to the view that uses it.
 */
app.controller('AuthCtrl', function($scope, $location, Auth) {
    $scope.loginPending = false;

    /**
     * Returns the username (user ID, e.g. 'kbasetest') of the logged in user, or null if nobody is logged in.
     */
    $scope.getUsername = function() {
        return Auth.getUsername();
    };

    /**
     * Returns the full name (e.g. 'KBase Test Account') of the logged in user, or null if nobody is logged in.
     */
    $scope.getFullUsername = function() {
        return Auth.getFullUsername();
    };

    /**
     * Attempts to log in the user. If someone is already logged in, that user is logged out first.
     * Since this process is asynchronous, two things can happen after this is complete.
     * 0. While the login is happening, $scope.loginPending is set to true.
     * 1. If successful, a 'loggedIn.kbase' event is broadcasted to whatever's listening.
     * 2. If unsuccessful, $scope.error is filled with an error message string.
     */
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
            $scope.loginPending = true;
            // actually perform login here
            Auth.logIn(user, pw).success(function() {
                $scope.$broadcast('loggedIn.kbase');
                $scope.loginPending = false;
            })
            .error(function(error) {
                $scope.loginPending = false;
                $scope.error = error.error_msg;
            });
        }
    };

    /**
     * Logs the user out and resets the path to the login page.
     */
    $scope.logOut = function() {
        Auth.logOut();
        $location.path('/');
    };

    /**
     * Returns true if logged in.
     */
    $scope.loggedIn = function() {
        var isLoggedIn = Auth.loggedIn();
        if(isLoggedIn) {
            $scope.username = Auth.getUsername();
        }
        return isLoggedIn;
    };

    $scope.loggedIn();
});