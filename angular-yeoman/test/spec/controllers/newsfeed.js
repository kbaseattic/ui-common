'use strict';

describe('Controller: NewsfeedCtrl', function() {
    var scope, ctrl, authService;

    beforeEach(module('kbaseStrawmanApp'));

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