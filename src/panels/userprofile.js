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
    'kb.session',
    'kb.widgetconnector',
    'q',
    'jquery'
],
    function (R, html, Session, widgetConnector, q, $) {
        'use strict';

        function renderPanel(params) {
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
                resolve({
                    title: Session.getUsername(),
                    content: panel,
                    widgets: widgets
                });
            });
        }

        function userprofileWidgetFactory() {

            function widget() {
                var mount, container;

                var children = [];

                // API 
                function attach(node) {
                    return q.Promise(function (resolve, reject) {
                        mount = node;
                        container = document.createElement('div');
                        mount.appendChild(container);
                        renderPanel()
                            .then(function (rendered) {
                                container.innerHTML = rendered.content;
                                R.send('app', 'title', rendered.title);
                                // create widgets.
                                children = rendered.widgets;
                                q.all(children.map(function (w) {
                                    return w.widget.init(w.config);
                                }))
                                    .then(function () {
                                        q.all(children.map(function (w) {
                                            return w.widget.attach($('#' + w.id).get(0));
                                        }))
                                            .then(function (results) {
                                                resolve();
                                            })
                                            .catch(function (err) {
                                                console.log('ERROR attaching');
                                                console.log(err);
                                            })
                                            .done();
                                    })
                                    .catch(function (err) {
                                        console.log('ERROR creating');
                                        console.log(err);
                                    })
                                    .done();
                            })
                            .catch(function (err) {
                                console.log('ERROR rendering console');
                                console.log(err);
                                reject(err);
                            })
                            .done();
                    });
                }

                function start(params) {
                    return q.Promise(function (resolve, reject) {
                        // for now these are fire and forget.
                        // this has implications for lifecycle --
                        // for instance, if stop is called immediately after start
                        // can it really stop the widgets? they may be in the middle
                        // of loading dependencies or fetching data!
                        // Better for lifecycle control might be a to have the 
                        // widgets return attachment promises, as we now do for
                        // panels...
                        // 
                        // NB: the widget connector, for now, needs the params
                        // for attachment.
                        console.log('PARAMS');
                        console.log(params);
                        q.all(children.map(function (wc) {
                            return wc.widget.start(params);
                        }))
                            .then(function (results) {
                                resolve();
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                            .done();
                    });
                }
                function stop() {
                    return q.Promise(function (resolve, reject) {
                        q.all(children.map(function (wc) {
                            return wc.widget.stop();
                        }))
                            .then(function (results) {
                                resolve();
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                            .done();
                    });
                }
                function detach() {
                    return q.Promise(function (resolve, reject) {
                        q.all(children.map(function (wc) {
                            return wc.widget.detach();
                        }))
                            .then(function (results) {
                                resolve();
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                            .done();
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
            };
        }

        function setup(app) {
            app.addRoute({
                path: ['people', {type: 'param', name: 'username'}],
                widget: userprofileWidgetFactory()
            });
            app.addRoute({
                path: ['people'],
                render: function (params) {
                    return 'NOT YET';
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
