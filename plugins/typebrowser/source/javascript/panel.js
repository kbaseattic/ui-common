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
    'kb.dom',
    'kb.runtime',
    'kb_widget_typeBrowser'
],
    function (q, html, DOM, R, typeBrowser) {
        'use strict';
        
        function widget(config) {
            var mount, container;

            function render() {
                var widgets = [];
                function addWidget(config) {
                    var id = html.genId();
                    widgets.push({
                        id: id,
                        widget: config.widget
                    });
                    return id;
                }

                // Render panel
                var div = html.tag('div'),
                    panel = html.panel;
                var panel = div({class: 'kbase-view kbase-typebrowser-view container-fluid', 'data-kbase-view': 'typebrowser'}, [
                    div({class: 'row'}, [
                        div({class: 'col-sm-12'}, [
                            panel('Type Browser',
                                div({id: addWidget({
                                        name: 'typebrowser',
                                        config: {},
                                        widget: typeBrowser.make()
                                    })})
                                )
                        ])
                    ])
                ]);
                return {
                    title: 'Type Browser for ' + R.getUsername(),
                    content: panel,
                    widgets: widgets
                };
            }

            var rendered = render();


            // Widget API
            function init() {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }
            function attach(node) {
                return q.Promise(function (resolve, reject) {
                    mount = node;
                    container = DOM.createElement('div');
                    mount.appendChild(container);
                    container.innerHTML = html.flatten(rendered.content);
                    R.send('app', 'title', rendered.title);
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.attach(DOM.findById(w.id));
                    }))
                        .then(function () {
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
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.detach();
                    }))
                        .then(function () {
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
                return q.Promise(function (resolve, reject) {
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.start(params);
                    }))
                        .then(function () {
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();
                });
            }
            function run(params) {
                return q.Promise(function (resolve, reject) {
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.run(params);
                    }))
                        .then(function () {
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
                    q.all(rendered.widgets.map(function (w) {
                        return w.widget.stop();
                    }))
                        .then(function () {
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();
                });
            }
            function destroy() {
                return q.Promise(function (resolve, reject) {
                    q.all(rendered.widgets.map(function (w) {
                        if (w.widget.destroy) {
                            return w.widget.destroy();
                        }
                    }))
                        .then(function () {
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
            make: function (config) {
                return widget(config);
            }
        };
    });
