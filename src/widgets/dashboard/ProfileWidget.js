define(['kb.widget.dashboard.base', 'kb.user_profile', 'kb.client.user_profile', 'kb.session', 'kb.appstate', 'kb.utils', 'q'],
   function (DashboardWidget, UserProfile, UserProfileService, Session, AppState, Utils, Q) {
      "use strict";
      var widget = Object.create(DashboardWidget, {
         init: {
            value: function (cfg) {
               cfg.name = 'ProfileWidget';
               cfg.title = 'Your Profile';
               this.DashboardWidget_init(cfg);

               return this;
            }
         },

         go: {
            value: function () {
               this.start();
               
               // NB: this uses the old original state-on-object rather than
               // the set/get/has state mechanism that most like-minded
               // widgets use.
               AppState.listenForItem('userprofile', function (profile) {
                  this.userProfile = profile;
                  this.refresh();
               }.bind(this));
               
               return this;
            }
         },

         setup: {
            value: function () {
               // User profile service
               //if (Session.isLoggedIn()) { 

               //  throw 'I only work when YOU are logged in';
               // }
               return true;
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
               return Q.Promise(function (resolve, reject, notify) {
                  AppState.whenItem('userprofile')
                  .then(function(profile) {
                     this.userProfile = profile;
                     resolve();
                  }.bind(this))
                  .catch(function (err) {
                     reject(err);
                  })
                  .done();
                  
               }.bind(this));
            }
         },

         createTemplateContext: {
            value: function () {
               // NB: the guard for userProfile presence below is only necessary
               // because there is a problem with widget startup -- in which a refresh
               // can be issued by setting a param, config, state, and the profile will
               // not have been populated yet because it is async too, and slower.
               // So we need to have some better control over widget state,
               // e.g. to avoid rendering when in an invalid state.
               if (Session.isLoggedIn() && this.userProfile) {
                  return Utils.merge(Utils.merge({}, this.context), {
                     env: {
                        lists: this.lists,
                        isOwner: this.isOwner(),
                        profileCompletion: this.calcProfileCompletion()
                     },
                     userRecord: this.userProfile.userRecord
                  });
               } else {
                  return Utils.merge(Utils.merge({}, this.context), {
                     env: {
                        profileCompletion: 'notloggedin'
                     }
                  });

               }
            }
         },

         xcreateTemplateContext: {
            value: function () {
               var context = {
                  session: {
                     isLoggedIn: Session.isLoggedIn(),
                     isReady: Session.isReady(),
                     username: Session.getUsername()
                  }
               }
               return context;
            }
         },

         calcProfileCompletion: {
            value: function () {
               if (Session.isLoggedIn()) {
                  var completion = this.userProfile.calcProfileCompletion();
                  var lastSave = this.userProfile.nthHistory(1);
                  if (completion.status === 'complete' && (!lastSave || (lastSave && lastSave.completionStatus === completion.status))) {
                     return null;
                  } else {
                     return completion;
                  }
               } else {
                  return 'notloggedin';
               }
            }
         },
         getProfileStatus: {
            value: function () {
               if (Session.isLoggedIn()) {
                  if (this.userProfile) {
                     return this.userProfile.getProfileStatus();
                  } else {
                     return 'none';
                  }
               } else {
                  return 'notloggedin';
               }
            }
         },

         render: {
            value: function () {
               // Generate initial view based on the current state of this widget.
               // Head off at the pass -- if not logged in, can't show profile.
               var state = this.getProfileStatus();
               switch (state) {
               case 'notloggedin':
                  // NOT LOGGED IN
                  this.renderLayout();
                  this.places.title.html('Unauthorized');
                  this.places.content.html(this.renderTemplate('unauthorized'));
                  break;
               case 'profile':
                  // NORMAL PROFILE 
                  // Title can be be based on logged in user infor or the profile.
                  // set window title.
                  this.renderLayout();
                  this.places.title.html(this.widgetTitle);

                  // this.places.title.html('You - ' + this.userProfile.getProp('user.realname') + ' (' + this.userProfile.getProp('user.username') + ')');
                  this.places.content.html(this.renderTemplate('view'));
                  break;
               case 'stub':
                  // STUB PROFILE
                  // Title can be be based on logged in user infor or the profile.
                  var realname = this.userProfile.getProp('user.realname');
                  this.renderLayout();
                  this.renderMessages();
                  this.places.title.html(this.widgetTitle);
                  // this.places.title.html(this.userProfile.getProp('user.realname') + ' (' + this.userProfile.getProp('user.username') + ')');
                  this.places.content.html(this.renderTemplate('stub_profile'));
                  break;
               case 'error':
                  this.renderLayout();
                  this.renderErrorView('Profile is in error state');
                  break;
               case 'none':
                  // NOT FOUND
                  // no profile, no basic aaccount info
                  this.renderLayout();
                  this.places.title.html('User Not Found');
                  this.places.content.html(this.renderTemplate('no_user'));
                  break;
               default:
                  this.renderLayout();
                  this.renderErrorView('Invalid profile state "' + state + '"')
               }
               this.renderMessages();
               return this;
            }
         }
      });

      return widget;
   });