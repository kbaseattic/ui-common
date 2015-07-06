/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.html', 'kb.statemachine', 'q'],
    function (html, StateMachine, Q) {
        'use strict';

        function renderPanel(app, params) {
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
                                        module: 'kb.widget.databrowser'
                                    })})
                                )
                        ])
                    ])
                ]);
                resolve({
                    title: 'Data Browser for ' + app.getUserId(),
                    content: panel,
                    widgets: widgets
                });
            });
        }

        function setup(app) {
            app.addRoute({
                path: ['databrowser'],
                promise: function (params) {
                    return Q.promise(function (resolve) {
                        resolve(renderPanel(app, params));
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
