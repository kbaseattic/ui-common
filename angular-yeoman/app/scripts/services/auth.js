'use strict';

app.factory('Auth',
    function(AUTH_URL, $http, $rootScope) {
        var Auth = {
            /**
             * Logs the user in and returns a promise for the asynchronous login process.
             * On success, the promise contains:
             * {
             *    username: the user id (e.g. kbasetest),
             *    name: the user's full name (e.g. KBase Test User),
             *    token: the new auth token
             * }
             * On failure, it returns the error object given by globus online. Among other
             * elements, this contains an error_msg string (error.error_msg)
             *
             * If a user successfully logs in, this stuffs 3 things into local storage:
             * kbUsername, kbFullUsername, and kbAuthToken
             * Guess which is which! :D
             */
            logIn: function(username, password) {
                // do log in, return promise
                // when login complete, stuff the token
                // in local storage
                var args = 'status=1&cookie=1&fields=name,kbase_sessionid,user_id,token&user_id=' + username + '&password=' + password;
                return $http.post(AUTH_URL, args, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                       .success(function(response) {
                            // should also stuff the token/username into local storage
                            localStorage.setItem('kbUsername', response.user_id);
                            localStorage.setItem('kbAuthToken', response.token);
                            localStorage.setItem('kbFullUsername', response.name);
                            return {
                                token: response.token,
                                username: response.user_id,
                                name: response.name
                            };
                       })
                       .error(function(error) {
                            return error;
                       });
            },

            /**
             * This logs the user out by setting its known token and username to null, and clearing local storage
             * of any login info.
             */
            logOut: function() {
                // log out of current session, clear token from storage
                this.token = null;
                this.username = null;
                localStorage.removeItem('kbUsername');
                localStorage.removeItem('kbAuthToken');
                localStorage.removeItem('kbFullUsername');
            },

            /**
             * This returns either the current auth token (or null if not logged in)
             */
            getAuthToken: function() {
                return localStorage.getItem('kbAuthToken');
            },

            /**
             * This returns the current username (id, e.g. kbasetest)
             */
            getUsername: function() {
                return localStorage.getItem('kbUsername');
            },

            /**
             * This returns the full username (e.g. KBase Test User)
             */
            getFullUsername: function() {
                return localStorage.getItem('kbFullUsername');
            },

            /**
             * This returns true if the user's logged in with a token stored in local storage, false otherwise.
             */
            loggedIn: function() {
                return localStorage.getItem('kbAuthToken') !== null;
            },
        };

        /**
         * Just maps the loggedIn() function onto $rootScope for convenience.
         */
        $rootScope.loggedIn = function() {
            return Auth.loggedIn();
        };

        return Auth;
    });