/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'bluebird',
    'kb.runtime',
    'kb.html',
    'kb.service.workspace',
    'kb_types',
    'datatables_bootstrap'
], function ($, Promise, R, html, Workspace, Types) {
    'use strict';

    function widget() {
        var mount, container, $container;

        var tableId;

        function renderer() {
            return new Promise(function (resolve, reject) {
                var workspace = new Workspace(R.getConfig('services.workspace.url'), {
                    token: R.getAuthToken()
                });
                var a = html.tag('a');
                Promise.resolve(workspace.list_all_types({
                    with_empty_modules: 1
                }))
                    .then(function (data) {
                        // Flatt out the types.
                        // var rows = [];
                        var typeRecords = {};
                        var getinfo = [];
                        Object.keys(data).forEach(function (moduleName) {
                            // list_all_types above returns a map of module.typeName to the latest version.
                            var types = data[moduleName];
                            Object.keys(types).forEach(function (typeName) {
                                var type = Types.makeType({
                                    module: moduleName,
                                    name: typeName,
                                    version: types[typeName] 
                                }),
                                typeId = Types.makeTypeId(type);
                                //rows.push([
                                //    moduleName, typeName, a({href: '#spec/type/' + typeId}, types[typeName])
                                //]);
                                // Each type is put into a map simply to create a set.
                                typeRecords[typeId] = {
                                    type: type
                                };
                                getinfo.push(Promise.resolve(workspace.get_type_info(typeId)));
                            });
                        });

                        Promise.all(getinfo)
                            .then(function (results) {
                                results.forEach(function (result) {
                                    // console.log(result);
                                    var typeId = result.type_def;
                                    typeRecords[typeId].info = result;
                                });
                                tableId = html.genId();
                                var rows = Object.keys(typeRecords).map(function (typeId) {
                                    var typeRecord = typeRecords[typeId];
                                    return [
                                        typeRecord.type.module, typeRecord.type.name,
                                        Types.getIcon({
                                            type: typeRecord.type,
                                            size: 'medium'
                                        }).html,
                                        a({href: '#spec/type/' + typeId}, Types.makeVersion(typeRecord.type)),
                                        typeRecord.info.using_type_defs.map(function (typeId) {
                                            return a({href: '#spec/type/' + typeId}, typeId);
                                        }).join('<br>'),
                                        typeRecord.info.used_type_defs.map(function (typeId) {
                                            return a({href: '#spec/type/' + typeId}, typeId);
                                        }).join('<br>'),
                                        typeRecord.info.using_func_defs.map(function (functionId) {
                                            return a({href: '#spec/functions/' + functionId}, functionId);
                                        }).join('<br>')

                                    ];
                                }),
                                    cols = ['Module', 'Type', 'Icon', 'Version', 'Using types', 'Used by types', 'Used by functions'],
                                    result = html.makeTable({columns: cols, rows: rows, id: tableId, class: 'table table-striped'});
                                resolve({
                                    title: 'Type Browser',
                                    content: result,
                                    children: []
                                });
                            })
                            .catch(function (err) {
                                console.log('ERROR getting type info');
                                console.log(err);
                                reject({
                                    title: 'Error',
                                    content: 'Error getting type info'
                                });
                            })
                            .done();
                    })
                    .catch(function (err) {
                        console.log('ERROR');
                        console.log(err);
                    })
                    .done();
            });
        }

        function attachDatatable() {
            console.log('attaching datatable ...');
            console.log(tableId);
            $('#' + tableId).dataTable({
                initComplete: function (settings) {
                    var api = this.api(),
                        rowCount = api.data().length,
                        pageSize = api.page.len(),
                        wrapper = api.settings()[0].nTableWrapper;
                    if (rowCount <= pageSize) {
                        $(wrapper).find('.dataTables_paginate').closest('.row').hide();
                        $(wrapper).find('.dataTables_filter').closest('.row').hide();
                    }
                    $(settings.nTable).removeClass('hide');
                }
            });
        }

        // API
        function init(config) {
            return new Promise(function (resolve) {
                resolve();
            });
        }

        function attach(node) {
            return new Promise(function (resolve, reject) {
                mount = node;
                container = document.createElement('div');
                $container = $(container);
                mount.appendChild(container);

                container.innerHTML = 'Loading all KBase Types ...' + html.loading();

                renderer()
                    .then(function (rendered) {
                        container.innerHTML = rendered.content;
                        R.send('app', 'title', rendered.title);

                        attachDatatable();
                        // create widgets.
                        // no children for now (see kbaseSimplePanel for how to do this)
                        resolve();
                    })
                    .catch(function (err) {
                        if (err.title) {
                            container.innerHTML = err.content;
                            R.send('app', 'title', err.title);
                        }
                        console.log('ERROR rendering widget');
                        console.log(err);
                        reject(err);
                    })
                    .done();
            });
        }

        function start(params) {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        }
        function stop() {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        }
        function detach() {
            return new Promise(function (resolve, reject) {
                resolve();
            });
        }
        return {
            init: init,
            attach: attach,
            start: start,
            stop: stop,
            detach: detach
        };
    }

    return {
        make: function () {
            return widget();
        }
    };

});