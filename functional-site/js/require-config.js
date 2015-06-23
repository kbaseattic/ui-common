// This is main.js
define('jquery', [], function () {
    return jQuery;
});
define('kb_clients', [], function () {
    return 'KBCLIENTS DUMMY OBJECT';
});
//NB underscore, as of 1.6, inclues AMD compatible loading. However, other parts of the kbase
// codebase may rely on underscore being loaded globally, so se just use the global version, which 
// must already be loaded.
define('underscore', [], function () {
    return _;
});
var kbClients = [
    ['narrative_method_store', 'NarrativeMethodStore'],
    ['user_profile', 'UserProfile'],
    ['workspace', 'Workspace']
];
// NB need the immediate function exec below in order to avoid
// variable capture problem with anon funcs.
for (var i in kbClients) {
    define('kb.client.' + kbClients[i][0], [], (function (client) {
        return function () {
            return client;
        };
    })(window[kbClients[i][1]]));

}

require.config({
    baseUrl: '/',
    catchError: true,
    onError: function (err) {
        alert("Error:" + err);
    },
    paths: {
        jquery: '/bower_components/jquery/',
        q: '/bower_components/q/q',
        nunjucks: '/bower_components/nunjucks/browser/nunjucks.min',
        // md5: '/bower_components/md5/build/md5.min',
        md5: '/bower_components/spark-md5/spark-md5.min',
        lodash: '/bower_components/lodash/lodash.min',
        postal: '/bower_components/postal.js/lib/postal.min',
        // 'postal.request-response': '/ext/postal/postal.request-response.min',
        postaldeluxe: '/src/postal/postal-deluxe',
        domReady: '/bower_components/requirejs-domready/domReady',
        text: '/bower_components/requirejs-text/text',
        json: '/bower_components/requirejs-json/json',
        // kbase utils
        'kb.app': '/src/kbaseApp',
        'kb.router': '/src/kbaseRouter',
        'kb.utils': '/src/kbaseUtils',
        'kb.cookie': '/src/kbaseCookie',
        'kb.test': '/src/kbaseTest',
        'kb.utils.api': '/src/kbaseAPIUtils',
        'kb.alert': '/src/widgets/kbaseAlert',
        'kb.asyncqueue': '/src/kbaseAsyncQueue',
        'kb.statemachine': '/src/kbaseStateMachine',
        'kb.logger': '/src/kbaseLogger',
        // kbase app
        'kb.appstate': '/src/kbaseAppState',
        
        // widgets
        // userProfileServiceClient: '/functional-site/assets/js/kbclient/user_profile_Client.js',
        'kb.widget.buttonbar': '/src/widgets/kbaseButtonbar',
        'kb.widget.social.base': '/src/widgets/social/kbaseSocialWidget',
        'kb.user_profile': '/src/kbaseUserProfile',
        'kb.widget.social.user_profile': '/src/widgets/social/kbaseUserProfileWidget',
        //kbaseuserrecentactivity: '/src/widgets/social/kbaseUserRecentActivity',
        //kbaseuserpopularnarratives: '/src/widgets/social/kbaseUserPopularNarratives',
        'kb.widget.social.user_search': '/src/widgets/social/kbaseUserSearch',
        'kb.widget.social.browse_narratives': '/src/widgets/social/kbaseUserBrowseNarratives',
        //kbaseusersummary: '/src/widgets/social/kbaseUserSummary',
        'kb.widget.social.collaborators': '/src/widgets/social/kbaseUserCollaboratorNetwork',
        'kb.session': '/src/kbaseSession',
        'kb.config': '/src/kbaseConfig',
        'kb.widget.navbar': '/src/widgets/kbaseNavbar',
        'kb.widget.base': '/src/widgets/kbaseBaseWidget',
        'kb.widget.login': '/src/widgets/kbaseLoginWidget',
        // Dashboard widgets
        'kb.widget.dashboard.base': '/src/widgets/dashboard/DashboardWidget',
        'kb.widget.dashboard.profile': '/src/widgets/dashboard/ProfileWidget',
        'kb.widget.dashboard.sharedNarratives': '/src/widgets/dashboard/SharedNarrativesWidget',
        'kb.widget.dashboard.narratives': '/src/widgets/dashboard/NarrativesWidget',
        'kb.widget.dashboard.publicNarratives': '/src/widgets/dashboard/PublicNarrativesWidget',
        'kb.widget.dashboard.apps': '/src/widgets/dashboard/AppsWidget',
        'kb.widget.dashboard.data': '/src/widgets/dashboard/DataWidget',
        'kb.widget.dashboard.collaborators': '/src/widgets/dashboard/CollaboratorsWidget',
        'kb.widget.dashboard.metrics': '/src/widgets/dashboard/MetricsWidget',
        // Dataview widgets
        'kb.widget.dataview.base': '/src/widgets/dataview/DataviewWidget',
        'kb.widget.dataview.overview': '/src/widgets/dataview/OverviewWidget',
        // KBase clients. Wrappers around the service clients to provide packaged operations with promises.
        'kb.client.workspace': '/src/clients/kbaseWorkspaceClient',
        'kb.client.methods': '/src/clients/kbaseClientMethods',
        
        'kb.panel.about': '/src/panels/about',
        'kb.panel.contact': '/src/panels/contact',
        'kb.panel.login': '/src/panels/login',
        'kb.panel.navbar': '/src/panels/navbar',
        'kb.panel.narrativemanager': '/src/panels/narrativemanager',
        
        'kb.service.profile': '/src/services/profile'
    }


});