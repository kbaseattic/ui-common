/**
 About view controller and utils.
 */
app.controller('About', function ($scope, $stateParams) {
    /*
     $scope.params = {
     wsid: $stateParams.wsid,
     objid: $stateParams.objid,
     ver: $stateParams.ver
     };
     */
    console.log('here in the controller!');
    // Set up the styles for the view.
    // Note that this is the style for all dataview views, as the actual view template
    // is controlled by the router...
    $('<link>')
        .appendTo('head')
        .attr({type: 'text/css', rel: 'stylesheet'})
        .attr('href', 'views/about/style.css');

    // Set up the nabar
    require(['kb.widget.navbar'], function (NAVBAR) {
        NAVBAR.clearMenu()
            .clear()
            .addDefaultMenu({
                search: true,
                narrative: true
            });
    });

    $scope.$on('$destroy', function () {

    });
});