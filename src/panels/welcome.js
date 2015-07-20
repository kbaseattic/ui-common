/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.html', 'kb.session', 'q'], function (html, Session, Q) {
    'use strict';

    function welcomeWidget() {

        function widget(config) {
            var mount, container, $container;

            function render() {
                var h1 = html.tag('h1'),
                    p = html.tag('p'),
                    div = html.tag('div');
                return div([
                    h1('Welcome to KBase'),
                    p('This is KBase')
                ]);
            }

            function attach(node) {
                return Q.Promise(function (resolve) {

                    mount = node;
                    container = document.createElement('div');
                    $container = $(container);
                    mount.appendChild(container);
                    container.innerHTML = render();

                    resolve();
                });
            }
            function start(params) {
                return Q.Promise(function (resolve) {
                    resolve();
                });
            }
            function stop(node) {
                return Q.Promise(function (resolve) {

                    resolve();
                });
            }
            function detach(node) {
                return Q.Promise(function (resolve) {

                    resolve();
                });
            }

            return {
                attach: attach,
                start: start,
                stop: stop,
                detach: detach
            };
        }


        return {
            create: function (config) {
                return widget(config);
            }
        }
    }


    function setup(app) {
        app.addRoute({
            path: ['welcome'],
            widget: welcomeWidget()
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
