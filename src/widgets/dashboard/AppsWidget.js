define(['dashboard_widget', 'kbaseuserprofileserviceclient', 'kbasesession', 'kbase_narrative_method_store_client', 'q'], 
function (DashboardWidget, UserProfileService, Session, NarrativeMethodStore, Q) {
  "use strict";
  var widget = Object.create(DashboardWidget, {
      init: {
        value: function (cfg) {
          cfg.name = 'AppsWidget';
          cfg.title = 'KBase Apps';
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
             this.methodStore = new NarrativeMethodStore( {
               
             });
          }        
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
        value: function () {
          var widget = this;
          return Q.Promise(function (resolve, reject, notify) {
            if (!Session.isLoggedIn()) {
              this.setState('apps', null);
              resolve();
            } else {
              
              this.promise(this.methodStore, 'list_apps_full_info', {})
              .then(function(data) {
                  console.log(data);
                widget.setState('appList', data);
              }).
              catch(function(err) {
                console.log('ERROR');
                console.log(err);
              })
              .done();

                /*
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
            */
            }
          }.bind(this));
        }
      }
      
      
  });
    
  return widget;
});