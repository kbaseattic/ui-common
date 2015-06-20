(function () {
    'use strict';
    var module = angular.module('about', []);
    module.config(function ($stateProvider) {
        $stateProvider.state('about', {
            url: '/about',
            templateUrl: 'viewmodules/about/view.html',
            controller: function ($scope) {
               console.log('here in the controller!');
            }
        });
    });
    module.directive('aboutintro', function($rootScope) {
        return {
            link: function(scope, ele, attrs) {
               "use strict";
               // Can use requre right here, no problem.
               require(['jquery'], function ($) {
                    // Insert some simple content.
                    var myContent = '<h2>About the Functional Site</h2>';
                    myContent += '<p>This, is, the functional site.</p>';
                    $(ele).append(myContent);
                });

            }
        };
    });
}());