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
    'kb.widget.databrowser'
],
    function (q, html, R, databrowserWidgetFactory) {
        'use strict';

        /*
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
                        widget: widgetAdapter.make(config)
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
        */
       
                

        function widget(config) {
            var mount, container;
            
            
            function render() {
                var h1 = html.tag('h1'),
                    div = html.tag('div');

                var widgets = [];

                function addFactoryWidget(def) {
                    var id = html.genId();
                    widgets.push({
                        id: id,
                        widget: def.widget
                    });
                    return div({id: id});
                }

                return {
                    title: 'Data Browser',
                    content: div({class: 'kb-panel-databrowser'}, [
                        h1('Data Browser'),
                        div({class: 'row'}, [
                            div({class: 'col-md-12'}, [
                                html.bsPanel('Data Browser Widget', addFactoryWidget({
                                    config: {},
                                    widget: databrowserWidgetFactory.make()
                                }))
                            ])
                        ])
                    ]),
                    widgets: widgets
                };
            }

            /* DOC: create lifecycle event
             * The create lifecycle event is the only synchronous one. 
             * This is because object creation, in its many forms, may
             * not always be naturally implementable as a promise.
             * In this case, we are trying to exemplify how a Panel can
             * strictly follow the widget lifecycle interface, and mangage
             * its sub-widgets along exactly the same trajectory. In reality,
             * sometimes a sub-widgets lifecyle events won't necessarily 
             * correspond to the parent widget's events.
             */
            var rendered = render();
            
            
            function init() {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }

            // Widget API
            function attach(node) {
                return q.Promise(function (resolve, reject) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    container.innerHTML = html.flatten(rendered.content);
                    R.send('app', 'title', rendered.title);
                    q.all(rendered.widgets.map(function (w) {
                            return w.widget.attach($('#' + w.id).get(0));
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
                return q.Promise(function (resolve) {
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.detach();
                    }))
                        .then(function (results) {
                            mount.removeChild(container);
                            container = null;
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();
                });
            }
            function start(params) {
                return q.Promise(function (resolve) {
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.start(params);
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
            function run(params) {
                return q.Promise(function (resolve) {
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.run(params);
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
                return q.Promise(function (resolve) {
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.stop();
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
            function destroy() {
                return q.Promise(function (resolve) {
                    q.all(rendered.widgets.map(function (w) {
                        if (w.widget.destroy) {
                            return w.widget.destroy();
                        }
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
                detach: detach,
                start: start,
                run: run,
                stop: stop,
                destroy: destroy
            };
        }

        return {
            create: function (config) {
                return widget(config);
            }
        };
    });
