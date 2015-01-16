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
        if (!sessionCookie) {
          this.isAuthenticated = false;
        } else {
          this.isAuthenticated = true;          
          this.sessionObject = this.decodeSessionString(sessionCookie);
        }
        this.isSessionProcessed = true;      
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
        return session;
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
    
    nothing: {
      value: function () {
        if (this.sessionObject === null) {
           this.importSession();
        } else {
          return false;
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