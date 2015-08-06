
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
                    /*
                     * DOC: html helper module
                     * The kb.html helper module is quite useful for building 
                     * html in a functional style. It has a generic tag function
                     * builder, as well as methods to build more complex html
                     * structures.
                     */
                    var h1 = html.tag('h1'),
                        div = html.tag('div');

                    /* DOC: avoiding extra dependencies
                     * Sometimes it is easier to implement a management interface
                     * directly in code like this. In this case we both add a
                     * widget to a list of child widgets, and build a 
                     * widget container structure which populates the widgets
                     * by associating a dynamically created unique id 
                     * (from html module) with both the widget and the dom node
                     * it will be rendered in (at some future time.)
                     * This is a very common pattern for creating widgets
                     * ahead of their use, when the html is not yet 
                     * instantiated in the DOM.
                     */
                    var widgets = [];

                    /* DOC: factory widgets
                     * The "factory widget" is a widget that is created 
                     * by the factory pattern, and implements the widget lifecycle
                     * interface. 
                     * Note that we use the widget directly here, since it implements
                     * the widget lifecycle api completely.
                     * 
                     * See the sample widget file for details.
                     * 
                     * Also note our little pattern for our widget definition.
                     * We have an id, which stores a unique string id for associating
                     * the widget the a dome node.
                     * A config object which is simply a way of passing information to a
                     * widget from the panel code. Note that this is not the same as 
                     * parameters, which are more oriented towards dynamic informatin such
                     * as route parameters
                     * A widget object is some object which implements the widget lifecycle
                     * api.
                     */
                    function addFactoryWidget(def) {
                        var id = html.genId();
                        widgets.push({
                            id: id,
                            widget: def.widget
                        });
                        return div({id: id});
                    }

                    /* DOC: jquery widget
                     * 
                     * This is a method for working with traditional kbase jquery 
                     * widgets. These widgets do not implement the widget lifecycle, 
                     * so instead of 
                     */
                    function addKBWidgetWidget(config) {
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

                    /* DOC: return some structure
                     * The render function returns enough structure to represent
                     * what needs to be rendered. This is not hard-coded at all, 
                     * and is just a convention within this panel. It has turned
                     * out, however, to be a useful pattern.
                     */
                    return {
                        title: 'Sample Panel',
                        content: div({class: 'kb-panel-sample'}, [
                            h1('Sample Panel and Widgets'),
                            div({class: 'row'}, [
                                div({class: 'col-md-6'}, [
                                    'Will be here...',
                                    html.bsPanel('Sample Factory Widget', addFactoryWidget({
                                        config: {},
                                        widget: sampleWidgetFactory.make()
                                    })),
                                    html.bsPanel('Sample jquery Widget', div({id: addKBWidgetWidget({
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

                /* DOC: init event
                 * Since a panel implements the widget interface, it starts 
                 * with an init event handler. The init event gives the panel
                 * a chance to set up whetever it needs, and to fail early if
                 * the proper conditions are not met.
                 * In this case, we really just need to initialize the sub-widgets.
                 * 
                 */
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

                /* DOC: attach event
                 * This attach() function implements the attach lifecycle event
                 * in the Panel Widget lifecycle interface.
                 * It is invoked at  point at which the parent environment has
                 * obtained a concerete DOM node at which to attach this Panel,
                 * and is ready to allow the Panel to attach itself to it.
                 * The Panel should not do anything with the provided node
                 * other than attach its own container node. This is because 
                 * in some environments, it may be that the provided node is
                 * long lived. A panel should not, for example, attach DOM listeners
                 * to it.
                 * 
                 */
                function attach(node) {
                    return q.Promise(function (resolve, reject) {
                        /* DOC: creating our attachment point
                         *  Here we save the provided node in the mount variable,
                         *  and attach our own container node to it. This pattern
                         *  allows us to attach event listeners as we wish to 
                         *  our own container, so that we have more control
                         *  over it. E.g. we can destroy and recreate it if we
                         *  want another set of event listeners and don't want
                         *  to bother with managing them all individually.
                         */
                        mount = node;
                        container = document.createElement('div');
                        mount.appendChild(container);

                        /* DOC: dom access
                         * In this case we are keeping things simple by using 
                         * the plain DOM API. We could also use jquery 
                         * here if we wish to.
                         */
                        container.innerHTML = rendered.content;

                        /* DOC: runtime interface
                         * Since a panel title is also, logically, the title of
                         * the "page" we use the runtimes event bus to emit the
                         * 'title' event to the application. The application 
                         * takes care of modifying the window panel to accomodate
                         * it.
                         */
                        R.send('app', 'title', rendered.title);

                        /* DOC: implement widget manager attach lifecycle event
                         * Okay, here we run all of the widgets through the 
                         * 
                         */
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
                    start: start,
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