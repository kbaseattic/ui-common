/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
/**
 * A slightly fancier widget factory
 * This widget adds the config and params arguments, 
 * and the html module.
 */
define([
    'bluebird',
    'kb.html',
    'kb.runtime',
    'kb.utils.api',
    'kb.service.workspace'
],
    function (Promise, html, runtime, utils, Workspace) {
        'use strict';

        var widget = function (config) {
            var mount, container,
                div = html.tag('div'),
                p = html.tag('p'),
                br = html.tag('br'),
                h3 = html.tag('h3');

            function dumpObject(obj) {
                if (obj) {
                    var cols = ['Key', 'Value'],
                        rows = Object.keys(obj).map(function (key) {
                        return [key, obj[key]];
                    });
                    return html.makeTable({
                        columns: cols,
                        rows: rows,
                        classes: ['table', 'table-striped', 'table-bordered']
                    });
                }
                return 'nothing';
            }

            // API

            function attach(node) {
                return new Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    resolve();
                });
            }

            function renderContent(params) {
                var improvements = [
                    'fetch an object from the workspace',
                    'display attributes of the object in a table'
                ];
                return [
                    p('Hi, I am the fourth sample widget'),
                    p(['My improvements include:',
                        html.makeList({items: improvements})
                    ]),
                    h3('Params'),
                    p(['My params are: ', br(), dumpObject(params)]),
                    h3('Config'),
                    p(['And config is: ', br(), dumpObject(config)])
                ];
            }

            function renderError(err) {
                var message;
                if (typeof err === 'string') {
                    message = err;
                } else if (err.message) {
                    message = err.message;
                } else if (err.error) {
                    message = 'working on it...';
                    console.log(err);
                } else {
                    message = 'Unknown error';
                }
                return html.makePanel({
                    title: 'Error',
                    content: message
                });
            }

            function start(params) {
                return new Promise(function (resolve) {
                    var workspace = new Workspace(runtime.getConfig('services.workspace.url'), {
                        token: runtime.getAuthToken()
                    });

                    // See ObjectIdentity
                    var objectIdentity = {
                        workspace: params.workspaceName,
                        name: params.objectName,
                        ver: params.objectVersion
                    };
                    Promise.resolve(workspace.get_object_info_new({
                        objects: [objectIdentity],
                        includeMetadata: 1,
                        ignoreErrors: 0
                    }))
                        .then(function (objectInfoList) {
                            var items = objectInfoList.map(function (infoItem) {
                                var info = utils.object_info_to_object(infoItem);
                                return dumpObject(info);
                            });
                            var content = html.makePanel({
                                title: 'My Panel',
                                content: div([
                                    renderContent(params),
                                    h3('Object Info'),
                                    items
                                ])
                            });
                            container.innerHTML = content;
                            resolve();
                        })
                        .catch(function (err) {
                            container.innerHTML = renderError(err)
                        })
                        .done();
                });
            }

            return {
                attach: attach,
                start: start
            };
        };

        return {
            make: function (config) {
                return widget(config);
            }
        };
    });
