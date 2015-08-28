define([
    'bluebird',
    'kb.runtime',
    'kb_widget_userProfile_base',
    'kb.client.methods',
    'kb.service.user_profile'
],
    function (Promise, R, SocialWidget, ClientMethods, UserProfileService) {
        'use strict';
        var Widget = Object.create(SocialWidget, {
            init: {
                value: function (cfg) {
                    cfg.name = 'CommonCollaboratorNetwork';
                    cfg.title = 'Common Collaborator Network';
                    this.SocialWidget_init(cfg);

                    return this;
                }
            },
            go: {
                value: function () {
                    this.start();
                    return this;
                }
            },
            setup: {
                value: function () {
                    // Set up workspace client

                    this.clientMethods = Object.create(ClientMethods).init();

                    if (R.isLoggedIn()) {
                        this.clientMethods = Object.create(ClientMethods).init();

                        if (R.hasConfig('services.user_profile.url')) {
                            this.userProfileClient = new UserProfileService(R.getConfig('user_profile_url'), {
                                token: R.getAuthToken()
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
                    return new Promise(function (resolve, reject) {
                        if (!R.isLoggedIn()) {
                            resolve();
                        } else {
                            Promise.resolve(this.userProfileClient.get_user_profile([this.params.userId]))
                                .then(function (data) {
                                    if (data && data[0]) {
                                        this.setState('currentUserProfile', data[0], false);
                                        this.clientMethods.getCollaborators({
                                            users: [this.getParam('userId')]
                                        })
                                            .then(function (collaborators) {
                                                this.setState('collaborators', collaborators);
                                                resolve();
                                            }.bind(this))
                                            .catch(function (err) {
                                                R.logError({
                                                    message: 'error building collab network...',
                                                    data: err
                                                });
                                                reject(err);
                                            });
                                    } else {
                                        reject('User not found');
                                    }
                                }.bind(this))
                                .catch(function (err) {
                                    R.logError({
                                        data:err
                                    });
                                    reject(err);
                                });
                        }
                    }.bind(this));
                }
            },
            // Overriding the default, simple, render because we need to update the title
            // TODO: make it easy for a widget to customize the title.
            render: {
                value: function () {
                    // Generate initial view based on the current state of this widget.
                    // Head off at the pass -- if not logged in, can't show profile.
                    if (this.error) {
                        this.renderError();
                    } else if (R.isLoggedIn()) {

                        this.places.title.html(this.renderTemplate('authorized_title'));
                        this.places.content.html(this.renderTemplate('authorized'));
                    } else {
                        // no profile, no basic aaccount info
                        this.places.title.html(this.widgetTitle);
                        this.places.content.html(this.renderTemplate('unauthorized'));
                    }
                    return this;
                }
            }
        });

        return Widget;
    });