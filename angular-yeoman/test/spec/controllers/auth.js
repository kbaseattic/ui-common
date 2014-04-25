'use strict';

// tests the Auth controller and underlying service.
describe('Controller: AuthCtrl', function() {
    var $httpBackend, scope, createController, authUrl, ctrl;
    var goodUid = 'kbasetest';
    var goodPw = 'password';
    var token = 'kb|an_auth_token';
    var goodExpectedResponse = {user_id: goodUid, token: token, name: goodUid};

    var badUid = 'asdf';
    var badPw = 'jkl;';
    var badExpectedResponse = {error_msg: 'error'};

    var authArgs = function(uid, pw) {
        return 'status=1&cookie=1&fields=name,kbase_sessionid,user_id,token&user_id=' + uid + '&password=' + pw;
    };

    beforeEach(module('kbaseStrawmanApp'));

    beforeEach(inject(function($injector, AUTH_URL) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('POST', AUTH_URL, authArgs(goodUid, goodPw)).respond(goodExpectedResponse);
        $httpBackend.when('POST', AUTH_URL, authArgs(badUid, badPw)).respond(badExpectedResponse);

        var $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');

        authUrl = AUTH_URL;

        scope = $rootScope.$new();
        ctrl = $controller('AuthCtrl', {'$scope': scope});
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        scope.logOut();
    });

    it('should log in successfully', function() {
        $httpBackend.expectPOST(authUrl, authArgs).respond(200, goodExpectedResponse);
        scope.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(scope.loggedIn()).toBeTruthy();
    });

    it('should have the right username', function() {
        scope.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(scope.getUsername()).toBe(goodUid);
    });

    it('should return the right full name', function() {
        scope.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(scope.getFullUsername()).toBe(goodUid);
    });

    it('should return a true logged in state', function() {
        scope.logIn(goodUid, goodPw);
        $httpBackend.flush();
        expect(scope.loggedIn()).toBeTruthy();
    });

    it('should not report being logged in without logging in first', function() {
        expect(scope.loggedIn()).toBeFalsy();
    });

    it('should fail to log in with bad credentials', function() {
        $httpBackend.expectPOST(authUrl, authArgs(badUid, badPw)).respond(401, badExpectedResponse);
        scope.logIn(badUid, badPw);
        $httpBackend.flush();
        expect(scope.loggedIn()).toBeFalsy();
    });
})