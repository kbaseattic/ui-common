'use strict';

app.controller('AuthCtrl', function($scope, $location, Auth) {
    $scope.username = Auth.getUsername();
    /**
     * Returns the Auth.logIn promise.
     * Once logging in occurs, the service will
     * keep a hold of the token and can be retrieved.
     */
    $scope.logIn = function(user, pw) {
        // actually perform login here
        $scope.error = null;

        Auth.logIn(user, pw).success(function(response) {
            $scope.username = Auth.getUsername();
            $('#loginModal').modal('hide');
        })
        .error(function(error) {
            $scope.error = error.error_msg;
        });
    };

    $scope.logOut = function() {
        Auth.logOut();
        $location.path('/');
    };

    $scope.showLoginDialog = function() {
        $scope.error = null;
    };
});