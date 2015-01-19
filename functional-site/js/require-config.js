// This is main.js
define('jquery', [], function() {
    return jQuery;
});
define('kbaseuserprofileserviceclient', [], function() {
  return UserProfile;
});
define('kbaseworkspaceserviceclient', [], function() {
  return Workspace;
})
require.config({
    baseUrl: '/',
    catchError: true,
    onError: function(err) {
		 alert("Error:" + err);
    },
    paths: {
      nunjucks: '/ext/nunjucks/nunjucks.min',
      md5: '/ext/md5/md5',
      q: '/ext/q/q.min',

      domReady: '/ext/require-plugins/domReady', 
    	text: '/ext/require-plugins/text',
      json: '/ext/require-plugins/json', 


      // widgets
      // userProfileServiceClient: '/functional-site/assets/js/kbclient/user_profile_Client.js',
      kbasesocialwidget: '/src/widgets/social/kbaseSocialWidget',
      kbaseuserprofile: '/src/widgets/social/kbaseUserProfile',
      kbaseuserprofilewidget: '/src/widgets/social/kbaseUserProfileWidget',
      kbaseuserrecentactivity: '/src/widgets/social/kbaseUserRecentActivity',
      kbaseuserpopularnarratives: '/src/widgets/social/kbaseUserPopularNarratives',
      kbaseusercollaboratornetwork: '/src/widgets/social/kbaseUserCollaboratorNetwork',
      kbaseusersearch: '/src/widgets/social/kbaseUserSearch',
      kbaseuserbrowsenarratives: '/src/widgets/social/kbaseUserBrowseNarratives',
      kbaseusersummary: '/src/widgets/social/kbaseUserSummary',
      kbasesession: '/src/kbaseSession',
      kbaseconfig: '/src/kbaseConfig', 
      kbaseutils: '/src/kbaseUtils',
      kbasecookie: '/src/kbaseCookie',
      kbasetest: '/src/kbaseTest',
      kbasenavbar: '/src/widgets/kbaseNavbar'
    },
   shim: { 
    'kbaseuserprofileserviceclient': {
      exports: 'UserProfile'
     },
     'kbaseworkspaceserviceclient': {
       exports: 'Workspace'
      },
     q: {
       exports: 'Q'
     }
   }
    
  
});
