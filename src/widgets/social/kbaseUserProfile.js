define(['nunjucks', 'jquery', 'md5', 'kbaseuserprofileserviceclient'], function (nunjucks, $, md5, UserProfile) {
    "use strict";

    var ProfileWidget = Object.create({}, {
        init: {
            value: function (cfg) {                
                this._generatedId = 0; 

                this.container = cfg.container;
                if (typeof this.container === 'string') {
                    this.container = $(this.container);
                }


                // Give ourselves the ability to show templates.
                this.templateEnv = new nunjucks.Environment(new nunjucks.WebLoader('/src/widgets/social/templates'), {
                    'autoescape': false
                });


                // User state:
                this.authToken = cfg.token;

                if (this.authToken) {
                    this.loggedIn = true;
                    // TODO: is this the best way to call the kase login jquery plugin?
                    this.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
                    this.loggedInName = $('<div></div>').kbaseLogin().get_kbase_cookie('name');
                } else {
                    this.loggedIn = false;
                }

                // This is the requested user (not logged in user):
                this.userId = cfg.userId;
                if (this.loggedInUserId === this.userId) {
                    this.userOwnsProfile = true;
                } else {
                    this.userOwnsProfile = false;
                }
                
                this.userRecord = cfg.userInfo;
                this.userId = cfg.userId;
                this.loggedInUserid = cfg.loggedInUserId;

                // Some of the display and of course the editing logic uses the concept of "i am the owner of this profile".
                if (this.userId === this.loggedInUserId) {
                    this.isProfileOwner = true;
                } else {
                    this.isProfileOwner = false;
                }

                // The context object is what is given to templates.
                this.context = {};
                this.context.env = {
                    isOwner: this.isProfileOwner,
                    userId: this.userId
                };

                // Create dropdown and lookup lists and maps.
                this.createUserRoles();
                this.createUserClasses();
                this.createTitles();
                this.createGravatarDefaults();
                this.createAvatarColors();
                
                // Set up nunjucks templating.
                /*
                Note that we do not use autoescaping. This means we need to inspect all places where
                template variables are inserted, and ensure that any values which are derived from
                user input and not run through a transformation filter are escaped with | e.
                We would rather not use auto-escaping due to performance concerns.
                We cannot use auto-escaping due to the need to filter some fields before output.
                E.g. to insert line breaks, perform simple markup.
                */
                

                var widget = this;
                this.templateEnv.addFilter('roleLabel', function(role) {
                    if (widget.userRolesMap[role]) {
                        return widget.userRolesMap[role];
                    } else {
                        return role;
                    }
                });
                this.templateEnv.addFilter('userClassLabel', function(userClass) {
                    if (widget.userClassesMap[userClass]) {
                        return widget.userClassesMap[userClass];
                    } else {
                        return userClass;
                    }
                });
                this.templateEnv.addFilter('titleLabel', function(title) {
                    if (widget.titlesMap[title]) {
                        return widget.titlesMap[title];
                    } else {
                        return title;
                    }
                });
                // create a gravatar-url out of an email address and a 
                // default option.
                this.templateEnv.addFilter('gravatar', function(email, size, rating, gdefault) {
                    // TODO: http/https.
                    var md5Hash = md5(email);
                    var url = 'http://www.gravatar.com/avatar/' + md5Hash + '?s=' + size + '&amp;r=' + rating + '&d=' + gdefault
                    return url;
                });
                this.templateEnv.addFilter('kbmarkup', function(s) {
                    s = s.replace(/\n/g, '<br>');
                    return s;
                });
                this.templateEnv.addFilter('avatarBackgroundColor', function(color) {
                    return this.avatarColorsMap[color].color;
                }.bind(this));
                this.templateEnv.addFilter('avatarTextColor', function(color) {
                    return this.avatarColorsMap[color].textColor;
                }.bind(this));

                this.templates = {};
                /*
                this.viewTemplate = templateEnv.getTemplate('userProfile_view.html');
                this.editTemplate = templateEnv.getTemplate('userProfile_edit.html');
                this.layoutTemplate = templateEnv.getTemplate('userProfile_layout.html');
                this.pictureTemplate = templateEnv.getTemplate('userProfile_picture.html');
                this.editAffiliationTemplate = templateEnv.getTemplate('userProfile_edit_affiliation.html');
                this.newAffiliationTemplate = templateEnv.getTemplate('userProfile_new_affiliation.html');
                this.noProfileTemplate = templateEnv.getTemplate('userProfile_no_profile.html');
                this.noUserTemplate = templateEnv.getTemplate('userProfile_no_user.html');
                this.unauthorizedTemplate = templateEnv.getTemplate('userProfile_unauthorized.html');
                */



                return this;
            }
        },

        go: {
            value: function () {
                this.createInitialUI();
                this.sync(function() {
                    this.render()
                }.bind(this));
            }
        },

        stop: {
            value: function () {

            }
        },

        getTemplate: {
            value: function(name) {
                if (this.templates[name] === undefined) {
                    this.templates[name] = this.templateEnv.getTemplate('userProfile_' + name + '.html');
                }
                return this.templates[name];
            }
        },

       
        sync: {
            value: function (callback) {
                // DATA
                // This is where we get the data to feed to the widget.
                // Each widget has its own independent data fetch.
                if (!this.authToken) {
                    // We don't fetch any data if a user is not logged in.
                    this.userRecord = null;
                    callback();
                } else {
                    var userProfileServiceURL = 'http://dev19.berkeley.kbase.us/services/user_profile/rpc';
                    var userProfile;

                    this.userProfileClient = new UserProfile(userProfileServiceURL, {
                        token: this.authToken
                    });
                   
                    this.userProfileClient.get_user_profile([this.userId], 
                        function(data) {
                            if (data[0]) {
                                // profile found
                                this.userRecord = data[0];
                                this.context.userRecord = this.userRecord;
                                // NB: this is just for now. We should probably incorporate
                                // the account <-> profile syncing somewhere else/
                                this.ensureAccountData(function() {
                                    callback();
                                }.bind(this));
                            } else {
                                // logged in
                                this.userRecord = {};
                                this.context.userRecord = this.userRecord;
                                this.ensureAccountData(function() {
                                    callback();
                                }.bind(this));
                            }
                        }.bind(this), 
                        function(err) {
                            console.log('Error getting user profile.');
                            console.log(err);
                            that.titlePlace.html('Error getting profile');
                            that.contentPlace.html('<p>Error getting profile: ' + err + '</p>');
                        }.bind(this)
                    );
                }
                return this;
            }
        },

        ensureAccountData: {
            value: function(then) {
                if (!this.userRecord.account) {
                    var that  = this;
                    this.getGenomeComparisonUserInfo({userId: this.userId}, function (data) {
                        if (data.realname) {
                            that.userRecord.account = {
                                realname: data.realname,
                                email: data.email,
                                username: this.userId
                            };
                        } else {
                            // what to do if not found? Should not get here...
                        }
                        then.call(that);
                    });
                } else {
                    then.call(this);
                }
            }
        },

        createUserRoles: {
            value: function () {
                /* User roles
                   Used to generate the user role checkboxes, and to provide labels for the info view
                */
                this.userRoles = [{
                    id: 'pi',
                    label: 'Principal Investigator'
                }, {
                    id: 'gradstudent',
                    label: 'Graduate Student'
                }, {
                    id: 'developer',
                    label: 'Developer'
                }, {
                    id: 'tester',
                    label: 'Tester'
                }, {
                    id: 'documentation',
                    label: 'Documentation'
                }, {
                    id: 'general',
                    label: 'General Interest'
                }
                ];
                this.userRolesMap = {};
                for (var i in this.userRoles) {
                    this.userRolesMap[this.userRoles[i].id] = this.userRoles[i].label;
                }
                this.context.env.roles = this.userRoles;

            }
        },

        createUserClasses: {
            value: function () {
                this.userClasses = [{
                    id: 'gsp-researcher',
                    label: 'GSP Researcher'
                }, {
                    id: 'berc-researcher',
                    label: 'BERC Researcher'
                }, {
                    id: 'ber-funded',
                    label: 'BER Funded'
                }, {
                    id: 'kbase-internal',
                    label: 'KBase Staff'
                }, {
                    id: 'kbase-test',
                    label: 'KBase Test/Beta User'
                }, {
                    id: 'nonprofit',
                    label: 'Other Nonprofit'
                }, {
                    id: 'commercial',
                    label: 'Commercial User'
                }];
                this.userClassesMap = {};
                for (var i in this.userClasses) {
                    this.userClassesMap[this.userClasses[i].id] = this.userClasses[i].label;
                }
                this.context.env.userClasses = this.userClasses;
            }
        },

        createUserClasses: {
            value: function () {
                this.userClasses = [{
                    id: 'pi',
                    label: 'Principal Investigator'
                }, {
                    id: 'gradstudent',
                    label: 'Graduate Student'
                }, {
                    id: 'kbase-internal',
                    label: 'KBase Staff'
                }, {
                    id: 'kbase-test',
                    label: 'KBase Test/Beta User'
                }, {
                    id: 'commercial',
                    label: 'Commercial User'
                }];
                this.userClassesMap = {};
                for (var i in this.userClasses) {
                    this.userClassesMap[this.userClasses[i].id] = this.userClasses[i].label;
                }
                this.context.env.userClasses = this.userClasses;
            }
        },

        createTitles: {
            value: function () {
                this.titles = [{
                    id: 'mr',
                    label: 'Mr.'
                }, {
                    id: 'ms',
                    label: 'Ms.'
                }, {
                    id: 'dr',
                    label: 'Dr.'
                }, {
                    id: 'prof',
                    label: 'Prof.'
                }];
                this.titlesMap = {};
                for (var i in this.titles) {
                    this.titlesMap[this.titles[i].id] = this.titles[i].label;
                }
                this.context.env.titles = this.titles;
            }
        },

        createGravatarDefaults: {
            value: function () {
                 this.gravatar_defaults = [{
                    id: 'mm',
                    label: 'Mystery Man - simple, cartoon-style silhouetted outline'
                }, {
                    id: 'identicon',
                    label: 'Identicon - a geometric pattern based on an email hash'
                }, {
                    id: 'monsterid',
                    label: 'MonsterID - generated "monster" with different colors, faces, etc'
                }, {
                    id: 'wavatar',
                    label: 'Wavatar - generated faces with differing features and backgrounds'
                }, {
                    id: 'retro',
                    label: 'Retro - 8-bit arcade-style pixelated faces'
                }, {
                    id: 'blank',
                    label: 'Blank - A Blank Space'
                }];
                this.gravatarDefaultsMap = {};
                for (var i in this.gravatar_defaults) {
                    this.gravatarDefaultsMap[this.gravatar_defaults[i].id] = this.gravatar_defaults[i].label;
                }
                this.context.env.gravatar_defaults = this.gravatar_defaults;
            }
        },

        createAvatarColors: {
            value: function () {
                 this.avatarColors = [{
                    id: 'maroon',
                    label: 'maroon',
                    color: '#800000',
                    textColor: '#FFF'
                }, {
                    id: 'red',
                    label: 'red',
                    color: '#ff0000',
                    textColor: '#FFF'
                }, {
                    id: 'orange',
                    label: 'orange',
                    color: '#ffA500',
                    textColor: '#FFF'
                }, {
                    id: 'yellow',
                    label: 'yellow',
                    color: '#ffff00',
                    textColor: '#000'
                }, {
                    id: 'olive',
                    label: 'olive',
                    color: '#808000',
                    textColor: '#FFF'
                }, {
                    id: 'purple',
                    label: 'purple',
                    color: '#800080',
                    textColor: '#FFF'
                }, {
                    id: 'fuchsia',
                    label: 'fuchsia',
                    color: '#ff00ff',
                    textColor: '#FFF'
                }, {
                    id: 'white',
                    label: 'white',
                    color: '#ffffff',
                    textColor: '#000'
                }, {
                    id: 'lime',
                    label: 'lime',
                    color: '#00ff00',
                    textColor: '#000'
                }, {
                    id: 'green',
                    label: 'green',
                    color: '#008000',
                    textColor: '#FFF'
                }, {
                    id: 'navy',
                    label: 'navy',
                    color: '#000080',
                    textColor: '#FFF'
                }, {
                    id: 'blue',
                    label: 'blue',
                    color: '#0000ff',
                    textColor: '#FFF'
                }, {
                    id: 'aqua',
                    label: 'aqua',
                    color: '#00ffff',
                    textColor: '#000'
                }, {
                    id: 'teal',
                    label: 'teal',
                    color: '#008080',
                    textColor: '#FFF'
                }, {
                    id: 'black',
                    label: 'black',
                    color: '#000000',
                    textColor: '#FFF'
                }, {
                    id: 'silver',
                    label: 'silver',
                    color: '#c0c0c0',
                    textColor: '#000'
                }, {
                    id: 'gray',
                    label: 'gray',
                    color: '#808080',
                    textColor: '#FFF'
                }];
                this.avatarColorsMap = {};
                for (var i in this.avatarColors) {
                    this.avatarColorsMap[this.avatarColors[i].id] = this.avatarColors[i];
                }
                this.context.env.avatarColors = this.avatarColors;
            }
        },
       
        getGenomeComparisonUserInfo: {
            value: function(cfg, fun) {
                // Can't use this, because the globus CORS policy does 
                // not allow us to.
                // TODO: need to incorporate this into the user profile
                // service.
                // FORNOW: use the getGenomeComparisonUserInfo workaround for now.
                if (!this.authToken) {
                    fun.call(that, {});
                }
                var host = 'kbase.us';
                var path = '/services/genome_comparison/users';
                var that = this;
                var query = 'usernames=' + cfg.userId + '&token=' + this.authToken;
                var url = 'https://' + host + path + '?' + query;
                var that = this;
                $.ajax(url, {
                    dataType: 'json',
                    success: function (responseData) {  
                         if (responseData.data[cfg.userId] && responseData.data[cfg.userId].fullName) {
                            fun.call(that, {
                                realname: responseData.data[cfg.userId].fullName, 
                                email: responseData.data[cfg.userId].email,
                                username: cfg.userId
                            });
                        } else {
                            fun.call(that, {realname: null});
                        }
                    },
                    error: function (jqxhr, status, error) {
                        console.log('error getting globus data: ' + jqxhr.responseText + ', ' + error);
                    }
                });
            }
        },

        genId: {
            value: function() {
                return 'gen_' + this._generatedId++;
            }
        },



        createProfile: {
            value: function () {
                // Get basic user account info (may already have it).
                this.ensureAccountData(function () {

                    // Copy the account fields to the corresponding user and profile fields.
                    this.userRecord.user = {
                        username: this.userRecord.account.username,
                        realname: this.userRecord.account.realname,
                    };
                    this.userRecord.profile = {
                        email: this.userRecord.account.email
                    };

                    this.saveUserRecord({
                        success: function() {
                            this.addSuccessMessage('Success!', 'Your user profile has been created.');
                            this.showEditView();
                        }
                    });
                    
                })

            }
        },

        saveUserRecord: {
            value: function (cfg) {

                /*var toSave = {};
                toSave.user = this.userRecord.user;
                toSave.profile = this.userRecord.profile;
                toSave.profile.basic_personal_info = null;
                toSave.profile.email_address = null;
                toSave.profile.email_addresses = null;
                console.log(toSave);

                toSave.env = null;
                */
                var that = this;
                this.userProfileClient.set_user_profile({
                        profile: this.userRecord
                },
                function(response) {                    
                    if (cfg.success) {
                        cfg.success.call(that);
                    }
                },
                function(err) {
                    that.addErrorMessage('Error!', 'Your user profile could not be saved: ' + err.error.message);
                    console.log('Error setting user profile: ' + err);
                });

            }
        },


        setProfileField: {
            value: function(section, name, value) {
                this.userRecord[section][name] = value;
            }
        },
        deleteProfileField: {
            value: function(section, name) {
                delete this.userRecord[section][name];
            }
        },

        // DOM QUERY
        getFieldValue: {
            value: function(name) {
                return this.contentPlace.find('[data-field="' + name + '"]').val();
            }
        },

       
        // MODEL UPDATE
        updateUserRecordFromForm: {
            value: function() {
                var that = this;
                this.clearErrors();

                // step 1: translate forms to this object...

                // REALNAME
                var realname = this.getFieldValue('realname');
                if (!realname || realname.length === 0) {
                    this.setFieldError('realname', 'Name field is required');
                } else if (realname.length > 100) {
                    this.setFieldError('realname', 'The name field may not be more than 100 characters long.');
                } else {
                    this.setProfileField('user', 'realname', realname);
                }

                // SUFFIX
                var suffix = this.getFieldValue('suffix');
                if (suffix) {
                    if (suffix.length > 25) {
                        this.setFieldError('suffix', 'The Suffix field may not be more than 25 characters long.');
                    } else {
                        this.setProfileField('profile', 'suffix', suffix);
                    }
                } else {
                    this.deleteProfileField('profile', 'suffix');
                }

                // TITLE
                var title = this.contentPlace.find('[data-field="title"]').val();
                if (title && title.length === 0) {
                    delete this.userRecord.profile['title'];
                } else {                    
                    this.userRecord.profile['title'] = title;
                }

                var location = this.contentPlace.find('[data-field="location"]').val();
                if (location && location.length > 0) {
                    this.userRecord.profile['location'] = location;
                } else {
                    this.userRecord.profile['location'] = null;
                }

                // EMAIL
                var email = this.getFieldValue('email');
                if (!email || email.length === 0) {
                    this.setFieldError('email', 'The E-Mail field is required.');
                } else {
                    this.setProfileField('profile', 'email', email);
                }

                // GRAVATAR
                var gravatar_default = this.contentPlace.find('[data-field="gravatar_default"]').val();
                if (gravatar_default && gravatar_default.length > 0) {
                    this.userRecord.profile['gravatar_default'] = gravatar_default;
                } else {
                    //delete(this.userRecord.profile['gravatar_default']);
                    this.userRecord.profile['gravatar_default'] = '';
                }
                var avatar_color = this.contentPlace.find('[data-field="avatar_color"]').val();
                if (avatar_color && avatar_color.length > 0) {
                    this.userRecord.profile['avatar_color'] = avatar_color;
                } else {
                    // delete(this.userRecord.profile['avatar_color']);
                    this.userRecord.profile['avatar_color'] = '';
                }

                var avatar_initials = this.contentPlace.find('[data-field="avatar_initials"]').val();
                if (avatar_initials && avatar_initials.length > 0) {
                    this.userRecord.profile['avatar_initials'] = avatar_initials;
                } else {
                    // delete(this.userRecord.profile['avatar_initials']);
                    this.userRecord.profile['avatar_initials'] = '';
                }

                /* Coding: Roles, Funding */

                // ROLES
                var roles = [];
                var roleFields = this.contentPlace.find('[data-field="roles"]');
                roleFields.each(function() {
                    if ($(this).is(':checked')) {
                        roles.push($(this).val());
                    }
                });
                this.userRecord.profile['roles'] = roles;


                // USER CLASS
                var userClassFields = this.contentPlace.find('[data-field="userClass"]');
                userClassFields.each(function() {
                    if ($(this).is(':checked')) {
                        // should only be one...
                        that.userRecord.profile['userClass'] = $(this).val();
                    }
                });


                // AFFILIATIONS
                var affiliations = this.contentPlace.find('[data-field-group="affiliation"]');
                var affiliationsToSave = [];
                for (var i = 0; i < affiliations.length; i++) {

                    var startYear = $(affiliations[i]).find('[data-field="start_year"]').val();
                    if (startYear === NaN) {
                        startYear = '';
                        // TODO: flag as error.
                    }

                    var endYear = $(affiliations[i]).find('[data-field="end_year"]').val();
                    if (endYear === NaN) {
                        endYear = '';
                        // TODO: flag as error.
                    }

                    var affiliation = {
                        title: $(affiliations[i]).find('[data-field="title"]').val(),
                        institution: $(affiliations[i]).find('[data-field="institution"]').val(),
                        start_year: startYear,
                        end_year: endYear
                    };

                    // TODO better way of handling this!
                    if (affiliation['title'] && affiliation['institution']) {
                        affiliationsToSave.push(affiliation);
                    }
                }
                this.userRecord.profile['affiliations'] = affiliationsToSave;


                // PERSONAL STATEMENT / BIO
                this.userRecord.profile['personal_statement'] = this.contentPlace.find('[data-field="personal_statement"]').val();


                // SAVING
                if (this.formHasError) {
                    this.addErrorMessage('Not Saved', 'Your changes cannot be saved due to one or more errors. Please review the form, make the required corrections, and try again.');
                    return false;
                }

                //console.log('saving...');
                //console.log(toSave);

                // Clean up the user info data object.

               
                return true;
            }
        },

        // DOM UPDATE

        // main views

        showInfoView: {
            value: function() {
                this.contentPlace.html(this.getTemplate('view').render(this.context));
                this.contentPlace.find('[data-button="edit"]').on('click', function(e) {
                    this.clearMessages();
                    this.showEditView();
                }.bind(this));
            }
        },

        setFieldError: {
            value: function(name, message) {
                //console.log('ERROR: ' + name + ', ' + message);
                var fieldControl = this.contentPlace.find('[data-field="' + name + '"]').closest('.form-group');
                if (fieldControl) {
                    fieldControl.addClass('has-error');
                }
                var fieldMessage = this.contentPlace.find('[data-message-for-field="' + name + '"]');
                if (fieldMessage) {
                    fieldMessage.html(message);
                    fieldMessage.addClass('error-message');
                } else {
                    console.log('no message container: ' + message);
                }
                this.formHasError = true;
            }
        },
        createInitialUI: {
            value: function () {
                // Set up the basic panel layout.
                // This adds stuff like the message area at the top of the panel body,
                // and a main body div.
                this.renderLayout();
                console.log('layout rendered?');

                // Set up listeners for any kbase events we are interested in:
                $(document).on('loggedIn.kbase', function(e, auth) {
                    this.authToken = auth.token;
                    this.sync(function () {this.render()}.bind(this));
                }.bind(this));

                $(document).on('loggedOut.kbase', function(e, auth) {
                    this.authToken = null;
                    this.sync(function () {this.render()}.bind(this));
                }.bind(this));
            }
        },

        render: {
            value: function () {
                // Generate initial view.
                // Head off at the pass -- if not logged in, can't show profile.
                if (!this.authToken) {
                    this.titlePlace.html('Unauthorized');
                    this.renderPicture();
                    this.contentPlace.html(this.getTemplate('unauthorized').render(this.context));
                } else if (this.userRecord && this.userRecord.user) {
                    // Title can be be based on logged in user infor or the profile.
                    if (this.userOwnsProfile) {
                        this.titlePlace.html('You - ' + this.loggedInName + ' (' + this.userRecord.user.username + ')');
                    } else {
                        this.titlePlace.html(this.userRecord.user.realname + ' (' + this.userRecord.user.username + ')');
                    }
                    this.renderPicture();
                    this.showInfoView();
                } else if (this.userRecord && this.userRecord.account) {
                    // no profile, but have basic account info.
                    this.titlePlace.html(this.userRecord.account.realname + ' (' + this.userRecord.account.username + ')');
                    this.renderPicture();
                    this.showNoProfileView();
                } else {
                    // no profile, no basic aaccount info
                    this.titlePlace.html('User Not Found');
                    this.renderPicture();
                    this.contentPlace.html(this.getTemplate('no_user').render(this.context));
                }
                return this;
            }
        },


        showEditView: {
            value: function() {
                this.contentPlace.html(this.getTemplate('edit').render(this.context));

                // wire up basic form crud buttons.
                $('[data-button="save"]').on('click', function(e) {
                    if (this.updateUserRecordFromForm()) {
                        this.saveUserRecord({
                            success: function() {
                                this.addSuccessMessage('Success!', 'Your user profile has been updated.');
                                this.showInfoView();
                            }
                        });
                    }
                }.bind(this));
                $('[data-button="cancel"]').on('click', function(e) {
                    this.clearMessages();
                    this.showInfoView();
                }.bind(this));

                // wire up affiliation add/remove buttons.
                $('[data-button="add-affiliation"]').on('click', function(e) {
                    // grab the container 
                    var affiliations = this.contentPlace.find('[data-field-group="affiliations"]');

                    // render a new affiliation
                    var id = this.genId();
                    var newAffiliation = this.getTemplate('new_affiliation').render({
                        generatedId: id
                    });

                    // append to the container
                    affiliations.append(newAffiliation);
                }.bind(this));

                // Wire up remove button for any affiliation.
                this.contentPlace.find('[data-field-group="affiliations"]').on('click', '[data-button="remove"]', function(e) {
                    // remove the containing affiliation group.
                    $(this).closest('[data-field-group="affiliation"]').remove();
                });
                // on any field change events, we update the relevant affiliation panel title
                this.contentPlace.find('[data-field-group="affiliations"]').on('keyup', 'input', function(e) {
                    // remove the containing affiliation group.
                    var panel  = $(this).closest('[data-field-group="affiliation"]');
                    var title = panel.find('[data-field="title"]').val();
                    var institution = panel.find('[data-field="institution"]').val();
                    var startYear = panel.find('[data-field="start_year"]').val();
                    var endYear = panel.find('[data-field="end_year"]').val();
                    endYear = endYear ? endYear : 'present';

                    panel.find('.panel-title').html(title + ' @ ' + institution + ', ' + startYear+'-'+endYear);
                });
            }
        },

        showNoProfileView: {
            value: function() {
                this.contentPlace.html(this.getTemplate('no_profile').render(this.context));
                if (this.isProfileOwner) {
                    $('[data-button="create-profile"]').on('click', function(e) {
                        this.createProfile();
                    }.bind(this));
                }
            }
        },

        // dom  update utils
         clearErrors: {
            value: function() {
                this.clearMessages();
                this.clearFieldMessages();
                this.contentPlace.find('.has-error').removeClass('has-error');
                this.contentPlace.find('.error-message').removeClass('error-message');
                this.formHasError = false;
            }
        },

        clearFieldMessages: {
            value: function() {
                $('[data-field-message]').empty();
            }
        },
        clearMessages: {
            value: function() {
                this.alertPlace.empty();
            }
        },
        addSuccessMessage: {
            value: function(title, message) {
                this.alertPlace.append(
                    '<div class="alert alert-success alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>' + title + '</strong> ' + message + '</div>');
            }
        },
        addErrorMessage: {
            value: function(title, message) {
                this.alertPlace.append(
                    '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>' + title + '</strong> ' + message + '</div>');
            }
        },

        renderPicture: {
            value: function() {
                var pic = this.getTemplate('picture').render(this.context);
                this.container.find('[data-placeholder="picture"]').html(pic);
            }
        },

        renderLayout: {
            value: function() {
                nunjucks.configure({
                    autoescape: true
                });
                this.container.html(this.getTemplate('layout').render(this.context));
                 // These are just convenience placeholders.
                this.alertPlace = this.container.find('[data-placeholder="alert"]');
                this.contentPlace = this.container.find('[data-placeholder="content"]');
                this.titlePlace = this.container.find('[data-placeholder="title"]');
            }
        }

    });

    return ProfileWidget;
});