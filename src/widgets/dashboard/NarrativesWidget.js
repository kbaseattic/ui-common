define(['jquery', 'nunjucks', 'kbaseutils', 'dashboard_widget', 'kbaseworkspaceserviceclient', 'kbasesession', 'q'],
   function ($, nunjucks, Utils, DashboardWidget, WorkspaceService, Session, Q) {
      "use strict";
      var widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'NarrativesWidget';
               cfg.title = 'Your Narratives';
               this.DashboardWidget_init(cfg);

               // Prepare templating.
               this.templates.env.addFilter('dateFormat', function (dateString) {
                  return Utils.niceElapsedTime(dateString);
               }.bind(this));

               // TODO: get this from somewhere, allow user to configure this.
               this.params.limit = 10;


               return this;
            }
         },

         go: {
            value: function () {
               this.start();
               return this;
            }
         },

         setup: {
            value: function () {
               // User profile service

               if (Session.isLoggedIn()) {
                  if (this.hasConfig('workspace_url')) {
                     this.workspaceClient = new WorkspaceService(this.getConfig('workspace_url'), {
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


         renderLayout: {
            value: function () {
               this.container.html(this.renderTemplate('layout'));
               this.places = {
                  title: this.container.find('[data-placeholder="title"]'),
                  alert: this.container.find('[data-placeholder="alert"]'),
                  content: this.container.find('[data-placeholder="content"]')
               };

            }
         },

         getPermissions: {
            value: function (narratives) {
               return Q.promise(function (resolve, reject, notify) {
                  var promises = narratives.map(function (narrative) {
                     return this.promise(this.workspaceClient, 'get_permissions', {
                        id: narrative.workspace.id
                     })
                  }.bind(this));
                  var username = Session.getUsername();
                  Q.all(promises)
                     .then(function (permissions) {
                        for (var i = 0; i < permissions.length; i++) {
                           var narrative = narratives[i];
                           narrative.permissions = this.object_to_array(permissions[i], 'username', 'permission')
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
         },

         setInitialState: {
            value: function (options) {
               return Q.promise(function (resolve, reject, notify) {
                  // We only run any queries if the session is authenticated.
                  if (!Session.isLoggedIn()) {
                     resolve();
                     return;
                  }

                  var sessionUsername = Session.getUsername();
                  var recentActivity = [];

                  // Note that Narratives are now associated 1-1 with a workspace. 
                  // Some new narrative attributes, such as name and (maybe) description, are actually
                  // stored as attributes of the workspace itself.
                  // At present we can just use the presence of "narrative_nice_name" metadata attribute 
                  // to flag a compatible workspace.
                  //
                  this.promise(this.workspaceClient, 'list_workspace_info', {
                        showDeleted: 0,
                        owners: [sessionUsername]
                     })
                     .then(function (data) {
                        // collect then into a map because we need to query for object details
                        var narrativesByWorkspace = {};
                        var narratives = [];
                        // First we both transform each ws info object into a nicer js object,
                        // and filter for modern narrative workspaces.
                        for (var i = 0; i < data.length; i++) {
                           //tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
                           //int object, permission user_permission, permission globalread,
                           //lock_status lockstat, usermeta metadata> workspace_info
                           var wsInfo = this.workspace_metadata_to_object(data[i]);

                           // make sure a modern narrative.
                           if (wsInfo.metadata.narrative && wsInfo.metadata.is_temporary !== 'true') {
                              narratives.push({
                                 workspace: wsInfo
                              });
                              narrativesByWorkspace[wsInfo.id] = {
                                 workspace: wsInfo
                              }
                           }
                        }
                        
                        if (narratives.length === 0) {
                           this.setState('narratives', []);
                           resolve();
                           return;
                        }

                        // Now we need to get the object metadata.
                        this.getPermissions(narratives)
                           .then(function (narratives) {
                              var workspaceIds = narratives.map(function (x) {
                                 return {
                                    wsid: x.workspace.id,
                                    objid: parseInt(x.workspace.metadata.narrative)
                                 }
                              });
                              this.promise(this.workspaceClient, 'get_objects', workspaceIds)
                                 .then(function (data) {
                                    for (var i = 0; i < data.length; i++) {
                                       // NB this has given us all of the objects in the relevant workspaces.
                                       // Now we need to filter out just the narratives of interest
                                       var wsObject = this.object_info_to_object(data[i].info);
                                       // console.log(narrativesByWorkspace[wsObject.wsid].workspace.metadata.narrative + '=' + wsObject.id);
                                       // NB: we use plain == for comparison since we need type convertion. The metadata.narrative
                                       // is a string, but wsObject.id is a number.
                                       if (narrativesByWorkspace[wsObject.wsid].workspace.metadata.narrative != wsObject.id) {
                                          continue;
                                       }
                                       // Save the object in the map...
                                       narrativesByWorkspace[wsObject.wsid].object = wsObject;
                                    }
                                    // Now add the objects back into the narratives list.
                                    narratives.forEach(function (x) {
                                       console.log(x);
                                       x.object = narrativesByWorkspace[x.workspace.id].object;
                                    });
                                    this.setState('narratives', narratives);
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
         }

      });

      return widget;
   });