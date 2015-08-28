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
    'bluebird',
    'kb.panel.navbar',
    'kb.client.profile',
    'yaml!DEV/config/ui.yml',
    'kb_types',
    
    'bootstrap',
    'css!font-awesome',
    'domReady!'],
    function (App, Runtime, AppState, Promise, Navbar, ProfileService, UIConfig, Types) {
        'use strict';

        var app = App.make();
        Runtime.setApp(app);

        var navbar = null;
        function setupApp() {
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
            });

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
                } else if (data.routeHandler.route.panelObject) {
                    // And ... we have another panel factory pattern here. We will
                    // converge as soon as we can...
                    app.showPanel3('app', data.routeHandler)
                        .catch(function (err) {
                            console.error('ERROR');
                            console.error(err);
                        })
                        .done();
                    // TODO: merge the following with the first redirect handler... 
                    // i.e. make them all return a promise.
                } else if (data.routeHandler.route.redirectHandler) {
                    app.doRedirectHandler(data.routeHandler)
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
            var loaders = UIConfig.plugins.map(function (plugin) {
                if (typeof plugin === 'string') {
                    plugin = {
                        name: plugin,
                        directory: 'plugins/' + plugin
                    };
                }
                var p = new Promise(function (resolve, reject) {
                    require(['yaml!' + plugin.directory + '/config.yml'], function (config) {
                        // build up a list of modules and add them to the require config.
                        var paths = {}, shims = {},
                            sourcePath = plugin.directory + '/source',
                            dependencies = [];

                        // load any styles.
                         // NB these are styles for the plugin as a whole.
                        // TODO: do away with this. the styles should be dependencies
                        // of the panel and widgets. widget css code is below...
                        if (config.source.styles) {
                            config.source.styles.forEach(function (style) {
                                dependencies.push('css!' + sourcePath + '/css/' + style.file);
                            });
                        }

                        // Add each module defined to the require config paths.
                        config.source.modules.forEach(function (source) {
                            var jsSourceFile = source.file,
                                matched = jsSourceFile.match(/^(.+?)(?:(?:\.js$)|(?:$))/);
                            if (matched) {
                                jsSourceFile = matched[1];
                                var sourceFile = sourcePath + '/javascript/' + jsSourceFile;
                                paths[source.module] = sourceFile;
                                if (source.css) {
                                    var styleModule = source.module + '_css';
                                    paths[styleModule] = sourceFile;
                                    shims[source.module] = {deps: ['css!' + styleModule]};
                                }
                            }
                        });
                        
                        // This usage of require.config will merge with the existing
                        // require configuration.
                        require.config({paths: paths, shim: shims});
                        
                        // Create a dynamic module for the plugin to use.
                        define('kb_plugin_' + config.package.name, [], function () {
                            return {
                                plugin: {
                                    path: '/' + sourcePath
                                }
                            }
                        });

                        // Now install any routes.
                        if (config.install) {
                            require(dependencies, function () {
                                var installSteps = [];
                                if (config.install.routes) {
                                    config.install.routes.forEach(function (route) {
                                        installSteps.push(new Promise(function (resolve) {
                                            // Runtime.addRoute(route);
                                            if (route.panelFactory) {
                                                require([route.panelFactory], function (factory) {
                                                    Runtime.addRoute({
                                                        path: route.path,
                                                        queryParams: route.queryParams,
                                                        config: {
                                                            pluginPath: '/' + sourcePath
                                                        },
                                                        panelFactory: factory
                                                    });
                                                    resolve();
                                                }, function (err) {
                                                    console.log('Error loading panel factory');
                                                    console.log(err);
                                                    reject({
                                                        name: 'routeError',
                                                        message: 'invalid route',
                                                        route: route
                                                    });
                                                });
                                            } else if (route.panelObject) {
                                                require([route.panelObject], function (obj) {
                                                    Runtime.addRoute({
                                                        path: route.path,
                                                        queryParams: route.queryParams,
                                                        config: {
                                                            pluginPath: sourcePath
                                                        },
                                                        panelObject: obj
                                                    }, function (err) {
                                                    console.log('Error loading panel object');
                                                    console.log(err);
                                                });
                                                    resolve();
                                                });
                                            } else  if (route.redirectHandler) {
                                                Runtime.addRoute(route);
                                                resolve();
                                            } else {
                                                throw {
                                                    name: 'routeError',
                                                    message: 'invalid route',
                                                    route: route
                                                };
                                            }

                                        }));
                                });
                                    
                                }
                                
                                if (config.install.menu) {
                                    config.install.menu.forEach(function (item) {
                                        installSteps.push(new Promise(function (resolve) {
                                            Runtime.send('navbar', 'add-menu-item', item);
                                            resolve();
                                        }));
                                    });
                                }
                                
                                if (config.install.types) {
                                    config.install.types.forEach(function (typeDef) {
                                        var type = typeDef.type,
                                            viewers = typeDef.viewers;
                                        viewers.forEach(function (viewerDef) {
                                            installSteps.push(new Promise(function (resolve) {
                                                Types.addViewer(type, viewerDef);
                                                resolve();
                                            }));
                                        });
                                        
                                    });
                                }
                                
                                Promise.all(installSteps)
                                    .then(function () {
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        console.log('ERROR');
                                        console.log(err);
                                    })
                                    .done();
                            });
                        } else {
                            console.log('No installation?');
                            resolve();
                        }

                    });
                });
                return p;
            });
            return new Promise.all(loaders);
        }

        function start() {
            return new Promise(function (resolve, reject) {
                // 
                // SETUP
                // 
                // Set up the panel routes
                function requirePromise(modules, fun) {
                    return new Promise(function (resolve) {
                        require(modules, function () {
                            fun.apply(null, arguments);
                            resolve();
                        });
                    });
                }

                // Here we load the internal panels.
                Runtime.logDebug({source: 'main', message: 'About to load panels...'});
                var panels = [
                    {module: 'kb.panel.message', config: {}},
                    // {module: 'kb.panel.login', config: {}},
                    {module: 'kb.panel.welcome'},
                    // {module: 'kb.panel.typeview'}
                    // {module: 'kb.panel.sample'},
                    // {module: 'kb.panel.sample.router'}
                ].map(function (panel) {
                    return requirePromise([panel.module], function (PanelModule) {
                        // this registers routes
                        PanelModule.setup(app, panel.config);
                    });
                });

                Promise.all(panels)
                    .then(function () {
                        setupApp();
                        // resolve();
                    })
                    .then(function () {
                        Runtime.logDebug({source: 'main', message: 'setting up app'});
                        return installPlugins();
                    })
                    .then(function () {
                        Runtime.logDebug({source: 'main', message: 'About to run app...'});
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

