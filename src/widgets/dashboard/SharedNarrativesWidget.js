define(['jquery', 'kbaseutils', 'dashboard_widget', 'kbaseworkspaceserviceclient', 'kbasesession', 'q'],
   function ($, Utils, DashboardWidget, WorkspaceService, Session, Q) {
      "use strict";
      var widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'SharedNarrativesWidget';
               cfg.title = 'Narratives Shared with You';
               this.DashboardWidget_init(cfg);

               // Prepare templating.
               this.templates.env.addFilter('dateFormat', function (dateString) {
                  return this.niceElapsedTime(dateString);
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

                  var recentActivity = [];

                  // 
                  // Get all workspaces, filter out those owned by the user,
                  // and those that are public
                  // 
                  this.promise(this.workspaceClient, 'list_workspace_info', {
                        showDeleted: 0,
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

                           // Ensures we have a narrative workspace.
                           if (!wsInfo.metadata.narrative) {
                              continue;
                           }
                           // Ensures we are not including "unsaved" narratives.
                           if (wsInfo.metadata.is_temporary === 'true') {
                              continue;
                           }
                           // Ensures we are not including workspaces owned by this user.
                           if (wsInfo.owner === Session.getUsername()) {
                              continue;
                           }
                           // No, we include global ones, they may ALSO have been shared
                           // with ths user.
                           //if (wsInfo.globalread !== 'n') {
                           //   continue;
                           //}

                           workspacesWithNarratives.push(wsInfo.id);
                           narrativesByWorkspace[wsInfo.id] = {
                              workspace: wsInfo
                           }


                        }

                        this.promise(this.workspaceClient, 'list_objects', {
                              ids: workspacesWithNarratives,
                              includeMetadata: 1
                           })
                           .then(function (data) {
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
                                    }
                                 }
                              }
                              var narratives = [];
                              for (var i = 0; i < workspacesWithNarratives.length; i++) {
                                 var wsId = workspacesWithNarratives[i];
                                 if (!narrativesByWorkspace[wsId].object) {
                                    console.log('WARNING: could not find narrative inside workspace: ' + wsId);
                                 } else {
                                    narratives.push(narrativesByWorkspace[wsId]);
                                 }
                              }
                              narratives = narratives.sort(function (a, b) {
                                 var x = (this.iso8601ToDate(a.object.save_date)).getTime();
                                 var y = (this.iso8601ToDate(b.object.save_date)).getTime();
                                 return ((x < y) ? 1 : ((x > y) ? -1 : 0));
                              }.bind(this));
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
               }.bind(this));
            }
         }

      });

      return widget;
   });