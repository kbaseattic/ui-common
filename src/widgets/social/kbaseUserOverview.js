(function($, undefined) {
    $.KBWidget({
        name: "KBaseUserOverview",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",

        userNameFetchUrl: "https://kbase.us/services/genome_comparison/users?usernames=",

        options: {
            container: null,
            userInfo: null,
            userProfileClient: null,
            userId: null,
            loggedInUserId: null,
            kbCache: {}
        },

        loggedIn: false,
        userId: null,
        loggedInUserId: null,
        userInfoData: null,
        isProfileOwner: false,
        alertPanel: null,

        init: function(options) {
            this._super(options);

            this.userProfileClient = options.userProfileClient;

            this.container = this.options.container;

            console.log(this.$elem);

            this.authToken = this.options.kbCache.token;

            if (options.kbCache.token) {
                this.loggedIn = true;
                this.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
            }
            this.userInfoData = options.userInfo;
            this.userProfile = options.userInfo;
            this.userId = options.userId;
            this.loggedInUserid = options.loggedInUserId;
            if (this.userId === this.loggedInUserId) {
                this.isProfileOwner = true;
            } else {
                this.isProfileOwner = false;
            }

            this.context = {};
            this.context.env = {
                isOwner: this.isProfileOwner
            };

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

            /*
            Note that we do not use autoescaping. This means we need to inspect all places where
            template variables are inserted, and ensure that any values which are derived from
            user input and not run through a transformation filter are escaped with | e.
            We would rather not use auto-escaping due to performance concerns.
            We cannot use auto-escaping due to the need to filter some fields before output.
            E.g. to insert line breaks, perform simple markup.
            */
            var env = new nunjucks.Environment(new nunjucks.WebLoader('/src/widgets/social/templates'), {
                'autoescape': false
            });

            var widget = this;
            env.addFilter('roleLabel', function(role) {
                if (widget.userRolesMap[role]) {
                    return widget.userRolesMap[role];
                } else {
                    return role;
                }
            });
            env.addFilter('userClassLabel', function(userClass) {
                if (widget.userClassesMap[userClass]) {
                    return widget.userClassesMap[userClass];
                } else {
                    return userClass;
                }
            });
            env.addFilter('titleLabel', function(title) {
                if (widget.titlesMap[title]) {
                    return widget.titlesMap[title];
                } else {
                    return title;
                }
            });
            // create a gravatar-url out of an email address and a 
            // default option.
            env.addFilter('gravatar', function(email, size, rating, gdefault) {
                // TODO: http/https.
                var md5Hash = md5(email);
                var url = 'http://www.gravatar.com/avatar/' + md5Hash + '?s=' + size + '&amp;r=' + rating + '&d=' + gdefault
                return url;
            });
            env.addFilter('kbmarkup', function(s) {
                s = s.replace(/\n/g, '<br>');
                return s;
            });

            this.viewTemplate = env.getTemplate('userProfile_view.html');
            this.editTemplate = env.getTemplate('userProfile_edit.html');
            this.layoutTemplate = env.getTemplate('userProfile_layout.html');
            this.pictureTemplate = env.getTemplate('userProfile_picture.html');
            this.editAffiliationTemplate = env.getTemplate('userProfile_edit_affiliation.html');
            this.newAffiliationTemplate = env.getTemplate('userProfile_new_affiliation.html');
            this.noProfileTemplate = env.getTemplate('userProfile_no_profile.html');

            // Set up the basic panel layout.
            this.setupLayout();
            this.alertPanel = this.$elem.find('[data-placeholder="alert"]');
            this.infoPanel = this.$elem.find('[data-placeholder="info"]');

            // initial view is either a read-only view of the profile or a no-profile placeholder.
            if (this.userInfoData) {

                this.context.user = this.userInfoData.user;
                this.context.profile = this.userInfoData.profile;

                this.setupPicture();
                this.showInfoView();
            } else {
                this.getGenomeComparisonUserInfo({userId: this.userId}, function (data) {
                    this.setupPicture();
                    this.context.account = {
                        realname: data.realname,
                        username: this.userId
                    };
                    this.container.find('.panel-title').html(data.realname + ' (' + this.userId + ')');
                    this.showNoProfileView();
                });
            }

            return this;
        },

        /*var userInfoData = {
                                                        basic_personal_info: {
                                                            real_name:loggedInName,
                                                            user_name:userId,
                                                            title:"",
                                                            suffix:"",
                                                            location:"",
                                                            email_addresses:[]
                                                        },
                                                        bio: {
                                                            affiliations:[],
                                                            degrees:[]
                                                        },
                                                        websites: [],
                                                        personal_statement: "",
                                                        interests: {
                                                            keywords:[],
                                                            research_statement:""
                                                        },
                                                        publications: [],
                                                        collaborators: [],
                                                        my_apps: [],
                                                        my_services: [],
                                                        resource_usage: {
                                                            disk_quota:20,
                                                            disk_usage:14,
                                                            disk_units:"GB",
                                                            cpu_quota:2000,
                                                            cpu_usage:138,
                                                            cpu_units : "CPU Hours"
                                                        }
                                                    };
        */

        getGlobusUserInfo: function(cfg, fun) {
            // Can't use this, because the globus CORS policy does 
            // not allow us to.
            // TODO: need to incorporate this into the user profile
            // service.
            // FORNOW: use the getGenomeComparisonUserInfo workaround for now.
            var host = 'nexus.api.globusonline.org';
            var that = this;
            var fieldsQuery;
            if (cfg.fieldsToGet) {
                fieldsQuery = 'fields='+fields;
            } else {
                fieldsQuery = '';
            }
            var url = 'https://' + host + '/users/' + cfg.userId + '?' + fieldsQuery;
            $.ajax(url, {
                headers: {
                    'Authorization': 'Globus-Goauthtoken ' + this.authToken
                },
                success: function (data) {  
                    if (data.data[cfg.userId] && data.data[cfg.userId].fullName) {
                        fun.call({realName: data.data[cfg.userId].fullName});
                    } else {
                        fun.call({realName: null});
                    }
                },
                error: function (jqxhr, status, error) {
                    console.log('error getting globus data: ' + jqxhr.responseText + ', ' + error);
                }
            });
        },
        getGenomeComparisonUserInfo: function(cfg, fun) {
            // Can't use this, because the globus CORS policy does 
            // not allow us to.
            // TODO: need to incorporate this into the user profile
            // service.
            // FORNOW: use the getGenomeComparisonUserInfo workaround for now.
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
                        fun.call(that, {realname: responseData.data[cfg.userId].fullName});
                    } else {
                        fun.call(that, {realname: null});
                    }
                },
                error: function (jqxhr, status, error) {
                    console.log('error getting globus data: ' + jqxhr.responseText + ', ' + error);
                }
            });
        },

        _generatedId: 0,
        genId: function() {
            return 'gen_' + this._generatedId++;
        },
        showEditView: function() {
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
                var affiliations = that.$elem.find('[data-field-group="affiliations"]');

                // render a new affiliation
                // console.log('AFF: ' + that.newAffiliationTemplate);
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

            this.$elem.find('[data-field-group="affiliation"] [data-button="remove"]').on('click', function(e) {
                $(this).closest('[data-field-group="affiliation"]').remove();
            });

            // select options and check radio and checkbox buttons...
            // hook up the buttons
            //    $('[data-placeholder="info"] [data-button="edit-info"]').on('click', function (e) {
            //    self.showEditView();
            //});
        },

        showNoProfileView: function() {
            var context = this.context;
            this.infoPanel.empty().append(this.noProfileTemplate.render(context));
        },

        showInfoView: function() {
            var that = this;
            this.infoPanel.empty();

            var context = this.context;
            context.user = this.userInfoData.user;
            context.profile = this.userInfoData.profile;
            var out = this.viewTemplate.render(context);
            this.infoPanel.append(out);

            $('[data-placeholder="info"] [data-button="edit-info"]').on('click', function(e) {
                that.clearMessages();
                that.showEditView();
            });
        },

        setFieldError: function(name, message) {
            console.log('ERROR: ' + name + ', ' + message);
            fieldControl = this.$elem.find('[data-field="' + name + '"]').closest('.form-group');
            if (fieldControl) {
                fieldControl.addClass('has-error');
            }
            var fieldMessage = this.$elem.find('[data-message-for-field="' + name + '"]');
            if (fieldMessage) {
                fieldMessage.html(message);
                fieldMessage.addClass('error-message');
            } else {
                console.log('no message container: ' + message);
            }
            this.formHasError = true;
        },

        setProfileField: function(section, name, value) {
            this.userInfoData[section][name] = value;
        },

        getFieldValue: function(name) {
            return this.$elem.find('[data-field="' + name + '"]').val();
        },

        clearErrors: function() {
            this.clearMessages();
            this.clearFieldMessages();
            this.$elem.find('.has-error').removeClass('has-error');
            this.$elem.find('.error-message').removeClass('error-message');
            this.formHasError = false;
        },

        saveData: function() {
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
                    this.setProfileField('user', 'suffix', suffix);
                }
            }

            // TITLE
            var title = this.$elem.find('[data-field="title"]').val();
            if (title && title.length === 0) {
                delete this.userInfoData.profile['title'];
            } else {
                this.userInfoData.profile['title'] = title;
            }

            var location = this.$elem.find('[data-field="location"]').val();
            if (location && location.length > 0) {
                this.userInfoData.profile['location'] = location;
            } else {
                this.userInfoData.profile['location'] = null;
            }

            // EMAIL
            var email = this.getFieldValue('email');
            if (!email || email.length === 0) {
                this.setFieldError('email', 'The E-Mail field is required.');
            } else {
                this.setProfileField('profile', 'email', email);
            }

            // GRAVATAR
            var gravatar_default = this.$elem.find('[data-field="gravatar_default"]').val();
            if (gravatar_default && gravatar_default.length > 0) {
                this.userInfoData.profile['gravatar_default'] = gravatar_default;
            } else {
                //delete(this.userInfoData.profile['gravatar_default']);
                this.userInfoData.profile['gravatar_default'] = '';
            }
            //console.log('AVATAR COLOR1: ' + this.userInfoData.profile['avatar_color']);
            var avatar_color = this.$elem.find('[data-field="avatar_color"]').val();
            //      console.log('AVATAR COLOR: ' + avatar_color);
            if (avatar_color && avatar_color.length > 0) {
                this.userInfoData.profile['avatar_color'] = avatar_color;
            } else {
                // delete(this.userInfoData.profile['avatar_color']);
                this.userInfoData.profile['avatar_color'] = '';
            }
            //    #console.log('AVATAR COLOR2: ' + this.userInfoData.profile['avatar_color']);

            var avatar_initials = this.$elem.find('[data-field="avatar_initials"]').val();
            if (avatar_initials && avatar_initials.length > 0) {
                this.userInfoData.profile['avatar_initials'] = avatar_initials;
            } else {
                // delete(this.userInfoData.profile['avatar_initials']);
                this.userInfoData.profile['avatar_initials'] = '';
            }

            /* Coding: Roles, Funding */

            // ROLES
            var roles = [];
            var roleFields = this.$elem.find('[data-field="roles"]');
            roleFields.each(function() {
                if ($(this).is(':checked')) {
                    roles.push($(this).val());
                }
            });
            this.userInfoData.profile['roles'] = roles;


            // USER CLASS
            var userClassFields = this.$elem.find('[data-field="userClass"]');
            userClassFields.each(function() {
                if ($(this).is(':checked')) {
                    // should only be one...
                    that.userInfoData.profile['userClass'] = $(this).val();
                }
            });


            // AFFILIATIONS
            var affiliations = this.$elem.find('[data-field-group="affiliation"]');
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
            this.userInfoData.profile['affiliations'] = affiliationsToSave;


            // PERSONAL STATEMENT / BIO
            this.userInfoData.profile['personal_statement'] = this.$elem.find("#personalStatement").val();


            // SAVING
            if (this.formHasError) {
                this.addErrorMessage('Not Saved', 'Your changes cannot be saved due to one or more errors. Please review the form, make the required corrections, and try again.');
                return false;
            }

            // Clean up the user info data object.

            var toSave = {};
            toSave.user = this.userInfoData.user;
            toSave.profile = this.userInfoData.profile;
            toSave.profile.basic_personal_info = null;
            toSave.profile.email_address = null;
            toSave.profile.email_addresses = null;

            toSave.env = null;

            console.log(toSave);

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
        },

        clearFieldMessages: function() {
            $('[data-field-message]').empty();
        },
        clearMessages: function() {
            this.alertPanel.empty();
        },
        addSuccessMessage: function(title, message) {
            this.alertPanel.append(
                '<div class="alert alert-success alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                '<strong>' + title + '</strong> ' + message + '</div>');
        },
        addErrorMessage: function(title, message) {
            this.alertPanel.append(
                '<div class="alert alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                '<strong>' + title + '</strong> ' + message + '</div>');
        },

        setupPicture: function() {
            var pic = this.pictureTemplate.render(this.context);
            this.$elem.find('[data-placeholder="picture"]').append(pic);
        },

        setupLayout: function() {
            nunjucks.configure({
                autoescape: true
            });
            var out = this.layoutTemplate.render(this.userProfile);
            this.$elem.append(out);
        }

    });
})(jQuery)