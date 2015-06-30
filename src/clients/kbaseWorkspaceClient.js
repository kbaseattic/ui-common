/*global
    define, console
 */
/*jslint
    browser: true,
    white: true
 */
define(['q', 'kb.session', 'kb.utils', 'kb.utils.api', 'kb.service.workspace', 'kb.config'],
    function (Q, Session, Utils, APIUtils, Workspace, Config) {
        'use strict';
        return Object.create({}, {
            init: {
                value: function (cfg) {
                    if (Session.isLoggedIn()) {
                        if (Config.hasConfig('workspace_url')) {
                            // console.log(Workspace);
                            this.workspaceClient = new Workspace(Config.getConfig('workspace_url'), {
                                token: Session.getAuthToken()
                            });
                        } else {
                            throw 'The workspace client url is not defined';
                        }
                    } else {
                        this.workspaceClient = null;
                    }
                    return this;
                }
            },
            isValidNarrative: {
                value: function (ws) {
                    // corrupt workspaces may have narrative set to something other than the object id of the narrative
                    if (ws.metadata.narrative && /^\d+$/.test(ws.metadata.narrative) && ws.metadata.is_temporary !== 'true') {
                        return true;
                    }
                    return false;
                }
            },
            applyNarrativeFilter: {
                value: function (ws, filter) {
                    return true;
                }
            },
            getNarratives: {
                value: function (cfg) {
                    // get all the narratives the user can see.
                    return Q.promise(function (resolve, reject) {
                        Utils.promise(this.workspaceClient, 'list_workspace_info', cfg.params)
                            .then(function (data) {
                                var workspaces = [], i, wsInfo;
                                for (i = 0; i < data.length; i += 1) {
                                    wsInfo = APIUtils.workspace_metadata_to_object(data[i]);
                                    if (this.isValidNarrative(wsInfo) && this.applyNarrativeFilter(cfg.filter)) {
                                        workspaces.push(wsInfo);
                                    }
                                }

                                var objectRefs = workspaces.map(function (w) {
                                    return {
                                        ref: w.id + '/' + w.metadata.narrative
                                    };
                                });

                                // Now get the corresponding object metadata for each narrative workspace
                                Utils.promise(this.workspaceClient, 'get_object_info_new', {
                                    objects: objectRefs,
                                    ignoreErrors: 1,
                                    includeMetadata: 1
                                })
                                    .then(function (data) {
                                        var narratives = [], i;
                                        for (i = 0; i < data.length; i += 1) {
                                            // If one of the object ids from the workspace metadata (.narrative) did not actually
                                            // result in a hit, skip it. This can occur if a narrative is corrupt -- the narrative object
                                            // was deleted or replaced and the workspace metadata not updated.
                                            if (!data[i]) {
                                                console.log('WARNING: workspace ' + narratives[i].workspace.id + ' does not contain a matching narrative object');
                                                continue;
                                            }
                                            // Make sure it is a valid narrative object.
                                            var object = APIUtils.object_info_to_object(data[i]);
                                            if (object.typeName !== 'Narrative') {
                                                console.log('WARNING: workspace ' + object.wsid + ' object ' + object.id + ' is not a valid Narrative object');
                                                continue;
                                            }
                                            narratives.push({
                                                workspace: workspaces[i],
                                                object: object
                                            });
                                        }
                                        resolve(narratives);
                                    }.bind(this))
                                    .catch(function (err) {
                                        reject(err);
                                    })
                                    .done();
                            }.bind(this))
                            .catch(function (err) {
                                reject(err);
                            })
                            .done();
                    }.bind(this));
                }
            },
            getPermissions: {
                value: function (narratives) {
                    return Q.promise(function (resolve, reject, notify) {
                        var promises = narratives.map(function (narrative) {
                            return Utils.promise(this.workspaceClient, 'get_permissions', {
                                id: narrative.workspace.id
                            });
                        }.bind(this));
                        var username = Session.getUsername();
                        Q.all(promises)
                            .then(function (permissions) {
                                var i, narrative;
                                for (i = 0; i < permissions.length; i += 1) {
                                    narrative = narratives[i];
                                    narrative.permissions = Utils.object_to_array(permissions[i], 'username', 'permission')
                                        .filter(function (x) {
                                            if (x.username === username ||
                                                x.username === '*' ||
                                                x.username === narrative.workspace.owner) {
                                                return false;
                                            } 
                                            return true;
                                        })
                                        .sort(function (a, b) {
                                            if (a.username < b.username) {
                                                return -1;
                                            }
                                            if (a.username > b.username) {
                                                return 1;
                                            }
                                            return 0;
                                        });
                                }
                                resolve(narratives);
                            }.bind(this))
                            .catch(function (err) {
                                reject(err);
                            })
                            .done();
                    }.bind(this));
                }
            },
            getObject: {
                value: function (workspaceId, objectId) {
                    return Q.Promise(function (resolve, reject) {
                        var objectRefs = [{ref: workspaceId + '/' + objectId}];
                        Utils.promise(this.workspaceClient, 'get_object_info_new', {
                            objects: objectRefs,
                            ignoreErrors: 1,
                            includeMetadata: 1
                        })
                            .then(function (data) {
                                if (data.length === 0) {
                                    reject('Object not found');
                                    return;
                                }
                                if (data.length > 1) {
                                    reject('Too many (' + data.length + ') objects found.');
                                    return;
                                }
                                
                                var object = APIUtils.object_info_to_object(data[0]);
                                resolve(object);
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