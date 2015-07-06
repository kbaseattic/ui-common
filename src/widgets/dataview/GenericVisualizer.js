/*global
 define, console, document
 */
/*jslint
 browser: true,
 white: true
 */
define(['jquery', 'q', 'kb.client.workspace', 'kb.app', 'kb.html'],
    function ($, Q, WorkspaceClient, App, html) {
        "use strict";
        var typeMap = {
            /*
             widget doesn't work. The underlying collection object looks broken.
             The collection object itself does not seem to return 
             */
            'Communities.Collection': {
                title: 'Data View',
                module: 'kb.jquery.communities.collection',
                widget: 'CollectionView',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws'},
                    {from: 'objectId', to: 'id'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'Communities.FunctionalMatrix': {
                //AbundanceDataBoxplot - id, name, ws, auth
                // expects auth, ws passed to it.
                //AbundanceDataView - id, name, ws
                //RankAbundancePlot - id, name [0,1], top ["10"-text], order [average, max, sum], ws, auth
                //AbundanceDataTable - id, name, ws, auth
                title: 'Data View',
                module: 'kb.jquery.communities.functional-matrix',
                widget: 'AbundanceDataView',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws'},
                    {from: 'objectId', to: 'id'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            // Need some example data to test with
            // NB uses the same plugin as above, so it should just work.
            'Communities.FunctionalProfile': {
                /* Done! Narrative uses AbundanceDataView */
                title: 'Data View',
                module: 'kb.jquery.communities.functional-profile',
                widget: 'AbundanceDataView',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws'},
                    {from: 'objectId', to: 'id'},
                    {from: 'authToken', to: 'token'}
                ],
            },
            // DO later ,need to port heatmap or use another heatmap widget.
            // 'Communities.Heatmap'

            /* NEEDS A COMPLEX LANDING PAGE */
            /* NOTE: skipping the rest of communities for now due to the 
             * work to port over the modified svg plugin.
             * TODO: finish
             'Communities.Metagenome': {
             //  Plugged in MetagenomeView (required a different kbaseTabs than for Neal's modeling) 
             title: 'Data View',
             module: 'kb.jquery.communities.metagenome',
             widget: 'MetagenomeView',
             panel: true,
             options: [
             {from: 'workspaceId', to: 'ws'},
             {from: 'objectId', to: 'id'},
             {from: 'authToken', to: 'token'}
             ]
             },
             */
            'GenomeComparison.ProteomeComparison': {
                title: 'Data View',
                module: 'kb.jquery.proteome-comparison.genome-comparison',
                widget: 'GenomeComparisonWidget',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws_name'},
                    {from: 'objectId', to: 'ws_id'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseAssembly.AssemblyInput': {
                title: 'Data View',
                module: 'kb.jquery.assembly.assembly-input',
                widget: 'kbaseAssemblyInput',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'workspaceId'},
                    {from: 'objectId', to: 'objId'},
                    {from: 'objectVersion', to: 'objVer', optional: true},
                    {from: 'loadingImage', to: 'loadingImage', optional: true}
                ]
            },
            'KBaseAssembly.AssemblyReport': {
                title: 'Data View',
                module: 'kb.jquery.assembly.view',
                widget: 'kbaseAssemblyView',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws_name'},
                    {from: 'objectId', to: 'ws_id'}
                ]
            },
            /* TODO: find sample data - untested */
            'KBaseAssembly.PairedEndLibrary': {
                title: 'Data View',
                module: 'kb.jquery.assembly.paired-end-library',
                widget: 'kbasePairedEndLibrary',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'workspaceId'},
                    {from: 'objectId', to: 'objId'},
                    {from: 'objectVersion', to: 'objVer', optional: true}
                ]
            },
            'KBaseFile.PairedEndLibrary': {
                title: 'Data View',
                module: 'kb.jquery.assembly.file-paired-end-library',
                widget: 'kbaseFilePairedEndLibrary',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'workspaceId'},
                    {from: 'objectId', to: 'objId'},
                    {from: 'objectVersion', to: 'objVer', optional: true}
                ]
            },
            'KBaseGenomes.GenomeComparison': {
                title: 'Data View',
                module: 'kb.jquery.proteome-comparison.genome-comparison-viewer',
                widget: 'kbaseGenomeComparisonViewer',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws'},
                    {from: 'objectId', to: 'id'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseGenomes.ContigSet': {
                title: 'Data View',
                module: 'kb.jquery.contigset',
                widget: 'kbaseContigSetView',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws_name'},
                    {from: 'objectId', to: 'ws_id'},
                    {from: 'objectVersion', to: 'ver', optional: true},
                    {from: 'workspaceURL', to: 'ws_url'},
                    {from: 'authToken', to: 'token'},
                    {from: 'loadingImage', to: 'loadingImage', optional: true}
                ]
                    // options: '{"ws_id":???objname,"ws_name":???wsname,"ver":???ver,"loadingImage":"'+this.options.loadingImage+'"}'
            },
            'KBaseGenomes.MetagenomeAnnotation': {
                title: 'Data View',
                module: 'kb.jquery.from_narrative.annotation-set-table',
                widget: 'AnnotationSetTable',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws'},
                    {from: 'objectId', to: 'id'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            
            /* COMPLEX LANDING PAGE */
            'KBaseGenomes.Genome': {
                title: 'Data View',
                module: 'kb.jquery.genome',
                widget: 'KBaseGenomePage',
                noPanel: true,
                // Options object to build. Maps
                options: [
                    {from: 'objectId', to: 'genomeID'},
                    {from: 'workspaceId', to: 'workspaceID'},
                    {from: 'loadingImage', to: 'loadingImage', optional: true}
                ],
                // options: '{"genomeID":???objname,"workspaceID":???wsname,"loadingImage":"'+this.options.loadingImage+'"}',
                sub: {
                    Feature: {
                        module: 'kb.jquery.genome.genepage',
                        widget: 'KBaseGenePage',
                        noPanel: true,
                        options: [
                            {from: 'objectId', to: 'genomeID'},
                            {from: 'workspaceId', to: 'objectId'},
                            {from: 'loadingImage', to: 'loadingImage', optional: true}
                        ]
                            // options: '{"genomeID":???objname,"workspaceID":???wsname,"featureID":???subid,"loadingImage":"'+this.options.loadingImage+'"}'
                    }
                }
            }
        };
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
                    div = html.tag('div'),
                    span = html.tag('span');
                $(node).html(div({class: 'panel panel-default '}, [
                    div({class: 'panel-heading'}, [
                        span({class: 'panel-title'}, title)
                    ]),
                    div({class: 'panel-body'}, [
                        div({id: id})
                    ])
                ]));
                return $('#' + id);
            }

            function findMapping(objectType) {
                var mapping = typeMap[objectType];
                if (mapping) {
                    if (params.sub && params.subid) {
                        if (mapping.sub) {
                            if (mapping.sub.hasOwnProperty(params.sub)) {
                                mapping = mapping.sub[params.sub]; // ha, crazy line, i know.
                            } else {
                                console.error('Sub was specified, but config has no correct sub handler, sub:', params.sub, "config:", config);
                                return $('<div>');
                            }
                        } else {
                            console.error('Sub was specified, but config has no sub handler, sub:', params.sub);
                            return $('<div>');
                        }
                        //} else {
                        //    console.error('Something was in sub, but no sub.sub or sub.subid found', params.sub);
                        //    return $('<div>');
                    }
                }
                return mapping;
            }


            function attachWidget(node) {
                // Get the workspace object

                workspaceClient.getObject(params.workspaceId, params.objectId)
                    .then(function (wsobject) {
                        var objectType = wsobject.type.split(/-/)[0];
                        var mapping = findMapping(objectType);
                        if (!mapping) {
                            $(node).html(html.panel('Not Found', 'Sorry, cannot find widget for ' + objectType));
                            return;
                        }

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

