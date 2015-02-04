define(['jquery', 'nunjucks', 'kbaseutils', 'kb.utils.api', 'dashboard_widget', 'kbc_Workspace', 'kbasesession', 'kb.widget.buttonbar', 'q'],
   function ($, nunjucks, Utils, APIUtils, DashboardWidget, WorkspaceService, Session, Buttonbar, Q) {
      "use strict";
      var widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'NarrativesWidget';
               cfg.title = 'Your Narratives';
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

         getViewTemplate: {
            value: function () {
               if (this.error) {
                  return 'error';
               } else if (Session.isLoggedIn()) {
                  return this.view;
               } else {
                  return 'unauthorized';
               }
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
                  //.addButton({
                  //   name: 'newnarrative',
                  //   label: 'New Narrative',
                  //   icon: 'plus-circle',
                 //    style: 'primary',
                  //   url: '/functional-site/#/narrativemanager/new',
                  //   external: true
                 // })
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
                  this.getNarratives({
                        params: {
                           showDeleted: 0,
                           owners: [sessionUsername]
                        }
                     })
                     .then(function (narratives) {
                        if (narratives.length === 0) {
                           this.setState('narratives', []);
                           resolve();
                           return;
                        }
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