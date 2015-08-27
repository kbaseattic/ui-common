define(['kb_widget_dashboard_base', 'kb.client.methods', 'kb.service.user_profile', 'kb.appstate', 'bluebird'],
    function (DashboardWidget, ClientMethods, UserProfileService, AppState, Promise) {
        "use strict";
        var Widget = Object.create(DashboardWidget, {
            init: {
                value: function (cfg) {
                    cfg.name = 'CollaboratorsWidget';
                    cfg.title = 'Common Collaborator Network';
                    this.DashboardWidget_init(cfg);

                    return this;
                }
            },
            setup: {
                value: function () {
                    // Set up workspace client
                    if (AppState.getItem('session').isLoggedIn()) {
                        this.clientMethods = Object.create(ClientMethods).init();

                        if (this.hasConfig('services.user_profile.url')) {
                            this.userProfileClient = new UserProfileService(this.getConfig('user_profile_url'), {
                                token: AppState.getItem('session').getAuthToken()
                            });
                        } else {
                            throw 'The user profile client url is not defined';
                        }

                    } else {
                        this.userProfileClient = null;
                    }
                }
            },
            setInitialState: {
                value: function (options) {
                    return new Promise(function (resolve, reject, notify) {
                        if (!AppState.getItem('session').isLoggedIn()) {
                            resolve();
                        } else {
                            AppState.whenItem('userprofile')
                                .then(function (profile) {
                                    this.setState('currentUserProfile', profile, false);
                                    this.clientMethods.getCollaborators()
                                        .then(function (collaborators) {
                                            this.setState('collaborators', collaborators);
                                            resolve();
                                        }.bind(this))
                                        .catch(function (err) {
                                            reject(err);
                                        });
                                }.bind(this))
                                .catch(function (err) {
                                    console.log('ERROR');
                                    console.log(err);
                                    reject(err);
                                })
                                .done();

                        }
                    }.bind(this));
                }
            }
        });

        return Widget;
    });