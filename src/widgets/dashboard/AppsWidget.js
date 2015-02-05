define(['dashboard_widget', 'kbc_UserProfile', 'kbaseutils', 'kbasesession', 'kbc_NarrativeMethodStore', 'kbc_Workspace', 'kb.utils.api', 'q'],
   function (DashboardWidget, UserProfileService, Utils, Session, NarrativeMethodStore, WorkspaceService, APIUtils, Q) {
      "use strict";
      var widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'AppsWidget';
               cfg.title = 'KBase Apps';
               this.DashboardWidget_init(cfg);
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

                  if (this.hasConfig('narrative_method_store_url')) {
                     this.methodStore = new NarrativeMethodStore(this.getConfig('narrative_method_store_url'), {
                        token: Session.getAuthToken()
                     });
                  } else {
                     throw 'The Narrative Method Store client url is not defined';
                  }

                  if (this.hasConfig('workspace_url')) {
                     this.workspaceClient = new WorkspaceService(this.getConfig('workspace_url'), {
                        token: Session.getAuthToken()
                     });
                  } else {
                     throw 'The Workspace client url is not defined';
                  }
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

         getNarratives: {
            value: function () {
               // get all the narratives the user can see.
               return Q.promise(function (resolve, reject, notify) {
                  Utils.promise(this.workspaceClient, 'list_workspace_info', {
                        showDeleted: 0,
                     })
                     .then(function (data) {
                        var workspaces = [];
                        for (var i = 0; i < data.length; i++) {
                           var wsInfo = APIUtils.workspace_metadata_to_object(data[i]);
                           if (wsInfo.metadata.narrative &&
                              /^\d+$/.test(wsInfo.metadata.narrative) && // corrupt workspaces may have narrative set to something other than the object id of the narrative
                              wsInfo.metadata.is_temporary !== 'true') { // Don't include "unsaved" narratives.
                              workspaces.push(wsInfo);
                           }
                        }

                        var objectRefs = workspaces.map(function (w) {
                           return {
                              ref: w.id + '/' + w.metadata.narrative
                           }
                        });

                        // Now get the objects for each narrative workspace
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
                                 narratives.push({
                                    workspace: workspaces[i],
                                    object: APIUtils.object_info_to_object(data[i])
                                 });
                              }
                              resolve(narratives);
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
         },

         setInitialState: {
            value: function () {
               var widget = this;
               return Q.Promise(function (resolve, reject, notify) {
                  if (!Session.isLoggedIn()) {
                     this.setState('apps', null);
                     resolve();
                  } else {

                     Utils.promise(this.methodStore, 'list_apps_full_info', {})
                        .then(function (data) {
                           var appMap = {};
                           data.forEach(function (x) {
                              appMap[x.id] = {
                                 owned: {
                                    count: 0,
                                    narratives: {}
                                 },
                                 shared: {
                                    count: 0,
                                    narratives: {}
                                 },
                                 public: {
                                    count: 0,
                                    narratives: {}
                                 }
                              }
                           });
                           
                           this.getNarratives()
                              .then(function (narratives) {
                                 // Now we have all the narratives this user can see.
                                 // now bin them by app.
                                 for (var i = 0; i < narratives.length; i++) {
                                    var narrative = narratives[i];
                                    if (narrative.object.metadata.methods) {
                                       var methods = JSON.parse(narratives[i].object.metadata.methods);
                                       var apps = methods.app;
                                       
                                       if (narrative.workspace.owner === Session.getUsername()) {
                                          var bin = 'owned';
                                       } else if (narrative.workspace.globalread === 'n') {
                                          var bin = 'shared';
                                       } else {
                                          var bin = 'public';
                                       }
                                       for (var app in apps) {
                                          // simple object, don't need to check.
                                          if (!appMap[app]) {
                                             console.log('WARNING: skipped app ' + app);
                                          } else {
                                             appMap[app][bin].count++;
                                             appMap[app][bin].narratives[narrative.workspace.id] = 1;
                                          }
                                       }
                                    }
                                 }
     
                                 data.forEach(function (x) {
                                    x.narrativeCount = appMap[x.id];
                                 });
                                 widget.setState('appList', data);

                                 resolve();
                              })
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

                  }
               }.bind(this));
            }
         }


      });

      return widget;
   });