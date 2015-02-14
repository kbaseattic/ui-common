/*

    KBase Bootstrap plugin to handle all login/session related stuff.

    Set up a container on your HTML page. It can be whatever you'd like. For example.

    <div id = 'fizzlefazzle'></div>

    You don't need to give it that ID. I just populated it with junk because I don't want to
    encourage people to use something generic like 'login', since there's no need. You don't need
    an ID at all, just some way to select it.

    Later, in your jquery initialization, do this:

    $(function() {
        ...

        $(#"fizzlefaszzle").login();

    }

    And that, my friends, is Jenga. You're done. Sit back and enjoy the fruits of your labor.

    There are a couple of useful things to know about. You can extract the user_id and kbase_sessionid:

        $(#"fizzlefazzle").login('session', 'user_id');
        $(#"fizzlefazzle").login('session', 'kbase_sessionid');

    When you're setting it up, you have a few options:

    $('#fizzlefazzle').login(
        {
            style : (button|slim|micro|hidden) // try 'em all out! button is the default.
            loginURL : the URL we're logging into
            login_callback : a function to be called upon login, success or failure. Gets an args hash  (user_id, kbase_sessionid)
            logout_callback : a function to be called upon logout, gets no args
            prior_login_callback : a function to be called upon loading a page, if the user was already logged in. Gets an args hash (user_id, kbase_sessionid)
            user_id : a string with which to pre-populate the user_id on the forms.
        }
    );

    You can also completely inline it.

        var $login_doodad = $('<span></span>').login({style : 'hidden'});
        $login_doodad.login('login', 'username', 'password', function (args) {
            console.log("Tried to log in and got back: "); console.log(args);
        });

*/

