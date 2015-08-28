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
    'bluebird',
    'jquery',
    'kb.widget.widgetadapter'
],
    function (html, R, StateMachine, Promise, $, widgetAdapter) {
        'use strict';

        function renderPanel() {
            return new Promise(function (resolve) {
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
                        widget: widgetAdapter.make(config)
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
                                    module: 'kb_widget_dashboard_narratives'
                                })}),
                            div({id: addWidget({
                                    name: 'sharednarratives',
                                    config: {
                                        viewState: panelState
                                    },
                                    module: 'kb_widget_dashboard_sharedNarratives'
                                })}),
                            div({id: addWidget({
                                    name: 'publicnarratives',
                                    config: {
                                        viewState: panelState
                                    },
                                    module: 'kb_widget_dashboard_publicNarratives'
                                })}),
                            div({id: addWidget({
                                    name: 'apps',
                                    config: {
                                        viewState: panelState
                                    },
                                    module: 'kb_widget_dashboard_apps'
                                })})
                        ]),
                        div({class: 'col-sm-4'}, [
                            div({id: addWidget({
                                    name: 'profile',
                                    config: {
                                        viewState: panelState
                                    },
                                    module: 'kb_widget_dashboard_profile'
                                })}),
                            div({id: addWidget({
                                    name: 'metrics',
                                    config: {
                                        viewState: panelState
                                    },
                                    module: 'kb_widget_dashboard_metrics'
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

        function widget() {
            var mount, container;

            var children = [];

            // API 
            function init(config) {
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function attach(node) {
                return new Promise(function (resolve, reject) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    renderPanel()
                        .then(function (rendered) {
                            container.innerHTML = rendered.content;
                            R.send('app', 'title', rendered.title);
                            // create widgets.
                            children = rendered.widgets;
                            Promise.all(children.map(function (w) {
                                return w.widget.init(w.config);
                            }))
                                .then(function () {
                                    Promise.all(children.map(function (w) {
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
                return new Promise(function (resolve, reject) {
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
                    Promise.all(children.map(function (wc) {
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
                return new Promise(function (resolve, reject) {
                    Promise.all(children.map(function (wc) {
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
                return new Promise(function (resolve, reject) {
                    Promise.all(children.map(function (wc) {
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
                init: init,
                attach: attach,
                start: start,
                stop: stop,
                detach: detach
            };
        }

        return {
            make: function (config) {
                return widget(config);
            }
        };
    });