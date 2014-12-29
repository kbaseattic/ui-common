define(['nunjucks', 'jquery', 'md5', 'kbaseuserprofileserviceclient'], function (nunjucks, $, md5, UserProfile) {
    "use strict";

    var ProfileWidget = Object.create({}, {
        init: {
            value: function (cfg) {
                this.userNameFetchUrl = "https://kbase.us/services/genome_comparison/users?usernames=";
                this._generatedId = 0; 

                this.container = cfg.container;
                if (typeof this.container === 'string') {
                    this.container = $(this.container);
                }

                // In all cases, we want an operable panel to interface with the user.
                this.createPanel();

                // Give ourselves the ability to show templates.
                var templateEnv = new nunjucks.Environment(new nunjucks.WebLoader('/src/widgets/social/templates'), {
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



                // this._super(options);

               

                

                
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
                templateEnv.addFilter('roleLabel', function(role) {
                    if (widget.userRolesMap[role]) {
                        return widget.userRolesMap[role];
                    } else {
                        return role;
                    }
                });
                templateEnv.addFilter('userClassLabel', function(userClass) {
                    if (widget.userClassesMap[userClass]) {
                        return widget.userClassesMap[userClass];
                    } else {
                        return userClass;
                    }
                });
                templateEnv.addFilter('titleLabel', function(title) {
                    if (widget.titlesMap[title]) {
                        return widget.titlesMap[title];
                    } else {
                        return title;
                    }
                });
                // create a gravatar-url out of an email address and a 
                // default option.
                templateEnv.addFilter('gravatar', function(email, size, rating, gdefault) {
                    // TODO: http/https.
                    var md5Hash = md5(email);
                    var url = 'http://www.gravatar.com/avatar/' + md5Hash + '?s=' + size + '&amp;r=' + rating + '&d=' + gdefault
                    return url;
                });
                templateEnv.addFilter('kbmarkup', function(s) {
                    s = s.replace(/\n/g, '<br>');
                    return s;
                });

                this.viewTemplate = templateEnv.getTemplate('userProfile_view.html');
                this.editTemplate = templateEnv.getTemplate('userProfile_edit.html');
                this.layoutTemplate = templateEnv.getTemplate('userProfile_layout.html');
                this.pictureTemplate = templateEnv.getTemplate('userProfile_picture.html');
                this.editAffiliationTemplate = templateEnv.getTemplate('userProfile_edit_affiliation.html');
                this.newAffiliationTemplate = templateEnv.getTemplate('userProfile_new_affiliation.html');
                this.noProfileTemplate = templateEnv.getTemplate('userProfile_no_profile.html');
                this.noUserTemplate = templateEnv.getTemplate('userProfile_no_user.html');
                this.unauthorizedTemplate = templateEnv.getTemplate('userProfile_unauthorized.html');

                // Set up the basic panel layout.
                this.setupLayout();

                // These are just convenience placeholders.
                this.alertPanel = this.panelBody.find('[data-placeholder="alert"]');
                this.infoPanel = this.panelBody.find('[data-placeholder="info"]');

                return this;
            }
        },

        createPanel: {
            value: function() {
                // Create the main panel for this widget.
                this.panel = '<div class="panel panel-default">'+
                                    '<div class="panel-heading"><span class="panel-title"></span></div>' +
                                    '<div class="panel-subitle"></div>' +
                                    '<div class="panel-body"></div></div>';

               
                this.container.html(this.panel);

                // Set up easy access to the title and body areas.
                this.panelTitle = this.container.find('.panel-heading .panel-title');
                this.panelBody = this.container.find('.panel-body');
            }
        },

        render: {
            value: function () {
                // Generate initial view.
                // Head off at the pass -- if not logged in, can't show profile.
                if (!this.authToken) {
                    this.panelTitle = 'Unauthorized';
                    this.infoPanel.empty().append(this.unauthorizedTemplate.render(this.context));
                } else if (this.userRecord && this.userRecord.user) {

                    // Title can be be based on logged in user infor or the profile.
                    if (this.userOwnsProfile) {
                        this.panelTitle.html('You - ' + this.loggedInName + ' (' + this.userRecord.user.username + ')');
                    } else {
                        this.panelTitle.html(this.userRecord.user.realname + ' (' + this.userRecord.user.username + ')');
                    }

                    this.context.user = this.userRecord.user;
                    this.context.profile = this.userRecord.profile;
                    this.context.account = this.userRecord.account;

                    this.setupPicture();
                    this.showInfoView();
                } else if (this.userRecord && this.userRecord.account) {
                    // no profile, but have basic account info.
                    this.context.account = this.userRecord.account;
                    this.panelTitle.html(this.userRecord.account.realname + ' (' + this.userRecord.account.username + ')');
                    this.setupPicture();
                    this.showNoProfileView();
                } else {
                    // no profile, no basic aaccount info
                    this.panelTitle.html('User Not Found');
                    this.setupPicture();
                    this.infoPanel.empty().append(this.noUserTemplate.render(this.context));
                }
                return this;
            }
        },

        sync: {
            value: function () {
 
                // DATA
                // This is where we get the data to feed to the widget.
                // Each widget has its own independent data fetch.

                if (!this.authToken) {
                    // We don't fetch any data if a user is not logged in.
                    this.userRecord = null;
                    this.setupPicture();
                    this.render();
                } else {

                    var userProfileServiceURL = 'http://dev19.berkeley.kbase.us/services/user_profile/rpc';
                    var userProfile;

                    //if (this.authToken) {
                        this.userProfileClient = new UserProfile(userProfileServiceURL, {
                            token: this.authToken
                        });
                    //} else {
                    //    this.userProfileClient = new UserProfile(userProfileServiceURL);
                    //}

                    var that = this;
                    this.userProfileClient.get_user_profile([this.userId], function(data) {
                        if (data[0]) {
                            // profile found
                            that.userRecord = data[0];
                            that.ensureAccountData(function() {
                                that.render();
                            });
                        } else {
                            // logged in
                            that.userRecord = {};
                            that.ensureAccountData(function() {
                                that.render();
                            });
                        }
                    }, function(err) {
                        console.log('Error getting user profile.');
                        console.log(err);
                        that.panelTitle.html('Error getting profile');
                        that.panelBody.html('<p>Error getting profile: ' + err + '</p>');
                    });
                    return this;
                }
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
                        then();
                    });
                } else {
                    then();
                }
            }
        },

        createUserRoles: {
            value: function () {
                /* User roles
                   Used to generate the user role checkboxes, and to provide labels for the info view
                */
                this.userRoles = [{
                    id: 'gsp-researcher',
                    label: 'GSP Researcher'
                }, {
                    id: 'berc-researcher',
                    label: 'BERC Researcher'
                }, {
                    id: 'ber-funded',
                    label: 'BER Funded'
                }, {
                    id: 'developer',
                    label: 'Developer'
                }, {
                    id: 'tester',
                    label: 'Tester'
                }];
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
                    textColor: '#FFF'
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
                    textColor: '#FFF'
                }, {
                    id: 'lime',
                    label: 'lime',
                    color: '#00ff00',
                    textColor: '#FFF'
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
                    textColor: '#FFF'
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
                    textColor: '#FFF'
                }, {
                    id: 'gray',
                    label: 'gray',
                    color: '#808080',
                    textColor: '#FFF'
                }];
                this.avatarColorsMap = {};
                for (var i in this.avatarColors) {
                    this.avatarColorsMap[this.avatarColors[i].id] = this.avatarColors[i].label;
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

        showEditView: {
            value: function() {
                var that = this;
                this.infoPanel.empty();

                var out = this.editTemplate.render(this.context);
                this.infoPanel.append(out);

                // wire up basic form crud buttons.
                $('[data-button="save"]').on('click', function(e) {
                    if (that.saveData()) {
                        that.showInfoView();
                    }
                });
                $('[data-button="cancel"]').on('click', function(e) {
                    that.showInfoView();
                });

                // wire up affiliation add/remove buttons.
                $('[data-button="add-affiliation"]').on('click', function(e) {
                    // grab the container 
                    var affiliations = that.panelBody.find('[data-field-group="affiliations"]');

                    // render a new affiliation
                    var id = that.genId();
                    var newAffiliation = that.newAffiliationTemplate.render({
                        generatedId: id
                    });

                    // append to the container
                    affiliations.append(newAffiliation);

                    // wire up the remove button.
                    // NB the container gets the generated-id stamp.
                    affiliations.find('[data-generated-id="' + id + '"] [data-button="remove"]').on('click', function(e) {
                        $(this).closest('[data-field-group="affiliation"]').remove();
                    });

                });

                this.panelBody.find('[data-field-group="affiliation"] [data-button="remove"]').on('click', function(e) {
                    $(this).closest('[data-field-group="affiliation"]').remove();
                });

                // select options and check radio and checkbox buttons...
                // hook up the buttons
                //    $('[data-placeholder="info"] [data-button="edit-info"]').on('click', function (e) {
                //    self.showEditView();
                //});
            }
        },

        showNoProfileView: {
            value: function() {
                var context = this.context;
                this.infoPanel.empty().append(this.noProfileTemplate.render(context));
            }
        },

        showInfoView: {
            value: function() {
                var that = this;
                this.infoPanel.empty();

                var context = this.context;
                context.user = this.userRecord.user;
                context.profile = this.userRecord.profile;
                context.account = this.userRecord.account;
                var out = this.viewTemplate.render(context);
                this.infoPanel.append(out);

                $('[data-placeholder="info"] [data-button="edit-info"]').on('click', function(e) {
                    that.clearMessages();
                    that.showEditView();
                });
            }
        },

        setFieldError: {
            value: function(name, message) {
                //console.log('ERROR: ' + name + ', ' + message);
                var fieldControl = this.panelBody.find('[data-field="' + name + '"]').closest('.form-group');
                if (fieldControl) {
                    fieldControl.addClass('has-error');
                }
                var fieldMessage = this.panelBody.find('[data-message-for-field="' + name + '"]');
                if (fieldMessage) {
                    fieldMessage.html(message);
                    fieldMessage.addClass('error-message');
                } else {
                    console.log('no message container: ' + message);
                }
                this.formHasError = true;
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
        getFieldValue: {
            value: function(name) {
                return this.panelBody.find('[data-field="' + name + '"]').val();
            }
        },

        clearErrors: {
            value: function() {
                this.clearMessages();
                this.clearFieldMessages();
                this.panelBody.find('.has-error').removeClass('has-error');
                this.panelBody.find('.error-message').removeClass('error-message');
                this.formHasError = false;
            }
        },

        saveData: {
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
                var title = this.panelBody.find('[data-field="title"]').val();
                if (title && title.length === 0) {
                    delete this.userRecord.profile['title'];
                } else {                    
                    this.userRecord.profile['title'] = title;
                }

                var location = this.panelBody.find('[data-field="location"]').val();
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
                var gravatar_default = this.panelBody.find('[data-field="gravatar_default"]').val();
                if (gravatar_default && gravatar_default.length > 0) {
                    this.userRecord.profile['gravatar_default'] = gravatar_default;
                } else {
                    //delete(this.userRecord.profile['gravatar_default']);
                    this.userRecord.profile['gravatar_default'] = '';
                }
                var avatar_color = this.panelBody.find('[data-field="avatar_color"]').val();
                if (avatar_color && avatar_color.length > 0) {
                    this.userRecord.profile['avatar_color'] = avatar_color;
                } else {
                    // delete(this.userRecord.profile['avatar_color']);
                    this.userRecord.profile['avatar_color'] = '';
                }

                var avatar_initials = this.panelBody.find('[data-field="avatar_initials"]').val();
                if (avatar_initials && avatar_initials.length > 0) {
                    this.userRecord.profile['avatar_initials'] = avatar_initials;
                } else {
                    // delete(this.userRecord.profile['avatar_initials']);
                    this.userRecord.profile['avatar_initials'] = '';
                }

                /* Coding: Roles, Funding */

                // ROLES
                var roles = [];
                var roleFields = this.panelBody.find('[data-field="roles"]');
                roleFields.each(function() {
                    if ($(this).is(':checked')) {
                        roles.push($(this).val());
                    }
                });
                this.userRecord.profile['roles'] = roles;


                // USER CLASS
                var userClassFields = this.panelBody.find('[data-field="userClass"]');
                userClassFields.each(function() {
                    if ($(this).is(':checked')) {
                        // should only be one...
                        that.userRecord.profile['userClass'] = $(this).val();
                    }
                });


                // AFFILIATIONS
                var affiliations = this.panelBody.find('[data-field-group="affiliation"]');
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
                this.userRecord.profile['personal_statement'] = this.panelBody.find("#personalStatement").val();


                // SAVING
                if (this.formHasError) {
                    this.addErrorMessage('Not Saved', 'Your changes cannot be saved due to one or more errors. Please review the form, make the required corrections, and try again.');
                    return false;
                }

                console.log('saving...');
                console.log(toSave);

                // Clean up the user info data object.

                var toSave = {};
                toSave.user = this.userRecord.user;
                toSave.profile = this.userRecord.profile;
                toSave.profile.basic_personal_info = null;
                toSave.profile.email_address = null;
                toSave.profile.email_addresses = null;
                console.log(toSave);

                toSave.env = null;

                this.userProfileClient.set_user_profile({
                        profile: toSave
                    },
                    function(response) {
                        that.addSuccessMessage('Success!', 'Your user profile has been updated.');
                    },
                    function(err) {
                        that.addErrorMessage('Error!', 'Your user profile could not be saved: ' + err.error.message);
                        console.log('Error setting user profile: ' + err);
                    });

                return true;
            }
        },

        clearFieldMessages: {
            value: function() {
                $('[data-field-message]').empty();
            }
        },
        clearMessages: {
            value: function() {
                this.alertPanel.empty();
            }
        },
        addSuccessMessage: {
            value: function(title, message) {
                this.alertPanel.append(
                    '<div class="alert alert-success alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>' + title + '</strong> ' + message + '</div>');
            }
        },
        addErrorMessage: {
            value: function(title, message) {
                this.alertPanel.append(
                    '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>' + title + '</strong> ' + message + '</div>');
            }
        },

        setupPicture: {
            value: function() {
                var pic = this.pictureTemplate.render(this.context);
                this.panelBody.find('[data-placeholder="picture"]').append(pic);
            }
        },

        setupLayout: {
            value: function() {
                nunjucks.configure({
                    autoescape: true
                });
                var out = this.layoutTemplate.render(this.userRecord);
                this.panelBody.append(out);
            }
        }

    });

    return ProfileWidget;
});