/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'bluebird',
    'knockout',     
    'kb.html', 
    'kb.runtime', 
    'kb.messaging'
], 
    function ($, Promise, ko, html, R, Messaging) {
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
    ko.components.register('test', Widget());
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
    
    /*
     * The widget factory function implements the widget interface.
     */
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
        function init() {
            return new Promise(function (resolve) {
               resolve();
            });
        }
        function attach(node) {
            return new Promise(function (resolve) {
                mount = node;
                container = document.createElement('div');
                mount.appendChild(container);
                container.innerHTML = html.flatten(render());
                R.send('app', 'title', 'About then FUNctional Site');
                resolve();
            });
        }
        function detach() {
            return new Promise(function (resolve) {
                mount.removeChild(container);
                container = null;
                resolve();
            });
        }
        function start(params) {
            return new Promise(function (resolve) {
                ko.applyBindings(null, container);
                resolve();
            });
        }
        function stop() {
            return new Promise(function (resolve) {
                ko.cleanNode(container);
                resolve();
            });
        }

        return {
            init: init,
            attach: attach,
            detach: detach,
            start: start,
            stop: stop
        };
    };
    
    return {
        make: function (config) {
            return widget(config);
        }
    };
    
});
