define(['q', 'kbasesession', 'kbaseutils', 'kb.utils.api', 'kbc_Workspace', 'kbaseconfig'],
   function (Q, Session, Utils, APIUtils, Workspace, Config) {

      return Object.create({}, {
         init: {
            value: function (cfg) {
               if (Session.isLoggedIn()) {
                  if (Config.hasConfig('workspace_url')) {
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
               if (ws.metadata.narrative &&
                  // corrupt workspaces may have narrative set to something other than the object id of the narrative
                  /^\d+$/.test(ws.metadata.narrative) &&
                  ws.metadata.is_temporary !== 'true') {
                  return true;
               } else {
                  return false;
               }
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
               return Q.promise(function (resolve, reject, notify) {
                  Utils.promise(this.workspaceClient, 'list_workspace_info', cfg.params)
                     .then(function (data) {
                        var workspaces = [];
                        for (var i = 0; i < data.length; i++) {
                           var wsInfo = APIUtils.workspace_metadata_to_object(data[i]);
                           if (this.isValidNarrative(wsInfo) && this.applyNarrativeFilter(cfg.filter)) {
                              workspaces.push(wsInfo);
                           }
                        }

                        var objectRefs = workspaces.map(function (w) {
                           return {
                              ref: w.id + '/' + w.metadata.narrative
                           }
                        });

                        // Now get the corresponding object metadata for each narrative workspace
                        Utils.promise(this.workspaceClient, 'get_object_info_new', {
                              objects: objectRefs,
                              ignoreErrors: 1,
                              includeMetadata: 1
                           })
                           .then(function (data) {
                              var narratives = [];
                              for (var i = 0; i < data.length; i++) {
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
                     })
                  }.bind(this));
                  var username = Session.getUsername();
                  Q.all(promises)
                     .then(function (permissions) {
                        for (var i = 0; i < permissions.length; i++) {
                           var narrative = narratives[i];
                           narrative.permissions = Utils.object_to_array(permissions[i], 'username', 'permission')
                              .filter(function (x) {
                                 if (x.username === username ||
                                    x.username === '*' ||
                                    x.username === narrative.workspace.owner) {
                                    return false;
                                 } else {
                                    return true;
                                 }
                              })
                              .sort(function (a, b) {
                                 if (a.username < b.username) {
                                    return -1;
                                 } else if (a.username > b.username) {
                                    return 1;
                                 } else {
                                    return 0
                                 }
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
         }
      });


   });