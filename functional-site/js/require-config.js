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
   define('kb.client.'+kbClients[i][0], [], (function (client) {
      return function () {
         return client;
      };
   })(window[kbClients[i][1]]));
      
}


define('postal', [], function () {
   return postal;
});
define('q', [], function () {
   return Q;
});
require.config({
   baseUrl: '/',
   catchError: true,
   onError: function (err) {
      alert("Error:" + err);
   },
   paths: {
      nunjucks: '/ext/nunjucks/nunjucks.min',
      md5: '/ext/md5/md5',
      lodash: '/ext/lodash/lodash-2.4.1.min',
      //  postal: '/ext/postal/postal-0.12.4.min',
      'postal.request-response': '/ext/postal/postal.request-response.min',
      postaldeluxe: '/src/postal/postal-deluxe',

      domReady: '/ext/require-plugins/domReady',
      text: '/ext/require-plugins/text',
      json: '/ext/require-plugins/json',
      
      // kbase utils
      'kb.utils': '/src/kbaseUtils',
      'kb.cookie': '/src/kbaseCookie',
      'kb.test': '/src/kbaseTest',
      'kb.utils.api': '/src/kbaseAPIUtils',
      'kb.alert': '/src/widgets/kbaseAlert',
      'kb.statemachine': '/src/kbaseStateMachine',  
      'kb.logger': '/src/kbaseLogger',

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
      'kb.widget.dashboard.apps': '/src/widgets/dashboard/AppsWidget',
      'kb.widget.dashboard.data': '/src/widgets/dashboard/DataWidget',
      'kb.widget.dashboard.collaborators': '/src/widgets/dashboard/CollaboratorsWidget', 
      'kb.widget.dashboard.metrics': '/src/widgets/dashboard/MetricsWidget',
      
      // Dataview widgets
      'kb.widget.dataview.base': '/src/widgets/dataview/DataviewWidget',
      'kb.widget.dataview.overview': '/src/widgets/dataview/OverviewWidget',
      
      // KBase clients. Wrappers around the service clients to provide packaged operations with promises.
      'kb.client.workspace': '/src/clients/kbaseWorkspaceClient',
      'kb.client.methods': '/src/clients/kbaseClientMethods'
   },
   shim: {
      // Better standard naming: Prefix with kbc_ (KBase Client), followed
      // by the global object / base filename the client lib.
     
      q: {
         exports: 'Q'
      }
   }


});