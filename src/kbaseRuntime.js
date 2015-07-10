/* global define */
/* jslint white: true */
define([],
    function () {
        'use strict';
        
        function appMethod(method, args) {
            var obj = getApp();
            obj[method].apply(method, args);
        }

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

        function getConfig() {
            appMethod('getConfig', arguments);
        }

        function hasConfig() {
            appMethod('hasConfig', arguments);
        }

        function getUserId() {
            appMethod('getUserId', arguments);
        }

        function getUsername() {
            appMethod('getUsername', arguments);
        }
        
        function getUserRealname() {
            appMethod('getUserRealname', arguments);
        }
       
        function getAuthToken() {
            appMethod('getAuthToken', arguments);
        }
        
        function isLoggedIn() {
            appMethod('isLoggedIn', arguments);
        }
        
        function pub() {
            appMethod('pub', arguments);
        }
        
        function sub() {
            appMethod('sub', arguments);
        }
        
        function genId() {
            appMethod('genId', arguments);
        }
        
        function getItem() {
            appMethod('getItem', arguments);
        }

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
            genId: genId,
            getItem: getItem
        };
    });

