(function () {
    'use strict';
    var module = angular.module('status', []);
    
    /*
     * This config function is run when the module is loaded.
     */
    module.config(function ($stateProvider) {
        $stateProvider.state('status', {
            url: '/status',
            templateUrl: 'viewmodules/status/view.html',
            controller: function ($scope) {
               console.log('here in the controller!');
            }
        });
    });

    /*
     * The directives are essentially nodes in the view template.
     */
    module.directive('statuscurrent', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
               "use strict";
               // Can use requre right here, no problem.
               require(['jquery'], function ($) {
                    // Insert some simple content.
                    var myContent = '<p>All systems are ... go!</p>';
                    $(ele).append(myContent);
                });

            }
        };
    });
}());