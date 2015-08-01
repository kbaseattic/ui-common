/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.widget',
    'kb.utils',
    'kb.narrative',
    'kb.utils.api',
    'kb.session',
    'kb.service.workspace',
    'q',
    'datatables_bootstrap'
],
    function (Widget, Utils, Narrative, APIUtils, Session, WorkspaceService, q) {
        "use strict";
        var widget = Object.create(Widget, {
            init: {
                value: function (cfg) {
                    cfg.name = 'DataBrowser';
                    cfg.title = 'Data Browser';
                    this.Widget_init(cfg);

                    // Prepare templating.
                    this.templates.env.addFilter('dateFormat', function (dateString) {
                        return Utils.niceElapsedTime(dateString);
                    }.bind(this));

                    return this;
                }
            },
            setup: {
                value: function () {
                    // User profile service
                    if (Session.isLoggedIn()) {
                        if (this.hasConfig('services.workspace.url')) {
                            this.workspaceClient = new WorkspaceService(this.getConfig('services.workspace.url'), {
                                token: Session.getAuthToken()
                            });
                        } else {
                            throw 'The workspace client url is not defined';
                        }
                    } else {
                        this.workspaceClient = null;
                    }
                }
            },
            setInitialState: {
                value: function (options) {
                    return q.Promise(function (resolve, reject, notify) {
                        // We only run any queries if the session is authenticated.
                        if (!Session.isLoggedIn()) {
                            resolve();
                            return;
                        }

                        // Note that Narratives are now associated 1-1 with a workspace. 
                        // Some new narrative attributes, such as name and (maybe) description, are actually
                        // stored as attributes of the workspace itself.
                        // At present we can just use the presence of "narrative_nice_name" metadata attribute 
                        // to flag a compatible workspace.
                        //
                        q(this.workspaceClient.list_workspace_info({
                            showDeleted: 0,
                            excludeGlobal: 1,
                            owners: [Session.getUsername()]
                        }))
                            .then(function (data) {
                                // First we both transform each ws info object into a nicer js object,
                                // and filter for modern narrative workspaces.
                                var workspaceList = [],
                                    workspaceDb = {},
                                    i, wsInfo;
                                for (i = 0; i < data.length; i += 1) {
                                    wsInfo = APIUtils.workspace_metadata_to_object(data[i]);

                                    // make sure a modern narrative.
                                    if (Narrative.isValid(wsInfo)) {
                                        // if (wsInfo.metadata.narrative && wsInfo.metadata.is_temporary !== 'true') {
                                        workspaceList.push(wsInfo.id);
                                        workspaceDb[wsInfo.id] = wsInfo;
                                    }
                                }
                                // We should now have the list of recently active narratives.
                                // Now we sort and limit the list.

                                // Now get the workspace details.

                                q(this.workspaceClient.list_objects({
                                    ids: workspaceList,
                                    includeMetadata: 1
                                }))
                                    .then(function (data) {
                                        var workspaceObjects = data.map(function (info) {
                                            var wsObjectInfo = APIUtils.object_info_to_object(info);
                                            return {
                                                info: wsObjectInfo,
                                                narrative: {
                                                    workspaceId: wsObjectInfo.wsid,
                                                    name: workspaceDb[wsObjectInfo.wsid].metadata.narrative_nice_name
                                                }
                                            };
                                        });
                                        
                                        
                                        //workspaceObjects = workspaceObjects.sort(function (a, b) {
                                        //    var x = (Utils.iso8601ToDate(a.save_date)).getTime(),
                                        //        y = (Utils.iso8601ToDate(b.save_date)).getTime();
                                        //    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
                                        //}.bind(this));
                                        this.setState('workspaceObjects', workspaceObjects);
                                        resolve();
                                    }.bind(this))
                                    .catch(function (err) {
                                        console.log('ERROR');
                                        console.log(err);
                                        reject(err);
                                    })
                                    .done();

                            }.bind(this))
                            .catch(function (err) {
                                console.log('ERROR');
                                console.log(err);

                                reject(err);
                            })
                            .done();
                    }.bind(this));
                }
            }
        });

        return widget;
    });