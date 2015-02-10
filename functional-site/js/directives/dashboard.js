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
            require(['kb.widget.dashboard.narratives'], function (W) {
               Object.create(W).init({
                  container: $(ele), 
                  stateMachine: scope.stateMachine
               }).go();
            });
         }
      };
   })
   .directive('dashboardsharednarratives', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {
            require(['kb.widget.dashboard.sharedNarratives'], function (W) {
               Object.create(W).init({
                  container: $(ele),
                  stateMachine: scope.stateMachine
               }).go();
            });
         }
      };
   })
   .directive('dashboardprofile', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {
            "use strict";
            require(['kb.widget.dashboard.profile', 'jquery'], function (W, $) {
               var widget = Object.create(W);
               widget.init({
                  container: $(ele),
                  stateMachine: scope.stateMachine
               }).go();
            });
         }
      };
   })

.directive('dashboardapps', function ($rootScope) {
   return {
      link: function (scope, ele, attrs) {
         require(['kb.widget.dashboard.apps'], function (Widget) {
            Object.create(Widget).init({
               container: $(ele),
               stateMachine: scope.stateMachine
            }).go();
         });
      }
   };
})

.directive('dashboarddata', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {
            require(['kb.widget.dashboard.data'], function (Widget) {
               Object.create(Widget).init({
                  container: $(ele),
                  stateMachine: scope.stateMachine
               }).go();
            });
         }
      };
   })
   .directive('dashboardmetrics', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {
            try {
               require(['kb.widget.dashboard.metrics'], function (Widget) {
                     Object.create(Widget).init({
                        container: $(ele),
                        stateMachine: scope.stateMachine
                     }).go();
                  },
                  function (err) {
                     $(ele).html('Exception rendering widget: ' + err);
                     console.log('EX in require in dashboardmetrics');
                     console.log(err);
                  });
            } catch (ex) {
               $(ele).html('Exception rendering widget: ' + ex);
               console.log('EX in dashboardmetrics');
               console.log(ex);
            }
         }
      };
   })
   .directive('dashboardcollaboratornetwork', function ($rootScope) {
      return {
         link: function (scope, ele, attrs) {

            require(['kb.widget.dashboard.collaborators'], function (Widget) {
               try {
                  var widget = Object.create(Widget);
                  widget.init({
                     container: $(ele),
                     userId: scope.params.userid,
                     stateMachine: scope.stateMachine
                  }).go();
               } catch (ex) {
                  $(ele).html('Error: ' + ex);
               }
            });
         }
      };
   });