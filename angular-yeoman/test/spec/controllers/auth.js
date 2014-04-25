'use strict';

// tests the Auth controller and underlying service.
describe('Controller: AuthCtrl', function() {
    var $httpBackend, scope, createController, authUrl, ctrl;
    var uid = 'kbasetest';
    var pw = 'password';
    var token = 'kb|an_auth_token';
    var authArgs = 'status=1&cookie=1&fields=name,kbase_sessionid,user_id,token&user_id=' + uid + '&password=' + pw;
    var expectedResponse = {user_id: uid, token: token, name: uid};

    beforeEach(module('kbaseStrawmanApp'));

    beforeEach(inject(function($injector, AUTH_URL) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('POST', AUTH_URL).respond({user_id: uid, token: token, name: uid});

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
        $httpBackend.expectPOST(authUrl, authArgs)
        .respond(200, expectedResponse);
        scope.logIn(uid, pw);
        $httpBackend.flush();
    });

    it('should have the right username', function() {
        scope.logIn(uid, pw);
        $httpBackend.flush();
        expect(scope.getUsername()).toBe(uid);
    });

    it('should return the right full name', function() {
        scope.logIn(uid, pw);
        $httpBackend.flush();
        expect(scope.getFullUsername()).toBe(uid);
    });

    it('should return a true logged in state', function() {
        scope.logIn(uid, pw);
        $httpBackend.flush();
        expect(scope.loggedIn()).toBeTruthy();
    });

    it('should fail to log in with a bad username', function() {
        // scope.logIn('badname', pw);
        // $httpBackend.flush();
        // expect(scope.loggedIn()).toBeFalsy();
    });
})