/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'q',
    'knockout',     
    'kb.html', 
    'kb.runtime', 
    'kb.messaging'
], 
    function ($, Q, ko, html, R, Messaging) {
    'use strict';

    var msgMan = Object.create(Messaging.MessageManager).init();

    var Widget = function () {
        var viewModel = function () {
            var messageSent = ko.observable(),
                messageReceived = ko.observable();

            msgMan.on('clickme', function (msg) {
                messageReceived(msg.data);
            });

            return {
                messageSent: messageSent,
                messageReceived: messageReceived,
                clicker: function () {
                    var id = html.genId();
                    messageSent(id);
                    msgMan.broadcast('clickme', id);
                }
            };
        };


        var div = html.tag('div'),
            span = html.tag('span');
        var view = div([
            div({dataBind: {click: 'clicker'}}, [
                'Click Here'
            ]),
            div([
                'sent: ', span({dataBind: {text: 'messageSent'}})
            ]),
            div([
                'received: ', span({dataBind: {text: 'messageReceived'}})
            ])
        ]);

        return {
            viewModel: viewModel,
            template: view
        };
    };
    function unApplyBindings(node, remove) {
        // Unbind DOM events 
        $(node).find('*').each(function () {
            $(this).unbind();
        });

        // Remove KO subscriptions.
        if (remove) {
            ko.removeNode(node);
        } else {
            ko.cleanNode(node);
        }
    }
    
    
    function aboutPanelFactory()  {
        function widget(config) {
            var mount, container;
            function render() {
                var p = html.tag('p'),
                    div = html.tag('div'),
                    a = html.tag('a');
                return [
                    p('This is all about KBase.'),
                    div([
                        p('Hi'),
                        p(['Hello, ', R.getUsername()]),
                        p(['Try this', a({href: '#contact'}, 'Contact')])
                    ]),
                    div({dataBind: {component: {name: '"test"'}}, style: {border: '1px red dotted'}})
                ];
            }
            // Widget API
            function attach(node) {
                return Q.Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    container.innerHTML = html.flatten(render());
                    resolve();
                });
            }
            function detach() {
                return Q.Promise(function (resolve) {
                    mount.removeChild(container);
                    container = null;
                    resolve();
                });
            }
            function start(params) {
                return Q.Promise(function (resolve) {
                    ko.applyBindings(null, container);
                    resolve();
                });
            }
            function stop() {
                return Q.Promise(function (resolve) {
                    ko.cleanNode(container);
                    resolve();
                });
            }

            return {
                attach: attach,
                detach: detach,
                start: start,
                stop: stop
            };
        };

        return {
            create: function (config) {
                return widget(config);
            }
        };
    }
    
    function setup(app, config) {
       

        // create our little ko test widget.
        ko.components.register('test', Widget());

        app.addRoute({
            path: ['about'],
            widget: aboutPanelFactory()
        });
        // app.addRoute({
        //     path: ['about', {type: 'param', name: 'name'}],
        //     render: function (params) {
        //         return 'This is all about ' + params.name;
        //     }
        // });
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
