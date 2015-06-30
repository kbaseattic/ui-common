require(['kb.panel.about', 'kb.panel.contact', 'kb.panel.login', 'kb.panel.navbar',
    'kb.panel.narrativemanager', 'kb.panel.userprofile', 'kb.panel.welcome',
    'kb.panel.dashboard', 'kb.panel.narrativestore', 'kb.panel.datasearch',
    'kb.panel.dataview',
    'kb.client.profile', 'kb.session', 'kb.app', 'kb.appstate', 'jquery', 'q', 'bootstrap', 'css!font-awesome'],
    function (About, Contact, Login, Navbar,
        NarrativeManagerPanel, UserProfile, Welcome,
        Dashboard, NarrativeStore, DataSearch,
        DataView,
        ProfileService, Session, App, AppState, $, Q) {
        // The following is a little hack to ensure that kbase bootstrap overrides are 
        // loaded AFTER base bootstrap.
        // 
        // SETUP
        // 
        // Set up the panel routes
        About.setup();
        Contact.setup();
        Login.setup();
        var NarrativeManager = NarrativeManagerPanel();
        NarrativeManager.setup();
        UserProfile.setup();
        Welcome.setup();
        Dashboard.setup();
        NarrativeStore.setup();
        DataSearch.setup();
        DataView.setup();


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
        function handleRoute(handler) {
            App.showPanel('app', handler);

        }

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
                route: Navbar,
                params: null
            });
        });
        App.sub('loggedin', function () {
            App.show('navbar', {
                route: Navbar,
                params: null
            });
            ProfileService.loadProfile();
        });
        App.sub('title', function (data) {
            Navbar.setTitle(data.title);
            App.show('navbar', {
                route: Navbar,
                params: null
            });
        })

        // This will work ... but we need to tune this!
        AppState.whenItem('userprofile')
            .then(function (profile) {
                App.show('navbar', {
                    route: Navbar,
                    params: null
                });
            })
            .done();


        //App.sub('profile.loaded', function () {
        //    App.mount('navbar', Navbar.render());
        //});

        // RUN


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

    });

