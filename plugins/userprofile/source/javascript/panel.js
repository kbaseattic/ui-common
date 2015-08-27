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
    'kb.widget.widgetadapter',
    'bluebird',
    'jquery'
],
    function (R, html, Session, widgetAdapterFactory, Promise, $) {
        'use strict';

        function renderPanel(params) {
            return new Promise(function (resolve) {
                // Widgets
                // Widgets are an array of functions or promises which are 
                // invoked later...
                var widgets = [];
                function addWidget(config) {
                    var id = html.genId();
                    widgets.push({
                        id: id,
                        widget: widgetAdapterFactory.make(config)
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
                                    module: 'kb_widget_userProfile_userProfileEditor'
                                })})                            
                        ]),
                        div({class: 'col-sm-3'}, [
                            div({id: addWidget({
                                    name: 'usersearch', 
                                    module: 'kb_widget_userProfile_userSearch'
                                })})
                        ])
                    ]),
                    div({class: 'row'}, [
                        div({class: 'col-sm-6'}, [
                            div({id: addWidget({
                                    name: 'narratives',
                                    module: 'kb_widget_userProfile_narrativeBrowser'
                                })})
                        ]),
                        div({class: 'col-sm-6'}, [
                            div({id: addWidget({
                                    name: 'collaborators',
                                    module: 'kb_widget_userProfile_collaboratorNetwork'
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

        function widget(config) {
            var mount, container,
                children = [],
                root;

            // API 
            function init(config) {
                return new Promise(function (resolve) {
                    root = config.pluginPath;
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
                                var config = w.config || {};
                                config.root = root;
                                return w.widget.init(config);
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