define(['kbasesocialwidget', 'kbaseuserprofileserviceclient'], 
function (SocialWidget, UserProfileService) {
  
  var widget = Object.create(SocialWidget, {
    init: {
      value: function (cfg) {
        cfg.name = 'UserSearch';
        cfg.title = 'Find Other Users';
        this.SocialWidget_init(cfg);
        
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
        
        return this;
      }
    },
      
    go: {
      value: function () {
        this.start();
        return this;
      }
    },
    
    getCurrentState: {
      value: function (options) {
        options.success();
      }
    },
    
    renderLayout: {
        value: function() {
          console.log('in user search layout');
            this.container.html(this.getTemplate('layout').render(this.context));
            this.places = {
            	title: this.container.find('[data-placeholder="title"]'),
              alert: this.container.find('[data-placeholder="alert"]'),
            	content: this.container.find('[data-placeholder="content"]')
            };
            var widget = this;
            this.container.find('[data-field="search_text"] input').on('keyup', function (e) {
              widget.params.searchText = $(this).val();
              if (widget.params.searchText && widget.params.searchText.length < 3) {
                widget.refresh();
              } else {
                widget.userProfileClient.filter_users({filter: widget.params.searchText}, 
                  function (users) {
                    console.log('got users');
                    console.log(users);
                    widget.setState('searchResults', users);
                  },
                  function (err) {
                    widget.renderErrorView(err);
                  }
                );
              }
            });
        }
    }
  });  
  return widget;
});