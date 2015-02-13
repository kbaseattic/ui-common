define(['jquery', 'postal', 'nunjucks', 'kb.widget.dashboard.base', 'kb.client.methods', 'kb.client.workspace', 'kb.client.user_profile', 'kb.session', 'kb.utils', 'kb.utils.api', 'q'],
   function ($, Postal, nunjucks, DashboardWidget, ClientMethods, WorkspaceService, UserProfileService, Session, Utils, APIUtils, Q) {
      "use strict";
      var Widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'CollaboratorsWidget';
               cfg.title = 'Common Collaborator Network';
               this.DashboardWidget_init(cfg);

               return this;
            }
         },

         go: {
            value: function () {
               this.start();
               /*Postal.channel('dashboard.metrics')
               .subscribe('query.collaborators', function (data) {
                  if (this.hasState('collaborators')) {
                     var count = n.length;
                  } else {
                     var count = null;
                  }
                  Postal.channel('dashboard.metrics')
                  .publish('update.collaborators', {
                     count: count
                  });
               }.bind(this));
               */

               
               return this;
            }
         },

         setup: {
            value: function () {
               // Set up workspace client
               if (Session.isLoggedIn()) {
                  this.clientMethods = Object.create(ClientMethods).init();
                  
                  if (this.hasConfig('user_profile_url')) {
                     this.userProfileClient = new UserProfileService(this.getConfig('user_profile_url'), {
                        token: Session.getAuthToken()
                     });
                  } else {
                     throw 'The user profile client url is not defined';
                  }

               } else {
                  this.userProfileClient = null;
               }
            }
         },
         
         onStateChange: {
            value: function () {
               if (this.hasState('collaborators')) {
                  var count = this.getState('collaborators').length;
               } else {
                  var count = null;
               }
               
               this.viewState.setItem('collaborators', {
                  filtered: count,
                  count: count
               });
               /*
               Postal
               .channel('dashboard.metrics')
               .publish('update.collaborators', {
                     count: count
                  }
               );
               */
            }
         },

         setInitialState: {
            value: function (options) {
               return Q.Promise(function (resolve, reject, notify) {
                  if (!Session.isLoggedIn()) {
                     resolve();
                  } else {
                     Utils.promise(this.userProfileClient, 'get_user_profile', [this.params.userId])
                        .then(function (data) {
                           if (data && data[0]) {
                              this.setState('currentUserProfile', data[0], false);

                              this.clientMethods.getCollaborators()
                                 .then(function (collaborators) {
                                    this.setState('collaborators', collaborators);
                                    resolve();
                                 }.bind(this))
                                 .catch(function (err) {
                                    console.log('error building collab network...');
                                    console.log(err);
                                    reject(err);
                                 });
                           } else {
                              reject('User not found');
                           }
                        }.bind(this))
                        .catch(function (err) {
                           console.log('error');
                           console.log(err);
                           reject(err);
                        });
                  }
               }.bind(this));
            }
         },

         // Overriding the default, simple, render because we need to update the title
         // TODO: make it easy for a widget to customize the title.
         render: {
            value: function () {
               // Generate initial view based on the current state of this widget.
               // Head off at the pass -- if not logged in, can't show profile.
               if (this.error) {
                  this.renderError();
               } else if (Session.isLoggedIn()) {

                  this.places.title.html(this.renderTemplate('authorized_title'));
                  this.places.content.html(this.renderTemplate('authorized'));
               } else {
                  // no profile, no basic aaccount info
                  this.places.title.html(this.widgetTitle);
                  this.places.content.html(this.renderTemplate('unauthorized'));
               }
               return this;
            }
         }
         


      });

      return Widget;
   });