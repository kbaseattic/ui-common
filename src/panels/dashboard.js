/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.html',
    'kb.runtime',
    'kb.statemachine',
    'q',
    'jquery',
    'kb.widget.widgetadapter',
    'kb.simplepanel',
    'css!kb.panel.dashboard.style'
],
    function (html, R, StateMachine, q, $, widgetAdapter, simplePanel) {
        'use strict';

        function renderPanel() {
            return q.Promise(function (resolve) {
                // View stat is a local state machine for this view.
                var panelState = Object.create(StateMachine).init();

                // Widgets
                // Widgets are an array of functions or promises which are 
                // invoked later...
                var widgets = [];

                function addWidget(config) {
                    var id = html.genId();
                    widgets.push({
                        id: id,
                        config: config,
                        widget: widgetAdapter.make()
                    });
                    return id;
                }

                // Render panel
                var div = html.tag('div');
                var panel = div({class: 'kbase-view kbase-dashboard-view container-fluid', 'data-kbase-view': 'social'}, [
                    div({class: 'row'}, [
                        div({class: 'col-sm-8'}, [
                            div({id: addWidget({
                                    name: 'narratives',
                                    config: {
                                        viewState: panelState
                                    },
                                    module: 'kb.widget.dashboard.narratives'
                                })}),
                            div({id: addWidget({
                                    name: 'sharednarratives',
                                    config: {
                                        viewState: panelState
                                    },
                                    module: 'kb.widget.dashboard.sharedNarratives'
                                })}),
                            div({id: addWidget({
                                    name: 'publicnarratives',
                                     config: {
                                        viewState: panelState
                                    },
                                    module: 'kb.widget.dashboard.publicNarratives'
                                })}),
                            div({id: addWidget({
                                    name: 'apps',
                                     config: {
                                        viewState: panelState
                                    },
                                    module: 'kb.widget.dashboard.apps'
                                })})
                        ]),
                        div({class: 'col-sm-4'}, [
                            div({id: addWidget({
                                    name: 'profile',
                                    config: {
                                        viewState: panelState
                                    },
                                    module: 'kb.widget.dashboard.profile'
                                })}),
                            div({id: addWidget({
                                    name: 'metrics',
                                     config: {
                                        viewState: panelState
                                    },
                                    module: 'kb.widget.dashboard.metrics'
                                })})
                        ])
                    ])
                ]);
                resolve({
                    title: 'Dashboard for ' + R.getUsername(),
                    content: panel,
                    widgets: widgets
                });
            });
        }

        function setup(app) {
            app.addRoute({
                id: 'dashboard',
                path: ['dashboard'],
                widget: simplePanel({
                    renderer: renderPanel
                })
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