(function($) {
  'use strict';
  $.KBWidget({

    name: "kbaseLogin",

    version: "1.1.0",
    options: {
      style: 'text',
      //loginURL : "http://140.221.92.231/services/authorization/Sessions/Login",
      loginURL: "https://kbase.us/services/authorization/Sessions/Login",
      possibleFields: ['verified', 'name', 'opt_in', 'kbase_sessionid', 'token', 'groups', 'user_id', 'email', 'system_admin'],
      fields: ['name', 'kbase_sessionid', 'user_id', 'token']
    },

    cookieName: 'kbase_session',
    narrCookieName: 'kbase_narr_session',

    sessionObject: null,
    userProfile: null,
    
    init: function(options) {
      this._super(options);

      // SYNC WARNING
      // There may be parts of the systCopaem which rely on the sycnronous loading characterstics of 
      // this plugin. Specifically, it has traditionally loaded early in the index page, so the 
      // session information is available to code which loads later.
      // Most of the session logic is now in kbaseSession.js, which is asynchronous in nature 
      // (requirejs loaded). However, there is a small version of the session code in kbaseSessionSync.js
      // which should be loaded towards the top of the index file, certainly before this one.
      // syncronously load the session.
      
      // Initial load of the session is through the synchronous kbase session sync object.
      // This object is compatible with the full kbase session object, but is loaded 
      // at index load time and so available here.
      // We use it for the initial state, but after that all other session interactions
      // are asynchronous, and session state is communicated via jquery messages.
      // The session object will either be the authenticated session object or null.
      this.sessionObject = $.KBaseSessionSync.getKBaseSession();
      
 
      // Select which version of the widget to show.
      // NB this widget just shows one state per instantiation -- 
      // the login form when the session is unauthenticated.
      this.$elem.empty();
      var style = '_' + this.options.style + 'Style';
      this[style](function (content) {
        if (content !== null) {
          this.$elem.html(content);
        }
        this.afterInit();
      }.bind(this));
      //if (this.ui) {
      //    this.$elem.append(this.ui);
      //  }
      // console.log('DONE?'); 

      return this;
    },
    
    afterInit: function () {
      // EVENT LISTENERS
      
      // These need to go after the element is built, but before session is 
      // set up below, because the widget may need to respond to login and profile events.
      postal.channel('session').subscribe('profile.loaded', function(data) {
      // $(document).on('profileLoaded.kbase', function(e, profile) {
        var profile = data.profile;
        this.profile = data.profile;
        this.userProfile = profile.getProfile();
        // NB: KB widgets "rewire" ids -- tranform ids into data- attributes.
        this.$elem.find('[data-element="user-label"]').html(this.get_user_label());
        var url = profile.getAvatarURL({size: 40, rating: 'pg'});
        this.$elem.find('[data-element="avatar"]').attr('src', url);
      }.bind(this));
       
      postal.channel('session').subscribe('profile.saved', function(data) {
         this.fetchUserProfile();
      }.bind(this));
      
      postal.channel('session').subscribe('profile.get', function (data, envelope) {
        envelope.reply(null, this.profile);
        
      }.bind(this));
      
      postal.channel('session').subscribe('login.success', function (data) {
        var session = data.session;
      // $(document).on('loggedIn.kbase', function(e, session) {
        this.sessionObject = session;
        this.$elem.find('[data-element="user-label"]').html(this.get_user_label());
        this.fetchUserProfile();
      }.bind(this));
      
      postal.channel('session').subscribe('logout.success', function() {
      // $(document).on('loggedOut.kbase', function(e) {
        this.sessionObject = null;
        var elem = this.$elem;
        require(['kb.widget.login'], function (LoginWidget) {
          try {
            var w = LoginWidget.init({
              container: elem,
              name: 'LoginWidget',
              title: 'Login Widget'
            });
            w.render();
          } catch (e) {
            console.log('Error');
            console.log(e);
          }
        });
      }.bind(this));
      
      //return;
      if (this.sessionObject) {
        this.fetchUserProfile();
      }
      
      if (this.sessionObject) {
        if (this.registerLogin) {
          this.registerLogin();
        }
      
        if (this.options.prior_login_callback) {
          this.options.prior_login_callback.call(this, sessionObject);
        }
        
        // Funny, loggedIn called when the session is loaded/
        // TODO: this should be something like sessionLoaded or sessionAvailable
        //this.trigger('loggedIn', this.sessionObject);
      }
      
      /*
      TODO: are these used anywwhere?????
      postal.channel('session').subscribe('login.query', function (data) {
        //$(document).on('loggedInQuery.kbase', $.proxy(function(e, callback) {
          if (callback) {
            callback(this.sessionObject);
          }
        }, this)
      );
     
       */
      
      postal.channel('loginwidget').subscribe('login.prompt', function (data) {
      // TODO: is this used anywhere?
        //if (args && args.user_id) {
        //    this.data('passed_user_id', args.user_id);
        //  }
        this.openDialog();
      }.bind(this));
      

      postal.channel('session').subscribe('logout.request', function (data) {
          this.logout();
        }.bind(this));
      
      /*
      // Finally listen for user activity in order to tickle the session.
      // But only tickle at the most every 5 seconds.
      
      var activity = false;
      $(document).on('mousemove keydown', function (e) {
        activity = true;       
      }.bind(this));
      
      var checkInterval  = 5000;
      window.setInterval(function (e) {
        if (activity) {
          activity = false;
          console.log('tickling at ' + (new Date()).getTime());
          this.tickleSession();
        }
      }.bind(this), checkInterval);
      */
    },

    get_kbase_cookie: function(field) {
      if (this.sessionObject) {
        return this.get_session_prop(field);
      }
    },

    is_authenticated: function() {
      // Use the presence of the primary cookie as the flag for
      // authenticated.

      if (!this.get_session()) {
        // ensure that all traces of authentication are removed.
        $.KBaseSessionSync.removeAuth();
        return false;
      } else {
        return true;
      }
    },

    get_session: function(options) {
      return this.sessionObject;
    },
    
    get_prop: function(obj, propName, defaultValue) {
      var props = propName.split('.');
      for (var i = 0; i < props.length; i++) {
        var key = props[i];
        if (obj[key] === undefined) {
          return defaultValue;
        } else {
          obj = obj[key];
        }
      }
      return obj;
    },

    get_session_prop: function(propName, defaultValue) {
      if (this.sessionObject) {
        return this.get_prop(this.sessionObject, propName, defaultValue);
      } else {
        return defaultValue;
      }
    },
    
    // NB: require for compatability with old code.
    session: function (propName) {
      if (propName === undefined) {
        return this.sessionObject;
      } else {
        return this.get_session_prop(propName);
      }
    },
    
    get_profile_prop: function(propName, defaultValue) {
      if (this.userProfile) {
        return this.get_prop(this.userProfile, propName, defaultValue);
      } else {
        return defaultValue;
      }
    },

    sessionId: function() {
      return this.get_session_prop('kbase_sessionid');
    },

    token: function() {
      return this.get_session_prop('token');
    },

   
    
    tickleSession: function () {
      require(['kb.session'], function (Session) {
        Session.setAuthCookie();
      })
    },

    registerLoginFunc: function() {
      return this.registerLogin
    },
    specificLogoutFunc: function() {
      return this.specificLogout
    },

    populateLoginInfo: function(args) {
      if (this.sessionObject) {
        // this.data('_session', this.sessionObject);
        this._error = null;
      } else {
        // this.data('_session', null);
        this._error = args.message;
      }
    },

    /* session : function(key, value) {

            if (!this.data('_session')) {
                this.data('_session', {});
            }

            var session = this.data('_session');

            if (arguments.length == 2) {
                session[key] = value;
            }

            if (arguments.length > 0) {
                return session[key];
            }
            else {
                return session;
            }
        },
          */

    error: function(new_error) {
      if (new_error) {
        this._error = new_error;
      }
      return this._error;
    },

    get_user_label: function() {
      if (this.userProfile) {
        return this.get_profile_prop('user.realname') + '<br><i style="font-size=90%;">' + this.get_profile_prop('user.username') + '</i>';
      } else if (this.sessionObject) {
        return this.get_session_prop('user_id');
      } else {
        return '';
      }
    },

    openDialog: function() {
      if (this.data('loginDialog')) {
        var $ld = this.data('loginDialog');
        $('form', $ld.dialogModal()).get(0).reset();
        var userId = this.get_session_prop('user_id') || this.data('passed_user_id') || this.options.user_id;
        $ld.dialogModal().data("user_id").val(userId);
        delete this.options.user_id;
        // this.session('user_id',undefined);
        $ld.dialogModal().trigger('clearMessages.kbase');
        this.data('loginDialog').openPrompt();
      }
    },

    _textStyle: function(callback) {
      // console.log('in text style');
      this._createLoginDialog();

      // this.$elem.css('padding', '9px 15px 7px 10px');
      
      var elem = this.$elem;
      require(['kb.widget.login'], function (LoginWidget) {
        try {
          var w = LoginWidget.init({
            container: elem,
            name: 'LoginWidget',
            title: 'Login Widget'
          });
          w.render();
          callback(null);
        } catch (e) {
          console.log('Error');
          console.log(e);
        }
      });
      
      // this._rewireIds($prompt, this);

      this.registerLogin = function(args) {
        if (this.sessionObject) {
          //this.data("loginlink").hide();
          //this.data('loggedinuser_id').html(this.get_user_label());
          //this.data("userdisplay").show();
          this.data('loginDialog').closePrompt();
        } else {
          this.data('loginDialog').dialogModal().trigger('error.kbase', args.message);
        }
      };

      this.specificLogout = function(args) {
        //this.data("userdisplay").hide();
        // this.data("loginlink").show();
      };

  

    },

    _hiddenStyle: function() {
      this._createLoginDialog();
      this.registerLogin = function(args) {
        if (args.success) {
          this.data('loginDialog').closePrompt();
        } else {
          this.data('loginDialog').dialogModal().trigger('error.kbase', args.message);
        }
      };

      return undefined;
    },

   
    _createLoginDialog: function() {

      var $elem = this.$elem;

      var $ld = $('<div></div').kbasePrompt({
        title: 'Login to KBase',
        controls: [
          'cancelButton', {
            name: 'Login',
            type: 'primary',
            id: 'loginbutton',
            callback: $.proxy(function(e) {
              var user_id = this.data('loginDialog').dialogModal().data('user_id').val();
              var password = this.data('loginDialog').dialogModal().data('password').val();

              this.data('loginDialog').dialogModal().trigger('message.kbase', user_id);
              this.login(user_id, password, function(args) {

                if (this.registerLogin) {
                  this.registerLogin(args);
                }
                if (this.options.login_callback) {
                  this.options.login_callback.call(this, args);
                }
              }.bind(this));

            }, this)
          }
        ],
        body: $('<p></p>')
          .append(
            $('<form></form>')
            .attr('name', 'form')
            .attr('id', 'form')
            .addClass('form-horizontal')
            .append(
              $('<fieldset></fieldset>')
              .append(
                $('<div></div>')
                .attr('class', 'alert alert-error')
                .attr('id', 'error')
                .attr('style', 'display : none')
                .append(
                  $('<div></div>')
                  .append(
                    $('<div></div>')
                    .addClass('pull-left')
                    .append(
                      $('<i></i>')
                      .addClass('icon-warning-sign')
                      .attr('style', 'float: left; margin-right: .3em;')
                    )
                  )
                  .append(
                    $('<div></div>')
                    .append(
                      $('<strong></strong>')
                      .append('Error:\n')
                    )
                    .append(
                      $('<span></span>')
                      .attr('id', 'errormsg')
                    )
                  )
                )
              )
              .append(
                $('<div></div>')
                .attr('class', 'alert alert-success')
                .attr('id', 'pending')
                .attr('style', 'display : none')
                .append(
                  $('<div></div>')
                  /*.append(
                                                                $('<div></div>')
                                                                    .addClass('pull-left')
                                                                    .append(
                                                                        $('<i></i>')
                                                                            .addClass('icon-info-sign')
                                                                            .attr('style', 'float: left; margin-right: .3em;')
                                                                    )
                                                            )*/
                  .append(
                    $('<div></div>')
                    .append(
                      $('<strong></strong>')
                      .append('Logging in as:\n')
                    )
                    .append(
                      $('<span></span>')
                      .attr('id', 'pendinguser')
                    )
                  )
                )
              )
              .append(
                $('<div></div>')
                .attr('class', 'form-group')
                .append(
                  $('<label></label>')
                  .addClass('control-label')
                  .addClass('col-lg-2')
                  .attr('for', 'user_id')
                  .css('margin-right', '10px')
                  .append('Username:\n')
                )
                .append(
                  $.jqElem('div')
                  .addClass('col-lg-9')
                  .append(
                    $('<input>')
                    .addClass('form-control')
                    .attr('type', 'text')
                    .attr('name', 'user_id')
                    .attr('id', 'user_id')
                    .attr('size', '20')
                  )
                )
              )
              .append(
                $('<div></div>')
                .attr('class', 'form-group')
                .append(
                  $('<label></label>')
                  .addClass('control-label')
                  .addClass('col-lg-2')
                  .attr('for', 'password')
                  .css('margin-right', '10px')
                  .append('Password:\n')
                )
                .append(
                  $.jqElem('div')
                  .addClass('col-lg-9')
                  .append(
                    $('<input>')
                    .addClass('form-control')
                    .attr('type', 'password')
                    .attr('name', 'password')
                    .attr('id', 'password')
                    .attr('size', '20')
                  )
                )
              )
            )
        ), //body
        footer: $('<span></span')
          .append(
            $('<a></a>')
            .attr('href', 'https://gologin.kbase.us/ResetPassword')
            .attr('target', '_blank')
            .text('Forgot password?')
        )
          .append('&nbsp;|&nbsp;')
          .append(
            $('<a></a>')
            .attr('href', ' https://gologin.kbase.us/OAuth?response_type=code&step=SignUp&redirect_uri=' + encodeURIComponent(location.href))
            .attr('target', '_blank')
            .text('Sign up')
        ),
      });

      this._rewireIds($ld.dialogModal(), $ld.dialogModal());

      this.data('loginDialog', $ld);

      $ld.dialogModal().bind('error',
        function(event, msg) {
          $(this).trigger('clearMessages.kbase');
          $(this).data("error").show();
          $(this).data("errormsg").html(msg);
        }
      );

      $ld.dialogModal().bind('message',
        function(event, msg) {
          $(this).trigger('clearMessages.kbase');
          $(this).data("pending").show();
          $(this).data("pendinguser").html(msg);
        }
      );

      $ld.dialogModal().bind('clearMessages',
        function(event) {
          $(this).data("error").hide();
          $(this).data("pending").hide();
        }
      );

      $ld.dialogModal().on('shown.bs.modal',
        function(e) {

          if ($(this).data('user_id').val().length == 0) {
            $(this).data('user_id').focus();
          } else {
            $(this).data('password').focus();
          }
        }
      );
      return $ld;
    },
    
    fetchUserProfile: function () {
      require(['kb.user_profile', 'kb.session', 'kb.appstate'], 
      function(UserProfile, Session, AppState) {
        var userProfile = Object.create(UserProfile).init({username: Session.getUsername()});
        userProfile.loadProfile()
        .then(function(profile) {
          switch (profile.getProfileStatus()) {
            case 'stub':
            case 'profile':
              AppState.setItem('userprofile', profile);
              postal.channel('session').publish('profile.loaded', {profile: profile});
              break;
            case 'none':
              profile.createStubProfile({createdBy: 'session'})
              .then(function(profile) {
                AppState.setItem('userprofile', profile);
                postal.channel('session').publish('profile.loaded', {profile: profile});
              })
              .catch (function(err) {
                postal.channel('session').publish('profile.loadfailure', {message: err});
              })
              .done();
              break;
          }
        })
        .catch (function(err) {
          var errMsg = 'Error getting user profile';
          postal.channel('session').publish('profile.loadfailure', {message: err});
        })
        .done();
      });
    },
    
    login: function(user_id, password, callback) {
      require(['kb.session', 'q'], function(Session, Q) {
        Session.login({
          username: user_id,
          password: password,
          success: function(session) {
            // omg this is the callback protocol 
            session.status = 1;
            session.success = 1;
            this.populateLoginInfo(session);
            
            // Awaiting clients can get the session object directly, from the cookie, or query the 
            // global singleton session object.
            postal.channel('session').publish('login.success', {session: session});
            
            if (callback) {
              callback.call(this, session);
            }
          }.bind(this),
          error: function(err) {
            var errObject = {
              status: 0,
              success: 0,
              message: err
            };
            this.populateLoginInfo(errObject);
            postal.channel('session').publish('login.failure', {error: errObject});
           
            if (callback) {
              callback.call(this, errObject);
            }
          }.bind(this)
        });
      }.bind(this));
    },

    logout: function(rePrompt) {
      require(['kb.session'], function (Session) {
        Session.removeAuth();

        // the rest of this is just housekeeping.
        if (this.specificLogout) {
          this.specificLogout();
        }

        this.populateLoginInfo();

        //automatically prompt to log in again
        // rePrompt = false;
        // defaults to true; originally this was always set to false...
        // because I think it was disabled.
        // heck, just comment this out.
        /*
        rePrompt = false;
        if (rePrompt === undefined) {
          rePrompt = true;
        } else {
          rePrompt;
        }
        if (this.data('loginDialog') != undefined && rePrompt) {
          this.openDialog();
        }
        */

        postal.channel('session').publish('logout.success');
        // this.trigger('loggedOut.kbase');
        
        // need this?
        //if (this.options.logout_callback) {
        //  this.options.logout_callback.call(this);
        //}
      }.bind(this));
    }

  });

}(jQuery));
