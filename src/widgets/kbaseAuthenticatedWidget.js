/*

*/

(function( $, undefined ) {

  'use strict';
    $.KBWidget({

		  name: "kbaseAuthenticatedWidget",

        version: "1.0.0",
        _accessors : [
            {name : 'auth', setter: 'setAuth'},
            'sessionId',
            'authToken',
            'user_id',
            'loggedInCallback',
            'loggedOutCallback',
            'loggedInQueryCallback'
        ],
        options: {
            auth : undefined
        },

        init: function(options) {

            this._super(options); 
            
            // An authenticated widget needs to get the initial auth state
            // from the KBaseSessionSync jquery extension.
            var sessionObject = $.KBaseSessionSync.getKBaseSession();
            this.setAuth(sessionObject);
            if (this.loggedInQueryCallback && sessionObject && sessionObject.token) {
              this.callAfterInit(function () {
                 this.loggedInQueryCallback(sessionObject);
              }.bind(this));
            }
           

            postal.channel('session').subscribe('login.success', function (session) {
                this.setAuth(session);
                if (this.loggedInCallback) {
                    this.loggedInCallback(undefined, session);
                }
              }.bind(this));

            postal.channel('session').subscribe('logout.success', function (session) {
                this.setAuth(undefined);
                if (this.loggedOutCallback) {
                    this.loggedOutCallback();
                }
              }.bind(this)); 

            /*
            TODO:used anywhere?
            NB: used to initialize the session in this widget, but 
            it relies on the SYNCHRONOUS nature of jquery events.
            IMHO this is not good, because it obscures the nature
            of what is going on here -- a simple method call of a 
            global object which knows about session state.
            $(document).trigger(
                'loggedInQuery',
                $.proxy(function (auth) {
                //console.log("CALLS LIQ");
                    this.setAuth(auth);

                    if (auth.kbase_sessionid) {
                        this.callAfterInit(
                            $.proxy(function() {
                                if (this.loggedInQueryCallback) {
                                    this.loggedInQueryCallback(auth)
                                }
                            }, this)
                        );
                    }
                }, this)
            );
            */

            return this;

        },

        setAuth : function (newAuth) {
            if (!newAuth) {
              newAuth = {};
            }
            this.setValueForKey('auth', newAuth);
           
           
            this.sessionId(newAuth.kbase_sessionid);
            this.authToken(newAuth.token);
            this.user_id(newAuth.user_id);
            //console.log("SETS AUTH TO "); console.log(newAuth);
            //console.log(this);
        },

        loggedInQueryCallback : function(args) {
            if (this.loggedInCallback) {
                this.loggedInCallback(undefined,args);
            }
        },

    });

}( jQuery ) );
