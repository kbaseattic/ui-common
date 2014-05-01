'use strict';

describe('Directives: modalShow', function() {
    var elem, scope, $compile;

    function compileDirective(template) {
        if (!template) {
            template = '<div class="modal fade" modal-show="showDialog" tabindex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">' + 
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
        }

        elem = $compile(template)(scope);
        scope.$digest();
    }

    beforeEach(module('kbaseStrawmanApp'));

    beforeEach(inject(function($injector) {
        var $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();
        $compile = $injector.get('$compile');

        compileDirective();
    }));

    it('should do things?', function() {
        expect(1).toBe(1);
    });


});