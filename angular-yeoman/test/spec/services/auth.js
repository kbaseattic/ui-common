'use strict';

// tests the Auth service explicitly.
describe('Services: Auth', function() {
    var $httpBackend;
    var goodUid = 'kbasetest';
    var goodPw = 'password';
    var goodFullName = 'KBase Test User';
    var token = 'kb|an_auth_token';
    var goodExpectedResponse = {user_id: goodUid, token: token, name: goodFullName};

    var badUid = 'asdf';
    var badPw = 'jkl;';
    var badExpectedResponse = {error_msg: 'error'};

    var authArgs = function(uid, pw) {
        return 'status=1&cookie=1&fields=name,kbase_sessionid,user_id,token&user_id=' + uid + '&password=' + pw;
    };

    beforeEach(module('kbaseStrawmanApp'));

    beforeEach(inject(function($injector, AUTH_URL) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('POST', AUTH_URL, authArgs(goodUid, goodPw)).respond(200, goodExpectedResponse);
        $httpBackend.when('POST', AUTH_URL, authArgs(badUid, badPw)).respond(401, badExpectedResponse);
    }));

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
});