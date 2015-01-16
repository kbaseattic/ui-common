define(['jquery', 'q'], function ($, Q) {
  var Session = Object.create({}, {
    
    init: {
      value: function (cfg) {
        this.importSession();
        return this;
      }
    }, 
    
    importSession: {
      value: function () {
        var sessionName = 'kbase_session';
        var sessionCookie = $.cookie(sessionName);
        // console.log(sessionCookie);
        if (!sessionCookie) {
          this.isAuthenticated = false;
        } else {
          this.sessionObject = this.validateSession(this.decodeSessionString(sessionCookie))
          if (this.sessionObject) {
            this.isAuthenticated = true;
          } else {
            this.isAuthenticated = false;
          }
        }
        this.isSessionProcessed = true;      
      }
    },
    
    // This may need to be called during auth state changes, e.g. 
    // a login widget.
    refreshSession: {
      value: function () {
        this.isSessionProcessed = false;
        this.importSession();
      }
    },
    
    getSession: {
      value: function () {
        if (!this.isSessionProcessed) {
          this.importSession();
        }
        return this;
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
    
    decodeSessionString: {
      value: function (s) {
        var session = this.decodeToken(s);
        session.token = session.token.replace(/PIPESIGN/g, '|').replace(/EQUALSSIGN/g, '=');
        session.tokenObject = this.decodeToken(session.token);
        return session;
      }
    },
    
    validateSession: {
      value: function (sessionObject) {
        if (!sessionObject) {
          return false;
        }
        if (this.hasExpired(sessionObject)) {
          return false;
        }
        return true;
      }
    },
    
    hasExpired : {
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
          console.log(diff);
          if (diff <= 0) {
            return true;
          } else {
            return false;
          }
        }
    },
    
    isSessionProcessed: {
      value: false,
      writable: true, 
    },
    
    isAuthenticated: {
      value: null,
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
     
    getUsername: {
      value: function () {
        if (this.isAuthenticated) {
          return this.sessionObject.un;
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
          
    getProp: {
      value: function (name) {
         var session = this.getSession();
         return session[name];
       }
     }
  });
  
  return Session.init();
})