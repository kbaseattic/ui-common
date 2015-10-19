/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'bluebird',
    'kb.runtime',
    'kb.html',
    'kb_widgetCollection', 
    'kb_widget_moduleSpecification'
],
    function (Promise, R, html, WidgetCollection, ModuleSpecWidget) {
        'use strict';
        function renderModulePanel(params) {
            return new Promise(function (resolve) {

                // Widgets
                // Widgets are an array of functions or promises which are 
                // invoked later...
                var widgets = WidgetCollection.make();

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

        function widget(config) {
            var mount, container, $container, children = [];
            function init(config) {
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function attach(node) {
                return new Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    $container = $(container);
                    resolve();
                });
            }
            function start(params) {
                return new Promise(function (resolve, reject) {
                    renderModulePanel(params)
                        .then(function (rendered) {
                            container.innerHTML = rendered.content;
                            R.send('app', 'title', 'Loading: ' + rendered.title);
                            // create widgets.
                            children = rendered.widgets;
                            Promise.all(children.map(function (w) {
                                return w.widget.create(w.config);
                            }))
                                .then(function () {
                                    Promise.all(children.map(function (w) {
                                        return w.widget.attach($('#' + w.id).get(0));
                                    }))
                                        .then(function (results) {
                                            Promise.all(children.map(function (w) {
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
                                                });
                                        })
                                        .catch(function (err) {
                                            R.logError({
                                                message: 'Attaching widget',
                                                exception: err
                                            });
                                            reject(err);
                                        });
                                })
                                .catch(function (err) {
                                    R.logError({
                                        message: 'Creating widget',
                                        exception: err
                                    });
                                    reject(err);
                                });
                        })
                        .catch(function (err) {
                            R.logError({
                                message: 'ERROR rendering module view',
                                exception: err
                            });
                            reject(err);
                        });
                });
            }
            function stop() {
                return new Promise(function (resolve) {
                    resolve();

                });
            }
            function detach() {
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
        ;

        return {
            make: function (config) {
                return widget(config);
            }
        };
    });