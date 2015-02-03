/**
Data view controller and utils.
*/

app.controller('Dataview', function ($scope, $stateParams) {
   $scope.params = {
      wsid: $stateParams.wsid,
      objid: $stateParams.objid,
      ver: $stateParams.ver
   };

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
         .addButton({
            name: 'copy',
            label: '+ New Narrative',
            style: 'primary',
            icon: 'plus-square',
            callback: function () {
               alert('add to a new narrative');
            }.bind(this)
         })
         .addButton({
            name: 'download',
            label: 'Download',
            style: 'primary',
            icon: 'download',
            callback: function () {
               alert('download object');
            }.bind(this)
         })
         .addDropdown({
            place: 'end',
            name: 'options',
            style: 'default',
            icon: 'copy',
            label: 'Copy',
            items: [
               {
                  name: 'narrative1',
                  icon: 'key',
                  label: 'Narrative 1',
                  url: 'xxx',
                  external: true
            },{
                  name: 'narrative2',
                  icon: 'key',
                  label: 'Narrative 3',
                  url: 'xxx',
                  external: true
            },{
                  name: 'narrative3',
                  icon: 'key',
                  label: 'Narrative 3',
                  url: 'xxx',
                  external: true
            }]
         });


   });
});