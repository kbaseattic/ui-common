define(['jquery', 'postal', 'nunjucks', 'kb.widget.dashboard.base', 'kb.client.methods', 'kb.client.workspace', 'kb.client.user_profile', 'kb.appstate', 'kb.utils', 'kb.utils.api', 'q'],
   function ($, Postal, nunjucks, DashboardWidget, ClientMethods, WorkspaceService, UserProfileService,  AppState, Utils, APIUtils, Q) {
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

         setup: {
            value: function () {
               // Set up workspace client
               if (AppState.getItem('session').isLoggedIn()) {
                  this.clientMethods = Object.create(ClientMethods).init();
                  
                  if (this.hasConfig('user_profile_url')) {
                     this.userProfileClient = new UserProfileService(this.getConfig('user_profile_url'), {
                        token: AppState.getItem('session').getAuthToken()
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
                  if (!AppState.getItem('session').isLoggedIn()) {
                     resolve();
                  } else {
                     AppState.whenItem('userprofile')
                     .then(function (profile) {
                        this.setState('currentUserProfile', profile, false);
                        this.clientMethods.getCollaborators()
                        .then(function (collaborators) {
                           this.setState('collaborators', collaborators);
                           resolve();
                        }.bind(this))
                        .catch(function (err) {
                           reject(err);
                        });
                     }.bind(this))
                     .catch(function(err) {
											 console.log('ERROR'); console.log(err);
                        reject(err);
                     })
                     .done();   
                     
                  }
               }.bind(this));
            }
         }
      });

      return Widget;
   });