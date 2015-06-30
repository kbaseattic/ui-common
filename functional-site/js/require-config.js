// This is main.js
define('kb_clients', [], function () {
    return 'KBCLIENTS DUMMY OBJECT';
});
//NB underscore, as of 1.6, inclues AMD compatible loading. However, other parts of the kbase
// codebase may rely on underscore being loaded globally, so se just use the global version, which 
// must already be loaded.
var kbClients = [
    ['narrative_method_store', 'NarrativeMethodStore'],
    ['user_profile', 'UserProfile'],
    ['workspace', 'Workspace']
];
// NB need the immediate function exec below in order to avoid
// variable capture problem with anon funcs.
kbClients.forEach(function(client) {
    define('kb.service.' + client[0], [], function () {
        return function (c) {
            return c;
        }(window[client[1]]);
    });
});
/*
for (var i in kbClients) {
    define('kb.client.' + kbClients[i][0], [], (function (client) {
        return function () {
            return client;
        };
    })(window[kbClients[i][1]]));

}
*/

require.config({
    baseUrl: '/',
    catchError: true,
    onError: function (err) {
        alert("Error:" + err);
    },
    paths: {
        // External Dependencies
        // ----------------------
        jquery: 'bower_components/jquery/dist/jquery.min',
        bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min',
        bootstrap_css: 'bower_components/bootstrap/dist/css/bootstrap.min',
        q: 'bower_components/q/q',
        nunjucks: 'bower_components/nunjucks/browser/nunjucks.min',
        // md5: '/bower_components/md5/build/md5.min',
        md5: 'bower_components/spark-md5/spark-md5.min',
        lodash: 'bower_components/lodash/lodash.min',
        postal: 'bower_components/postal.js/lib/postal.min',
        // 'postal.request-response': '/ext/postal/postal.request-response.min',
        postaldeluxe: 'src/postal/postal-deluxe',
        domReady: 'bower_components/requirejs-domready/domReady',
        text: 'bower_components/requirejs-text/text',
        json: 'bower_components/requirejs-json/json',
        underscore: 'bower_components/underscore/underscore-min',        
        datatables: 'bower_components/datatables/media/js/jquery.dataTables.min',
        datatables_css: 'bower_components/datatables/media/css/jquery.dataTables.min',
        datatables_bootstrap: 'bower_components/datatables-bootstrap3-plugin/media/js/datatables-bootstrap3.min',
        datatables_bootstrap_css: 'bower_components/datatables-bootstrap3-plugin/media/css/datatables-bootstrap3.min',
        knockout: 'bower_components/knockout/dist/knockout.debug',
        'knockout-mapping': 'bower_components/knockout-mapping/knockout-mapping',
        angular: 'bower_components/angular/angular',
        'angular-ui': 'bower_components/angular-ui/build/angular-ui.min',
        'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router.min',
        'angular-ui-bootstrap': 'bower_components/angular-ui-bootstrap-bower/ui-bootstrap.min',
        'angular-ui-bootstrap-templates': 'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min',
        'jquery.blockUI': 'bower_components/blockUI/jquery.blockUI',
        'd3': 'bower_components/d3/d3.min',
        'd3-sankey': 'bower_components/d3-plugins-sankey/sankey',
        'd3-sankey-css': 'bower_components/d3-plugins-sankey/sankey',
        
        // Just style, man.
        'font-awesome': 'bower_components/font-awesome/css/font-awesome.min',
        
        // KBase Styles
        // ----------------
        'kb.style.bootstrap': 'css/kb-bootstrap',
        'kb.style.sankey': 'css/sankeystyle',
        
        // KBase Utils
        // ----------------------
        'kb.app': 'src/kbaseApp',
        'kb.router': 'src/kbaseRouter',
        'kb.utils': 'src/kbaseUtils',
        'kb.cookie': 'src/kbaseCookie',
        'kb.test': 'src/kbaseTest',
        'kb.utils.api': 'src/kbaseAPIUtils',
        'kb.alert': 'src/widgets/kbaseAlert',
        'kb.asyncqueue': 'src/kbaseAsyncQueue',
        'kb.statemachine': 'src/kbaseStateMachine',
        'kb.logger': 'src/kbaseLogger',
        // kbase app
        'kb.appstate': 'src/kbaseAppState',
        
        // KBase Widgets
        // -------------
        // userProfileServiceClient: '/functional-site/assets/js/kbclient/user_profile_Client.js',
        'kb.widget.buttonbar': 'src/widgets/kbaseButtonbar',
        'kb.widget.social.base': 'src/widgets/social/kbaseSocialWidget',
        'kb.user_profile': 'src/kbaseUserProfile',
        'kb.widget.social.user_profile': 'src/widgets/social/kbaseUserProfileWidget',
        //kbaseuserrecentactivity: '/src/widgets/social/kbaseUserRecentActivity',
        //kbaseuserpopularnarratives: '/src/widgets/social/kbaseUserPopularNarratives',
        'kb.widget.social.user_search': 'src/widgets/social/kbaseUserSearch',
        'kb.widget.social.browse_narratives': 'src/widgets/social/kbaseUserBrowseNarratives',
        //kbaseusersummary: '/src/widgets/social/kbaseUserSummary',
        'kb.widget.social.collaborators': 'src/widgets/social/kbaseUserCollaboratorNetwork',
        'kb.session': 'src/kbaseSession',
        'kb.config': 'src/kbaseConfig',
        'kb.widget.navbar': 'src/widgets/kbaseNavbar',
        'kb.widget.base': 'src/widgets/kbaseBaseWidget',
        'kb.widget.login': 'src/widgets/kbaseLoginWidget',
        // Dashboard widgets
        'kb.widget.dashboard.base': 'src/widgets/dashboard/DashboardWidget',
        'kb.widget.dashboard.profile': 'src/widgets/dashboard/ProfileWidget',
        'kb.widget.dashboard.sharedNarratives': 'src/widgets/dashboard/SharedNarrativesWidget',
        'kb.widget.dashboard.narratives': 'src/widgets/dashboard/NarrativesWidget',
        'kb.widget.dashboard.publicNarratives': '/src/widgets/dashboard/PublicNarrativesWidget',
        'kb.widget.dashboard.apps': 'src/widgets/dashboard/AppsWidget',
        'kb.widget.dashboard.data': 'src/widgets/dashboard/DataWidget',
        'kb.widget.dashboard.collaborators': '/src/widgets/dashboard/CollaboratorsWidget',
        'kb.widget.dashboard.metrics': 'src/widgets/dashboard/MetricsWidget',
        
        // Dataview widgets
        'kb.widget.dataview.base': 'src/widgets/dataview/DataviewWidget',
        'kb.widget.dataview.overview': 'src/widgets/dataview/OverviewWidget',
        'kb.widget.genericvisualizer': 'src/widgets/dataview/genericvisualizer',
        'kb.widget.dataview.download': 'src/widgets/dataview/kbaseDownloadPanel',
        
        // KBase clients. Wrappers around the service clients to provide packaged operations with promises.
        'kb.client.workspace': 'src/clients/kbaseWorkspaceClient',
        'kb.client.methods': 'src/clients/kbaseClientMethods',
        
        // KBase Panels
        // ------------
        'kb.panel.about': 'src/panels/about',
        'kb.panel.contact': 'src/panels/contact',
        'kb.panel.login': 'src/panels/login',
        'kb.panel.navbar': 'src/panels/navbar',
        'kb.panel.narrativemanager': 'src/panels/narrativemanager',
        'kb.panel.userprofile': 'src/panels/userprofile',
        'kb.panel.welcome': 'src/panels/welcome',
        'kb.panel.dashboard': 'src/panels/dashboard',
        'kb.panel.dashboard.style': 'src/panels/dashboard',
        'kb.panel.narrativestore': 'src/panels/narrativestore',
        'kb.panel.datasearch': 'src/panels/datasearch',
        'kb.panel.dataview': 'src/panels/dataview',
        'kb.panel.dataview.style': 'src/panels/dataview',
        
        // KBase JQuery Plugin Widgets
        // ---------------------------
        'kb.jquery.widget': 'src/widgets/jquery/kbaseWidget',
        'kb.jquery.authenticatedwidget': 'src/widgets/jquery/kbaseAuthenticatedWidget',
        'kb.jquery.narrativestore': 'src/widgets/jquery/kbaseNarrativeStoreView',
        // TODO: why this name for this widget?
        'kb.jquery.provenance': 'src/widgets/jquery/KBaseWSObjGraphCenteredView',
        
        // KBase Data Visualization Widget
        // ----------------------------
        'kb.visualizer.contigset': 'src/widgets/jquery/visualizers/contigset/kbaseContigSetView',
        
        // KBase Services
        // non-visual dependencies of plugins
        // --------------
        'kb.client.profile': 'src/clients/profile',
        'kb.client.narrativemanager': 'src/clients/narrativemanager',
        
        // KBase Angular Apps
        // ------------------
        'kb.angular.search': 'src/angular/search'
        
        
    },
    shim: {
        datatables: {
            deps: ['jquery']
        },
        datatables_bootstrap: {
            deps: ['datatables', 'css!datatables_bootstrap_css']
        },
        'jquery.blockUI': {
            deps: ['jquery'], exports: '$.fn.block'
        },
        // Bootstrap Shims. From :
        // http://stackoverflow.com/questions/13377373/shim-twitter-bootstrap-for-requirejs
        // Note that bootstrap will be AMD/UMD compatible in v4.
        bootstrap: {
            deps: ['jquery']
        },
        angular: {
            deps: ['jquery'], exports: 'angular'
        },
        'angular-ui-bootstrap-templates': {
            deps: ['angular', 'angular-ui-bootstrap']
        },
        'angular-ui-bootstrap': {
            deps: ['angular']
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        
        'd3-sankey': {
            deps: ['d3', 'css!d3-sankey-css', 'css!kb.style.sankey']
        }
    },
    map: {
        '*': {
            'css': 'bower_components/require-css/css.min'
        }
    }


});