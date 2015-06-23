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
    
    // SETUP LISTENERS
    
    // DOM listeners
    $(window).bind('hashchange', function (e) {
        // NB this is called AFTER it has changed. The browser will do nothing by
        // default.
        var handler = App.findCurrentRoute();
        if (!handler) {
            return;
        }
        var rendered =  handler.route.render(handler.params);
        //if (typeof rendered === 'object') {
        //    rendered = App.html(rendered);
        //}
        App.mount('app', rendered);        
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
    
    
    // App.mount('navbar', Navbar.render());
    
    // Find a handler for the current route
    var handler = App.findCurrentRoute();
    if (!handler) {
        return;
    }
    
    // TODO: remove any previously mounted panel.
    
    // Mount this panel.
    var rendered =  handler.route.render(handler.params);

    //if (typeof rendered === 'object') {
    //    rendered = App.html(rendered);
    //}
    App.mount('app', rendered);
    
});

