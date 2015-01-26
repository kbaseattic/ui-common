define(['kbasebasewidget', 'kbasesession', 'jquery', 'postal'], function (BaseWidget, Session, $, Postal) {
  // make a widget ... on the fly?
  var W = Object.create(BaseWidget, {
    init: {
      value: function(cfg) {
        cfg.name = 'LoginWidget';
        cfg.title = 'Login Widget';      
        this.BaseWidget_init(cfg);
        
        return this;
      }
    },
    createTemplateContext: {
      value: function () {
        return {
          isLoggedIn: Session.isLoggedIn(),
          username: Session.getUsername(),
          realname: Session.getRealname()
        }
      }
    }, 
    renderx: {
      value: function() {
        // Generate initial view based on the current state of this widget.
        // Head off at the pass -- if not logged in, can't show profile.
        throw 'Where am I being called from?';
        if (this.error) {
          this.renderError();
        } else if (Session.isLoggedIn()) {
          this.container.html(this.renderTemplate('loggedin'));
        } else {
          // no profile, no basic aaccount info
          this.container.html(this.renderTemplate('loggedout'));
        }
        return this;
      }
    },
    
    render: {
      value: function () {
        if (Session.isLoggedIn()) {
          this.container.html(this.renderTemplate('loggedin'));
          this.container.find('[data-menu-item="logout"]').on('click', function (e) {
            e.preventDefault();
            Postal.channel('session').publish('logout.request');
            // $(this).trigger('logout.kbase');
          });
        } else {
          this.container.html(this.renderTemplate('loggedout'));
          this.container.find('[data-menu-item="signin"]').on('click', function (e) {
            e.preventDefault();
            Postal.channel('loginwidget').publish('login.prompt');
            // $(this).trigger('promptForLogin.kbase');
          });
        }
        return this;
      }
    }
  });
  return W;
});