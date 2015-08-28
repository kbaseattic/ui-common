
/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */

define([
    'jquery',
    'bluebird',
    'kb.runtime',
    'kb.dom',
    'kb.html',
    'kb.service.workspace',
    'kb.utils.api',
    'kb.utils',
    'kb.narrative',
    'datatables_bootstrap'
],
    function ($, Promise, R, DOM, html, WorkspaceClient, APIUtils, Utils, Narrative) {
        'use strict';

        var widget = function (config) {
            var mount, container;

            var workspaceClient = new WorkspaceClient(R.getConfig('services.workspace.url'), {
                token: R.getAuthToken()
            });

            var workspaceObjects;

            function render(data) {
                var a = html.tag('a'),
                    tableId = html.genId(),
                    columns = ['Object Name', 'Type', 'Version', 'Narrative', 'Version', 'Last Modified'],
                    rows = data.map(function (object) {
                        return [
                            a({href: '/functional-site/#dataview/' + object.info.wsid + '/' + object.info.id}, object.info.name),
                            object.info.typeName,
                            object.info.typeMajorVersion + '.' + object.info.typeMinorVersion,
                            a({href: '/narrative/' + object.narrative.workspaceId + '/' + object.info.id}, object.narrative.name),
                            object.info.version,
                            Utils.niceElapsedTime(object.info.save_date)
                        ]
                    });

                return {
                    content: html.makeTable({columns: columns, rows: rows, class: 'table table-striped', id: tableId}),
                    afterAttach: function () {
                        $('#' + tableId).dataTable();
                    }
                }
            }


            function getData() {
                return new Promise(function (resolve, reject) {
                    Promise.resolve(workspaceClient.list_workspace_info({
                        showDeleted: 0,
                        excludeGlobal: 1,
                        owners: [R.getUsername()]
                    }))
                        .then(function (data) {
                            var workspaceList = [],
                                workspaceDb = {}, i, wsInfo;
                            for (i = 0; i < data.length; i += 1) {
                                wsInfo = APIUtils.workspace_metadata_to_object(data[i]);

                                if (Narrative.isValid(wsInfo)) {
                                    workspaceList.push(wsInfo.id);
                                    workspaceDb[wsInfo.id] = wsInfo;
                                }
                            }

                            // We should now have the list of recently active narratives.
                            // Now we sort and limit the list.
                            // Now get the workspace details.
                            Promise.resolve(workspaceClient.list_objects({
                                ids: workspaceList,
                                includeMetadata: 1
                            }))
                                .then(function (data) {
                                    workspaceObjects = data.map(function (info) {
                                        var wsObjectInfo = APIUtils.object_info_to_object(info);
                                        return {
                                            info: wsObjectInfo,
                                            narrative: {
                                                workspaceId: wsObjectInfo.wsid,
                                                name: workspaceDb[wsObjectInfo.wsid].metadata.narrative_nice_name
                                            }
                                        };
                                    });
                                    resolve(workspaceObjects);
                                })
                                .catch(function (err) {
                                    console.log('ERROR');
                                    console.log(err);
                                    reject(err);
                                })
                                .done();
                        })
                        .catch(function (err) {
                            console.log('ERROR');
                            console.log(err);
                            reject(err);
                        })
                        .done();
                });
            }

            function init(config) {
                return new Promise(function (resolve) {
                    resolve();
                });
            }

            function attach(node) {
                return new Promise(function (resolve) {
                    mount = node;

                    container = DOM.createElement('div');
                    DOM.append(mount, container);
                    DOM.setHTML(container, html.loading());

                    resolve();
                });
            }

            function start(params) {
                return new Promise(function (resolve, reject) {

                    /* DOC: rendering
                     * Here we have a simple rendering implementation!
                     */
                    // DOM.setHTML(container, 'Hi, I am a very simple minded widget.');

                    getData()
                        .then(function (data) {
                            var rendered = render(data);
                            DOM.setHTML(container, rendered.content);
                            if (rendered.afterAttach) {
                                rendered.afterAttach();
                            }
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();


                    resolve();
                });
            }

            function run(params) {
                return new Promise(function (resolve) {
                    DOM.setHTML(container, 'Hi, it is now ' + (new Date()));
                    resolve();
                });
            }

            function stop() {
                return new Promise(function (resolve) {
                    resolve();
                });
            }

            function detach() {
                return new Promise(function (resolve) {
                    DOM.remove(mount, container);
                    resolve();
                });
            }

            function destroy() {
                return new Promise(function (resolve) {
                    resolve();
                });
            }

            return {
                init: init,
                attach: attach,
                start: start,
                run: run,
                stop: stop,
                detach: detach,
                destroy: destroy
            };
        };

        return {
            make: function (config) {
                return widget(config);
            }
        };
    }
);