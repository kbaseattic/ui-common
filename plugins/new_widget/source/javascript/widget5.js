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
    'q',
    'kb.html',
    'kb.runtime',
    'kb.utils.api',
    'kb.service.workspace'
],
    function (q, html, runtime, utils, Workspace) {
        'use strict';

        var widget = function (config) {
            var mount, container,
                p = html.tag('p'),
                br = html.tag('br');

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
                return q.Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    resolve();
                });
            }

            function getContentTabs(params) {
                var improvements = [
                    'fetch an object from the workspace',
                    'display attributes of the object in a table'
                ];
                return [
                    {
                        id: 'info',
                        label: 'Info',
                        content: [
                            p('Hi, I am the fourth sample widget'),
                            p(['My improvements include:',
                                html.makeList({items: improvements})
                            ])
                        ]
                    },
                    {
                        id: 'params',
                        label: 'Params',
                        content: p(['My params are: ', br(), dumpObject(params)])
                    },
                    {
                        id: 'config',
                        label: 'Config',
                        content: p(['And config is: ', br(), dumpObject(config)])
                    }
                ]
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
                return q.Promise(function (resolve) {
                    var workspace = new Workspace(runtime.getConfig('services.workspace.url'), {
                        token: runtime.getAuthToken()
                    });

                    // See ObjectIdentity
                    var objectIdentity = {
                        workspace: params.workspaceName,
                        name: params.objectName,
                        ver: params.objectVersion
                    };
                    q(workspace.get_object_info_new({
                        objects: [objectIdentity],
                        includeMetadata: 1,
                        ignoreErrors: 0
                    }))
                        .then(function (objectInfoList) {
                            var tabs = getContentTabs(params);
                            var items = objectInfoList.map(function (infoItem) {
                                var info = utils.object_info_to_object(infoItem);
                                return dumpObject(info);
                            });
                            tabs.unshift({
                                id: 'main',
                                label: 'Main',
                                content: items
                            });
                            var content = html.makePanel({
                                title: 'My Widget',
                                content: html.makeTabs({
                                    tabs: tabs
                                })
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
