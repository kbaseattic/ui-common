define([
    'jquery',
    'bluebird',
    'kb.runtime',
    'kb_widgetBases_baseWidget',
    'kb.html',
    'kb.dom',
    'kb.utils',
    'kb.utils.api',
    'kb.service.workspace',
    'kb.narrative'
],
    function ($, Promise, R, BaseWidget, html, DOM, Utils, APIUtils, Workspace, Narrative) {
        'use strict';
        function getData() {
            return new Promise(function (resolve, reject) {
                var workspaceClient = new Workspace(R.getConfig('workspace_url'), {
                    token: R.getAuthToken()
                }),
                    workspaceDb = {};
                Promise.resolve(workspaceClient.list_workspace_info({
                    showDeleted: 0,
                    excludeGlobal: 1,
                    owners: [R.getUsername()]
                }))
                    .then(function (data) {
                        var workspaceList = [],
                            wsInfo;
                        data.forEach(function (wsInfoRaw) {
                            wsInfo = APIUtils.workspace_metadata_to_object(wsInfoRaw);
                            if (Narrative.isValid(wsInfo)) {
                                workspaceList.push(wsInfo.id);
                                workspaceDb[wsInfo.id] = wsInfo;
                            }
                        });
                        return new Promise.resolve(workspaceClient.list_objects({
                            ids: workspaceList,
                            includeMetadata: 1
                        }));
                    })
                    .then(function (data) {
                        resolve(data.map(function (info) {
                            var wsObjectInfo = APIUtils.object_info_to_object(info);
                            return {
                                info: wsObjectInfo,
                                narrative: {
                                    workspaceId: wsObjectInfo.wsid,
                                    name: workspaceDb[wsObjectInfo.wsid].metadata.narrative_nice_name
                                }
                            };
                        }));
                    })
                    .catch(function (err) {
                        reject(err);
                    })
                    .done();
            });
        }
        function render(data) {
            var a = html.tag('a'),
                tableId = html.genId(),
                columns = ['Object Name', 'Type', 'Version', 'Narrative', 'Version', 'Last Modified'],
                rows = data.map(function (object) {
                    return [
                        a({href: '#dataview/' + object.info.wsid + '/' + object.info.id}, object.info.name),
                        object.info.typeName,
                        object.info.typeMajorVersion + '.' + object.info.typeMinorVersion,
                        a({href: '/narrative/' + object.narrative.workspaceId + '/' + object.info.id}, object.narrative.name),
                        object.info.version,
                        Utils.niceElapsedTime(object.info.save_date)
                    ];
                });

            return {
                content: html.makeTable({columns: columns, rows:rows, classes: ['table', 'table-striped'], id: tableId}),
                afterAttach: function () {
                    $('#' + tableId).dataTable();
                }
            };
        }
        return Object.create(BaseWidget, {
            onAttach: {
                value: function (container) {
                    container.innerHTML = html.loading();
                }
            },
            onStart: {
                value: function () {
                    return new Promise(function (resolve, reject) {
                        getData()
                            .then(function (data) {
                                var rendered = render(data);
                                // this.setContent(rendered.content);
                                this.container.innerHTML = rendered.content;
                                DOM.setHTML(this.container, rendered.content);
                                if (rendered.afterAttach) {
                                    rendered.afterAttach();
                                }
                                resolve();
                            }.bind(this))
                            .catch(function (err) {
                                reject(err);
                            })
                            .done();
                    }.bind(this));
                }
            }
        });
    });