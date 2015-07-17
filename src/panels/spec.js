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
    'kb.widget.error',
    'kb.jquery.card-layout-manager'
], function ($, html, R, Q, DataTypeSpecWidget, ModuleSpecWidget, ErrorWidget) {
    'use strict';

    var Widgets = function () {
        var widgets = {};
        
        function addFactoryWidget(name, widget, params) {
            // Create a container node. We need to be able to render
            // default content in case the widget can't render for 
            // some reason.
            // Note that we are just creating a procedure for attaching
            // the widget -- the dom may not be ready yet.
            var id = html.genId(),
                W, w;
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
        function getWidgets() {
            return widgets;
        }
        return {
            addFactoryWidget: addFactoryWidget,
            getWidgets: getWidgets
        }
    }


    function renderTypePanel(params) {
        return Q.Promise(function (resolve) {

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
                        div({id: widgets.addFactoryWidget('datatypespec', DataTypeSpecWidget, {
                                datatype: params.datatype
                            })})
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

    function renderModulePanel(params) {
        return Q.Promise(function (resolve) {

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
                        div({id: widgets.addFactoryWidget('datatypespec', ModuleSpecWidget, {
                            moduleid: params.moduleid
                            })})
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
    
    function setup(app) {
        app.addRoute({
            path: ['spec', 'type', {type: 'param', name: 'datatype'}],
            render: null,
            data: null,
            promise: function (params) {
                return renderTypePanel(params);
            },
            start: function (node, self) {
                return true;
            },
            stop: function (node, self) {
                return true;
            }

        });
        app.addRoute({
            path: ['spec', 'module', {type: 'param', name: 'moduleid'}],
            render: null,
            data: null,
            promise: function (params) {
                return renderModulePanel(params);
            },
            start: function (node, self) {
                return true;
            },
            stop: function (node, self) {
                return true;
            }

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
