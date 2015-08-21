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
    'kb.runtime',
    'kb.utils.api',
    'kb_types'
],
    function ($, q, WorkspaceClient, html, R, APIUtils, Types) {
        "use strict";
       

        function findMapping(type, params) {
            // var mapping = typeMap[objectType];
            var mapping = Types.getViewer({type: type});
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

                return q.Promise(function (resolve, reject) {
                    workspaceClient.getObject(params.workspaceId, params.objectId)
                        .then(function (wsobject) {
                            var type = APIUtils.parseTypeId(wsobject.type);
                            //var objectType = wsobject.type.split(/-/)[0];
                            var mapping = findMapping(type, params);
                            if (!mapping) {
                                $widgetContainer.html(html.panel('Not Found', 'Sorry, cannot find widget for ' + type.module + '.' + type.name));
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
                            //console.log('ERROR');
                            //console.log(err);
                            reject(err);
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
            function showError(err) {
                var content;
                
                if (typeof err === 'string') {
                    content = err;
                } else if (err.message) {
                    content = err.message;
                } else if (err.error && err.error.error) {
                    content = err.error.error.message;
                } else {
                    content = 'Unknown Error';
                }
                container.innerHTML = html.bsPanel('Error', content);
            }
            function start(params) {
                return q.Promise(function (resolve, reject) {
                    attachWidget(params)
                        .then(function () {
                            resolve();
                        })
                        .catch(function (err) {
                            // if attaching the widget failed, we attach a 
                            // generic error widget:
                            // TO BE DONE
                            showError(err);
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

