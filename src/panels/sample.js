/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'q',
    'underscore',
    'kb.html',
    'kb.runtime',
    'kb.widget.sample.factory'
],
    function ($, q, _, html, R, SampleFactoryWidget) {
        'use strict';

        function samplePanel() {

            function widget(config) {
                var mount, container;
                var children;
                
                function render() {
                    return q.Promise(function (resolve) {
                        var h1 = html.tag('h1'),
                            div = html.tag('div');

                        var widgets = [];

                        function addWidget(config) {
                            var id = html.genId();
                            widgets.push({
                                id: id,
                                config: config,
                                widget: config.widget
                            });
                            return div({id: id});
                        }

                        resolve({
                            title: 'Sample Panel',
                            content: div([
                                h1('Sample Panel and Widgets'),
                                div({class: 'row'}, [
                                    div({class: 'col-md-6'}, [
                                       'Will be here...',
                                       addWidget({
                                           widget: SampleFactoryWidget.create()
                                       })
                                    ])
                                ])
                            ]),
                            widgets: widgets
                        });
                    });
                }

                function attach(node) {
                    return q.Promise(function (resolve, reject) {
                        mount = node;
                        container = document.createElement('div');
                        mount.appendChild(container);
                        render()
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
                    return q.Promise(function (resolve) {
                        q.all(children.map(function (w) {
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
                function stop(node) {
                    return q.Promise(function (resolve) {
                        q.all(children.map(function (w) {
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
                function detach(node) {
                    return q.Promise(function (resolve) {
                        q.all(children.map(function (w) {
                            return w.widget.detach();
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
                path: ['sample'],
                widget: samplePanel()
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
