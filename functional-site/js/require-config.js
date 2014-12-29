// This is main.js
define('jquery', [], function() {
    return jQuery;
});
define('kbaseuserprofileserviceclient', [], function() {
  return UserProfile;
});
require.config({
    baseUrl: '/',
    catchError: true,
    onError: function(err) {
		 alert("Error:" + err);
    },
    paths: {
      nunjucks: '/ext/nunjucks/nunjucks.min',
      md5: '/ext/md5/md5',

      domReady: '/ext/require-plugins/domReady', 
    	text: '/ext/require-plugins/text',

      // widgets
      // userProfileServiceClient: '/functional-site/assets/js/kbclient/user_profile_Client.js',
      kbaseuserprofilewidget: '/src/widgets/social/kbaseUserProfile'
    },
   shim: { 
    'kbaseuserprofileserviceclient': {
      exports: 'UserProfile'
    }
  }
});