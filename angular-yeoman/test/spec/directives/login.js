'use strict';

describe('Directives: login', function() {
    var elem, $scope, $httpBackend;

    beforeEach(module('kbaseStrawmanApp'));

    beforeEach(inject(function($compile, $rootScope, $templateCache) {
        $templateCache.put('templates/login.html', '<div>mock mock mock</div>');

        // Make a new scope
        $scope = $rootScope.$new();

        // Make an element to compile the directive into
        elem = angular.element('<div login></div>');

        // Compile that directive with that element and scope
        $compile(elem)($scope);

        // This directive makes a new element - grab it and digest it
        $scope = elem.scope();
        $scope.$digest();
    }));


    it('should initialize with showDialog = false', function() {
        expect($scope.showDialog).toBe(false);
    });

    it('should respond to "loggedIn.kbase" by setting showDialog to false', function() {
       $scope.showDialog = true;
       inject(function($rootScope) {
            $rootScope.$broadcast('loggedIn.kbase');
       });
       expect($scope.showDialog).toBe(false);
    });

    it('should set showDialog to true when calling showLoginDialog', function() {
       $scope.showLoginDialog();
       expect($scope.showDialog).toBe(true);
    });

});
