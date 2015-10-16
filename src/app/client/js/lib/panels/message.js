/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.html', 'kb.session', 'bluebird'], function (html, Session, Promise) {
    'use strict';

    function messagePanel() {

        function widget(config) {
            var mount, container, $container;
            
            function getMessage(id) {
                switch (id) {
                    case 'notfound': 
                        return {
                            title: 'Not Found',
                            text: 'Sorry, that was not found'
                        };                        
                }
            }

            function render(id) {
                var h1 = html.tag('h1'),
                    p = html.tag('p'),
                    div = html.tag('div');
                var message = getMessage(id);
                return div([
                    h1(message.title),
                    p(message.text)
                ]);
            }

            function attach(node) {
                return new Promise(function (resolve) {

                    mount = node;
                    container = document.createElement('div');
                    $container = $(container);
                    mount.appendChild(container);

                    resolve();
                });
            }
            function start(params) {
                return new Promise(function (resolve) {                    
                    container.innerHTML = render(params.id);
                    resolve();
                });
            }
            function stop(node) {
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function detach(node) {
                return new Promise(function (resolve) {
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
            path: ['message', {type: 'param', name: 'id'}],
            widget: messagePanel()
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
