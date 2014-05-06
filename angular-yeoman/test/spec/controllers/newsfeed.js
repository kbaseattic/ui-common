'use strict';

/**
 * A test spec for the dummy newsfeed controller.
 */
describe('Controller: NewsfeedCtrl', function() {
    var scope, ctrl, authService;

    beforeEach(module('kbaseStrawmanApp'));

    // Make a new controller, and inject the Auth service into it.
    beforeEach(inject(function($rootScope, $controller, Auth) {
        authService = Auth;
        scope = $rootScope.$new();
        ctrl = $controller('NewsfeedCtrl', {$scope: scope, Auth: authService});
    }));

    afterEach(inject(function() {
        authService.logOut();
    }));

    it('should start with an undefined user in scope', function() {
        expect(scope.username).toBeFalsy();
    });
});