/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'bluebird',
    'kb.dom',
    'kb.html',
    'kb.widget.kbwidgetadapter'
], function (Promise, DOM, html, kbWidgetAdapterFactory) {
    'use strict';
    function widget(config) {
        var mount, container;

        // Mini widget manager
        function render() {
            var div = html.tag('div');
            var widgets = [];
            function addKBWidget(config) {
                var id = html.genId();
                widgets.push({
                    widget: kbWidgetAdapterFactory.make(config),
                    id: id
                });
                return id;
            }
            var content = div([
                div({id: addKBWidget({
                        module: 'kb_widget_narrativeStore',
                        jquery_object: 'KBaseNarrativeStoreView'
                    })})
            ]);
            return {
                content: content,
                widgets: widgets
            };
        }

        var rendered = render();

        // Widget Interface Implementation

        function init(config) {
            return new Promise(function (resolve) {
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
            return new Promise(function (resolve) {
                mount = node;
                container = DOM.createElement('div');
                mount.appendChild(container);
                Promise.all(rendered.widgets.map(function (w) {
                    return w.widget.attach(node);
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
        function start(params) {
            return new Promise(function (resolve) {
                container.innerHTML = rendered.content;
                Promise.all(rendered.widgets.map(function (w) {
                    return w.widget.start(params);
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
                resolve();
            });
        }
        function run(params) {
            return new Promise(function (resolve) {
                container.innerHTML = rendered.content;
                Promise.all(rendered.widgets.map(function (w) {
                    return w.widget.start(params);
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
        function stop() {
            return new Promise(function (resolve) {
                Promise.all(rendered.widgets.map(function (w) {
                    return w.widget.stop();
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
        function detach() {
            return new Promise(function (resolve) {
                Promise.all(rendered.widgets.map(function (w) {
                    return w.widget.detach();
                }))
                        .then(function () {
                            mount.removeChild(container);
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
        function destroy() {
            return new Promise(function (resolve) {
                Promise.all(rendered.widgets.map(function (w) {
                    return w.widget.destroy();
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

        // Widget Interface
        return {
            init: init,
            attach: attach,
            start: start,
            run: run,
            stop: stop,
            detach: detach,
            destroy: destroy
        };
    }

    return {
        make: function (config) {
            return widget(config);
        }
    };

});