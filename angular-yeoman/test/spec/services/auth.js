'use strict';

/**
 * This unit tests the Auth service explicitly.
 *
 * It does this by mocking any calls that the services might make with the server, using
 * Angular's $httpBackend service. Given a call that will be made, this lets us bypassing
 * making any actual HTTP calls, and just return a canned response to fulfill our tests:
 * we aren't testing either the HTTP stack or the KBase Auth service here, just how we
 * expect our Angular service to respond.
 */
describe('Services: Auth', function() {
    var $httpBackend;
    var goodUid = 'kbasetest';
    var goodPw = 'password';
    var goodFullName = 'KBase Test User';
    var token = 'kb|an_auth_token|expiry=9999999999|';
    var goodExpectedResponse = {user_id: goodUid, token: token, name: goodFullName};

    var badUid = 'asdf';
    var badPw = 'jkl;';
    var badExpectedResponse = {error_msg: 'error'};

    var oldToken = 'kb|token|expiry=12345|';

    // This is the same argument string that the service code will create and send via HTTP - we
    // need this to recognize what's being sent so we can catch it and respond without using actual 
    // network traffic.
    var authArgs = function(uid, pw) {
        return 'status=1&cookie=1&fields=name,kbase_sessionid,user_id,token&user_id=' + uid + '&password=' + pw;
    };

    // First off, initialize the app module
    beforeEach(module('kbaseStrawmanApp'));

    // Next, get the $httpBackend service we'll be using and initialize it to respond
    // properly to a couple of expected calls.
    beforeEach(inject(function($injector, AUTH_URL) {
        $httpBackend = $injector.get('$httpBackend');

        $httpBackend.when('POST', AUTH_URL, authArgs(goodUid, goodPw))
                    .respond(200, goodExpectedResponse);
        $httpBackend.when('POST', AUTH_URL, authArgs(badUid, badPw))
                    .respond(401, badExpectedResponse);
    }));

    // After each test, make sure to flush the backend, AND make sure that the Auth
    // service is reinitialized.
    afterEach(inject(function(Auth) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        Auth.logOut();
    }));


    it('is not logged in when initialized', inject(function(Auth) {
        expect(Auth.loggedIn()).toBeFalsy();
    }));

    it('has no token before logging in', inject(function(Auth) {
        expect(Auth.getAuthToken()).toBeFalsy();
    }));

    it('has no token after logging out', inject(function(Auth) {
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        Auth.logOut();
        expect(Auth.getAuthToken()).toBeFalsy();
    }));

    it('reports a user being logged out correctly, after logging in first', inject(function(Auth) {
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        Auth.logOut();
        expect(Auth.loggedIn()).toBeFalsy();
    }));

    it('reports a user being logged in correctly', inject(function(Auth) {
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(Auth.loggedIn()).toBeTruthy();
    }));

    it('returns a good auth token', inject(function(Auth) {
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(Auth.getAuthToken()).toBe(token);
    }));

    it('returns the right username', inject(function(Auth) {
        expect(Auth.getUsername()).toBeFalsy();
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(Auth.getUsername()).toBe(goodUid);
    }));

    it('returns the user\'s right full name', inject(function(Auth) {
        expect(Auth.getFullUsername()).toBeFalsy();
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(Auth.getFullUsername()).toBe(goodFullName);
    }));

    it('maps the loggedIn function onto the $rootScope correctly', inject(function(Auth, $rootScope) {
        expect(typeof $rootScope.loggedIn).toBe('function');
        expect($rootScope.loggedIn()).toBeFalsy();
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect($rootScope.loggedIn()).toBeTruthy();
    }));

    it('errors correctly when presented with bad login credentials', inject(function(Auth) {
        Auth.logIn(badUid, badPw).then(
            function(){},
            function(error) { expect(error.data.error_msg).toBe(badExpectedResponse.error_msg); }
        );
        $httpBackend.flush();
        expect(Auth.loggedIn()).toBeFalsy();
    }));

    it('should make a cookie on login', inject(function(Auth) {
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(document.cookie).not.toBe('');
    }));

    it('should clear cookies after log out', inject(function(Auth) {
        Auth.logIn(goodUid, goodPw);
        $httpBackend.flush();
        Auth.logOut();
        expect(document.cookie).toBe('');
    }));

    it('should properly state that an old or invalid token has expired', inject(function(Auth) {
        var badToken = 'token_of_DOOM';
        expect(Auth.tokenExpired(badToken)).toBe(true);
        expect(Auth.tokenExpired(oldToken)).toBe(true);
    }));

    it('should log out and return \'false\' if a logIn check is done with an old token', inject(function(Auth) {
        // spoof an old token
        localStorage.setItem('kbAuthToken', oldToken);
        expect(Auth.loggedIn()).toBe(false);
    }));
});