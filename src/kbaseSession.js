define(['jquery', 'q', 'kb.cookie', 'kb.config'],
    function ($, Q, Cookie, Config) {
        'use strict';
        var Session = Object.create({}, {
   
           
            
            // Property Constants
            
            /**
            * The standard name of the KBase session cookie.
            * 
            * @const {string}
            * @private
            */
            cookieName: {
                value: 'kbase_session'
            },
            
            /**
            * The standard name of the KBase session cookie used in the Narrative.
            * 
            * @const {string}
            * @private
            */
            narrCookieName: {
                value: 'kbase_narr_session'
            },
            
            // Property Variables

            /**
            * The span, from the instant a session cookie is created, after which the cookie will 
            * be deleted from the browser. Corresponds to the max-age attribute of a cookie. 
            * nb: this is set in @init from the configuration object.
            * 
            * @member {integer}
            * @private
            * 
            */
            cookieMaxAge: {
                value: null,
                writable: true
            },
            
            // Initializer
            
            /**
            * Initialize the object to a well defined starting state.
            * This includes creating instance properties, initializing data, setting 
            * default values.
            * 
            * @function init
            * 
            * @returns {Session} A reference to this object.                  
            *                   
            */
            init: {
                value: function () {
                    this.sessionObject = undefined;
                    this.setSession(this.importSessionFromCookie());
                    // 1 hour is the default cookie max age.
                    this.cookieMaxAge = Config.getConfig('session.cookie.max-age', 60 * 60);

                    return this;
                }
            },
            
            
            // API Methods


           // Implementation Methods
           
           /**
            * The canonical kbase session object, based on the kbase session
            * cookie, but removing a duplicated field and adding the parsed
            * token.
            * 
            * @typedef {Object} SessionObject
            * @property {string} user_id
            * @property {string} realname
            * @property {string} token
            * @property {string} sessionId
            * @property {TokenObject} tokenObject
            */
           
           /**
            * The token object as supplied by the Globus auth service. 
            * @todo: document the remainder of the fields
            * 
            * @typedef {Object} TokenObject
            * @property {string} un
            * @property {string} expiry
            * 
            */
           
            /**
             * Attempt to set the internal session object from the given 
             * session object.
             * 
             * @function setSession
             * @private
             * 
             * @param {SessionObject} obj - a session object
             * @returns {undefined}
             */
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

            /**
             * Extract the cookie from the browser environment, parse it, and 
             * validate it. This is the canonical interface betweek KBase ui
             * code and browser authentication.
             * 
             * @function importSessionFromCookie
             * @private
             * 
             * @returns {SessionObject|null} a kbase session object or null
             * if there is no valid session cookie.
             */
            importSessionFromCookie: {
                value: function () {
                    var sessionCookie = Cookie.getItem(this.cookieName);
                    // var sessionCookie = $.cookie(sessionName);
                    if (!sessionCookie) {
                        return null;
                    }
                    // first pass just break out the string into fields.
                    var session = this.decodeToken(sessionCookie);

                    if (!(session.kbase_sessionid && session.un && session.user_id && session.token)) {
                        this.removeAuth();
                        return null;
                    }
                    session.token = session.token.replace(/PIPESIGN/g, '|').replace(/EQUALSSIGN/g, '=');
                    
                    // Ensure that we have localStorage.
                    var storageSessionString = localStorage.getItem(this.cookieName);
                    if (!storageSessionString) {
                      console.log('WARNING: Local Storage Cookie missing -- resetting session');
                      this.removeAuth();
                      return null;
                    } 
        
                    var storageSession = JSON.parse(storageSessionString);
                    if (session.token !== storageSession.token) {
                      console.log('WARNING: Local Storage Cookie auth different than cookie -- resetting session');
                      console.log(session.token);
                      console.log(storageSession)
                      this.removeAuth();
                      return null;          
                    }

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

            /**
             * Creates a valid standard Session Object from a raw session object
             * provided by Globus.
             * 
             * @function importSessionFromAuthObject
             * @private
             * 
             * @param {KBaseSessionObject} kbaseSession - the session object
             * returned from the KBase auth server
             * @returns {SessionObject|null} a validated Session Object, or null
             * if no session or an invalid session was provided.
             */
            importSessionFromAuthObject: {
                value: function (kbaseSession) {
                    // Auth object has fields un, user_id, kbase_sessionid, token. If any are missing, we void the session (if any)
                    // cookies and pretend we have nothing.
                    // NB: the object returned from the auth service does NOT have the un field.
                    if (!(kbaseSession.kbase_sessionid && kbaseSession.user_id && kbaseSession.token)) {
                        // throw new Error('Invalid Kbase Session Cookie');
                        this.removeAuth();
                        return null;
                    }
                    var newSession = {
                        username: kbaseSession.user_id,
                        realname: kbaseSession.name,
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

            /**
             * Forces the session object to be re-imported from the browser
             * cookie. Designed to be used by clients which want to ensure that
             * they have the very latest session. Similar to getSession(), 
             * except that getSession() will only refresh the session if it is
             * missing.
             * 
             * @function refreshSession
             * @public
             * 
             * @returns {SessionObject} the current session object.
             */
            refreshSession: {
                value: function () {
                    this.setSession(this.importSessionFromCookie());
                    return this.sessionObject;
                }
            },

            /**
             * Gets the current session object, fetching it from the environment
             * (cookie) if it has never been set. Note that in order to retrieve
             * the current session as rpoerted by the environment, use refreshSession.
             * 
             * @function getSession
             * @public
             * 
             * @returns {SessionObject|null} the session object, or null if there
             * is no valid session available.
             */
            getSession: {
                value: function () {
                    if (this.sessionObject === undefined) {
                        this.setSession(this.importSessionFromCookie());
                    }
                    return this;
                }
            },
            
            /**
             * 
             * The traditional KBase session layout, reflecting the fields set
             * in the browser cookie.
             * 
             * 
             * @typedef {Object} KBaseSessionObject
             * @property {string} token - The Globus auth token
             * @property {string} un - username as extracted from the Globus auth token
             * @property {string} user_id - same as un
             * @property {string} name - The user "full name" (globus) or
             * "user name" (kbase). Deprecated - user name should be taken from
             * the user profile. (See xxx)
             * @property {string} kbase_sessionid - Issued by the auth server,
             * used to uniquely identify this session amongst all other extant
             * sessions. ???
             * @todo Where is kbase_sessionid used??? Not in ui-common ...
             * 
             */

            /**
             * Returns the "KBase Session", for legacy usage. The legacy method
             * of accessing the session is to work directly with a session object,
             * rather than the api.
             * 
             * @function getKBaseSesssion
             * @public
             * 
             * @returns {KBaseSessionObject}
             */
            getKBaseSession: {
                value: function () {
                    this.refreshSession();
                    if (!this.sessionObject) {
                        return null;
                    }
                    return {
                        un: this.sessionObject.username,
                        user_id: this.sessionObject.username,
                        name: this.sessionObject.realname,
                        token: this.sessionObject.token,
                        kbase_sessionid: this.sessionObject.sessionId
                    }
                }
            },
            
            /**
             * An object representation of the Globus authentication token.
             * 
             * @typedef {Object} GlobusAuthToken
             * 
             */

            /**
             * Decodes a Globus authentication token, transforming the token
             * plain string into a map of field names to values.
             * 
             * @function decodeToken
             * @private
             * 
             * @param {string} - A globus auth token
             * 
             * @returns {GlobusAuthToken} an object representing the decoded
             * token.
             */
            decodeToken: {
                value: function (token) {
                    var parts = token.split('|');
                    var map = {};
                    for (var i = 0; i < parts.length; i++) {
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

                    if (!(sessionObject.sessionId && sessionObject.username && sessionObject.token && sessionObject.tokenObject)) {
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
                    var expiryDate = new Date(expirySec * 1000);
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
                    if (this.sessionObject) {
                        var cookieString = this.makeAuthCookie();
                        Cookie.setItem(this.cookieName, cookieString, this.cookieMaxAge, '/');
                        //Cookie.setItem(this.cookieName, cookieString, this.cookieMaxAge, '/', 'kbase.us');
                        Cookie.setItem(this.narrCookieName, cookieString, this.cookieMaxAge, '/');
                        // Cookie.setItem(this.narrCookieName, cookieString, this.cookieMaxAge, '/', 'kbase.us');
                        // Set the same cookie in localStorage for compatability.
                        var kbaseSession = this.getKBaseSession();
                        // This is for compatability with the current state of the narrative ui, which uses this
                        // as a flag for being authenticated.
                        kbaseSession.success = 1;
                        localStorage.setItem(this.cookieName, JSON.stringify(kbaseSession));
                    }
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
                        user_id: options.username,
                        password: options.password,
                        fields: 'un,token,user_id,kbase_sessionid,name',
                        status: 1
                    };

                    $.support.cors = true;
                    $.ajax({
                        type: 'POST',
                        url: Config.getConfig('login_url'),
                        data: loginParams,
                        dataType: 'json',
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        beforeSend: function (xhr) {
                            // make cross-site requests
                            xhr.withCredentials = true;
                        },
                        success: function (data, res, jqXHR) {
                            if (data.kbase_sessionid) {
                                this.setSession(this.importSessionFromAuthObject(data));
                                this.setAuthCookie();
                                options.success(this.getKBaseSession());
                            } else {
                                options.error({
                                    status: 0,
                                    message: data.error_msg
                                });
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
                            } else if (jqXHR.responseJSON) {
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

            getRealname: {
                value: function () {
                    if (this.isAuthenticated) {
                        return this.sessionObject.realname;
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
                value: function () {
                    Cookie.removeItem(this.cookieName, '/');
                    Cookie.removeItem(this.cookieName, '/', 'kbase.us');
                    Cookie.removeItem(this.narrCookieName, '/', 'kbase.us');
                    // Remove the localStorage session for compatability.
                    localStorage.removeItem(this.cookieName);
                }
            },
        });

        return Session.init();
    });