define(['jquery', 'kbaseutils', 'kb.utils.api', 'dashboard_widget', 'kbc_Workspace', 'kbasesession', 'kb.widget.buttonbar', 'q'],
   function ($, Utils, APIUtils, DashboardWidget, WorkspaceService, Session, Buttonbar, Q) {
      "use strict";
      var widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'SharedNarrativesWidget';
               cfg.title = 'Narratives Shared with You';
               this.DashboardWidget_init(cfg);

               // TODO: get this from somewhere, allow user to configure this.
               this.params.limit = 10;

               this.view = 'slider';

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

               this.buttonbar = Object.create(Buttonbar).init({
                  container: this.container.find('[data-placeholder="buttonbar"]')
               });
               this.buttonbar
                  .clear()
                  .addRadioToggle({
                     buttons: [
                        {
                           label: 'Slider',
                           active: true,
                           callback: function (e) {
                              this.view = 'slider';
                              this.refresh();
                           }.bind(this)
                              },
                        {
                           label: 'Table',
                           callback: function (e) {
                              this.view = 'table';
                              this.refresh();
                           }.bind(this)
                              }
                  ]
                  });

            }
         },

         render: {
            value: function () {
               // Generate initial view based on the current state of this widget.
               // Head off at the pass -- if not logged in, can't show profile.
               if (this.error) {
                  this.renderError();
               } else if (Session.isLoggedIn()) {
                  this.places.title.html(this.widgetTitle);
                  this.places.content.html(this.renderTemplate(this.view));
               } else {
                  // no profile, no basic aaccount info
                  this.places.title.html(this.widgetTitle);
                  this.places.content.html(this.renderTemplate('unauthorized'));
               }
               this.container.find('[data-toggle="popover"]').popover();
               this.container.find('[data-toggle="tooltip"]').tooltip();
               return this;
            }
         },

         xgetPermissions: {
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
         },

         setInitialState: {
            value: function (options) {
               return Q.promise(function (resolve, reject, notify) {
                  // Get all workspaces, filter out those owned by the user,
                  // and those that are public

                  this.getNarratives({
                        params: {
                           showDeleted: 0
                        }
                     })
                     .then(function (narratives) {
                        if (narratives.length === 0) {
                           this.setState('narratives', []);
                           resolve();
                           return;
                        }

                        // TODO: move this into getNarratives (the hook is there, just not implemented)
                        // filter out those owned, and those which we don't have
                        // view or write permission for
                        narratives = narratives.filter(function (x) {
                           if (x.workspace.owner === Session.getUsername() ||
                              x.workspace.user_permission === 'n') {
                              return false;
                           } else {
                              return true;
                           }
                        });

                        this.getPermissions(narratives)
                           .then(function (narratives) {
                              narratives = narratives.sort(function (a, b) {
                                 return b.object.saveDate.getTime() - a.object.saveDate.getTime();
                              });
                              this.setState('narratives', narratives);
                              resolve();
                           }.bind(this))
                           .catch(function (err) {
                              console.log('ERROR');
                              console.log(err);
                              reject(err);
                           })
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