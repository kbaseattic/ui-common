define(['jquery', 'nunjucks', 'kbasesocialwidget', 'kb.client.methods', 'kbc_UserProfile', 'kbasesession', 'kbaseutils', 'q', 'underscore'],
   function ($, nunjucks, SocialWidget, ClientMethods, UserProfileService, Session, Utils, Q, _) {
      "use strict";
      var Widget = Object.create(SocialWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'CommonCollaboratorNetwork';
               cfg.title = 'Common Collaborator Network';
               this.SocialWidget_init(cfg);

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
               // Set up workspace client
               
               this.clientMethods = Object.create(ClientMethods).init();
               
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

         setInitialState: {
            value: function (options) {
               return Q.Promise(function (resolve, reject, notify) {
                  // console.log(this.initConfig);

                  if (!Session.isLoggedIn()) {
                     resolve();
                  } else {
                     Utils.promise(this.userProfileClient, 'get_user_profile', [this.params.userId])
                        .then(function (data) {
                           if (data && data[0]) {
                              this.setState('currentUserProfile', data[0], false);
                              this.clientMethods.getCollaborators({
                                 users: [this.getParam('userId')]
                              })
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