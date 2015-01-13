define(['kbasesocialwidget', 'kbaseuserprofileserviceclient'], 
function (SocialWidget, UserProfileService) {
    "use strict";
    var widget = Object.create(SocialWidget, {
      init: {
        value: function (cfg) {
          cfg.name = 'UserSummary';
          cfg.title = 'User Summary';
          this.SocialWidget_init(cfg);
        
          this.syncApp();
        
          return this;
        }
      },
      
      go: {
        value: function () {
          this.start();
          return this;
        }
      },
    
      syncApp: {
        value: function () {
          // User profile service
          if (this.isLoggedIn()) {
            if (this.hasConfig('user_profile_url')) {
              this.userProfileClient = new UserProfileService(this.getConfig('user_profile_url'), {
                  token: this.auth.authToken
              });
            } else {
  					  throw 'The user profile client url is not defined';
  				  }
          }        
        }
      },
    
      //getCurrentState: {
      //  value: function (options) {
      //    options.success();
      //  }
      //},
     
      renderLayout: {
          value: function() {
              this.container.html(this.renderTemplate('layout'));
              this.places = {
              	title: this.container.find('[data-placeholder="title"]'),
                alert: this.container.find('[data-placeholder="alert"]'),
              	content: this.container.find('[data-placeholder="content"]')
              };
          
            }
      }
      
  });
    
  return widget;
});