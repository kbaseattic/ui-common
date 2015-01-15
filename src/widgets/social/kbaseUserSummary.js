define(['kbasesocialwidget', 'kbaseuserprofileserviceclient', 'kbasesession'], 
function (SocialWidget, UserProfileService, Session) {
  "use strict";
  var widget = Object.create(SocialWidget, {
      init: {
        value: function (cfg) {
          cfg.name = 'UserSummary';
          cfg.title = 'User Summary';
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
      
      createTemplateContext: {
        value: function () {
          var session = Session.getSession();
          var context = {
            session: {
              isLoggedIn: session.isLoggedIn(),
              isReady: session.isReady(),
              username: session.getUsername()
            }
          }
          return context;
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
      }
      
  });
    
  return widget;
});