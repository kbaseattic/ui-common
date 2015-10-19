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
    'kb_widget_FunctionSpecification'
],
    function (Promise, R, html, WidgetCollection, FunctionSpecWidget) {
        'use strict';
        function renderFunctionPanel(params) {
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
                    renderFunctionPanel(params)
                        .then(function (rendered) {
                            container.innerHTML = rendered.content;
                            R.send('app', 'title', rendered.title);
                            // create widgets.
                            children = rendered.widgets;
                            Promise.all(children.map(function (w) {
                                console.log('creating...');
                                console.log(w);
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
                                                    resolve();
                                                })
                                                .catch(function (err) {
                                                    console.log('ERROR starting');
                                                    console.log(err);
                                                });
                                        })
                                        .catch(function (err) {
                                            console.log('ERROR attaching');
                                            console.log(err);
                                        });
                                })
                                .catch(function (err) {
                                    console.log('ERROR creating');
                                    console.log(err);
                                });
                        })
                        .catch(function (err) {
                            console.log('ERROR rendering console');
                            console.log(err);
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

        return {
            make: function (config) {
                return widget(config);
            }
        };
    });