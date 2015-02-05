/*
 *  Directives
 *
 *  These can be thought of as the 'widgets' on a page.
 *  Scope comes from the controllers.
 *
 */

angular.module('dashboard-directives', []);
angular.module('dashboard-directives')
   .directive('dashboardnarratives', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {
            require(['dashboard_narratives_widget'], function (W) {
               Object.create(W).init({
                  container: $(ele)
               }).go();
            });
         }
      };
   })
   .directive('dashboardsharednarratives', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {
            require(['dashboard_shared_narratives_widget'], function (W) {
               Object.create(W).init({
                  container: $(ele)
               }).go();
            });
         }
      };
   })
   .directive('dashboardprofile', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {
            "use strict";
            require(['dashboard_profile_widget', 'jquery'], function (W, $) {
               var widget = Object.create(W);
               widget.init({
                  container: $(ele)
               }).go();
            });
         }
      };
   })

.directive('dashboardapps', function ($rootScope) {
   return {
      link: function (scope, ele, attrs) {
         require(['dashboard_apps_widget'], function (Widget) {
            Object.create(Widget).init({
               container: $(ele)
            }).go();
         });
      }
   };
})

.directive('dashboarddata', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {
            require(['dashboard_data_widget'], function (Widget) {
               Object.create(Widget).init({
                  container: $(ele)
               }).go();
            });
         }
      };
   })
   .directive('dashboardcollaboratornetwork', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {

            require(['kb.widget.collaboratornetwork'], function (Widget) {
               try {
                  var widget = Object.create(Widget);
                  widget.init({
                     container: $(ele),
                     userId: scope.params.userid
                  }).go();
               } catch (ex) {
                  $(ele).html('Error: ' + ex);
               }
            });
         }
      };
   });