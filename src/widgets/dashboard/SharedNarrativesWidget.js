define(['jquery', 'kbaseutils', 'kb.utils.api', 'dashboard_widget', 'kb.client.workspace', 'kbasesession', 'kb.widget.buttonbar', 'q'],
   function ($, Utils, APIUtils, DashboardWidget, Workspace, Session, Buttonbar, Q) {
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
               this.workspaceClient = Object.create(Workspace).init();
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
                  })
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
                              }]
                  })
                  .addInput({
                     placeholder: 'Search',
                     place: 'end',
                     onkeyup: function (e) {
                        this.filterState({
                           search: $(e.target).val()
                        });
                     }.bind(this)
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



         filterState: {
            value: function (options) {
               if (!options.search || options.search.length === 0) {
                  this.setState('narratives', this.narratives);
                  return;
               }

               var searchRe = new RegExp(options.search, 'i');
               var nar = this.narratives.filter(function (x) {
                  if (x.workspace.metadata.narrative_nice_name.match(searchRe)) {
                     return true;
                  } else {
                     return false;
                  }
               });
               this.setState('narratives', nar);
            }
         },

         setInitialState: {
            value: function (options) {
               return Q.promise(function (resolve, reject, notify) {
                  // Get all workspaces, filter out those owned by the user,
                  // and those that are public

                  this.workspaceClient.getNarratives({
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

                        this.workspaceClient.getPermissions(narratives)
                           .then(function (narratives) {
                              narratives = narratives.sort(function (a, b) {
                                 return b.object.saveDate.getTime() - a.object.saveDate.getTime();
                              });
                              this.narratives = narratives;
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