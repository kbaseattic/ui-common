/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.html', 'kb.session', 'q', 'kb.messaging', 'knockout', 'jquery'], function (html, Session, Q, Messaging, ko, $) {
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
    function unapplyBindings(node, remove) {
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
    function setup(app) {
        var p = html.tag('p'),
            div = html.tag('div');

        ko.components.register('test', Widget());

        app.addRoute({
            path: ['about'],
            promise: function (params) {
                return Q.promise(function (resolve) {
                    var content = [
                        p('This is all about KBase.'),
                        div([
                            p('Hi'),
                            p(['Hello, ', Session.getUsername()])
                        ]),
                        div({dataBind: {component: {name: '"test"'}}, style: {border: '1px red dotted'}})
                    ];
                    resolve({
                        content: content,
                        title: 'About the Functional Site',
                    });
                });
            },
            start: function (node, self) {
                ko.applyBindings(node);
            },
            stop: function (node, self) {
                unapplyBindings(node);
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
