define(['kb.app', 'kb.session', 'q'], function (App, Session, Q) {
    'use strict';
    function setup() {
        var p = App.tag('p'),
            div = App.tag('div');
        App.addRoute({
            path: ['about'],
            promise: function (params) {
                return Q.promise(function (resolve) {
                    var content = [
                        p('This is all about KBase.'),
                        div([
                            p('Hi'),
                            p(['Hello, ', Session.getUsername()])
                        ])
                    ];
                    resolve({
                        content: content,
                        title: 'About the Functional Site'
                    });
                });
            }
        });
        App.addRoute({
            path: ['about', {type: 'param', name: 'name'}],
            render: function (params) {
                return 'This is all about ' + params.name;
            }
        });
    }
    function teardown() {
        // TODO: remove routes
        return false;
    }
    function start() {
        //
        return false;
    }
    function stop() {
        //
        return false;
    }
    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop       
    };
});
