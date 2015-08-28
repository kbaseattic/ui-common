/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'bluebird',
    'jquery',
    'kb.html',
    'kb.runtime',
    'kb_widget_egPlugin_testWidget'
],
    function (Promise, $, html, R, testWidget) {
        /* DOC: strict mode
         * We always set strict mode with the following magic javascript
         * incantation.
         */
        'use strict';

        function widget(config) {
            var mount, container;

            function render() {
                var h1 = html.tag('h1'),
                    div = html.tag('div'),
                    p = html.tag('p');

                var widgets = [];

                function addFactoryWidget(def) {
                    var id = html.genId();
                    widgets.push({
                        id: id,
                        widget: def.widget
                    });
                    return div({id: id});
                }

                function addObjectInterfaceWidget(def) {
                    var id = html.genId();
                    widgets.push({
                        id: id,
                        widget: def.widget
                    });
                    return div({id: id});
                }

                return {
                    title: 'Example Plugin Panel',
                    content: div([
                        h1('Example Plugin Panel'),
                        p('This is an example plugin panel'),
                        div({class: 'row'}, [
                            div({class: 'col-md-6'}, [
                                html.bsPanel('About', [
                                    'This is an example plugin'
                                ])
                            ]),
                            div({class: 'col-md-6'}, [
                                html.bsPanel('About', [
                                    addObjectInterfaceWidget({
                                        widget: Object.create(testWidget)
                                    })
                                ])
                            ])
                        ])
                    ]),
                    widgets: widgets
                };
            }

            var rendered = render();

            function init(config) {
                return new Promise(function (resolve, reject) {
                    Promise.all(rendered.widgets.map(function (w) {
                        return w.widget.init(w.config);
                    }))
                        .then(function () {
                            resolve();
                        })
                        .catch(function (err) {
                            /* TODO: work out best pattern for error flow */
                            console.log('ERROR creating');
                            console.log(err);
                        })
                        .done();
                });
            }

            function attach(node) {
                return new Promise(function (resolve, reject) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);

                    container.innerHTML = rendered.content;

                    R.send('app', 'title', rendered.title);

                    Promise.all(rendered.widgets.map(function (w) {
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
                });
            }
            function start(params) {
                return new Promise(function (resolve, reject) {
                    Promise.all(rendered.widgets.map(function (w) {
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
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function stop() {
                return new Promise(function (resolve) {
                    Promise.all(rendered.widgets.map(function (w) {
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
            function detach() {
                return new Promise(function (resolve) {
                    Promise.all(rendered.widgets.map(function (w) {
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
            function destroy() {
                return new Promise(function (resolve) {
                    resolve();
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