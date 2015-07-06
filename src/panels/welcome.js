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
        var h1 = html.tag('h1'),
            p = html.tag('p'),
            div = html.tag('div');
        app.addRoute({
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
