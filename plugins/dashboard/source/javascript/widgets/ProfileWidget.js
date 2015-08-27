define(['kb_widget_dashboard_base', 'kb_user_profile', 'kb.service.user_profile', 'kb.session', 'kb.appstate', 'kb.utils', 'bluebird'],
        function (DashboardWidget, UserProfile, UserProfileService, Session, AppState, Utils, Promise) {
            "use strict";
            var widget = Object.create(DashboardWidget, {
                init: {
                    value: function (cfg) {
                        cfg.name = 'ProfileWidget';
                        cfg.title = 'Your Profile';
                        this.DashboardWidget_init(cfg);

                        return this;
                    }
                },
                afterStart: {
                    value: function () {
                        // NB: this uses the old original state-on-object rather than
                        // the set/get/has state mechanism that most like-minded
                        // widgets use.
                        AppState.listenForItem('userprofile', {
                            onSet: function (profile) {
                                this.setState('userProfile', profile);
                                this.setState('profileCompletion', this.calcProfileCompletion(profile))
                            }.bind(this),
                            onError: function (err) {
                                this.setError(err);
                            }.bind(this)
                        });

                        return this;
                    }
                },
                setInitialState: {
                    value: function (options) {
                        return new Promise(function (resolve, reject, notify) {
                            if (!Session.isLoggedIn()) {
                                resolve();
                                return;
                            }
                            AppState.whenItem('userprofile')
                                .then(function (profile) {
                                    this.setState('userProfile', profile);
                                    this.setState('profileCompletion', this.calcProfileCompletion(profile))
                                    resolve();
                                }.bind(this))
                                .catch(function (err) {
                                    console.log('ERROR');
                                    console.log(err);
                                    reject(err);
                                })
                                .done();
                        }.bind(this));
                    }
                },
                onCreateTemplateContext: {
                    value: function (context) {
                        return Utils.merge(Utils.merge({}, context), {
                            env: {
                                lists: this.lists
                            }
                        });
                    }
                },
                calcProfileCompletion: {
                    value: function (profile) {
                        var completion = profile.calcProfileCompletion();
                        if (completion.status === 'complete') {
                            return null;
                        } else {
                            return completion;
                        }
                    }
                },
                getProfileStatus: {
                    value: function () {
                        if (this.status === 'error') {
                            return 'error';
                        } else {
                            if (this.hasState('userProfile')) {
                                return this.getState('userProfile').getProfileStatus();
                            } else {
                                return 'none';
                            }
                        }
                    }
                },
                render: {
                    value: function () {
                        // Generate initial view based on the current state of this widget.
                        // Head off at the pass -- if not logged in, can't show profile.
                        if (!Session.isLoggedIn()) {
                            this.places.title.html('Unauthorized');
                            this.places.content.html(this.renderTemplate('unauthorized'));
                            return;
                        }

                        if (this.status === 'error') {
                            this.renderError();
                        } else {
                            if (this.hasState('userProfile')) {
                                switch (this.getState('userProfile').getProfileStatus()) {
                                    case 'profile':
                                        // NORMAL PROFILE 
                                        // Title can be be based on logged in user infor or the profile.
                                        // set window title.
                                        try {
                                            this.places.title.html(this.widgetTitle);
                                            this.places.content.html(this.renderTemplate('view'));
                                        } catch (ex) {
                                            this.places.title.html(this.widgetTitle);
                                            this.places.content.html('ERROR: ' + ex);
                                        }
                                        break;
                                    case 'stub':
                                        // STUB PROFILE
                                        this.places.title.html(this.widgetTitle);
                                        this.places.content.html(this.renderTemplate('stub_profile'));
                                        break;
                                    case 'none':
                                        // NOT FOUND
                                        // no profile, no basic aaccount info
                                        this.places.title.html('User Not Found');
                                        this.places.content.html(this.renderTemplate('no_user'));
                                        break;
                                    default:
                                        this.renderErrorView('Invalid profile state "' + state + '"')
                                }
                                return this;
                            }
                        }
                    }
                }
            });

            return widget;
        });