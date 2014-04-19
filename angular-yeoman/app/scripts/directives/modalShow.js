'use strict';

/**
 * Taken mostly from http://stackoverflow.com/questions/19644405/simple-angular-directive-for-bootstrap-modal
 */
app.directive('modalShow', function($parse) {
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, element, attrs) {
            scope.showModal = function(visible, elem) {
                if (!elem) {
                    elem = element;
                }
                if (visible) {
                    elem.modal('show');
                }
                else {
                    elem.modal('hide');
                }
            };

            scope.$watch(attrs.modalShow, function(newValue, oldValue) {
                scope.showModal(newValue, attrs.$$element);
            });

            element.bind('hide.bs.modal', function() {
                $parse(attrs.modalShow).assign(scope, false);
                if (!scope.$$phase && !scope.$root.$$phase) {
                    scope.$apply();
                }
            });
        }
    };
});