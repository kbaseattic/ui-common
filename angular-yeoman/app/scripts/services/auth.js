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
            logIn: function(username, password, token) {
                // do log in, return promise
                // when login complete, stuff the token
                // in local storage
                var args = 'status=1&cookie=1&fields=name,kbase_sessionid,user_id,token&user_id=' + username + '&password=' + password;
                if (token) {
                    args = 'status=1&cookie=1&token=' + token + '&fields=name,kbase_sessionid,user_id,token';
                }
                return $http.post(AUTH_URL, args, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                       .success(function(response) {
                            // should also stuff the token/username into local storage
                            localStorage.setItem('kbUsername', response.user_id);
                            localStorage.setItem('kbAuthToken', response.token);
                            localStorage.setItem('kbFullUsername', response.name);

                            var authCookie = 'un=' + response.user_id +
                                             '|kbase_sessionid=' + response.kbase_sessionid +
                                             '|user_id=' + response.user_id +
                                             '|token=' + response.token.replace(/=/g, 'EQUALSSIGN').replace(/\|/g, 'PIPESIGN');

                            $.cookie('kbase_session', authCookie, { path: '/'});
                            $.cookie('kbase_session', authCookie, { path: '/', domain: 'kbase.us'});

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
                localStorage.removeItem('kbUsername');
                localStorage.removeItem('kbAuthToken');
                localStorage.removeItem('kbFullUsername');
                $.removeCookie('kbase_session');
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
             * Returns true if the token is not expired, false otherwise.
             */
            tokenExpired: function(token) {
                var expirySec = /\|expiry\=(\d+)\|/.exec(token);
                if (expirySec) {
                    expirySec = expirySec[1];
                    var expiryDate = new Date(expirySec*1000);
                    return (expiryDate - new Date() < 0);
                }
                return true;
            },

            /**
             * Checks whether a user is logged in through two steps.
             * 1. Check if a token is present.
             * 2. Validate that token using its expiration date.
             * 3. (later, if needed) validate the token against Globus Online
             */
            loggedIn: function() {
                var token = localStorage.getItem('kbAuthToken');

                // If we don't have a token, then it can't be valid, can it?
                if (!token) {
                    return false;
                }

                // If the token is expired, then it's invalid
                if (this.tokenExpired(token)) {
                    this.logOut();
                    return false;
                }
                return true;
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