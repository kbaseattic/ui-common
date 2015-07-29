/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'kb.html',
    'kb.runtime',
    'q',
    'kb.widget.spec.data-type-specification',
    'kb.widget.spec.module-specification',
    'kb.widget.spec.function-specification',
    'kb.widget.error',
    'kb.jquery.card-layout-manager'
], function ($, html, R, q, DataTypeSpecWidget, ModuleSpecWidget, FunctionSpecWidget, ErrorWidget) {
    'use strict';

    var Widgets = function () {
        var widgets = [];
        
        function addFactoryWidget(name, widget) {
            var id = html.genId();
            widgets.push({
                name: name,
                widget: widget.create(),
                id: id
            });
            return id;
        }
        
        /*function addFactoryWidget(name, widget, params) {
            // Create a container node. We need to be able to render
            // default content in case the widget can't render for 
            // some reason.
            // Note that we are just creating a procedure for attaching
            // the widget -- the dom may not be ready yet.
            var id = html.genId(),
                W;
            try {
                W = widget.create(params);
            } catch (e) {
                W = ErrorWidget.create({
                    exception: e,
                    from: 'addFactoryWidget'
                });
            }
            // Wrap each widget in a widget connector, if need be. 
            // We do this so we can use different types of widgets.
            // The raw widget can be attached here if it complies
            // with the widget spec.
            widgets[name] = {
                widget: W,
                id: id,
                attach: W.attach,
                detach: W.detach,
                start: W.start,
                stop: W.stop
            };

            return id;
        }
        */
        function getWidgets() {
            return widgets;
        }
        return {
            addFactoryWidget: addFactoryWidget,
            getWidgets: getWidgets
        };
    };


    function renderTypePanel(params) {
        return q.Promise(function (resolve) {

            // Widgets
            // Widgets are an array of functions or promises which are 
            // invoked later...
            var widgets = Widgets();

            // Render panel
            var div = html.tag('div');
            var panel = div({class: 'kbase-view kbase-spec-view container-fluid', 'data-kbase-view': 'spec'}, [
                div({class: 'row'}, [
                    div({class: 'col-sm-12'}, [
                        //div({id: addJQWidget('cardlayoutmanager', 'KBaseCardLayoutManager')}),
                        div({id: widgets.addFactoryWidget('datatypespec', DataTypeSpecWidget)})
                    ])
                ])
            ]);
            resolve({
                title: 'Data Type Specification',
                content: panel,
                widgets: widgets.getWidgets()
            });
        });
    }
    
    function typeViewPanelFactory() {
        function widget(config) {
            var mount, container, $container, children = [];

            function attach(node) {
                return q.Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    $container = $(container);
                    resolve();
                });
            }
            function start(params) {
                return q.Promise(function (resolve, reject) {
                    renderTypePanel(params)
                        .then(function (rendered) {
                            container.innerHTML = rendered.content;
                            R.send('app', 'title', rendered.title);
                            // create widgets.
                            children = rendered.widgets;
                            q.all(children.map(function (w) {
                                        console.log('creating...');
                                        console.log(w);
                                return w.widget.create(w.config);
                            }))
                                .then(function () {
                                    q.all(children.map(function (w) {
                                        return w.widget.attach($('#' + w.id).get(0));
                                    }))
                                        .then(function (results) {
                                            q.all(children.map(function (w) {
                                                return w.widget.start(params);
                                            }))
                                                .then(function (results) {
                                                    resolve();
                                                })
                                                .catch(function (err) {
                                                    console.log('ERROR starting');
                                                    console.log(err);
                                                })
                                                .done();
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
            function stop() {
                return q.Promise(function (resolve) {
                    resolve();

                });
            }
            function detach() {
                return q.Promise(function (resolve) {
                    resolve();
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
    
    function renderFunctionPanel(params) {
        return q.Promise(function (resolve) {

            // Widgets
            // Widgets are an array of functions or promises which are 
            // invoked later...
            var widgets = Widgets();

            // Render panel
            var div = html.tag('div');
            var panel = div({class: 'kbase-view kbase-spec-view container-fluid', 'data-kbase-view': 'spec'}, [
                div({class: 'row'}, [
                    div({class: 'col-sm-12'}, [
                        //div({id: addJQWidget('cardlayoutmanager', 'KBaseCardLayoutManager')}),
                        div({id: widgets.addFactoryWidget('functiontspec', FunctionSpecWidget)})
                    ])
                ])
            ]);
            resolve({
                title: 'Data Type Specification',
                content: panel,
                widgets: widgets.getWidgets()
            });
        });
    }
    function functionViewPanelFactory() {
        function widget(config) {
            var mount, container, $container, children = [];

            function attach(node) {
                return q.Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    $container = $(container);
                    resolve();
                });
            }
            function start(params) {
                return q.Promise(function (resolve, reject) {
                    renderFunctionPanel(params)
                        .then(function (rendered) {
                            container.innerHTML = rendered.content;
                            R.send('app', 'title', rendered.title);
                            // create widgets.
                            children = rendered.widgets;
                            q.all(children.map(function (w) {
                                        console.log('creating...');
                                        console.log(w);
                                return w.widget.create(w.config);
                            }))
                                .then(function () {
                                    q.all(children.map(function (w) {
                                        return w.widget.attach($('#' + w.id).get(0));
                                    }))
                                        .then(function (results) {
                                            q.all(children.map(function (w) {
                                                return w.widget.start(params);
                                            }))
                                                .then(function (results) {
                                                    resolve();
                                                })
                                                .catch(function (err) {
                                                    console.log('ERROR starting');
                                                    console.log(err);
                                                })
                                                .done();
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
            function stop() {
                return q.Promise(function (resolve) {
                    resolve();

                });
            }
            function detach() {
                return q.Promise(function (resolve) {
                    resolve();
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

    function renderModulePanel(params) {
        return q.Promise(function (resolve) {

            // Widgets
            // Widgets are an array of functions or promises which are 
            // invoked later...
            var widgets = Widgets();

            // Render panel
            var div = html.tag('div');
            var panel = div({class: 'kbase-view kbase-spec-view container-fluid', 'data-kbase-view': 'spec'}, [
                div({class: 'row'}, [
                    div({class: 'col-sm-12'}, [
                        //div({id: addJQWidget('cardlayoutmanager', 'KBaseCardLayoutManager')}),
                        //div({id: widgets.addFactoryWidget('datatypespec', ModuleSpecWidget, {
                        //    moduleid: params.moduleid
                        //    })})
                        div({id: widgets.addFactoryWidget('datatypespec', ModuleSpecWidget)})
                    ])
                ])
            ]);
            resolve({
                title: 'Data Type Specification',
                content: panel,
                widgets: widgets.getWidgets()
            });
        });
    }
    
    function moduleViewPanelFactory() {
        function widget(config) {
            var mount, container, $container, children = [];

            function attach(node) {
                return q.Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    $container = $(container);
                    resolve();
                });
            }
            function start(params) {
                return q.Promise(function (resolve, reject) {
                    renderModulePanel(params)
                        .then(function (rendered) {
                            container.innerHTML = rendered.content;
                            R.send('app', 'title', 'Loading: ' + rendered.title);
                            // create widgets.
                            children = rendered.widgets;
                            q.all(children.map(function (w) {                                
                                return w.widget.create(w.config);
                            }))
                                .then(function () {
                                    q.all(children.map(function (w) {
                                        return w.widget.attach($('#' + w.id).get(0));
                                    }))
                                        .then(function (results) {
                                            q.all(children.map(function (w) {
                                                return w.widget.start(params);
                                            }))
                                                .then(function (results) {
                                                    R.send('app', 'title', rendered.title);
                                                    resolve();
                                                })
                                                .catch(function (err) {
                                                    R.logError({
                                                        message: 'Starting widget',
                                                        exception: err
                                                    });
                                                    reject(err);
                                                })
                                                .done();
                                        })
                                        .catch(function (err) {
                                            R.logError({
                                                message: 'Attaching widget',
                                                exception: err
                                            });
                                            reject(err);
                                        })
                                        .done();
                                })
                                .catch(function (err) {
                                    R.logError({
                                        message: 'Creating widget',
                                        exception: err
                                    });
                                    reject(err);
                                })
                                .done();
                        })
                        .catch(function (err) {
                            R.logError({
                                message: 'ERROR rendering module view',
                                exception: err
                            });
                            reject(err);
                        })
                        .done();
                });
            }
            function stop() {
                return q.Promise(function (resolve) {
                    resolve();

                });
            }
            function detach() {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }

            return {
                attach: attach,
                start: start,
                stop: stop,
                detach: detach
            };
        }
        ;

        return {
            create: function (config) {
                return widget(config);
            }
        };
    }
    
    function setup(app) {
        app.addRoute({
            path: ['spec', 'type', {type: 'param', name: 'datatype'}],
            widget: typeViewPanelFactory()
        });
         
        app.addRoute({
            path: ['spec', 'module', {type: 'param', name: 'moduleid'}],
            widget: moduleViewPanelFactory()
        });
        
        app.addRoute({
            path: ['spec', 'functions', {type: 'param', name: 'functionid'}],
            widget: functionViewPanelFactory()
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
