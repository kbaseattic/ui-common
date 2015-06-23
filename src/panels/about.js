define(['kb.app', 'kb.session'], function (App, Session) {
    'use strict';
    function setup() {
        var p = App.tag('p'),
            div = App.tag('div');
        App.addRoute({
            path: ['about'],
            render: function (params) {
                return [
                    p([], 'This is all about KBase and ' + params.name),
                    div([], [
                        p([], 'Hi'),
                        p([], ['Hello, ', Session.getUsername()])
                    ])
                ];
                // return 'This is all about KBase  and ' + params.name;
            }
        });
        App.addRoute({
            path: ['about', {type:'param', name:'name'}],
            render: function (params) {
                return 'This is all about ' + params.name;
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
