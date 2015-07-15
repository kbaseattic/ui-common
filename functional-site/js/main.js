/**
 * 
 * Main entry point for the KBase single page app (SPA).
 * 
 * @param {type} App
 * @param {type} AppState
 * @param {type} $
 * @param {type} Q
 * @param {type} NarrativeManagerPanel
 * @param {type} Navbar
 * @param {type} ProfileService
 * @param {type} Session
 * @returns {undefined}
 */
/*global
 define, console, window, require
 */
/*jslint
 browser: true,
 white: true
 */
require([
    'kb.app',
    'kb.runtime',
    'kb.appstate',
    'q',
    'kb.panel.narrativemanager',
    'kb.panel.navbar',
    'kb.client.profile',
    'kb.session',
    'bootstrap',
    'css!font-awesome',
    'domReady!'],
    function (App, Runtime, AppState, Q, NarrativeManagerPanel, Navbar, ProfileService, Session) {
        'use strict';
        
        var app = App.create();
        Runtime.setApp(app);

        var navbar = null;
        function setupApp() {
            var NarrativeManager = NarrativeManagerPanel.create();
            NarrativeManager.setup();

            // Call factory object to create our global navbar.
            navbar = Navbar.create();
            navbar.setup();

            // The default route is invoked if there is no route set up to handle
            // the path.
            app.setDefaultRoute({
                promise: function (params) {
                    return Q.Promise(function (resolve) {
                        resolve({
                            content: 'Route Not Found',
                            title: 'Not Found'
                        });
                    });
                }
            });
            
            /* 
             * Handle the "empty path", which is also the root of the site.
             * This can look like the following:
             * /functional-site
             * /functional-site#
             * /functional-site#/
             * /functional-site/#
             * /functional-site/#/
             * /functional-site/#/////
             * TODO: have this redirect to some sensible location ... like the dashboard
             * TODO: rename the "promise" method of a route to something that makes more semantic sense
            */
            app.addRoute({
                path: [],
                promise: function (params) {
                    return Q.Promise(function (resolve) {
                        resolve({
                            content: 'Functional Site',
                            title: 'Home'
                        });
                    });
                }
            });

            /*
             * The app is responsible for the primary display layout, which 
             * a far as the panels are concerned, is composed of a set of 
             * "mount points". A mount point is simply a DOM node. The id of the
             * node is the link between the layout html and the app, and a
             * similar string key is the link between the app and the collection
             * of mount points in javascript. We keep a mirror of the mount points
             * in this collection (object) in order to keep a handle on the currently
             * mounted panel, for life cycle management.
             */
            app.createMountPoint('app', '#app');
            app.createMountPoint('navbar', '#kbase-navbar');


            // SETUP LISTENERS

            // DOM listeners
            

            // App Listeners
            app.sub('loggedout', function () {
                app.show('navbar', {
                    route: navbar,
                    params: null
                });
            });
            app.sub('loggedin', function () {
                app.show('navbar', {
                    route: navbar,
                    params: null
                });
                ProfileService.loadProfile();
            });
            app.sub('title', function (data) {
                navbar.setTitle(data.title);
                app.show('navbar', {
                    route: navbar,
                    params: null
                });
            });
            app.sub('navigate', function (data) {
                app.navigateTo(data);
            });

            // This will work ... but we need to tune this!
            AppState.whenItem('userprofile')
                .then(function (profile) {
                    app.show('navbar', {
                        route: navbar,
                        params: null
                    });
                })
                .done();
            

            app.sub('new-route', function (data) {
                app.showPanel('app', data.routeHandler);
            });

        }

        function runApp() {
            app.start();
            
            //App.sub('profile.loaded', function () {
            //    App.mount('navbar', Navbar.render());
            //});

            // Navbar will be mounted upon the login/out message.
            // App.mount('navbar', Navbar.render());

            // Handle the initial route.
            // Find a handler for the current route
          
        }

        // 
        // SETUP
        // 
        // Set up the panel routes
        function requirePromise(modules, fun) {
            return Q.Promise(function (resolve) {
                require(modules, function () {
                    fun.apply(null, arguments);
                    resolve();
                });
            });
        }
        Runtime.logDebug({source: 'main', message: 'About to load panels...'});
        var promises = [
            {module: 'kb.panel.about'},
            {module: 'kb.panel.contact'},
            {module: 'kb.panel.login'},
            {module: 'kb.panel.userprofile'},
            {module: 'kb.panel.welcome'},
            {module: 'kb.panel.dashboard'},
            {module: 'kb.panel.narrativestore'},
            {module: 'kb.panel.datasearch'},
            {module: 'kb.panel.dataview'},
            {module: 'kb.panel.databrowser'},
            {module: 'kb.panel.spec'}
        ].map(function (panel) {
            return requirePromise([panel.module], function (Panel) {
                Panel.setup(app);
            });
        });
        Q.all(promises)
            .then(function () {
                Runtime.logDebug({source: 'main', message: 'setting up app'});
                setupApp();
                runApp();
            })
            .catch(function (err) {
                console.log('ERROR loading panels');
                console.log(err);
            })
            .done();
        Runtime.logDebug({source: 'main', message: 'done'});


    });

