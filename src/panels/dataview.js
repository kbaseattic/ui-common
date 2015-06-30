/*global
    define
 */
/*jslint
    browser: true,
    white: true
*/
define(['underscore', 'jquery', 'kb.app', 'kb.statemachine', 'kb.session', 'kb.config', 'kb.widget.dataview.overview', 'kb.jquery.provenance', 'kb.widget.genericvisualizer', 'kb.widget.dataview.download', 'q', 'css!kb.panel.dataview.style'], function (_, $, App, StateMachine, Session, Config, OverviewWidget, ProvenanceWidget, GenericVisualizer, DownloadWidget, Q) {
    'use strict';
    
    function renderBSPanel(title, content) {
        var div = App.tag('div'),
            span = App.tag('span');

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
        var div = App.tag('div'),
            span = App.tag('span'),
            h4 = App.tag('h4');
        
        var panelId = App.genId(),
            headingId = App.genId(),
            collapseId = App.genId();

        return div({class: 'panel-group kb-widget', id: panelId, role: 'tablist', 'aria-multiselectable': 'true'}, [
            div({class: 'panel panel-default'}, [
                div({class: 'panel-heading', role: 'tab', id: headingId}, [
                    h4({class: 'panel-title'}, [
                        span({'data-toggle': 'collapse', 'data-parent': '#'+panelId, 'data-target': '#'+collapseId, 'aria-expanded': 'false', 'aria-controls': collapseId, class: 'collapsed', style: {cursor: 'pointer'}}, [
                            span({class: 'fa fa-sitemap fa-rotate-90', style: {'margin-left': '10px', 'margin-right': '10px'}}), 
                            title
                        ])
                    ])
                ]),
                div({class: 'panel-collapse collapse', id: collapseId, role: 'tabpanel', 'aria-labelledby': 'provHeading'}, [
                    div({class: 'panel-body'},[
                        content
                    ])
                ])
            ])
        ]);
    }

    function renderPanel(params) {
        return Q.Promise(function (resolve) {
            // View stat is a local state machine for this view.
            var viewState = Object.create(StateMachine).init();

            // Widgets
            // Widgets are an array of functions or promises which are 
            // invoked later...
            var widgets = {};
            function addWidget(name, widget) {
                var id = App.genId();
                var W = Object.create(widget);
                widgets[name] = {
                    widget: W,
                    id: id,
                    attach: function (node) {
                        W.init({
                            container: node,
                            workspaceId: params.workspaceId,
                            objectId: params.objectId,
                            objectVersion: params.ver,
                            sub: params.sub,
                            viewState: viewState
                        }).go();
                    }
                };
                return id;
            }
            
            function addFactoryWidget(name, widget, params) {
                var id = App.genId();
                var W = widget({
                    workspaceId: params.workspaceId,
                    objectId: params.objectId,
                    objectVersion: params.ver,
                    workspaceURL: Config.getItem('workspace_url'),
                    authToken: Session.getAuthToken(),
                    sub: params.sub,
                    viewState: viewState,
                    greeting: params.greeting
                });
                widgets[name] = {
                    widget: W,
                    id: id,
                    attach: function (node) {
                        W.attach(node);
                    }
                };
                return id;
            }
            
            function addJQWidget(name, widget) {
                var id = App.genId();
                widgets[name] = {
                    widget: null,
                    id: id,
                    attach: function (node) {
                        var jqueryWidget = $(node)[widget];
                        if (!jqueryWidget) {
                            $(node).html('Sorry, cannot find widget ' + widget);
                        } else {
                            $(node)[widget]({
                                wsNameOrId: params.workspaceId,
                                objNameOrId: params.objectId,
                                ws_url: Config.getItem('workspace_url'),
                                token: Session.getAuthToken()
                            });
                        }
                    }
                };
                
                return id;
            }

            // Render panel
            var div = App.tag('div');
            var panel = div({class: 'kbase-view kbase-dashboard-view container-fluid', 'data-kbase-view': 'social'}, [
                div({class: 'row'}, [
                    div({class: 'col-sm-12'}, [
                        div({id: addWidget('overview', OverviewWidget)}),
                        renderBSCollapsiblePanel('Data Provenance and Reference Network', div({id: addJQWidget('provenance', 'KBaseWSObjGraphCenteredView')})),
                        div({id: addFactoryWidget('visualizer1', GenericVisualizer, _.extend(_.clone(params), {greeting: 'Hey'}))})
                    ])                   
                ])
            ]);
            resolve({
                title: 'Dashboard for ' + Session.getUsername(),
                content: panel,
                widgets: widgets
            });
        });
    }

    function setup() {
        App.addRoute({
            id: 'dataview',
            path: ['dataview', 
                   {type: 'param', name: 'workspaceId'}, 
                   {type: 'param', name: 'objectId'}
            ],
            params: {
                subObject: {},
                subObjectId: {}
            },
            promise: function (params) {                
                return Q.promise(function (resolve) {
                    resolve(renderPanel(params));
                });
            },
            start: start,
            stop: stop
        });
        App.addRoute({
            id: 'dataview',
            path: ['dataview', 
                   {type: 'param', name: 'workspaceId'}, 
                   {type: 'param', name: 'objectId'},
                   {type: 'param', name: 'objectVersion'}
            ],
            params: {
                subObject: {},
                subObjectId: {}
            },
            promise: function (params) {                
                return Q.promise(function (resolve) {
                    resolve(renderPanel(params));
                });
            },
            start: start,
            stop: stop
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
