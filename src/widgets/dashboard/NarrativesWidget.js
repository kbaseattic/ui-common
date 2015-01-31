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
                        var workspacesWithNarratives = [];
                        // First we both transform each ws info object into a nicer js object,
                        // and filter for modern narrative workspaces.
                        for (var i = 0; i < data.length; i++) {
                           //tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
                           //int object, permission user_permission, permission globalread,
                           //lock_status lockstat, usermeta metadata> workspace_info
                           var wsInfo = this.workspace_metadata_to_object(data[i]);

                           // make sure a modern narrative.
                           if (wsInfo.metadata.narrative && wsInfo.metadata.is_temporary !== 'true') {
                              workspacesWithNarratives.push(wsInfo.id);
                              narrativesByWorkspace[wsInfo.id] = {
                                 workspace: wsInfo
                              }
                           }
                        }

                        this.promise(this.workspaceClient, 'list_objects', {
                              ids: workspacesWithNarratives,
                              includeMetadata: 1
                           })
                           .then(function (data) {
                              var permissionsPromises = [];
                              // we need to keep a stash of narratives in the same order as we
                              // build the promises, because the WS client does not return the wsId 
                              // with the response.
                              var narrativeObjects = [];
                              for (var i = 0; i < data.length; i++) {
                                 // Filter for just narratives.
                                 // TODO: Oops, the object id is provide in the ws metadata!
                                 var wsObject = this.object_info_to_object(data[i]);
                                 var type = wsObject.type.split(/[-\.]/);
                                 if (type[1] === 'Narrative') {
                                    if (narrativesByWorkspace[wsObject.wsid].object) {
                                       console.log('WARNING: more than one narrative in this workspace: ' + wsObject.wsid);
                                    } else {
                                       narrativesByWorkspace[wsObject.wsid].object = wsObject;
                                       narrativeObjects.push(wsObject);
                                       permissionsPromises.push(this.promise(this.workspaceClient, 'get_permissions', {
                                          id: wsObject.wsid
                                       }));
                                    }
                                 }
                                
                              }
                              // Get permissions in parallel, then build up the list of narratives.
                              Q.all(permissionsPromises)
                                 .then(function (permissions) {
                                    // add the permissions to the master table of narratives keyed by workspace.
                                    for (var i = 0; i < permissions.length; i++) {
                                       var wsId = narrativeObjects[i].wsid;
                                       var permissionsList = this.object_to_array(permissions[i], 'username', 'permission');
                                       permissionsList = permissionsList.filter(function (x) {
                                          if (x.username === sessionUsername) {
                                             return false;
                                          } else if (x.username === '*') {
                                             // permissions for public are recorded as username '*'.
                                             return false;
                                          } else {
                                             return true;
                                          }
                                       });
                                       permissionsList = permissionsList.sort(function (a,b) {
                                          if (a.username < b.username) {
                                             return -1;
                                          } else if (a.username > b.username) {
                                             return 1;
                                          } else {
                                             return 0
                                          }
                                       });
                                          
                                       narrativesByWorkspace[wsId].permissions = permissionsList;
                                    }

                                    // Now convert to an array in order to be sortable, and for rendering.
                                    var narratives = [];
                                    for (var i = 0; i < workspacesWithNarratives.length; i++) {
                                       var wsId = workspacesWithNarratives[i];
                                       if (!narrativesByWorkspace[wsId].object) {
                                          console.log('WARNING: could not find narrative inside workspace: ' + wsId);
                                       } else {
                                          narratives.push(narrativesByWorkspace[wsId]);
                                       }
                                    }
                                    // TODO: skip this step -- the template and/or front end can handle this.
                                    narratives = narratives.sort(function (a, b) {
                                       var x = (Utils.iso8601ToDate(a.object.save_date)).getTime();
                                       var y = (Utils.iso8601ToDate(b.object.save_date)).getTime();
                                       return ((x < y) ? 1 : ((x > y) ? -1 : 0));
                                    }.bind(this));
                                    this.setState('narratives', narratives);
                                    // Finally, resolve our promise!
                                    resolve();
                                 }.bind(this))
                                 .catch(function (err) {
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