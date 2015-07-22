/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.runtime',
    'kb.html',
    'kb.widgetconnector',
    'kb.simplepanel',
    'q',
    'jquery'
],
    function (R, html, widgetConnector, simplePanel, q, $) {
        'use strict';

        function renderPanel() {
            return q.Promise(function (resolve) {
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
                var div = html.tag('div');
                var panel = div({class: 'kbase-view kbase-user-page-view container-flud', 'data-kbase-view': 'social'}, [
                    div({class: 'row'}, [
                        div({class: 'col-sm-9'}, [
                            div({id: addWidget({
                                    name: 'profile',
                                    module: 'kb.widget.social.user_profile'
                                })})                            
                        ]),
                        div({class: 'col-sm-3'}, [
                            div({id: addWidget({
                                    name: 'usersearch', 
                                    module: 'kb.widget.social.user_search'
                                })})
                        ])
                    ]),
                    div({class: 'row'}, [
                        div({class: 'col-sm-6'}, [
                            div({id: addWidget({
                                    name: 'narratives',
                                    module: 'kb.widget.social.browse_narratives'
                                })})
                        ]),
                        div({class: 'col-sm-6'}, [
                            div({id: addWidget({
                                    name: 'collaborators',
                                    module: 'kb.widget.social.collaborators'
                                })})
                        ])
                    ])
                ]);
                var title;
                if (R.getUsername === params.username) {
                    title = 'Viewing your Profile';
                } else {
                    title = 'Viewing profile for ' + params.username;
                }
                resolve({
                    title: title,
                    content: panel,
                    widgets: widgets
                });
            });
        }
        function runner() {
            return q.Promise(function (resolve) {
               +++ LEFT OFF HERE +++
               need to figure out how to give the panel state, communiciate with its env (e.g. title),
               and also feed params to the children widgets.
               this particular solution is TRYING to be generic. Of course, bringing the full
               implementation of the panel in here would solve the problem ...
            });
        }

        function setup(app) {
            app.addRoute({
                path: ['people', {type: 'param', name: 'username'}],
                widget: simplePanel({
                    renderer: renderPanel,
                    runner: runner
                })
            });
            app.addRoute({
                path: ['people'],
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
