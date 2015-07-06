/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.html', 'kb.session', 'q'], function (html, Session, Q) {
    'use strict';
    function setup(app) {
        var p = html.tag('p'),
            div = html.tag('div');
        app.addRoute({
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
        app.addRoute({
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
