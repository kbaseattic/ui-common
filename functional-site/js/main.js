require(['kb.panel.narrativemanager', 'kb.panel.navbar',
    'kb.client.profile', 'kb.session', 'kb.app', 'kb.appstate', 'jquery', 'q', 'bootstrap', 'css!font-awesome', 'domReady!'],
    function (NarrativeManagerPanel, Navbar, ProfileService, Session, App, AppState, $, Q) {

        function handleRoute(handler) {
            App.showPanel('app', handler);

        }

        var navbar = null;
        function setupApp() {
            var NarrativeManager = NarrativeManagerPanel();
            NarrativeManager.setup();
            
            // Call factory object.
            navbar = Navbar();
            navbar.setup();
            // Navbar.setup();

            App.setDefaultRoute({
                promise: function (params) {
                    return Q.Promise(function (resolve) {
                        resolve({
                            content: 'Route Not Found',
                            title: 'Not Found'
                        });
                    });
                }
            });
            App.addRoute({
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

            // Set up the page mount points.
            App.createMountPoint('app', '#app');

            App.createMountPoint('navbar', '#kbase-navbar');

            // TODO: remove any previously mounted panel.    
            // TODO: convert all to promises or callback, but make it easy!


            function replacePath(path) {
                // maybe render message ...
                //
                //        'redirecting to <a href="/narrative/ws.' + workspaceId +
                //        '.obj.' + objId + '">/narrative/ws.' + workspaceId +
                //        '.obj.' + objId + '</a>');
                window.location.replace(path);
            }

            // SETUP LISTENERS

            // DOM listeners
            $(window).bind('hashchange', function (e) {
                // NB this is called AFTER it has changed. The browser will do nothing by
                // default.
                var handler = App.findCurrentRoute();
                if (!handler) {
                    return;
                }
                handleRoute(handler);
            });

            // App Listeners
            App.sub('loggedout', function () {
                App.show('navbar', {
                    route: navbar,
                    params: null
                });
            });
            App.sub('loggedin', function () {
                App.show('navbar', {
                    route: navbar,
                    params: null
                });
                ProfileService.loadProfile();
            });
            App.sub('title', function (data) {
                navbar.setTitle(data.title);
                App.show('navbar', {
                    route: navbar,
                    params: null
                });
            });
            App.sub('navigate', function (data) {
                App.navigateTo(data);
            });

            // This will work ... but we need to tune this!
            AppState.whenItem('userprofile')
                .then(function (profile) {
                    App.show('navbar', {
                        route: navbar,
                        params: null
                    });
                })
                .done();
        }

        function runApp() {
            //App.sub('profile.loaded', function () {
            //    App.mount('navbar', Navbar.render());
            //});

            // RUN
            App.startHeartbeat();


            // Not sure about this approach ... but works for now.
            if (Session.isLoggedIn) {
                App.pub('loggedin');
            } else {
                App.pub('loggedout');
            }

            // Navbar will be mounted upon the login/out message.
            // App.mount('navbar', Navbar.render());

            // Handle the initial route.
            // Find a handler for the current route
            var handler = App.findCurrentRoute();
            if (!handler) {
                return;
            }
            handleRoute(handler);
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
        console.log('About to load panels...');
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
            {module: 'kb.panel.databrowser'}
        ].map(function (panel) {
            return requirePromise([panel.module], function (Panel) {
                Panel.setup(App);
            });
        });
        Q.all(promises)
            .then(function () {
                console.log('setting up app');
                setupApp();
                runApp();
            })
            .catch(function (err) {
                console.log('ERROR loading panels');
                console.log(err);
            })
            .done();
        console.log('done');


    });

