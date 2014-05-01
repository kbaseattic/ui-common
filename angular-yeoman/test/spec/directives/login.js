'use strict';

describe('Directives: login', function() {
    var elem, scope, $rootScope, $httpBackend, $compile;

    function compileDirective(template) {
        if (!template) {
            template = '<div ng-controller="AuthCtrl" login/>';
        }

        elem = $compile(template)(scope);
        scope.$digest();
    }

    beforeEach(module('kbaseStrawmanApp', function($compileProvider) {
        $compileProvider.directive('modalShow', function() {
            var def = {
                priority: 100,
                terminal: true,
                restrict: 'EAC',
                template: '<div class="mock">this is a mock!</div>'
            };
            return def;
        });
    }));

    beforeEach(module('app/templates/login.html'));

    beforeEach(inject(function($injector) {
        var $templateCache = $injector.get('$templateCache');
        var template = $templateCache.get('app/templates/login.html');
        $templateCache.put('templates/login.html', template);

        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();

        $compile = $injector.get('$compile');

        compileDirective();
    }));


    it('should compile correctly', function() {
        expect(elem.isolateScope().showDialog).toBe(false);
    });

    it('should respond to "loggedIn.kbase" by setting showDialog to false', function() {
        $rootScope.$broadcast('loggedIn.kbase');
        expect(elem.isolateScope().showDialog).toBe(false);
    });

    it('should set showDialog to true when calling showLoginDialog', function() {
        elem.isolateScope().showLoginDialog();
        expect(elem.isolateScope().showDialog).toBeTruthy();
    });

});
