require(['jquery', 'kbaseutils', 'kbasesession','kbc_UserProfile', 'kbaseuserprofilewidget', 'json!functional-site/config.json'],
function ($, Utils, Session, UserProfileService, UserProfileWidget, Config) {
  /*
  If the user is logged in
  Load their profile
  If they don't have one
  create a stub...
  */
  var UserChecker = Object.create({}, {
    check: {
      value: function () {
        if (!Session.isLoggedIn()) {
          return;
        }
        
        
      
        var config =  Config[Config.setup];
        if (!Utils.hasProp(config, 'user_profile_url')) { 
          console.log('[CheckUser.check] The user profile client url is not defined.');
          return;
        }
          
        var username = Session.getUsername();
        var userProfileClient = new UserProfileService(Utils.getProp(config, 'user_profile_url'), {
           token: Session.getAuthToken()
        });
        
        Utils.promise(userProfileClient, 'get_user_profile', [username])
        .then(function(data) {
            if (data[0]) {
              console.log('[CheckUser.check] Got profile');
            } else {
              console.log('[CheckUser.check] No profile');
              Utils.promise(userProfileClient, 'lookup_globus_user', [username])
              .then(function(users) {
                var user = users[username];
                
                if (!user) {
                  throw 'User ' + username + ' was not found.';
                }
                var userRecord = UserProfileWidget.createStubProfile({
                  username: user.userName,
                  realname: user.fullName,
                  accountRecord: user,
                  createdBy: 'automatic'
                });

                Utils.promise(userProfileClient, 'set_user_profile', {profile: userRecord})
                .then(function() {
                  console.log('[CheckUser.check] Successfully created new stub profile');
                })
                .catch (function(err) {
                  console.log('[CheckUser.check] Error creating new stub profile (1)');
                  console.log(err);
                })
                .done();
              })
              .catch (function(err) {
                console.log('[CheckUser.check] Error creating new stub profile (2)');
                console.log(err);
              })
              .done();
              
            }
          })
        .catch (function(err) {
          console.log('[CheckUser.check] Error getting user profile. The error follows.');
          console.log(err);
        })
        .done();
        
      }
    }
  });
  
  UserChecker.check();
    
});