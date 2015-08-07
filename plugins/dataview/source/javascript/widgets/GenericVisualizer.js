/*global
 define, require, console, document
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'q',
    'kb.client.workspace',
    'kb.html',
    'kb.runtime'
],
    function ($, q, WorkspaceClient, html, R) {
        "use strict";
        var typeMap = {
            /*
             widget doesn't work. The underlying collection object looks broken.
             The collection object itself does not seem to return 
             Does not work in production either 
             Fixed!
             It is just that some collection objects are broken.
             */
            'Communities.Collection': {
                title: 'Data View',
                module: 'kb.widget.dataview.communities.collection',
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
                module: 'kb.widget.dataview.communities.functional-matrix',
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
                module: 'kb.widget.dataview.communities.functional-profile',
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
            'Communities.Heatmap': {
                name: 'Data View',
                module: 'kb.widget.dataview.communities.abundance-data-heatmap',
                widget: 'AbundanceDataHeatmap',
                options: [
                    {from: 'workspaceId', to: 'ws'},
                    {from: 'objectId', to: 'id'}
                ]
            },
            /* NEEDS A COMPLEX LANDING PAGE */
            'Communities.Metagenome': {
                //  Plugged in MetagenomeView (required a different kbaseTabs than for Neal's modeling) 
                title: 'Data View',
                module: 'kb.widget.dataview.communities.metagenome',
                widget: 'MetagenomeView',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws'},
                    {from: 'objectId', to: 'id'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'GenomeComparison.ProteomeComparison': {
                title: 'Data View',
                module: 'kb.widget.dataview.proteome-comparison.genome-comparison',
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
                module: 'kb.widget.dataview.assembly.assembly-input',
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
                module: 'kb.widget.dataview.assembly.view',
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
                module: 'kb.widget.dataview.assembly.paired-end-library',
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
                module: 'kb.widget.dataview.assembly.file-paired-end-library',
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
                module: 'kb.widget.dataview.proteome-comparison.genome-comparison-viewer',
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
                module: 'kb.widget.dataview.contigset.contigset_view',
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
                module: 'kb.widget.dataview.genome.annotation_set_table',
                widget: 'AnnotationSetTable',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'ws'},
                    {from: 'objectId', to: 'id'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseGenomes.Pangenome': {
                title: 'Data View',
                module: 'kb.widget.dataview.genome.pangenome',
                widget: 'kbasePanGenome',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'name'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            /* COMPLEX LANDING PAGE */
            'KBaseGenomes.Genome': {
                title: 'Data View',
                module: 'kb.widget.dataview.genome',
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
                        module: 'kb.widget.dataview.genome.genepage',
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
            },
            // MODELING
            'KBasePhenotypes.PhenotypeSet': {
                title: 'Data View',
                module: 'kb.widget.dataview.modeling.tab_table',
                widget: 'kbaseTabTable',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'obj'},
                    {from: 'objectType', to: 'type'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBasePhenotypes.PhenotypeSimulationSet': {
                title: 'Data View',
                module: 'kb.widget.dataview.modeling.tab_table',
                widget: 'kbaseTabTable',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'obj'},
                    {from: 'objectType', to: 'type'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseSearch.GenomeSet': {
                title: 'Data View',
                module: 'kb.widget.dataview.modeling.tab_table',
                widget: 'kbaseTabTable',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'obj'},
                    {from: 'objectType', to: 'type'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseTrees.Tree': {
                title: 'Data View',
                module: 'kb.widget.dataview.trees.tree',
                widget: 'kbaseTree',
                panel: true,
                options: [
                    {from: 'workspaceId', to: 'workspaceID'},
                    {from: 'objectId', to: 'treeID'},
                    {from: 'objectVersion', to: 'treeObjVer'}
                ]
            },
            /*
             * The modeling widgets are all based on the "tab table" which  
             * expects the widgets to be made through an internal object
             * system. All widgets are loaded within the tab_table module, 
             * and looked up and loaded there.
             */
            'KBaseBiochem.Media': {
                title: 'Data View',
                module: 'kb.widget.dataview.modeling.tab_table',
                widget: 'kbaseTabTable',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'obj'},
                    {from: 'objectType', to: 'type'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseFBA.FBA': {
                title: 'Data View',
                module: 'kb.widget.dataview.modeling.tab_table',
                widget: 'kbaseTabTable',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'obj'},
                    {from: 'objectType', to: 'type'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseFBA.FBAModel': {
                title: 'Data View',
                module: 'kb.widget.dataview.modeling.tab_table',
                widget: 'kbaseTabTable',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'obj'},
                    {from: 'objectType', to: 'type'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseFBA.FBAModelSet': {
                title: 'Data View',
                module: 'kb.widget.dataview.modeling.tab_table',
                widget: 'kbaseTabTable',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'obj'},
                    {from: 'objectType', to: 'type'},
                    {from: 'authToken', to: 'token'}
                ]
            },
            'KBaseExpression.ExpressionSeries': {
                title: 'Data View',
                module: 'kb.widget.dataview.expression.expression_series',
                widget: 'kbaseExpressionSeries',
                panel: true,
                options: [
                    {from: 'workspaceName', to: 'ws'},
                    {from: 'objectName', to: 'name'}
                ]
            }
        };

        function findMapping(objectType, params) {
            var mapping = typeMap[objectType];
            if (mapping) {
                if (params.sub && params.subid) {
                    if (mapping.sub) {
                        if (mapping.sub.hasOwnProperty(params.sub)) {
                            mapping = mapping.sub[params.sub]; // ha, crazy line, i know.
                        } else {
                            throw new Error('Sub was specified, but config has no correct sub handler, sub:' + params.sub + "config:");
                        }
                    } else {
                        throw new Error('Sub was specified, but config has no sub handler, sub:' + params.sub);
                    }
                    //} else {
                    //    console.error('Something was in sub, but no sub.sub or sub.subid found', params.sub);
                    //    return $('<div>');
                }
            }
            return mapping;
        }

        // Returns id for the 
        function createBSPanel($node, title) {
            var id = html.genId(),
                div = html.tag('div'),
                span = html.tag('span');
            $node.html(div({class: 'panel panel-default '}, [
                div({class: 'panel-heading'}, [
                    span({class: 'panel-title'}, title)
                ]),
                div({class: 'panel-body'}, [
                    div({id: id})
                ])
            ]));
            return $('#' + id);
        }


        function genericVisualizerWidgetFactory() {
            var mount, container, $container, config;
            var workspaceClient;

            function attachWidget(params) {
                // Get the workspace object
                var $widgetContainer = $container;
                
                // Translate and normalize params.
                params.objectVersion = params.ver;
                
                // Get other params from the runtime.
                params.workspaceURL = R.getConfig('services.workspace.url');
                params.authToken = R.getAuthToken();

                return q.Promise(function (resolve) {
                    workspaceClient.getObject(params.workspaceId, params.objectId)
                        .then(function (wsobject) {
                            var objectType = wsobject.type.split(/-/)[0];
                            var mapping = findMapping(objectType, params);
                            if (!mapping) {
                                $widgetContainer.html(html.panel('Not Found', 'Sorry, cannot find widget for ' + objectType));
                                resolve();
                                return;
                            }
                            
                            // These params are from the found object.
                            params.objectName = wsobject.name;
                            params.workspaceName = wsobject.ws;
                            params.objectVersion = wsobject.version;
                            params.objectType = wsobject.type;

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
                                if ($widgetContainer[mapping.widget] === undefined) {
                                    $widgetContainer.html('Sorry, cannot find jquery widget ' + mapping.widget);
                                } else {
                                    if (mapping.panel) {
                                        $widgetContainer = createBSPanel($widgetContainer, mapping.title);
                                    }
                                    $widgetContainer[mapping.widget](widgetParams);
                                }
                                resolve();
                            });
                        })
                        .catch(function (err) {
                            console.log('ERROR');
                            console.log(err);
                        })
                        .done();
                });
            }

            function init(cfg) {
                return q.Promise(function (resolve) {
                    config = cfg;
                    workspaceClient = Object.create(WorkspaceClient).init({url: R.getConfig('services.workspace.url')});
                    resolve();
                });
            }
            function attach(node) {
                return q.Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    $container = $(container);
                    mount.appendChild(container);
                    resolve();
                });
            }
            function start(params) {
                return q.Promise(function (resolve) {
                    attachWidget(params)
                        .then(function () {
                            resolve();
                        })
                        .catch(function (err) {
                            console.error('ERROR');
                            console.error(err);
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
            function destroy() {
                return q.Promise(function (resolve) {
                    resolve();
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
            create: function () {
                return genericVisualizerWidgetFactory();
            }
        };
    });

