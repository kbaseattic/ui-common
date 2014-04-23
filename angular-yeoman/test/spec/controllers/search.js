'use strict';

describe('Controller: SearchCtrl', function() {
    var scope, ctrl;

    beforeEach(module('kbaseStrawmanApp'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller('SearchCtrl', {$scope: scope});
    }));

    it('should have a startSearch function', function() {
        expect(typeof scope.startSearch).toBe('function');
    });
});