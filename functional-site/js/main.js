require(['kb.panel.about', 'kb.panel.contact', 'kb.panel.login', 'kb.panel.navbar', 
         'kb.panel.narrativemanager', 'kb.panel.userprofile', 'kb.panel.welcome',
         'kb.panel.dashboard', 'kb.panel.narrativestore',
         'kb.service.profile', 'kb.session', 'kb.app', 'kb.appstate', 'jquery'], 
        function (About, Contact, Login,  Navbar, 
                  NarrativeManagerPanel, UserProfile, Welcome,
                  Dashboard, NarrativeStore,
                  ProfileService, Session, App, AppState, $) {
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

