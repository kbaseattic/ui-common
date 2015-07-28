/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'q',
    'kb.html',
    'kb.runtime',
    'kb.statemachine', 
    'kb.widgetconnector',
    'kb.simplepanel'
],
    function (q, html, R, StateMachine, widgetConnector, simplePanel) {
        'use strict';

        function renderPanel() {
            return q.Promise(function (resolve) {
                // View stat is a local state machine for this view.
                var viewState = Object.create(StateMachine).init();

                // Widgets
                // Widgets are an array of functions or promises which are 
                // invoked later...
                var widgets = [];
                function addWidget(config) {
                    var id = html.genId();
                    widgets.push({
                        id: id,
                        config: config,
                        widget: widgetConnector.create()
                    });
                    return id;
                }

                // Render panel
                var div = html.tag('div'),
                    panel = html.panel;
                var panel = div({class: 'kbase-view kbase-databrowser-view container-fluid', 'data-kbase-view': 'databrowser'}, [
                    div({class: 'row'}, [
                        div({class: 'col-sm-3'}, [
                            panel('Search', 'Search will go here...')
                        ]),
                        div({class: 'col-sm-9'}, [
                            panel('Data Browser',
                                div({id: addWidget({
                                        name: 'databrowser',
                                        config: {
                                            viewState: viewState
                                        },
                                        module: 'kb.widget.databrowser'
                                    })})
                                )
                        ])
                    ])
                ]);
                resolve({
                    title: 'Data Browser for ' + R.getUsername(),
                    content: panel,
                    widgets: widgets
                });
            });
        }

        function setup(app) {
            app.addRoute({
                path: ['databrowser'],
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
