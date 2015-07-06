/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.html', 'kb.statemachine', 'kb.session', 'q', 'postal', 'css!kb.panel.dashboard.style'],
    function (html, StateMachine, Session, Q, Postal) {
        'use strict';

        function renderPanel(params) {
            return Q.Promise(function (resolve) {
                // View stat is a local state machine for this view.
                var viewState = Object.create(StateMachine).init();

                // Widgets
                // Widgets are an array of functions or promises which are 
                // invoked later...
                var widgets = {};

                function addWidget(config) {
                    var id = html.genId();
                    widgets[config.name] = {
                        id: id,
                        attach: function (node) {
                            require([config.module], function (Widget) {
                                var W = Object.create(Widget);
                                W.init({
                                    container: node,
                                    userId: params.username,
                                    viewState: viewState
                                }).go();
                            });
                        }
                    };
                    return id;
                }

                // Render panel
                var div = html.tag('div');
                var panel = div({class: 'kbase-view kbase-dashboard-view container-fluid', 'data-kbase-view': 'social'}, [
                    div({class: 'row'}, [
                        div({class: 'col-sm-8'}, [
                            div({id: addWidget({
                                    name: 'narratives',
                                    module: 'kb.widget.dashboard.narratives'
                                })}),
                            div({id: addWidget({
                                    name: 'sharednarratives',
                                    module: 'kb.widget.dashboard.sharedNarratives'
                                })}),
                            div({id: addWidget({
                                    name: 'publicnarratives',
                                    module: 'kb.widget.dashboard.publicNarratives'
                                })}),
                            div({id: addWidget({
                                    name: 'apps',
                                    module: 'kb.widget.dashboard.apps'
                                })})
                        ]),
                        div({class: 'col-sm-4'}, [
                            div({id: addWidget({
                                    name: 'profile',
                                    module: 'kb.widget.dashboard.profile'
                                })}),
                            div({id: addWidget({
                                    name: 'metrics',
                                    module: 'kb.widget.dashboard.metrics'
                                })}),
                            div({id: addWidget({
                                    name: 'usersearch',
                                    module: 'kb.widget.dashboard.usersearch'
                                })})
                        ])
                    ])
                ]);
                resolve({
                    title: 'Dashboard for ' + Session.getUsername(),
                    content: panel,
                    widgets: widgets
                });
            });
        }

        function setup(app) {
            app.addRoute({
                id: 'dashboard',
                path: ['dashboard'],
                promise: function (params) {
                    return Q.promise(function (resolve) {
                        resolve(renderPanel(params));
                    });
                },
                start: start,
                stop: stop
            });
        }
        function teardown() {
            // TODO: remove routes
            return false;
        }

        function start() {
        }
        function stop() {
        }
        return {
            setup: setup,
            teardown: teardown,
            start: start,
            stop: stop
        };
    });