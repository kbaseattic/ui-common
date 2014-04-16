'use strict';

app.factory('Auth',
    function(AUTH_URL, $http, $rootScope) {
        var Auth = {
            logIn: function(username, password) {
                // do log in, return promise
                // when login complete, stuff the token
                // in local storage
                console.debug('logging in "' + username + '" with pw "' + password + '"');
                var args = 'status=1&cookie=1&fields=name,kbase_sessionid,user_id,token&user_id=' + username + '&password=' + password;
                return $http.post(AUTH_URL, args, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                       .success(function(response) {
                            // should also stuff the token/username into local storage
                            localStorage.setItem('kbUsername', response.user_id);
                            localStorage.setItem('kbAuthToken', response.token);
                            return {
                                token: response.token,
                                username: response.user_id
                            };
                       })
                       .error(function(error) {
                            return error;
                       });
            },

            logOut: function() {
                // log out of current session, clear token from storage
                this.token = null;
                this.username = null;
                localStorage.removeItem('kbUsername');
                localStorage.removeItem('kbAuthToken');
            },

            getAuthToken: function() {
                // fetch the current auth token (or null if not logged in)
                return localStorage.getItem('kbAuthToken');
            },

            getUsername: function() {
                return localStorage.getItem('kbUsername');
            },

            loggedIn: function() {
                return localStorage.getItem('kbAuthToken') !== null;
            },
        };

        $rootScope.loggedIn = function() {
            return Auth.loggedIn();
        };

        return Auth;
    });