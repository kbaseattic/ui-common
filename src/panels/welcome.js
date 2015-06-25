define(['kb.app', 'kb.session', 'q'], function (App, Session, Q) {
    'use strict';
    function setup() {
        var h1 = App.tag('h1'),
            p = App.tag('p'),
            div = App.tag('div');
        App.addRoute({
            path: ['welcome'],
            render: null,
            promise: function (params) {
                return Q.promise(function (resolve) {
                    var content = [
                        h1({}, 'Welcome to KBase'),
                        p({}, 'This is KBase')
                    ];
                    resolve({
                        content: content,
                        title: 'Welcome to KBase'
                    });
                });
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
