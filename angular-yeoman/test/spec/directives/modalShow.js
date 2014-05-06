'use strict';

describe('Directives: modalShow', function() {
    var elem, $scope, $compile;

    beforeEach(module('kbaseStrawmanApp'));

    beforeEach(inject(function($rootScope, $compile) {
        var template = '<div class="modal fade" modal-show="showDialog" tabindex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">' + 
                '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                            '<h4 class="modal-title">Test Modal</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            'A test modal!' +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<div class="row form-horizontal">' +
                                '<div class="col-md-6" style="white-space: nowrap;">' +
                                    '<a class="btn btn-default" data-dismiss="modal">Close</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        elem = angular.element(template);
        $scope = $rootScope.$new();
        $compile(elem)($scope);
        $scope = elem.scope();
        $scope.$digest();
    }));

    it('should hide its modal when commanded', function() {
        $scope.showModal('false');
    });

    it('should show its modal when commanded', function() {
        $scope.showModal('true');
    });

    it('should deal with a separate modal element if given one', function() {
        $scope.showModal('false', elem);
    });

    it('should catch and handle the close dialog event', function() {
        inject(function($timeout) {
            elem.triggerHandler('hide.bs.modal');
        });
    });
});