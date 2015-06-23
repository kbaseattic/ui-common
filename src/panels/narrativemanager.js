define(['kb.app', 'kb.session'], function (App, Session) {
    'use strict';
    function setup() {
        
        /*
         $stateProvider
            .state('narrativemanager', {
                url: "/narrativemanager/:action?app&method&copydata&appparam",
                templateUrl: 'views/narrative/narrative-manager.html',
                controller: 'narrativemanager'
            });
        */
        
        App.addRoute({
            path: ['narrativemanager', {type: 'param', name: 'action'}],
            queryParams: {
                app: {},
                method: {},
                copydata: {},
                appparam: {}
            },
            render: function (params) {
            }
        });
    };
    function teardown() {
        // TODO: remove routes
    };
    function start () {
        //
    };
    function stop () {
        //
    };
    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop
    };
    
});
