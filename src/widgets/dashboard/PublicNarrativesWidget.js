define(['jquery', 'postal', 'kb.utils', 'kb.utils.api', 'kb.widget.dashboard.base', 'kb.client.methods', 'kb.session', 'kb.widget.buttonbar', 'q'],
   function ($, Postal, Utils, APIUtils, DashboardWidget, KBService, Session, Buttonbar, Q) {
      "use strict";
      var widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'PublicNarrativesWidget';
               cfg.title = 'Public Narratives';
               this.DashboardWidget_init(cfg);

               // TODO: get this from somewhere, allow user to configure this.
               this.params.limit = 10;

               this.view = 'slider';
               this.templates.env.addFilter('appName', function (x) {
                  return this.getState(['appsMap', x, 'name'], x);
               }.bind(this));
               this.templates.env.addFilter('methodName', function (x) {
                  return this.getState(['methodsMap', x, 'name'], x);
               }.bind(this));
               return this;
            }
         },
         getAppName: {
            value: function (name) {
               return this.getState(['appsMap', name, 'name'], name);
            }
         },
         getMethodName: {
            value: function (name) {
               return this.getState(['methodsMap', name, 'name'], name);
            }
         },
         go: {
            value: function () {
               this.start();

               /*Postal.channel('dashboard.metrics')
               .subscribe('query.sharedNarratives', function (data) {
                  if (this.hasState('narratives')) {
                     var count = n.length;
                  } else {
                     var count = null;
                  }
                  Postal.channel('dashboard.metrics')
                  .publish('update.sharedNarratives', {
                     narratives: {
                        count: count
                     }
                  });
               }.bind(this));
               */
               return this;
            }
         },

         setup: {
            value: function () {
               this.kbservice = Object.create(KBService).init();
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

         setupUI: {
            value: function () {
               if (this.hasState('narratives') && this.getState('narratives').length > 0) {
                  this.buttonbar = Object.create(Buttonbar).init({
                     container: this.container.find('[data-placeholder="buttonbar"]')
                  });
                  this.buttonbar
                     .clear()

                  /*.addRadioToggle({
                     buttons: [
                        {
                           label: 'Slider',
                           active: true,
                           class: 'btn-kbase',
                           callback: function (e) {
                              this.view = 'slider';
                              this.refresh();
                           }.bind(this)
                              },
                        {
                           label: 'Table',
                           class: 'btn-kbase',
                           callback: function (e) {
                              this.view = 'table';
                              this.refresh();
                           }.bind(this)
                              }]
                  })
                  */
                  .addInput({
                     placeholder: 'Search',
                     place: 'end',
                     onkeyup: function (e) {
                        // little hack to make sure the public narratives is opened up.
                        var collapse = this.places.title;
                        // console.log(collapse.hasClass('collapsed'));
                        if (collapse.hasClass('collapsed')) {
                           var id = collapse.attr('data-target');
                           $(id).collapse('show');
                           //console.log('opening...');
                           //collapse.collapse('show');
                        }

                        this.filterState({
                           search: $(e.target).val()
                        });
                     }.bind(this)
                  });
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

         filterState: {
            value: function (options) {
               if (!options.search || options.search.length === 0) {
                  this.setState('narrativesFiltered', this.getState('narratives'));
                  return;
               }
               var searchRe = new RegExp(options.search, 'i');
               var nar = this.getState('narratives').filter(function (x) {
                  if (x.workspace.metadata.narrative_nice_name.match(searchRe) ||
                     (x.object.metadata.cellInfo &&
                        (function (apps) {
                           for (var i in apps) {
                              var app = apps[i];
                              if (app.match(searchRe) || this.getAppName(app).match(searchRe)) {
                                 return true;
                              }
                           }
                        }.bind(this))(Object.keys(x.object.metadata.cellInfo.app))) ||
                     (x.object.metadata.cellInfo &&
                        (function (methods) {
                           for (var i in methods) {
                              var method = methods[i];
                              if (method.match(searchRe) || this.getMethodName(method).match(searchRe)) {
                                 return true;
                              }
                           }
                        }.bind(this))(Object.keys(x.object.metadata.cellInfo.method)))) {
                     return true;
                  } else {
                     return false;
                  }
               }.bind(this));
               this.setState('narrativesFiltered', nar);
            }
         },

         onStateChange: {
            value: function () {
               var count = this.doState('narratives', function (x) {
                  return x.length
               }, null);
               var filtered = this.doState('narrativesFiltered', function (x) {
                  return x.length
               }, null);

               this.viewState.setItem('publicNarratives', {
                  count: count,
                  filtered: filtered
               });
               /*Postal
               .channel('dashboard.metrics')
               .publish('update.sharedNarratives', {
                     count: count
                  }
               );
               */
            }
         },

         setInitialState: {
            value: function (options) {
               return Q.promise(function (resolve, reject, notify) {
                  // Get all workspaces, filter out those owned by the user,
                  // and those that are public

                  Q.all([this.kbservice.getNarratives({
                           params: {
                              showDeleted: 0,
                              excludeGlobal: 0
                           }
                        }),
                        this.kbservice.getApps(),
                        this.kbservice.getMethods()])
                     .then(function (result) {
                        var narratives = result[0];
                        var apps = result[1];
                        var methods = result[2];


                        this.setState('apps', apps);
                        var appsMap = {};
                        apps.forEach(function (app) {
                           appsMap[app.id] = app;
                        });
                        this.setState('appsMap', appsMap);

                        this.setState('methods', methods);
                        var methodsMap = {};
                        methods.forEach(function (method) {
                           methodsMap[method.id] = method;
                        });
                        this.setState('methodsMap', methodsMap);


                        if (narratives.length === 0) {
                           this.setState('narratives', []);
                           resolve();
                           return;
                        }

                        // TODO: move this into getNarratives (the hook is there, just not implemented)
                        // filter out those owned by the user, and those which also have some sharing
                        // permission ('n' in this case means "no sharing permission" not "no permission"
                        // because clearly globally shared narratives carrry that permission to everyone!)
                        narratives = narratives.filter(function (x) {
                           if (x.workspace.owner === Session.getUsername() ||
                              x.workspace.user_permission !== 'n') {
                              return false;
                           } else {
                              return true;
                           }
                        });

                        this.kbservice.getPermissions(narratives)
                           .then(function (narratives) {
                              narratives = narratives.sort(function (a, b) {
                                 return b.object.saveDate.getTime() - a.object.saveDate.getTime();
                              });
                              this.setState('narratives', narratives);
                              this.setState('narrativesFiltered', narratives);

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