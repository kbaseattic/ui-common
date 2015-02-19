define(['kb.widget.dashboard.base', 'kb.client.user_profile', 'kb.utils', 'kb.session', 'kb.client.narrative_method_store', 'kb.client.workspace', 'kb.client.methods', 'kb.utils.api', 'kb.logger', 'q'],
   function (DashboardWidget, UserProfileService, Utils, Session, NarrativeMethodStore, WorkspaceService, Narratives, APIUtils, Logger, Q) {
      "use strict";
      var widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'AppsWidget';
               cfg.title = 'KBase Apps';
               Narratives.init();
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

         setInitialState: {
            value: function () {
               var widget = this;
               return Q.Promise(function (resolve, reject, notify) {
                  if (!Session.isLoggedIn()) {
                     this.setState('apps', null);
                     resolve();
                  } else {

                     Utils.promise(this.methodStore, 'list_apps_full_info', {})
                        .then(function (allApps) {
                           var appMap = {};
                           
                           allApps.forEach(function (x) {
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
                              };                              
                           });
                           
                           
                           Narratives.getNarratives({
                              params: {showDeleted: 0}
                           })
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
                                             Logger.logWarning({
                                                source: 'AppsWidget',
                                                title: 'Skipped App',
                                                message: 'The app "' + app +'" was skipped because it is not in the Apps Store'
                                             });
                                          } else {
                                             appMap[app][bin].count++;
                                             appMap[app][bin].narratives[narrative.workspace.id] = 1;
                                          }
                                       }
                                    }
                                 }
     
                                 allApps.forEach(function (x) {
                                    x.narrativeCount = appMap[x.id];
                                 });
                                 var appList = allApps.sort(function (a,b) {
                                    if (a.name < b.name) {
                                       return -1;
                                    } else if (a.name > b.name) {
                                       return 1;
                                    } else {
                                       return 0;
                                    }
                                 });
                                 widget.setState('appList', appList);
                              
                                 // Now twist this and get narrative count per app by ownership category.
                                 var appOwnership = {owned: [], shared: [], public: []};
                                 allApps.forEach(function (app) {
                                    ['owned', 'shared', 'public'].forEach(function (ownerType) {
                                       if (app.narrativeCount[ownerType].count > 0) {
                                          appOwnership[ownerType] .push({
                                             count: app.narrativeCount[ownerType].count,
                                             app: app
                                          });
                                       }
                                    });
                                 });
                                 widget.setState('appOwnership', appOwnership);
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