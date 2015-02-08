/**
Data view controller and utils.
*/

app.controller('Dataview', function ($scope, $stateParams) {
   $scope.params = {
      wsid: $stateParams.wsid,
      objid: $stateParams.objid,
      ver: $stateParams.ver
   };
   // handle subobjects, only allowed types!!  This needs to be refactored because it can depend on the base type!!!
   var allowedSubobjectTypes = {'Feature':true};
   
   if ($stateParams.sub && $stateParams.subid) {
      if (allowedSubobjectTypes.hasOwnProperty($stateParams.sub)) {
         $scope.params.sub = {sub:$stateParams.sub,subid:$stateParams.subid};
      }
   }
   
   // Set up the styles for the view.
   // Note that this is the style for all dataview views, as the actual view template
   // is controlled by the router...
    $('<link>')
    .appendTo('head')
    .attr({type: 'text/css', rel: 'stylesheet'})
    .attr('href', 'views/dataview/style.css');

   // Set up the nabar
   require(['kbasenavbar'], function (NAVBAR) {
      NAVBAR.clearMenu()
         .addDefaultMenu({
            search: true,
            narrative: true
         })
         .addHelpMenuItem({
            type: 'divider'
         })
         .addHelpMenuItem({
            name: 'featurerequest',
            label: 'Request Feature',
            external: true,
            icon: 'thumbs-o-up',
            url: 'https://atlassian.kbase.us/secure/CreateIssueDetails!init.jspa?pid=10200&issuetype=2&priority=4&components=10108&assignee=eapearson&summary=Feature%20Request%20on%20User%20Page'
         })
         .addHelpMenuItem({
            name: 'bugreport',
            label: 'Report BUG',
            icon: 'bug',
            external: true,
            url: 'https://atlassian.kbase.us/secure/CreateIssueDetails!init.jspa?pid=10200&issuetype=1&priority=3&components=10108&assignee=eapearson&summary=Bug%20on%20User%20Page'
         })
         .clearButtons()
        


   });
});