define(['jquery', 'q', 'kb.user_profile', 'kb.cookie', 'kb.config'], 
function ($, Q, UserProfile, Cookie, Config) {
  'use strict';
  var Session = Object.create({}, {
    init: {
      value: function (cfg) {
        this.sessionObject = undefined;
        //try {
          this.setSession(this.importSessionFromCookie());
          //} catch (ex) {
        //  console.log('EX importing session');
        //  console.log(ex);
        //}
        //console.log('in session init');
        return this;
      }
    },
    
    cookieName: {
      value: 'kbase_session'
    },
    narrCookieName: {
      value: 'kbase_narr_session'
    },
    
    setSession: {
      value: function (obj) {
        if (this.validateSession(obj)) {
          this.sessionObject = obj;
          this.isAuthenticated = true;
        } else {
          this.sessionObject = null;
          this.isAuthenticated = false;
        }
      }
    },
    
    importSessionFromCookie: {
      value: function () {
        var sessionCookie = Cookie.getItem(this.cookieName);
        // var sessionCookie = $.cookie(sessionName);
        if (!sessionCookie) {
          return null;
        }
        // first pass just break out the string into fields.
        var session = this.decodeToken(sessionCookie);
        
        if (! (session.kbase_sessionid && session.un && session.user_id && session.token) ) {
          this.removeAuth();
          return null;
        }
        
        session.token = session.token.replace(/PIPESIGN/g, '|').replace(/EQUALSSIGN/g, '=');

        // now we have a session object equivalent to the one returned by the auth service.
        
        var newSession = {
          username: session.user_id,
          token: session.token,
          tokenObject: this.decodeToken(session.token),
          sessionId: session.kbase_sessionid
        };
        
        if (this.validateSession(newSession)) {
          return newSession;
        } else {
          return null;
        }
      }
    },
    
    importSessionFromAuthObject: {
      value: function (kbaseSession) {
        // Auth object has fields un, user_id, kbase_sessionid, token. If any are missing, we void the session (if any)
        // cookies and pretend we have nothing.
        // NB: the objec returned from the auth service does NOT have the un field.
        if (! (kbaseSession.kbase_sessionid && kbaseSession.user_id && kbaseSession.token) ) {
          // throw new Error('Invalid Kbase Session Cookie');
          this.removeAuth();
          return null;
        }
        var newSession = {
          username: kbaseSession.user_id,
          token: kbaseSession.token,
          tokenObject: this.decodeToken(kbaseSession.token),
          sessionId: kbaseSession.kbase_sessionid
        };
        
        if (this.validateSession(newSession)) {
          return newSession;
        } else {
          return null;
        }
      }
    },
    
    // This may need to be called during auth state changes, e.g. 
    // a login widget.
    refreshSession: {
      value: function () {
        this.setSession(this.importSessionFromCookie());
      }
    },
    
    getSession: {
      value: function () {
        if (this.sessionObject === undefined) {
          this.setSession(this.importSessionFromCookie());
        }
        return this;
      }
    },
    
    getKBaseSession: {
      value: function () {
        var session = this.getSession();
        if (!session) {
          return null;
        }
        return {
          un: session.username,
          user_id: session.username,
          token: session.token,
          kbase_sessionid: session.sessionId
        }
      }
    },
        
    decodeToken: {
      value: function (token) {
        var parts = token.split('|');
        var map = {};
        for (var i=0; i<parts.length; i++) {
          var fieldParts = parts[i].split('=');
          var key = fieldParts[0];
          var value = fieldParts[1];
          map[key] = value;
        }
        return map;
      }
    },
    
    validateSession: {
      value: function (sessionObject) {
        if (sessionObject === undefined) {
          sessionObject = this.sessionObject;
        }
        if (!sessionObject) {
          return false;
        }
        
        if (! (sessionObject.sessionId && sessionObject.username && sessionObject.token && sessionObject.tokenObject) ) {
          return false;
        }
      
        if (this.hasExpired(sessionObject)) {
          return false;
        }
        return true;
      }
    },
    
    hasExpired: {
      value: function (sessionObject) {          
          var expirySec = sessionObject.tokenObject.expiry;
          if (!expirySec) {
            return false;
          }
          expirySec = parseInt(expirySec);
          if (isNaN(expirySec)) {
            return false;
          }
          var expiryDate = new Date(expirySec*1000);
          var diff = expiryDate - new Date();
          if (diff <= 0) {
            return true;
          } else {
            return false;
          }
        }
    },
    
    makeAuthCookie: {
      value: function () {
        if (this.sessionObject) {
          return 'un=' + this.sessionObject.username + 
                 '|kbase_sessionid=' + this.sessionObject.sessionId +
                 '|user_id=' + this.sessionObject.username +
                 '|token=' + this.sessionObject.token.replace(/=/g, 'EQUALSSIGN').replace(/\|/g, 'PIPESIGN');
        } else {
          return null;
        }
      }
    },
    
    setAuthCookie: {
      value: function () {
        var cookieString = this.makeAuthCookie();
        Cookie.setItem(this.cookieName, cookieString, 3600, '/');
        Cookie.setItem(this.cookieName, cookieString, 3600, '/', 'kbase.us');
        Cookie.setItem(this.narrCookieName, cookieString, 3600, '/', 'kbase.us');
        
        //$.cookie(this.cookieName, cookieString, { path: '/', domain: 'kbase.us', expires: 60 });
        //$.cookie(this.cookieName, cookieString, { path: '/', expires: 60 });
        //$.cookie(this.narrCookieName, cookieString, { path: '/', domain: 'kbase.us', expires: 60 });  
      }
    },
    
    fetchProfile: {
      value: function () {
        return Q.Promise(function (resolve, reject, update) {
          Session.refreshSession();
          var userProfile = Object.create(UserProfile).init({username: this.getUsername()});
          userProfile.loadProfile()
          .then(function(profile) {
            switch (profile.getProfileStatus()) {
              case 'stub':
              case 'profile':                
                resolve(profile.getProfile());
                break;
              case 'none':
                profile.createStubProfile({createdBy: 'session'})
                .then(function(profile) {
                  resolve(profile);
                })
                .catch (function(err) {
                  reject('Error creating new stub profile');
                })
                .done();
                break;
            }
          })
          .catch (function(err) {
            var errMsg = 'Error getting user profile';
            // KBase Event Interface
            $(document).trigger('loggedInFailure', errMsg);
            reject(errMsg);
          })
          .done();
          });
        }
    },
    
    login: {
      value: function (options) {
        // Uses the options args style, with success and error callbacks.
        // The top layer of kbase widgets do not have Q available.
        
        // Validate params.
        if (!options.username || options.username.length === 0) {  
          options.error('Cannot log in without username');
          return;
        } else if (!options.password || options.password.length === 0) {
          options.error('Cannot log in without password');
          return;
        } 
        
        // NB: the cookie param determines whether the auth service will
        // set a cookie or not. The cookie set only includes un and kbase_sessionid.
        // It does not include the auth token, amazingly, which is required for all 
        // service calls.
        var loginParams = { 
          user_id : options.username, 
          password: options.password,
          cookie: 0,
          fields: 'un,token,user_id,kbase_sessionid',
          status : 1
        };
        
        $.support.cors = true;
        $.ajax({
          type: 'POST',
          url: Config.getConfig('login_url'),
          data: loginParams,
          dataType: 'json',
          crossDomain: true,
          xhrFields: { withCredentials: true },
          beforeSend : function(xhr){
             // make cross-site requests
             xhr.withCredentials = true;
          },
          success: function (data,res,jqXHR) {
            if (data.kbase_sessionid) {
              this.setSession(this.importSessionFromAuthObject(data));
              this.setAuthCookie();
              
              // Awaiting clients can get the session object directly, from the cookie, or query the 
              // global singleton session object.
              $(document).trigger('loggedIn', this.getKBaseSession());
              
              // And as if that is not enough there is even a calback.
              // Call it in a promise so that it is done after we finish up here.
              Q.Promise(function (resolve, reject, notify) {
                options.success(this.getKBaseSession());
                resolve();
              }.bind(this)).done();
              
              // And ... semi independently we will fetch the profile for this user.
              this.fetchProfile()
              .then(function (profile) {
                $(document).trigger('profileLoaded.session', this.userProfile);
              }).catch(function (err) {
                $(document).trigger('loggedInFailure', {status : 0, message : err});     
              })
              .done();
            } else {
              callback.call(this, {status : 0, message : data.error_msg});
              $(document).trigger('loggedInFailure', {status : 0, message : data.error_msg});
            }
          }.bind(this),
          error: function (jqXHR, textStatus, errorThrown) {
           /* Some error cases
           * status == 401 - show "uid/pw = wrong!" message
           * status is not 401, 
           *     and we have a responseJSON - if that's the "LoginFailure: Auth fail" error, show the same uid/pw wrong msg.
           *     and we do not have a responseJSON (or it's something else): show a generic message
           */
           var errmsg = textStatus;
           var wrongPwMsg = "Login Failed: your username/password is incorrect.";
           if (jqXHR.status && jqXHR.status === 401) {
              errmsg = wrongPwMsg;
           }  else if (jqXHR.responseJSON) {
              // if it has an error_msg field, use it
              if (jqXHR.responseJSON.error_msg) {
                  errmsg = jqXHR.responseJSON.error_msg;
              }
              // if that's the unclear auth fail message, update it
              if (errmsg === "LoginFailure: Authentication failed.") {
                  errmsg = wrongPwMg;
              }
           }
           // if we get through here and still have a useless error message, update that, too.
           if (errmsg == "error") {
              errmsg = "Error connecting to KBase login server";
          }
           this.sessionObject = null;
           this.error = {
            message: errmsg
          }
           options.error(errmsg);
          }.bind(this)
      });
     }
   },
    
    isSessionProcessed: {
      value: false,
      writable: true, 
    },
    
    isAuthenticated: {
      value: false,
      writable: true
    },
    
    sessionObject: {
      value: null,
      writable: true,
      enumberable: true,
      configurable: true
    },
    
    isReady: {
      value: function () {
        return this.isSessionProcessed;
      }
    },
    
    isLoggedIn: {
      value: function () {
        return this.isAuthenticated;
      }
    },
    
    getProp: {
      value: function (propName, defaultValue) {
        return Util.getProp(this.sessionObject, propName, defaultValue);
      }
    },
     
    getUsername: {
      value: function () {
        if (this.isAuthenticated) {
          return this.sessionObject.username;
        }
      }
    },
    
    getUserRealName: {
      value: function () {
        if (this.isAuthenticated) {
          return "Not Yet";
        }
      }
    },
    
    getAuthToken: {
      value: function () {
        if (this.isAuthenticated) {
          return this.sessionObject.token;
        }
      }
    },     
     removeAuth: {
       value: function() {
         Cookie.removeItem(this.cookieName, '/');
         Cookie.removeItem(this.cookieName, '/', 'kbase.us');
         Cookie.removeItem(this.narrCookieName, '/', 'kbase.us');
       }
     },
  });
  
  var SessionManager = Object.create({}, {
    init: {
      value: function () {
          
      }
    }
  })
  
  return Session.init();
});