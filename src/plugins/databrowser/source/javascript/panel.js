/*global
 define, require
 */
/*jslint
 white: true
 */
define([
    'bluebird',
    'kb.html',
    'kb.dom',
    'kb.runtime',
    'kb_widget_databrowser'
],
    function (Promise, html, DOM, R, databrowserWidgetFactory) {
        'use strict';

        function widget(config) {
            var mount, container;


            function render() {
                var h1 = html.tag('h1'),
                    div = html.tag('div');

                var widgets = [];

                function addWidget(def) {
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
                                html.bsPanel('Data Browser Widget', addWidget({
                                    config: {},
                                    widget: databrowserWidgetFactory.make()
                                }))
                            ])
                        ])
                    ]),
                    widgets: widgets
                };
            }

            var rendered = render();


            // Widget API
            function init() {
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function attach(node) {
                return new Promise(function (resolve, reject) {
                    mount = node;
                    container = DOM.createElement('div');
                    mount.appendChild(container);
                    container.innerHTML = html.flatten(rendered.content);
                    R.send('app', 'title', rendered.title);
                    Promise.all(rendered.widgets.map(function (w) {
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
                return new Promise(function (resolve, reject) {
                    Promise.all(rendered.widgets.map(function (w) {
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
                return new Promise(function (resolve, reject) {
                    Promise.all(rendered.widgets.map(function (w) {
                        return w.widget.start(params);
                    }))
                        .then(function () {
                            resolve();
                        })
                        .catch(function (err) {
                            /* TODO: render error here */
                            console.log('ERROR starting widgets');
                            console.log(err);
                            reject(err);
                        })
                        .done();
                });
            }
            function run(params) {
                return new Promise(function (resolve, reject) {
                    Promise.all(rendered.widgets.map(function (w) {
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
                return new Promise(function (resolve, reject) {
                    Promise.all(rendered.widgets.map(function (w) {
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
                return new Promise(function (resolve, reject) {
                    Promise.all(rendered.widgets.map(function (w) {
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
