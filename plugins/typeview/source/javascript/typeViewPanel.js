/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'q',
    'kb.runtime',
    'kb.html',
    'kb_widgetCollection', 
    'kb_widget_dataTypeSpecification'
],
    function (q, R, html, WidgetCollection, DataTypeSpecWidget) {
        'use strict';

        function renderTypePanel(params) {
            return q.Promise(function (resolve) {

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

        function widget(config) {
            var mount, container, $container, children = [];

            function init(config) {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }
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