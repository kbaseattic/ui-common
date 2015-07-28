/*global define */
/*jslint browser: true, white: true */
define([
    'kb.logger', 
    'kb.session',
    'kb.props'
],
    function (Logger, Session, Props) {
        'use strict';
        
        function setApp(app) {
            if (window._kbase_app !== undefined) {
                throw new Error('App is already set');
            }
            window._kbase_app = app;
        }
        function getApp() {
            if (window._kbase_app === undefined || window._kbase_app === null) {
                throw new Error('No currrent app');
            }
            return window._kbase_app;
        }

        function appMethod(method, args) {
            var obj = getApp();
            return obj[method].apply(obj, args);
        }

        function getConfig() {
            return appMethod('getConfig', arguments);
        }

        function hasConfig() {
            return appMethod('hasConfig', arguments);
        }

        function pub() {
            return appMethod('pub', arguments);
        }
        function sub() {
            return appMethod('sub', arguments);
        }
        function unsub() {
            return appMethod('unsub', arguments);
        }
        
         function publish() {
            return appMethod('publish', arguments);
        }
        function subscribe() {
            return appMethod('subscribe', arguments);
        }
        function unsubscribe() {
            return appMethod('unsubscribe', arguments);
        }
        
        function genId() {
            return appMethod('genId', arguments);
        }
        
        function getItem() {
            return appMethod('getItem', arguments);
        }
        
        // Logging
        

        
        function proxyMethod(obj, method, args) {
            return obj[method].apply(obj, args);
        }
        
        function getUserId() {
            return proxyMethod(Session, 'getUserId', arguments);
        }

        function getUserRealname() {
            return proxyMethod(Session, 'getUserRealname', arguments);
        }
       
        function getAuthToken() {
            return proxyMethod(Session, 'getAuthToken', arguments);
        }
        
        function getUsername() {
            return proxyMethod(Session, 'getUsername', arguments);
        }
        
        function isLoggedIn() {
            return proxyMethod(Session, 'isLoggedIn', arguments);
        }
        
        function logError() {
            return proxyMethod(Logger, 'logError', arguments);
        }
        
        function logWarning() {
            return proxyMethod(Logger, 'logWarning', arguments);
        }
        
        function logInfo() {
            return proxyMethod(Logger, 'logInfo', arguments);
        }
        
        function logDebug() {
            return proxyMethod(Logger, 'logDebug', arguments);
        }
        
        /* Wrap postal messaging */
       
        
        var props = Props.create();
        
        return {
            setApp: setApp,
            getApp: getApp,
            getConfig: getConfig,
            hasConfig: hasConfig,
            getUsername: getUsername,
            getUserId: getUserId,
            getUserRealname: getUserRealname,
            getAuthToken: getAuthToken,
            isLoggedIn: isLoggedIn,
            pub: pub,
            sub: sub,
            unsub: unsub,
            genId: genId,
            getItem: getItem,
            
            logError: logError,
            logWarning: logWarning,
            logInfo: logInfo,
            logDebug: logDebug,
            
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            
            send: publish,
            recv: subscribe,
            drop: unsubscribe,
            
            props: props,
            debug: function () {
                return props.debug();
            }
        };
    });

