define(['kb.user_profile', 'kb.appstate', 'kb.runtime'],
function (UserProfile, AppState, R) {
    
    function loadProfile() {
        var userProfile = Object.create(UserProfile).init({username: R.getUsername()});
        userProfile.loadProfile()
                .then(function (profile) {
                    switch (profile.getProfileStatus()) {
                        case 'stub':
                        case 'profile':
                            AppState.setItem('userprofile', profile);
                            R.send('app', 'profile.loaded', {
                                profile: profile
                            });
                            // Postal.channel('session').publish('profile.loaded', {profile: profile});
                            break;
                        case 'none':
                            profile.createStubProfile({createdBy: 'session'})
                                    .then(function (profile) {
                                        AppState.setItem('userprofile', profile);
                                        R.send('app', 'profile.loaded', {
                                            profile: profile
                                        });
                                        // Postal.channel('session').publish('profile.loaded', {profile: profile});
                                    })
                                    .catch(function (err) {
                                        R.send('app', 'profile.loadfailure', {
                                            error: err
                                        });
                                        // Postal.channel('session').publish('profile.loadfailure', {error: err});
                                    })
                                    .done();
                            break;
                    }
                })
                .catch(function (err) {
                    var errMsg = 'Error getting user profile';
                    R.send('app', 'profile.loadfailure', {
                        error: err, 
                        message: errMsg
                    });
                    // Postal.channel('session').publish('profile.loadfailure', {error: err, message: errMsg});
                })
                .done();
    }
    
    return {
        loadProfile: loadProfile
    };
});