define(['dashboard_widget', 'kbaseuserprofile', 'kbaseuserprofileserviceclient', 'kbasesession', 'kbaseutils', 'q'], 
function (DashboardWidget, UserProfile, UserProfileService, Session, Utils, Q) {
  "use strict";
  var widget = Object.create(DashboardWidget, {
      init: {
        value: function (cfg) {
          cfg.name = 'ProfileWidget';
          cfg.title = 'Your Profile';
          this.DashboardWidget_init(cfg);
          
          
          this.templates.env.addFilter('roleLabel', function(role) {
            if (this.listMaps['userRoles'][role]) {
              return this.listMaps['userRoles'][role].label;
            } else {
              return role;
            }
          }.bind(this));
          this.templates.env.addFilter('userClassLabel', function(userClass) {
            if (this.listMaps['userClasses'][userClass]) {
              return this.listMaps['userClasses'][userClass].label;
            } else {
              return userClass;
            }
          }.bind(this));
          this.templates.env.addFilter('titleLabel', function(title) {
            if (this.listMaps['userTitles'][title]) {
              return this.listMaps['userTitles'][title].label;
            } else {
              return title;
            }
          }.bind(this));
          // create a gravatar-url out of an email address and a 
          // default option.
          this.templates.env.addFilter('gravatar', function(email, size, rating, gdefault) {
            // TODO: http/https.
            return UserProfile.makeGravatarURL(email, size, rating, gdefault);
          }.bind(this));
          this.templates.env.addFilter('kbmarkup', function(s) {
            s = s.replace(/\n/g, '<br>');
            return s;
          });
        
          
          return this;
        }
      },
      
      go: {
        value: function () {
          console.log('go...');
          this.start();
          console.log('started...');
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
          value: function() {
              this.container.html(this.renderTemplate('layout'));
              this.places = {
              	title: this.container.find('[data-placeholder="title"]'),
                alert: this.container.find('[data-placeholder="alert"]'),
              	content: this.container.find('[data-placeholder="content"]')
              };
          
            }
      },
      
      setInitialState: {
        value: function(options) {
          // TODO: We might be able to rely on the profile loaded with the page.
          // But for now, be independent.
          return Q.Promise(function (resolve, reject, notify) {
            // this.resetState();
            if (!Session.isLoggedIn()) {
              // We don't even try to get the profile if the user isn't 
              // logged in.
              this.userProfile = null;
              resolve();
            } else {
              console.log('getting user profile...');
              console.log(Session.getUsername());
              this.userProfile = Object.create(UserProfile).init({username: Session.getUsername()}); 
              this.userProfile.loadProfile()
              .then(function(found) {
                console.log('got it...');
                resolve();
              })
              .catch (function(err) {
                console.log('[UserProfile.sync] Error getting user profile.');
                console.log(err);
                reject(err);
              })
              .done();
            }
          }.bind(this));
        }
      },
      
      createTemplateContext: {
        value: function() {
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
            var completion =  this.userProfile.calcProfileCompletion();
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
        value: function() {
          if (Session.isLoggedIn()) {
            return this.userProfile.getProfileStatus();
          } else {
            return 'notloggedin';
          }
        }
      },
      
      render: {
        value: function() {
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
              this.places.title.html('You - ' + this.userProfile.getProp('user.realname') + ' (' + this.userProfile.getProp('user.username') + ')');
              this.places.content.html(this.renderTemplate('view'));
              break;
            case 'stub':
              // STUB PROFILE
              // Title can be be based on logged in user infor or the profile.
              var realname = this.userProfile.getProp('user.realname');
              this.renderLayout();
              this.renderMessages();
              this.places.title.html(this.userProfile.getProp('user.realname') + ' (' + this.userProfile.getProp('user.username') + ')');
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