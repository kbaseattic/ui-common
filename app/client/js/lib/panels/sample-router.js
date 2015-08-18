
/* DOC: jslint configuration
 * The following two comment sections are instructions to jslint, to 
 * provide exceptions to allow for less noisy but still useful linting.
 */
/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */

/* DOC: requirejs define
 * Note that this is an anonymous define. The module name for this panel is 
 * provided in require-config.js, which associates a string key with this module file.
 * The only dependency required to implement a panel is a promises library,
 * in this case Q (cit. here).
 * It is very commong to have jquery and kb.html also included, as they
 * assist greatly in building html and manipulating the DOM, and kb.runtime
 * since it is the primary interface to the user interface runtime.
 * In addition, any widgets will need to be included here as well.
 * (Well, some usage patterns may load widgets in a different way, but this
 *  sample panel represents a moderately straightforward implementation.)
 *  
 *  Formatting: I find that listing each module name on a separate line 
 *  enhances readability.
 * 
 */

/* @typedef Panel
 * @type {object}
 * @method {undefined} setup
 * @method {undefined} teardown
 * 
 */

/* 
 * Sample panel module.
 * @module {Panel} panel/sample
 * 
 */
define([
    'q',
    'jquery',
    'kb.html',
    'kb.runtime',
    'kb.widget.sample.factory',
    'kb.widget.kbwidgetadapter',
    'kb.widget.widgetadapter',
    'kb.widget.sample.object-interface'
],
    function (q, $, html, R, sampleWidgetFactory, kbWidgetAdapterFactory, widgetAdapterFactory, sampleObjectInterfaceWidget) {
        /* DOC: strict mode
         * We always set strict mode with the following magic javascript
         * incantation.
         */
        'use strict';

        function panelFactory() {

            function widget(config) {
                /* DOC: widget variables and factory pattern
                 * In the factory pattery for object creation, we can just
                 * declare variables within the factory function, and they 
                 * are naturally available to all functions defined within.
                 * 
                 * In this case we need to store references to the original 
                 * DOM node passed during attachment (mount), the DOM node
                 * created by the Panel for its own use (container),
                 * and an array of subwidgets (children).
                 */
                var mount, container;

                /* DOC helper functions
                 * Although not part of the Panel Interface, a common pattern is
                 * to have a sert of helper functions. This assists in meeting 
                 * the coding standard of short, understandable, single-purposed
                 * functions.
                 * A very common helper funcion is a renderer. A panel may have 
                 * more then one render function, e.g. to represent different
                 * states. In this case, the render function simply builds a
                 * layout upon which it will attache widgets.
                 * 
                 */
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

                    function addJqueryWidget(config) {
                        var id = html.genId();
                        widgets.push({
                            widget: kbWidgetAdapterFactory.make(config),
                            id: id
                        });
                        return id;
                    }

                    function addObjectWidget(config) {
                        var id = html.genId();
                        widgets.push({
                            id: id,
                            widget: widgetAdapterFactory.make(config)
                        });
                        return id;
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
                        title: 'Sample Panel',
                        content: div([
                            h1('Sample Panel and Widgets'),
                            div({class: 'row'}, [
                                div({class: 'col-md-6'}, [
                                    'Will be here...',
                                    html.bsPanel('Sample Factory Widget', addFactoryWidget({
                                        config: {},
                                        widget: sampleWidgetFactory.make()
                                    })),
                                    html.bsPanel('Sample jquery Widget', div({id: addJqueryWidget({
                                            name: 'samplejquerywidget',
                                            module: 'kb.widget.sample.jquery',
                                            jquery_object: 'SampleWidget'
                                        })})),
                                    html.bsPanel('Sample Object Widget', div({id: addObjectWidget({
                                            name: 'sampleobjectwidget',
                                            module: 'kb.widget.sample.object'
                                        })})),
                                    html.bsPanel('Sample Object Widget with Interface', addObjectInterfaceWidget({
                                        widget: Object.create(sampleObjectInterfaceWidget)
                                    }))
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
        }

        function setup(app) {
            app.addRoute({
                path: ['sample', 'router', {type: 'param', name: 'param1'}],
                queryParams: {
                    param2: {
                        required: true
                    },
                    param3: {
                        required: false
                    },
                    param4: {
                        required: true
                    }
                },
                panelFactory: panelFactory()
            });
            R.send('navbar', 'add-menu-item', {
                name: 'samplerouter', 
                definition: {
                    path: 'sample/router/test', 
                    label: 'Sample Panel with Interesting Routing', 
                    icon: 'plane'
                }
            });
        }
        function teardown() {
            // TODO: remove routes
            return false;
        }
        
        return {
            setup: setup,
            teardown: teardown
        };
    });
