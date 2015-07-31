require(['kb.session', 'kb.test', 'q'], function (Session, Tester, Q) {
    'use strict';
    var tests = [
        {
            method: 'getUsername',
            description: 'get user name',
            input: [],
            expects: {
                output: 'eaptest20'
            }
        },
        {
            method: 'getRealname',
            description: 'get real name',
            input: [],
            expects: {
                output: 'Erik "test 20" Pearson'
            }
        },
        {
            method: 'getSessionId',
            description: 'get session id',
            input: [],
            expects: {
                output: {
                    name: 'is a string',
                    test: function (value) {
                        if (typeof value === 'string') {
                            return true;
                        }
                        return false;
                    }
                }
            }
        },

        {
            method: 'getAuthToken',
            description: 'get auth token',
            input: [],
            expects: {
                output: {
                    name: 'is a string',
                    test: function (value) {
                        if (typeof value === 'string') {
                            return true;
                        }
                        return false;
                    }
                }
            }
        },

        {
            method: 'isLoggedIn',
            description: 'is session authenticated?',
            input: [],
            expects: {
                output: true
            }
        }
    ];

    var s = Object.getPrototypeOf(Session);
    Q.Promise(function (resolve, reject) {
        s.cookieMaxAge = 10000;
        s.login({
            username: 'eaptest20',
            password: 'G0blin2k',
            disableCookie: true,
            success: function (kbaseSession) {
                resolve(kbaseSession);
            },
            error: function (errorMessage) {
                console.log('urg');
                reject(errorMessage);
            }
        });
    }).
        then(function (kbaseSession) {
            Object.create(Tester).init({
                id: 'authenticatedGetProperties',
                name: 'Get Properties of Authenticated Session',
                description: 'This should be interesting...',
                tests: tests,
                makeObject: function () {
                    return s;
                },
                whenResult: function (test) {
                    return Q.Promise(function (resolve) {
                        resolve(test.object[test.method].apply(test.object, test.input));
                    });
                }
            }).runTests();
        })
        .catch(function (errMsg) {
            console.log('YIKES');
            console.log(errMsg);
        })
        .done();
});