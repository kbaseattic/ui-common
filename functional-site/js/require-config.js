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
   'NarrativeMethodStore',
   'UserProfile',
   'Workspace'
];
// NB need the immediate function exec below in order to avoid
// variable capture problem with anon funcs.
for (var i in kbClients) {
   define('kbc_'+kbClients[i], [], (function (client) {
      return function () {
         return client;
      };
   })(window[kbClients[i]]));
      
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
      kbaseutils: '/src/kbaseUtils',
      kbasecookie: '/src/kbaseCookie',
      kbasetest: '/src/kbaseTest',
      'kb.utils.api': '/src/kbaseAPIUtils',
      'kb.alert': '/src/widgets/kbaseAlert',

      // widgets
      // userProfileServiceClient: '/functional-site/assets/js/kbclient/user_profile_Client.js',
      'kb.widget.buttonbar': '/src/widgets/kbaseButtonbar',
      kbasesocialwidget: '/src/widgets/social/kbaseSocialWidget',
      kbaseuserprofile: '/src/kbaseUserProfile',
      kbaseuserprofilewidget: '/src/widgets/social/kbaseUserProfileWidget',
      kbaseuserrecentactivity: '/src/widgets/social/kbaseUserRecentActivity',
      kbaseuserpopularnarratives: '/src/widgets/social/kbaseUserPopularNarratives',
      kbaseusersearch: '/src/widgets/social/kbaseUserSearch',
      kbaseuserbrowsenarratives: '/src/widgets/social/kbaseUserBrowseNarratives',
      kbaseusersummary: '/src/widgets/social/kbaseUserSummary',
      kbaseusercollaboratornetwork: '/src/widgets/social/kbaseUserCollaboratorNetwork',
      
      kbasesession: '/src/kbaseSession',
      kbaseconfig: '/src/kbaseConfig',
      kbasenavbar: '/src/widgets/kbaseNavbar',
      kbasebasewidget: '/src/widgets/kbaseBaseWidget',
      kbaseloginwidget: '/src/widgets/kbaseLoginWidget',
      
      // Dashboard widgets
      dashboard_widget: '/src/widgets/dashboard/DashboardWidget',
      dashboard_profile_widget: '/src/widgets/dashboard/ProfileWidget',
      dashboard_shared_narratives_widget: '/src/widgets/dashboard/SharedNarrativesWidget',
      dashboard_narratives_widget: '/src/widgets/dashboard/NarrativesWidget',
      dashboard_apps_widget: '/src/widgets/dashboard/AppsWidget',
      dashboard_data_widget: '/src/widgets/dashboard/DataWidget',
      'kb.widget.collaboratornetwork': '/src/widgets/dashboard/CollaboratorNetwork',
      
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