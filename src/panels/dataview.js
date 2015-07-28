/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'underscore',
    'jquery',
    'q',
    'kb.html',
    'kb.statemachine',
    'kb.runtime',
    'kb.widgetconnector',
    'kb.widget.genericvisualizer',
    'kb.jquerywidgetconnector',
    
    'kb.jquery.provenance',
    'kb.widget.dataview.download',
    'css!kb.panel.dataview.style'
],
    function (_, $, q, html, StateMachine, R, widgetConnectorFactory, GenericVisualizer, jqueryWidgetConnectorFactory) {
        'use strict';

        // handle subobjects, only allowed types!!  This needs to be refactored because it can depend on the base type!!!
        var allowedSubobjectTypes = {'Feature': true};


        //if ($stateParams.sub && $stateParams.subid) {
        //    if (allowedSubobjectTypes.hasOwnProperty($stateParams.sub)) {
        //        $scope.params.sub = {sub: $stateParams.sub, subid: $stateParams.subid};
        //    }
        // }

        function renderBSPanel(title, content) {
            var div = html.tag('div'),
                span = html.tag('span');

            return div({class: 'panel panel-default '}, [
                div({class: 'panel-heading'}, [
                    span({class: 'panel-title'}, title)
                ]),
                div({class: 'panel-body'}, [
                    content
                ])
            ]);
        }

        function renderBSCollapsiblePanel(title, content) {
            var div = html.tag('div'),
                span = html.tag('span'),
                h4 = html.tag('h4');

            var panelId = html.genId(),
                headingId = html.genId(),
                collapseId = html.genId();

            return div({class: 'panel-group kb-widget', id: panelId, role: 'tablist', 'aria-multiselectable': 'true'}, [
                div({class: 'panel panel-default'}, [
                    div({class: 'panel-heading', role: 'tab', id: headingId}, [
                        h4({class: 'panel-title'}, [
                            span({'data-toggle': 'collapse', 'data-parent': '#' + panelId, 'data-target': '#' + collapseId, 'aria-expanded': 'false', 'aria-controls': collapseId, class: 'collapsed', style: {cursor: 'pointer'}}, [
                                span({class: 'fa fa-sitemap fa-rotate-90', style: {'margin-left': '10px', 'margin-right': '10px'}}),
                                title
                            ])
                        ])
                    ]),
                    div({class: 'panel-collapse collapse', id: collapseId, role: 'tabpanel', 'aria-labelledby': 'provHeading'}, [
                        div({class: 'panel-body'}, [
                            content
                        ])
                    ])
                ])
            ]);
        }

        function renderPanel(params) {
            return q.Promise(function (resolve) {
                // View stat is a local state machine for this view.
                var viewState = Object.create(StateMachine).init();

                // Widgets
                var widgets = [];
                
                // These are "classic Erik" widgets, for which the widgetConnector
                // calls them according to the new widget api.
                function addWidget(config) {
                    var id = html.genId();
                    widgets.push({
                        id: id,
                        config: config,
                        widget: widgetConnectorFactory.create()
                    });
                    return id;
                }

                // These are new (only one maybe) widgets based on the factory
                // pattern which do implement the new widget pattern.
                function addFactoryWidget(name, widget) {
                    var id = html.genId();
                    widgets.push({
                        name: name,
                        widget: widget.create(),
                        id: id
                    });
                    return id;
                }

                function addJQWidget(config) {
                    var id = html.genId();
                    widgets.push({
                        config: config,
                        widget: jqueryWidgetConnectorFactory.create(),
                        id: id
                    });

                    return id;
                }

                // Render panel
                var div = html.tag('div');
                var panel = div({class: 'kbase-view kbase-dataview-view container-fluid', 'data-kbase-view': 'dataview'}, [
                    div({class: 'row'}, [
                        div({class: 'col-sm-12'}, [
                            div({id: addWidget({
                                    name: 'overview',
                                    module: 'kb.widget.dataview.overview'
                                })}),
                            renderBSCollapsiblePanel('Data Provenance and Reference Network', div({id: addJQWidget({
                                    name: 'provenance',
                                    module: 'kb.jquery.provenance',
                                    jqueryobject: 'KBaseWSObjGraphCenteredView'
                                })})),
                            div({id: addFactoryWidget('visualizer1', GenericVisualizer)})
                        ])
                    ])
                ]);
                resolve({
                    title: 'Dataview',
                    content: panel,
                    widgets: widgets
                });
            });
        }

        function dataViewWidgetFactory() {
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
                        renderPanel(params)
                            .then(function (rendered) {
                                container.innerHTML = rendered.content;
                                R.send('app', 'title', rendered.title);
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
            ;

            return {
                create: function (config) {
                    return widget(config);
                }
            };
        }

        function setup(app) {
            app.addRoute({
                id: 'dataview',
                path: ['dataview',
                    {type: 'param', name: 'workspaceId'},
                    {type: 'param', name: 'objectId'}
                ],
                params: {
                    sub: {},
                    subid: {}
                },
                widget: dataViewWidgetFactory()
            });
            app.addRoute({
                id: 'dataview',
                path: ['dataview',
                    {type: 'param', name: 'workspaceId'},
                    {type: 'param', name: 'objectId'},
                    {type: 'param', name: 'objectVersion'}
                ],
                params: {
                    sub: {},
                    subid: {}
                },
                widget: dataViewWidgetFactory()
            });
        }
        function teardown() {
            // TODO: remove routes
            return false;
        }

        function start() {
        }
        function stop() {
        }
        return {
            setup: setup,
            teardown: teardown,
            start: start,
            stop: stop
        };
    });
