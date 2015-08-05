/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'q',
    'jquery',
    'kb.html',
    'kb.runtime'
],
    function (q, $, html, R) {
        /* DOC: strict mode
         * We always set strict mode with the following magic javascript
         * incantation.
         */
        'use strict';

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
                            div({class: 'row'}, [
                                div({class: 'col-md-6'}, [
                                    'This is an example plugin panel!',
                                    html.bsPanel('About', [
                                        'This is an example plugin'
                                    ])
                                ])
                            ])
                        ]),
                        widgets: widgets
                    };
                }

                var rendered = render();

                function init(config) {
                    return q.Promise(function (resolve, reject) {
                        q.all(rendered.widgets.map(function (w) {
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
                    return q.Promise(function (resolve, reject) {
                        mount = node;
                        container = document.createElement('div');
                        mount.appendChild(container);

                        container.innerHTML = rendered.content;

                        R.send('app', 'title', rendered.title);

                        q.all(rendered.widgets.map(function (w) {
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
                        resolve();
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
                function detach() {
                    return q.Promise(function (resolve) {
                        q.all(rendered.widgets.map(function (w) {
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
                    return q.Promise(function (resolve) {
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
            create: function (config) {
                return widget(config);
            }
        };
    });