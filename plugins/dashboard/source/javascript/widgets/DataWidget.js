/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb_widget_dashboard_base', 'kb.utils', 'kb.utils.api', 'kb.session', 'kb.service.workspace', 'bluebird'],
    function (DashboardWidget, Utils, APIUtils, Session, WorkspaceService, Promise) {
        "use strict";
        var widget = Object.create(DashboardWidget, {
            init: {
                value: function (cfg) {
                    cfg.name = 'DataWidget';
                    cfg.title = 'Your Data';
                    this.DashboardWidget_init(cfg);

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
                    return new Promise(function (resolve, reject, notify) {
                        // We only run any queries if the session is authenticated.
                        if (!Session.isLoggedIn()) {
                            resolve();
                            return;
                        }
                        console.log('starting...');

                        // Note that Narratives are now associated 1-1 with a workspace. 
                        // Some new narrative attributes, such as name and (maybe) description, are actually
                        // stored as attributes of the workspace itself.
                        // At present we can just use the presence of "narrative_nice_name" metadata attribute 
                        // to flag a compatible workspace.
                        //
                        Promise.resolve(this.workspaceClient.list_workspace_info({
                            showDeleted: 0,
                            excludeGlobal: 1,
                            owners: [Session.getUsername()]
                        }))
                            .then(function (data) {
                                console.log('Hmm .. did this work yet?');
                                var dataObjects = [];
                                // First we both transform each ws info object into a nicer js object,
                                // and filter for modern narrative workspaces.
                                var workspaces = {};
                                var workspaceList = [];
                                for (var i = 0; i < data.length; i++) {
                                    var wsInfo = APIUtils.workspace_metadata_to_object(data[i]);

                                    // make sure a modern narrative.
                                    if (wsInfo.metadata.narrative && wsInfo.metadata.is_temporary !== 'true') {
                                        workspaceList.push(wsInfo.id);
                                        wsInfo[wsInfo.id] = wsInfo;
                                    }
                                }
                                // We should now have the list of recently active narratives.
                                // Now we sort and limit the list.

                                // Now get the workspace details.

                                var workspaceObjects = [];
                                Promise.resolve(this.workspaceClient.list_objects({
                                    ids: workspaceList,
                                    includeMetadata: 1
                                }))
                                    .then(function (data) {
                                                                        console.log('Well .. did this work yet?');

                                        for (var i = 0; i < data.length; i++) {
                                            workspaceObjects.push(APIUtils.object_info_to_object(data[i]));
                                        }
                                        workspaceObjects = workspaceObjects.sort(function (a, b) {
                                            var x = (Utils.iso8601ToDate(a.save_date)).getTime();
                                            var y = (Utils.iso8601ToDate(b.save_date)).getTime();
                                            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
                                        }.bind(this));
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