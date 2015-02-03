/*
 *  Directives
 *
 *  These can be thought of as the 'widgets' on a page.
 *  Scope comes from the controllers.
 *
 */

angular.module('dataview', []);
angular.module('dataview')
.directive('dataviewoverview', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
           "use strict";
           require(['kb.widget.dataview.overview', 'jquery'], function (W, $) {
                var widget = Object.create(W);
              console.log(scope.params);
                widget.init({
                    container: $(ele),
                    workspaceId: scope.params.wsid,
                    objectId: scope.params.objid,
                    objectVersion: scope.params.ver 
                }).go();
            });
        }
    };
})
.directive('dataviewvisualizer', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            $(ele).html('Viz panel here');
        }
    }; 
});