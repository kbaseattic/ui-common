require(['kb.panel.about', 'kb.panel.contact', 'kb.panel.login', 'kb.panel.navbar', 
         'kb.panel.narrativemanager',
         'kb.service.profile', 'kb.session', 'kb.app', 'kb.appstate', 'jquery'], 
        function (About, Contact, Login,  Navbar, 
                  NarrativeManager,
                  ProfileService, Session, App, AppState, $) {
    // SETUP
    // 
    // Set up the panel routes
    About.setup();
    Contact.setup();
    Login.setup();
    NarrativeManager.setup();
    
    App.setDefaultRoute({
        path: ['about'],
        render: function (params) {
            return 'This needs to route to a default panel...'
        }
    });
    
    // Set up the page mount points.
    App.createMountPoint('app', '#app');
    
    App.createMountPoint('navbar', '#kbase-navbar');
    
    // TODO: remove any previously mounted panel.    
    // TODO: convert all to promises or callback, but make it easy!
    function handleRoute(handler) {
        if (handler.route.render) {
            try {
                var rendered =  handler.route.render(handler.params);
                App.mount('app', rendered);
            } catch (ex) {
                App.mount('app', 'Error mounting this panel.');
            }
        } else if (handler.route.promise) {
            var promise = handler.route.promise;
            promise(handler.params)
                .then(function (rendered) {
                    App.mount('app', rendered);
                })
                .catch(function (err) {
                    App.mount('app', 'Error mounting this panel.' + err);
                })
                .done();       
        }
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
        App.mount('navbar', Navbar.render());
    });
    App.sub('loggedin', function () {
        App.mount('navbar', Navbar.render());
        ProfileService.loadProfile();
    });
    
    // This will work ... but we need to tune this!
        AppState.whenItem('userprofile')
        .then(function (profile) {
            App.mount('navbar', Navbar.render());
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

