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
define([
    'kb.app',
    'kb.runtime',
    'kb.appstate',
    'q',
    'kb.panel.narrativemanager',
    'kb.panel.navbar',
    'kb.client.profile',
    'yaml!build/ui.yml',
    'bootstrap',
    'css!font-awesome',
    'domReady!'],
    function (App, Runtime, AppState, Q, NarrativeManagerPanel, Navbar, ProfileService, UIConfig) {
        'use strict';

        var app = App.make();
        Runtime.setApp(app);

        var navbar = null;
        function setupApp() {
            var NarrativeManager = NarrativeManagerPanel.create();
            NarrativeManager.setup();

            // Call factory to create our global navbar.
            navbar = Navbar.create();
            navbar.setup();

            // Set up the navbar.
            Object.keys(UIConfig.navbar.menu.available_items).forEach(function (menuId) {
                navbar.addMenuItem(menuId, UIConfig.navbar.menu.available_items[menuId]);
            });
            Object.keys(UIConfig.navbar.menu.menus).forEach(function (menuId) {
                navbar.addMenu(menuId, UIConfig.navbar.menu.menus[menuId]);
            });

            Runtime.recv('navbar', 'add-menu-item', function (data) {
                navbar.addMenuItem(data.name, data.definition);
                navbar.addToMenu('authenticated', data.name);
            });

            Runtime.recv('navbar', 'clear-buttons', function () {
                navbar.clearButtons();
            })

            // ?? (EAP)
            Runtime.props.setItem('navbar', navbar);

            // The default route is invoked if there is no route set up to handle
            // the path.
            app.setDefaultRoute({
                redirect: {
                    path: 'message/notfound'
                }
            });

            /*
             * 
             
             promise: function (params) {
             return Q.Promise(function (resolve) {
             resolve({
             content: 'Route Not Found',
             title: 'Not Found'
             });
             });
             }
             */

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
                redirect: {
                    path: 'welcome'
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

            app.show2('navbar', {widget: navbar})
                .then(function () {
                    // anything to do?
                })
                .catch(function (err) {
                    console.error('ERROR');
                    console.error(err);
                })
                .done();

            Runtime.recv('app', 'navigate', function (data) {
                app.navigateTo(data);
            });

            Runtime.recv('app', 'redirect', function (data) {
                app.redirectTo(data.url, data.new_window);
            });

            // This will work ... but we need to tune this!
            Runtime.recv('app', 'loggedin', function () {
                ProfileService.loadProfile();
            });

            Runtime.recv('app', 'new-route', function (data) {
                if (data.routeHandler.route.redirect) {
                    Runtime.send('app', 'navigate', {
                        path: data.routeHandler.route.redirect.path,
                        params: data.routeHandler.route.redirect.params
                    });
                } else if (data.routeHandler.route.handler) {
                    // This pattern handles the narrativemanager -- represents another way
                    // to handle routes...
                    data.routeHandler.route.handler(data.params)
                        .then(function (result) {
                            if (result.redirect) {
                                Runtime.send('app', 'redirect', result.redirect);
                            }
                        })
                        .catch(function (err) {
                            console.log('ERROR');
                            console.log(err);
                        })
                        .done();
                } else if (data.routeHandler.route.panelFactory) {
                    // And ... we have another panel factory pattern here. We will
                    // converge as soon as we can...
                    app.showPanel3('app', data.routeHandler)
                        .catch(function (err) {
                            console.error('ERROR');
                            console.error(err);
                        })
                        .done();
                } else {
                    app.showPanel2('app', data.routeHandler)
                        .catch(function (err) {
                            console.error('ERROR');
                            console.error(err);
                        })
                        .done();
                }
            });

        }

        function runApp() {
            Runtime.logDebug({source: 'main', message: 'running app'});
            app.start();

            //App.sub('profile.loaded', function () {
            //    App.mount('navbar', Navbar.render());
            //});

            // Navbar will be mounted upon the login/out message.
            // App.mount('navbar', Navbar.render());

            // Handle the initial route.
            // Find a handler for the current route

        }

        function installPlugins() {
            var plugins = UIConfig.plugins;

            // for each plugin
            var loaders = plugins.map(function (plugin) {
                // read the config file
                if (typeof plugin === 'string') {
                    plugin = {
                        name: plugin,
                        directory: 'plugins/' + plugin
                    }
                }
                return Q.Promise(function (resolve) {
                    require(['yaml!' + plugin.directory + '/config.yml'], function (config) {
                        // build up a list of modules and add them to the require config.
                        var paths = {},
                            sourcePath = plugin.directory + '/source';

                        // load any styles.
                        var dependencies = [];
                        if (config.source.styles) {
                            config.source.styles.forEach(function (style) {
                                dependencies.push('css!' + sourcePath + '/css/' + style.file);
                            });
                        }

                        config.source.modules.forEach(function (source) {
                            paths[source.module] = sourcePath + '/javascript/' + source.file;
                        });
                        require.config({paths: paths});
                        // enter a require closure with the installer as the module.

                        // NB - installer is the first module in the dependency
                        // list so we receive it as the first argument.
                        if (config.install.routes) {
                            require(dependencies, function () {
                                var routes = config.install.routes.map(function (route) {
                                    return Q.Promise(function (resolve) {
                                        require([route.panelFactory], function (factory) {
                                            Runtime.addRoute({
                                                path: route.path,
                                                panelFactory: factory
                                            });
                                            resolve();
                                        });
                                    });
                                });
                                Q.all(routes)
                                    .then(function () {
                                        if (config.install.menu) {
                                            config.install.menu.forEach(function (item) {
                                                Runtime.send('navbar', 'add-menu-item', item);
                                            });
                                        }
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        console.log('ERROR');
                                        console.log(err);
                                    })
                                    .done();
                            });
                        }
                        
                    });
                });
            });
            return Q.all(loaders);

        }

        function start() {

            return Q.Promise(function (resolve, reject) {
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
                var panels = [
                    {module: 'kb.panel.message', config: {}},
                    {module: 'kb.panel.contact', config: {}},
                    {module: 'kb.panel.login', config: {}},
                    // {module: 'kb.panel.userprofile', config: {}},
                    {module: 'kb.panel.welcome', config: {}},
                    {module: 'kb.panel.dashboard', config: {}},
                    //{module: 'kb.panel.narrativestore'},
                    // {module: 'kb.panel.datasearch'},
                    {module: 'kb.panel.dataview', config: {}},
                    {module: 'kb.panel.typebrowser', config: {}},
                    {module: 'kb.panel.typeview'},
                    {module: 'kb.panel.test'},
                    // {module: 'kb.panel.sample'},
                    // {module: 'kb.panel.sample.router'}
                ].map(function (panel) {
                    return requirePromise([panel.module], function (PanelModule) {
                        // this registers routes
                        PanelModule.setup(app, panel.config);
                    });
                });

                Q.all(panels)
                    .then(function () {
                        setupApp();
                        resolve();
                    })
                    .then(function () {
                        Runtime.logDebug({source: 'main', message: 'setting up app'});
                        return installPlugins();
                    })
                    .then(function () {
                        runApp();
                        Runtime.logDebug({source: 'main', message: 'done'});
                    })
                    .catch(function (err) {
                        console.log('ERROR loading panels');
                        console.log(err);
                        reject(err);
                    })
                    .done();
            });
        }

        return {
            start: start
        };


    });

