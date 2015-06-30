/*global
    define, console, document
 */
/*jslint
    browser: true,
    white: true
*/
define(['jquery', 'q', 'kb.client.workspace', 'kb.app'],
    function ($, Q, WorkspaceClient, App) {
        "use strict";
        
        var typeMap = {
            'KBaseGenomes.ContigSet': {
                title: 'Data View',
                module: 'kb.visualizer.contigset',
                widget: 'kbaseContigSetView',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws_name'},
                    {from: 'objectId', to: 'ws_id'},
                    {from: 'workspaceURL', to: 'ws_url'},
                    {from: 'authToken', to: 'token'},
                    {from: 'objectVersion', to: 'ver', optional: true},
                    {from: 'loadingImage', to: 'loadingImage', optional: true}
                ]
                // options: '{"ws_id":???objname,"ws_name":???wsname,"ver":???ver,"loadingImage":"'+this.options.loadingImage+'"}'
            },
            /* COMPLEX LANDING PAGE */
            'KBaseGenomes.Genome': {
                module: 'kb.visualizer.genome',
                widget: 'KBaseGenomePage',
                noPanel: true,
                // Options object to build. Maps
                options: [
                    {from: 'objectId', to: 'genomeID'},
                    {from: 'workspaceId', to: 'workspaceID'},
                    {from: 'loadingImage', to: 'loadingImage'}                          
                ],
                // options: '{"genomeID":???objname,"workspaceID":???wsname,"loadingImage":"'+this.options.loadingImage+'"}',
                sub:{
                    Feature: {
                        module: 'kb.visualizer.genepage',
                        widget: 'KBaseGenePage',
                        noPanel: true,
                        options: [
                            {from: 'objectId', to: 'genomeID'},
                            {from: 'workspaceId', to: 'objectId'},
                            {from: 'loadingImage', to: 'loadingImage'}
                        ]
                        // options: '{"genomeID":???objname,"workspaceID":???wsname,"featureID":???subid,"loadingImage":"'+this.options.loadingImage+'"}'
                    }
                }
            }
        }
        
        // This style returns a factory function.
        // The only usage of 'this' is to return it as a convenience for 
        // method chaining.
        return function (params) {
            // This should give us an unfakable "this".
            var greeting = params.greeting;
            
            var containerNode = null;
            
            var workspaceClient = Object.create(WorkspaceClient).init({url: params.ws_url});
            
            function render() {
                var node = $(document.createElement('div'));
                attachWidget(node);
                $(containerNode).append(node);
            }
            
            // Returns id for the 
            function createBSPanel(node, title) {
                var id = App.genId(),
                    div = App.tag('div'),
                    span = App.tag('span');

                $(node).html(div({class: 'panel panel-default '}, [
                    div({class: 'panel-heading'}, [
                        span({class: 'panel-title'}, title)
                    ]),
                    div({class: 'panel-body'}, [
                        div({id: id})
                    ])
                ]));
                return $('#'+id);
            }
            
            
            function attachWidget(node) {
                // Get the workspace object
                
                workspaceClient.getObject(params.workspaceId,  params.objectId)
                    .then(function (wsobject) {
                        var objectType = wsobject.type.split(/-/)[0];
                    
                        // console.log(objectType);
                        
                        var mapping = typeMap[objectType];
                        if (!mapping) {
                            $(node).html('Sorry, cannot find widget for ' + objectType);
                            return;
                        }
                        // $(node).html('Found the widget for ' + objectType +'. It has module ' + mapping.module);
                        
                        // Create params.
                        var widgetParams = {};
                        mapping.options.forEach(function (item) {
                            var from = params[item.from];
                            if (!from && item.optional !== true) {
                                // console.log(params);
                                throw 'Missing param, from ' + item.from + ', to ' + item.to;
                            }
                            widgetParams[item.to] = from;
                        });
                        
                        require(['jquery', mapping.module], function ($, Widget) {
                            // jquery chicanery
                            var jqueryWidget = $(node)[mapping.widget];
                            if (!jqueryWidget) {
                                $(node).html('Sorry, cannot find jquery widget ' + mapping.widget);
                            } else {
                                if (mapping.panel) {
                                    node = createBSPanel(node, mapping.title);
                                }
                                $(node)[mapping.widget](widgetParams);
                            }
                        });
                        
                        //console.log('Got workspace object');
                        //console.log(wsobject);
                    })
                    .catch(function (err) {
                        console.log('ERROR');
                        console.log(err);
                    })
                    .done();
                
                // Create the type symbol from the object.
            }
            
            function attach(node) {
                containerNode = node;
                render();
            }
            

            // 
            var self = {
                attach: attach,
                attachWidget: attachWidget
            };
            return self;
        };

    });

