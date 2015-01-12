define(['nunjucks', 'jquery', 'md5', 'kbasesocialwidget','kbaseuserprofileserviceclient'], 
       function(nunjucks, $, md5, SocialWidget, UserProfileService) {
    "use strict";

    var ProfileWidget = Object.create(SocialWidget, {

        init: {
            value: function(cfg) {
              cfg.name = 'UserProfile';
              cfg.title = 'User Profile';
              this.SocialWidget_init(cfg);
              
                this._generatedId = 0;

                // User profile service
                if (this.isLoggedIn()) {
                  if (this.hasConfig('user_profile_url')) {
                    this.userProfileClient = new UserProfileService(this.getConfig('user_profile_url'), {
                        token: this.auth.authToken
                    });
                  } else {
        					  throw 'The user profile client url is not defined';
        				  }
                }        
        
                $.ajaxSetup({
                    timeout: 10000
                });


                // Create dropdown and lookup lists and maps.
                this.createListMaps();

                // Set up nunjucks templating.
                /*
                Note that we do not use autoescaping. This means we need to inspect all places where
                template variables are inserted, and ensure that any values which are derived from
                user input and not run through a transformation filter are escaped with | e.
                We would rather not use auto-escaping due to performance concerns.
                We cannot use auto-escaping due to the need to filter some fields before output.
                E.g. to insert line breaks, perform simple markup.
                */


                this.templates.env.addFilter('roleLabel', function(role) {
                    if (this.listMaps['userRoles'][role]) {
                        return this.listMaps['userRoles'][role].label;
                    } else {
                        return role;
                    }
                }.bind(this));
                this.templates.env.addFilter('userClassLabel', function(userClass) {
                    if (this.listMaps['userClasses'][userClass]) {
                        return this.listMaps['userClasses'][userClass].label;
                    } else {
                        return userClass; 
                    }
                }.bind(this));
                this.templates.env.addFilter('titleLabel', function(title) {
                    if (this.listMaps['userTitles'][title]) {
                        return this.listMaps['userTitles'][title].label;
                    } else {
                        return title;
                    }
                }.bind(this));
                // create a gravatar-url out of an email address and a 
                // default option.
                this.templates.env.addFilter('gravatar', function(email, size, rating, gdefault) {
                    // TODO: http/https.
                    var md5Hash = md5(email);
                    // window.location.protocol
                    var url = 'https://www.gravatar.com/avatar/' + md5Hash + '?s=' + size + '&amp;r=' + rating + '&d=' + gdefault
                    return url;
                });
                this.templates.env.addFilter('kbmarkup', function(s) {
                    s = s.replace(/\n/g, '<br>');
                    return s;
                });
                this.templates.env.addFilter('avatarBackgroundColor', function(color) {
                    return this.listMaps['avatarColor'][color].color;
                }.bind(this));
                this.templates.env.addFilter('avatarTextColor', function(color) {
                    return this.listMaps['avatarColor'][color].textColor;
                }.bind(this));

                return this;
            }
        },

        calcState: {
            value: function() {

                if (this.isLoggedIn()) {
                    if (this.userRecord) {
                        if (this.userRecord.user) {
                            if (this.userRecord.profile.userdata) {
                                this.profileStatus = 'profile';
                            } else {
                                this.profileStatus = 'stub';
                            }
                        } else {
                            if (this.userRecord.profile.account) {
                                this.profileStatus = 'accountonly';
                            } else {
                                this.profileStatus = 'error';
                            }
                        }
                    } else {
                        this.profileStatus = 'none';
                    }
                } else {
                    this.profileStatus = 'notloggedin';
                }
                return this.profileStatus
            }
        },



        resetState: {
            value: function() {
                this.userRecord = null;
                // this.accountRecord = null;
            }
        },

        /*
            getCurrentState 
        */
        getCurrentState: {
            value: function(options) {
                // DATA
                // This is where we get the data to feed to the widget.
                // Each widget has its own independent data fetch.
                // This may be called at any point to
                this.resetState();
                if (!this.isLoggedIn()) {
                    // We don't fetch any data if a user is not logged in. 
                    options.success();
                } else {
                    this.userProfileClient.get_user_profile([this.params.userId],
                        function(data) {
                            if (data[0]) {
                                // profile found
                                this.userRecord = data[0];

                                // NB this should never occur in production, but in our
                                // testing phase we are evolving profile structure so we
                                // try to fix it up here... for now.
                                if (!this.userRecord.profile) {
                                    this.userRecord.profile = {
                                        metadata: {},
                                        userdata: null,
                                        account: null
                                    }
                                }

                                if (this.userRecord.profile.account) {
                                    // this.accountRecord = this.userRecord.profile.account;
                                    options.success();
                                } else {
                                    // ASYNC
                                    this.getUserAccountInfo({
                                        userId: this.params.userId,
                                        success: function(data) {
                                            // like i said, this is just a hack for now.
                                            this.userRecord.profile.account = data;
                                            options.success();
                                        }.bind(this),
                                        error: function(err) {
                                            options.error(err);
                                        }.bind(this)
                                    });
                                }
                            } else {
                                // ASYNC
                                /*                              
                                 this.getUserAccountInfo({
                                      userId: this.params.userId, 
                                      success: function (data) {
                                          this.accountRecord = data;
                                          options.success();
                                      }.bind(this),
                                      error: function (err) {
                                        options.error(err);
                                      }.bind(this)
                                  });
                                */
                                options.success();
                            }
                        }.bind(this),
                        function(err) {
                            console.log('[UserProfile.sync] Error getting user profile.');
                            console.log(err);
                            options.error(err);
                        }.bind(this)
                    );
                }
                return this;
            }
        },

        fixProfile: {
            value: function(options) {

                if (!this.isOwner()) {
                    options.error('Now profile owner, cannot fix it up.');
                    return;
                }

                if (this.userRecord) {
                    if (this.userRecord.profile.account) {
                        // We are all good here... nothing to do.
                        options.success();
                    } else {
                        // No account property on user record
                        // This is not a normal state and can be removed, inciting an error
                        // condition, after testing.

                        this.getUserAccountInfo({
                            userId: this.params.userId,
                            success: function(data) {
                                // like i said, this is just a hack for now.
                                this.userRecord.profile.account = data;

                                this.saveUserRecord({
                                    success: function() {
                                        options.success();
                                    }.bind(this),
                                    error: function(err) {
                                        options.error(err);
                                    }.bind(this)
                                });


                            }.bind(this),
                            error: function(err) {
                                options.error(err);
                            }.bind(this)
                        });
                    }
                } else {
                    // No user record for user ... so we create a stub profile.
                    this.getUserAccountInfo({
                        userId: this.params.userId,
                        success: function(data) {

                            this.userRecord = this.createStubProfile({
                                username: this.accountRecord.userName,
                                realname: this.accountRecord.fullName,
                                accountRecord: this.accountRecord
                            });

                            // ASYNC
                            this.saveUserRecord({
                                success: function() {
                                    options.success();
                                }.bind(this),
                                error: function(err) {
                                    options.error(err);
                                }.bind(this)
                            });

                            options.success();
                        }.bind(this),
                        error: function(err) {
                            options.error(err);
                        }.bind(this)
                    });
                }
            }
        },

        createStubProfile: {
            value: function(baseProfile) {
                var record = {
                    user: {
                        username: baseProfile.username,
                        realname: baseProfile.realname
                    },
                    profile: {
                        metadata: {
                            created: (new Date()).toISOString()
                        },
                        account: baseProfile.account,
                        userdata: {}
                    }
                }
                return record;
            }
        },

        createProfile: {
            value: function(baseProfile) {
                var record = this.createStubProfile(baseProfile);

                record.profile.userdata = {};

                // If real profile fields provided, create the userdata portion of the profile.
                if (baseProfile.email) {
                    record.profile.userdata.email = baseProfile.email;
                }

                // We actually create the userdata bare object, but remove it if it is empty
                if (record.profile.userdata && Object.getOwnPropertyNames(record.profile.userdata).length === 0) {
                    record.profile.userdata = null;
                }

                return record;
            }
        },

        go: { 
            value: function() {
              this.renderLayout();
                this.renderWaitingView();
                this.getCurrentState({
                    success: function() {
                        if (this.isOwner()) {
                            this.fixProfile({
                                success: function() {
                                    this.render();
                                }.bind(this),
                                error: function(err) {
                                    this.calcState();
                                    this.renderErrorView(err);
                                }.bind(this)
                            });
                        } else {
                            this.render();
                        }
                    }.bind(this),
                    error: function(err) {
                        this.calcState();
                        this.renderErrorView(err);
                    }.bind(this)
                });
                return this;
            }
        },

        createTemplateContext: {
          value: function () {
            var completion = this.calcProfileCompletion();
            return this.merge(this.merge({}, this.context), {         
                  env: {
                      lists: this.lists,
                      profileCompletion: this.calcProfileCompletion()
                  },                    
                  userRecord: this.userRecord
              });
          }
        },
        
        lists: {
            value: {
                userRoles: [{
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
                }],
                userClasses: [{
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
                }],
                userTitles: [{
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
                }],
                gravatarDefaults: [{
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
                }],
                avatarColors: [{
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
                }]


            }
        },

        createListMaps: {
            value: function() {
                this.listMaps = {};
                for (var listId in this.lists) {
                    var list = this.lists[listId];

                    this.listMaps[listId] = {};

                    for (var i in list) {
                        this.listMaps[listId][list[i].id] = list[i];
                    }
                }
            }
        },

        // MODEL UPDATE

        /*
        updateField: {
            value: function (fieldName, controlType, dataPath, validationFun) {
                var field = this.places.content.find('[data-field="'+fieldName+'"]');
                if (!field) {
                    throw 'Field "' + fieldName + '" was not found on the form.';
                }
                var control = field.find(controlType);
                if (!control) {
                    throw 'Field "' + fieldName + '" does not have an input control of type "' + controlType + '"';
                }

                try {
                    var result = validationFun.call(this, control.val());
                    if (result === undefined) {
                        this.deleteProfileField(dataPath, fieldName, result);
                    } else {
                        this.setProfileField(dataPath, fieldName, result);
                    }
                } catch (err) {
                    this.setFieldError(field, err);
               }
            }
        },
        */

        formToObject: {
            value: function(schema) {
                // walk the schema, building an object out of any form values 
                // that we find.
                var that = this;
                var form = this.places.content.find['form'];
                var fieldValidationErrors = [];
                var objectValidationErrors = [];
                var parser = Object.create({}, {
                    init: {
                        value: function(cfg) {
                            if (typeof cfg.container === 'string') {
                                this.container = $(cfg.container);
                            } else {
                                this.container = cfg.container;
                            }
                            this.currentPath = [];
                            this.jsonRoot = Object.create(null);
                            this.currentJsonNode = this.jsonRoot;
                            this.fieldValidationErrors = cfg.fieldValidationErrors;
                            this.objectValidationErrors = cfg.objectValidationErrors;
                            return this;
                        }
                    },
                    getFieldValue: {
                        value: function(name) {
                            // Each form control is marked with a data-field attribute on a container element, with the name set to the 
                            // property path on the data object. The actual form control is found inisde the container.
                            var field = this.container.find('[data-field="' + name + '"]');
                            if (!field || field.length === 0) {
                                // NB: this is not null, which is reserved for a field with empty data.
                                return undefined;
                            }
                            var control = field.find('input, textarea, select');
                            if (!control || control.length === 0) {
                                // NB: this is not null, which is reserved for a field with empty data.
                                return undefined;
                            }
                            switch (control.prop('tagName').toLowerCase()) {
                                case 'input':
                                    switch (control.attr('type')) {
                                        case 'checkbox':
                                            return control.map(function() {
                                                var $el = $(this);
                                                if ($el.prop('checked')) {
                                                    return $el.val();
                                                } else {
                                                    return null;
                                                }
                                            }).get();
                                        case 'radio':
                                            var value = control.map(function() {
                                                var $el = $(this);
                                                if ($el.prop('checked')) {
                                                    return $el.val();
                                                } else {
                                                    return null;
                                                }
                                            }).get();
                                            if (value.length === 1) {
                                                return value[0];
                                            } else {
                                                return null;
                                            }
                                        default:
                                            var value = control.val();
                                            if (value && value.length > 0) {
                                                return value;
                                            } else {
                                                return null;
                                            }
                                    }
                                case 'textarea':
                                    var value = control.val();
                                    if (value) {
                                        if (value.length === 0) {
                                            value = null;
                                        }
                                    }
                                    return value;
                                case 'select':
                                    var value = control.val();
                                    if (value) {
                                        if (value.length === 0) {
                                            value = null;
                                        }
                                    }
                                    return value;
                            }
                        }
                    },
                    parseObject: {
                        value: function(schema) {
                            var newObject = {};
                            var propNames = Object.getOwnPropertyNames(schema.properties);
                            for (var i = 0; i < propNames.length; i++) {
                                var propName = propNames[i];
                                var propSchema = schema.properties[propName];

                                switch (propSchema.type) {
                                    case 'object':
                                        var json = {};
                                        // var node = parentNode.find('[data-field-group="'+propName+'"]');
                                        this.currentPath.push(propName);

                                        var value = this.parseObject(propSchema);
                                        if (value) {
                                            newObject[propName] = value;
                                        }


                                        this.currentPath.pop();
                                        break;
                                    case 'array':
                                        this.currentPath.push(propName);
                                        var value = this.parseArray(propSchema);
                                        if (value) {
                                            newObject[propName] = value;
                                        }
                                        this.currentPath.pop();
                                        break;
                                    case 'string':
                                        this.currentPath.push(propName);
                                        var value = this.parseString(propSchema);
                                        var error = this.validateString(value, propSchema);
                                        if (error) {
                                            this.addFieldError({
                                                propPath: this.currentPath.join('.'),
                                                message: error

                                            })
                                        }
                                        if (value !== undefined) {
                                            newObject[propName] = value;
                                        }
                                        this.currentPath.pop();
                                        break;
                                    case 'integer':
                                        this.currentPath.push(propName);
                                        var value = this.parseInteger(propSchema);
                                        if (value !== undefined) {
                                            newObject[propName] = value;
                                        }
                                        this.currentPath.pop();
                                        break;
                                    case 'boolean':
                                        // noop
                                        break;
                                    case 'null':
                                        // noop
                                        break;
                                }

                            }

                            if (schema.required) {
                                for (var i = 0; i < schema.required.length; i++) {
                                    var requiredProp = schema.required[i];
                                    if (newObject[requiredProp] === undefined || newObject[requiredProp] === null) {
                                        this.currentPath.push(requiredProp);
                                        var propPath = this.currentPath.join('.');
                                        this.addFieldError({
                                            propPath: propPath,
                                            message: 'This field is required'
                                        });
                                        this.currentPath.pop();
                                    }
                                }
                            }

                            return newObject;
                        }

                    },
                    parseArray: {
                        value: function(schema) {
                            // for now just handle a non-nested array ... i.e. an array of objects or values
                            var itemSchema = schema.items;
                            // The array items are driven by the DOM in this case. We need to loop through the
                            // nodes returned by the selector for this array.
                            //this.currentPath.push(propName);
                            var path = this.currentPath.join('.');
                            // We select the field by the usual method, data-field. On in this case, it will contain
                            // a form control which can provide multiple selections, either a checkbox, a select, or
                            // multiple inputs with the same name (?).
                            // We have to handle the case of multi-valued fields (checkbox)
                            switch (itemSchema.type) {
                                case 'string':
                                    // map to controls here. If the controls are implemented right, as checkboxes or
                                    // a select with multiple-values, we get back an array of values.
                                    return this.getFieldValue(path);
                                case 'object':
                                    // we don't have a canned way to get a set of fields ... yet.
                                    var value = this.container.find('[data-field="' + path + '"] fieldset').map(function(i) {
                                        // do array objects in a separate parser because we need to establish a new
                                        // container (one for each array element) and path (a fresh path for each array element and container)
                                        var newObj = Object.create(parser).init({
                                            container: $(this),
                                            fieldValidationErrors: fieldValidationErrors,
                                            objectValidationErrors: objectValidationErrors
                                        }).parseObject(itemSchema);
                                        return newObj;
                                    }).get();
                                    return value;
                                default:
                                    throw "Can't make array out of " + itemSchema.type + " yet.";
                            }
                        }

                    },
                    validateString: {
                        value: function(value, schema) {
                            // handle formats:
                            if (value) {
                                switch (schema.format) {
                                    case 'email':
                                        var emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        if (!emailRe.test(value)) {
                                            return 'Invalid email format';
                                        }
                                        break;
                                }
                            }
                            return false;
                        }
                    },
                    parseString: {
                        value: function(schema) {
                            var fieldName = this.currentPath.join('.');
                            return this.getFieldValue(fieldName);
                        }
                    },
                    addFieldError: {
                        value: function(err) {
                            err.container = this.container;
                            this.fieldValidationErrors.push(err);
                        }
                    },
                    parseInteger: {
                        value: function(schema) {
                            var fieldName = this.currentPath.join('.');
                            var strVal = this.getFieldValue(fieldName);
                            if (strVal) {
                                if (strVal.length > 0) {
                                    var intVal = parseInt(strVal);
                                    if (isNaN(intVal)) {
                                        this.addFieldError({
                                            propPath: fieldName,
                                            message: 'Not a valid integer'
                                        });
                                        return undefined;
                                    } else {
                                        var invalid = false;
                                        if (schema.minimum) {
                                            if (schema.minimumExclusive) {
                                                if (intVal <= schema.minimum) {
                                                    invalid = true;
                                                    this.addFieldError({
                                                        propPath: fieldName,
                                                        message: 'The integer value is below or at the minimum of ' + schema.minimum
                                                    });
                                                }
                                            } else {
                                                if (intVal < schema.minimum) {
                                                    invalid = true;
                                                    this.addFieldError({
                                                        propPath: fieldName,
                                                        message: 'The integer value is below the minimum of ' + schema.minimum
                                                    });
                                                }
                                            }
                                        }
                                        if (schema.maximum) {
                                            if (schema.maximumExclusive) {
                                                if (intVal >= schema.maximum) {
                                                    invalid = true;
                                                    this.addFieldError({
                                                        propPath: fieldName,
                                                        message: 'The integer value is above or at the maximum of ' + schema.maximum
                                                    });
                                                }
                                            } else {
                                                if (intVal > schema.maximum) {
                                                    invalid = true;
                                                    this.addFieldError({
                                                        propPath: fieldName,
                                                        message: 'The integer value is above the maximum of ' + schema.maximum
                                                    });
                                                }
                                            }
                                        }
                                        if (invalid) {
                                            return undefined;
                                        } else {
                                            return intVal;
                                        }
                                    }
                                } else {
                                    return undefined;
                                }
                            } else {
                                return undefined;
                            }
                        }
                    }
                });
                var result = parser.init({
                    container: this.places.content,
                    fieldValidationErrors: fieldValidationErrors,
                    objectValidationErrors: objectValidationErrors
                }).parseObject(schema);

                var errors = false;
                if (fieldValidationErrors.length > 0) {
                    errors = true;
                    this.showFieldValidationErrors(fieldValidationErrors);
                }
                if (objectValidationErrors.length > 0) {
                    errors = true;
                    // this.showObjectValidationErrors(objectValidationErrors);
                }

                if (errors) {
                    throw 'Validation errors processing the form';
                } else {
                    return result;
                }
            }
        },

        showFieldValidationErrors: {
            value: function(errors) {
                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];
                    this.showFieldError(error.container, error.propPath, error.message);
                }
            }
        },

        updateUserRecord: {
            value: function(newRecord) {
                var recordCopy = this.merge({}, this.userRecord);
                var merged = this.merge(recordCopy, newRecord);
                return merged;
            }
        },
        getUserProfileFormSchema: {
            value: function() {
                // For building and validating user form input for a user profile.
                // This is a subset of the user profile schema.
                // FORNOW: fairly loose, other than sensible limits and formatting checks.
                // NB: 
                return {
                    type: 'object',
                    properties: {
                        user: {
                            type: 'object',
                            title: 'User', 
                            properties: {
                                realname: {
                                    type: 'string',
                                    title: 'Real Name',
                                    maxLength: 100
                                }
                            },
                            required: ['realname']
                        },
                        profile: {
                            type: 'object',
                            properties: {
                                userdata: {
                                    type: 'object',
                                    properties: {
                                        avatar: {
                                            type: 'object',
                                            properties: {
                                                gravatar_default: {
                                                    type: 'string',
                                                    title: 'Gravatar Default Setting'
                                                },
                                                avatar_color: {
                                                    type: 'string',
                                                    title: 'Avatar Background Color'
                                                },
                                                avatar_phrase: {
                                                    type: 'string',
                                                    title: 'Avatar Phrase'
                                                }
                                            }
                                        },
                                        title: {
                                            type: 'string',
                                            title: 'Title'
                                        },
                                        suffix: {
                                            type: 'string',
                                            title: 'Suffix'
                                        },
                                        location: {
                                            type: 'string',
                                            title: 'Geographic Location',
                                            maxLength: 25
                                        },
                                        email: {
                                            type: 'string',
                                            title: 'E-Mail Address',
                                            format: 'email'
                                        },
                                        personal_statement: {
                                            type: 'string',
                                            title: 'Personal Statement',
                                        },
                                        user_class: {
                                            type: 'string',
                                            title: 'User Type'
                                        },
                                        roles: {
                                            type: 'array',
                                            title: 'Roles',
                                            items: {
                                                type: 'string'
                                            }
                                        },
                                        affiliations: {
                                            type: 'array',
                                            title: 'Affiliation',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    title: {
                                                        type: 'string',
                                                        title: 'Title'
                                                    },
                                                    institution: {
                                                        type: 'string',
                                                        title: 'Institution'
                                                    },
                                                    start_year: {
                                                        type: 'integer',
                                                        title: 'Start Year',
                                                        minimum: 1900,
                                                        maximum: 2100
                                                    },
                                                    end_year: {
                                                        type: 'integer',
                                                        title: 'End Year',
                                                        minimum: 1900,
                                                        maximum: 2100
                                                    }
                                                },
                                                required: ['title', 'institution', 'start_year']
                                            }
                                        }
                                    },
                                    required: ['email', 'user_class', 'roles', 'location']
                                }
                            }
                        }
                    }
                };
            }
        },
        getUserProfileSchema: {
            value: function() {
                return {
                    type: 'object',
                    properties: {
                        user: {
                            type: 'object',
                            properties: {
                                username: {
                                    type: 'string'
                                },
                                realname: {
                                    type: 'string'
                                }
                            },
                            required: ['username', 'realname']
                        },
                        profile: {
                            type: 'object',
                            properties: {
                                avatar: {
                                    type: 'object',
                                    properties: {
                                        gravatar_default: {
                                            type: 'string'
                                        },
                                        avatar_color: {
                                            type: 'string'
                                        },
                                        avatar_phrase: {
                                            type: 'string'
                                        }
                                    }
                                },
                                title: {
                                    type: 'string'
                                },
                                suffix: {
                                    type: 'string'
                                },
                                location: {
                                    type: 'string'
                                },
                                email: {
                                    type: 'string'
                                },
                                personal_statement: {
                                    type: 'string'
                                },
                                user_class: {
                                    type: 'string'
                                },
                                roles: {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    }
                                },
                                affiliations: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            title: {
                                                type: 'string'
                                            },
                                            institution: {
                                                type: 'string'
                                            },
                                            start_year: {
                                                type: 'integer'
                                            },
                                            end_year: {
                                                type: 'integer'
                                            }
                                        }
                                    }
                                }
                            },
                            required: ['email', 'user_class', 'user_roles', 'location']
                        }
                    }
                };
            }
        },
        updateUserRecordFromForm: {
            value: function() {
                this.clearErrors();

                var schema = this.getUserProfileFormSchema();


                try {
                    var json = this.formToObject(schema);
                } catch (e) {
                    this.addErrorMessage('Error', 'There was an error processing the form:' + e);
                    return false;
                }

                var updated = this.updateUserRecord(json);

                // Check the updated form ...

                // If errors, emit them.

                // Otherwise, set the userRecord to the new one.

                this.userRecord = updated;

                // step 1: translate forms to this object...

                // REALNAME

                /*

                this.updateField('realname', 'input', ['user'], function (value) {
                    if (!value || value.length === 0) {
                        throw 'Name field is required';
                    } else if (value.length > 100) {
                        throw 'The name field may not be more than 100 characters long.';
                    }   
                    return value;
                });

                


                // SUFFIX
                this.updateField('suffix', 'input', ['profile'], function (value) {
                    if (value) {
                        if (value.length > 25) {
                            throw 'The Suffix field may not be more than 25 characters long.';
                        } 
                    }
                    return value;
                });

                // TITLE
                var title = this.contentPlace.find('[data-field="title"]').val();
                this.updateField('title', 'input', ['profile'], function (value) {
                    if (value) {
                        if (!this.titlesMap[value]) {
                            throw 'The title value "'+value+'" is not within the acceptable range.'
                        }
                    }
                    return value;
                }.bind(this));
*/
                /*
                                // LOCATION
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

                                // GRAVATAR & AVATAR
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

                                // Coding: Roles, Funding 

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
                                var currentYear = (new Date()).getFullYear();                
                                for (var i = 0; i < affiliations.length; i++) {

                                    var startYearNode = $(affiliations[i]).find('[data-field="start_year"]')
                                    var startYear = startYear.val();
                                    if (!startYear || startYear.length === 0) {
                                        this.setFieldError(startYearNode, 'The Start Year for an affiliation is required.');
                                    } else {
                                        startYear = parseInt(startYear);                    
                                        if (startYear === NaN) {
                                            this.setFieldError(startYearNode, 'This value needs to be an integer between 1900 and ' + currentYear);
                                        } else if (startYear < 1900) {
                                            this.setFieldError(startYearNode, 'This value needs to be an integer between 1900 and ' + currentYear);
                                        } else if (startYear > currentYear) {
                                            this.setFieldError(startYearNode, 'This value needs to be an integer between 1900 and ' + currentYear);
                                        } else {
                                            that.userRecord.profile['start_year'] = startYear;
                                        }
                                    }

                                    var endYear = $(affiliations[i]).find('[data-field="end_year"] input').val();
                                    if (endYear === NaN) {
                                        endYear = '';
                                        // TODO: flag as error.
                                    }

                                    var affiliation = {
                                        title: $(affiliations[i]).find('[data-field="title"] input').val(),
                                        institution: $(affiliations[i]).find('[data-field="institution"] input').val(),
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
                                this.userRecord.profile['personal_statement'] = this.contentPlace.find('[data-field="personal_statement"] textarea').val();
                                */

                // SAVING
                if (this.formHasError) {
                    this.addErrorMessage('Not Saved', 'Your changes cannot be saved due to one or more errors. Please review the form, make the required corrections, and try again.');
                    return false;
                }

                // Clean up the user info data object.
                return true;
            }
        },

        createUserRecord: {
            value: function(options) {
                // Get basic user account info (may already have it).

                this.getUserAccountInfo({
                    userId: this.params.userId,
                    success: function(data) {
                        this.accountRecord = data;

                        // account data has been set ... copy the account fields to the corresponding user and profile fields.
                        this.userRecord = this.createProfile({
                            username: data.userName,
                            realname: data.fullName,
                            email: data.email,
                            account: data
                        })

                        this.saveUserRecord({
                            success: function() {
                                this.calcState();
                                options.success();
                            }.bind(this),
                            error: function(err) {
                                options.error(err);
                            }.bind(this)
                        })
                    }.bind(this),
                    error: function(err) {
                        options.error(err);
                    }.bind(this)
                });
            }
        },

        saveUserRecord: {
            value: function(cfg) {
                this.userProfileClient.set_user_profile({
                        profile: this.userRecord
                    },
                    function(response) {
                        if (cfg.success) {
                            cfg.success();
                        }
                    }.bind(this),
                    function(err) {
                        if (cfg.error) {
                            cfg.error(err.error);
                        }
                    }.bind(this));
            }
        },

        setProfileField: {
            value: function(path, name, value) {
                var rec = this.userRecord;
                for (var i = 0; i < path.length; path++) {
                    if (!rec[path[i]]) {
                        rec[path[i]] = {};
                    }
                    rec = rec[path[i]];
                }
                rec[name] = value;
            }
        },

        deleteProfileField: {
            value: function(path, name) {
                for (var i = 0; i < path.length; path++) {
                    if (!rec[path[i]]) {
                        return
                    }
                    rec = rec[path[i]];
                }
                delete rec[name];
            }
        },

        renderErrorView: {
            value: function(data) {
                // Make sure we have the standard panel layout.
                this.renderLayout();
                var title;
                if (data.title) {
                    title = data.title;
                } else {
                    title = 'Error';
                }
                this.places.title.html(title);
                this.renderPicture();
                this.places.content.html(this.renderTemplate('error', data));
            }
        },

        getUserAccountInfo: {
            value: function(options) {
                var userProfile;
                this.userProfileClient.lookup_globus_user([options.userId],
                    function(data) {
                        if (data[options.userId]) {
                            options.success(data[options.userId]);
                        } else {
                          console.log(data);
                            options.error({
                                title: 'User not found',
                                message: 'No account information found for this user (empty data).'
                            });
                        }
                    }.bind(this),
                    function(err) {
                        console.log('ERROR');
                        console.log(err);
                        options.error({
                            title: 'User not found',
                            message: 'No account information found for this user ' + options.userId
                        });
                    }.bind(this)
                );
            }
        },

        getSchemaNode: {
            value: function (schema, propPath) {
                var props = propPath.split('.');
                // doesn't handle arrays now.
                for (var i=0; i<props.length; i++) {
                    var prop = props[i];
                    // Get the node.
                    switch (schema.type) {
                        case 'object': 
                            var field = schema.properties[prop];
                            if (!field) {
                                throw 'Field '+ prop + ' in ' + propPath + ' not found.';
                            }
                            schema = field;
                            break;
                        case 'string':
                        case 'integer':
                        case 'boolean':
                        default: 
                            throw 'Cannot get a node on type type ' + schema.type;
                    }
                }

                return schema;
            }
        },

        calcProfileCompletion: {
            value: function() {
                /*
                    returns:
                    status:
                    message:
                    percentComplete

                    statuses:

                    denied - not logged in - should never return information about a profile
                    error - returned for all profile states for which this calculation is invalid, inluding:
                        accountonly - this is not a normal state for a profile
                        none - no profile, no account
                        error 
                    stub - a stub profile, which means the user has not opted into their profile
                    incomplete - user has a profile, so we can calculate the percent of fields completed.
                    complete -- all fields filled in
                      

                */
                var status = null;

                var state = this.calcState();
                switch (state) {
                    case 'notloggedin': 
                        // NOT LOGGED IN
                        // should not get here -- profiles are not even loaded for unauthenticated
                        // sessions.
                        return {
                            status: 'denied'
                        }
                        break;
                    case 'profile': 
                        // NORMAL PROFILE 
                        // May or may not be complete. Falls through so we can do the calculations below...
                        break;
                    case 'stub':
                        // STUB PROFILE
                        return {
                            status: 'stub'
                        }
                        break;
                    case 'accountonly':
                        // NO PROFILE
                        // NB: should not be here!!
                        // no profile, but have basic account info.
                        return {
                            status: 'error'
                        }
                        break;
                    case 'error': 
                        return {
                            status: 'error'
                        }
                        break;
                    case 'none':               
                        // NOT FOUND
                        // no profile, no basic aaccount info
                        return {
                            status: 'notfound'
                        }
                        break;
                    default:
                        return {
                            status: 'error'
                        }
                        break;
                }

                // rate the profile based on percent of fields completed.
                /*
                    status:
                        none - no profile
                        incomplete - required fields not filled in
                        complete - required fields filled in, no optional fields
                    percent_complete:
                        if required fields are completed, rate it based on the completion of the
                        the following fields:
                        real name, location, email, user class, roles, affiliations, personal statement
                */
                var requiredFields = [
                    'user.username', 'profile.userdata.email', 'profile.userdata.user_class', 'profile.userdata.location'
                ];

                var fieldsToCheck = [
                    'user.username', 'profile.userdata.location', 'profile.userdata.email', 'profile.userdata.user_class', 'profile.userdata.roles',
                    'profile.userdata.affiliations', 'profile.userdata.personal_statement'
                ];

                // ensure required fields.
                var formSchema = this.getUserProfileFormSchema();
                var missing = [];

                for (var i = 0; i < requiredFields.length; i++) {
                    var value = this.getProp(this.userRecord, requiredFields[i]);
                    if (this.isBlank(value)) {
                        status = 'requiredincomplete';
                        var field = this.getSchemaNode(formSchema, requiredFields[i]);
                        missing.push(field);
                    }
                }

                if (status) {
                    return {
                        status: status,
                        message: 'The following required profile fields are missing: ' + missing.join(', '),
                        missingFields: missing
                    }
                }

                for (var i = 0; i < fieldsToCheck.length; i++) {
                    var value = this.getProp(this.userRecord, fieldsToCheck[i]);
                    if (fieldsToCheck[i] === 'profile.userdata.personal_statement') {
                        // console.log('PERSONAL: ');
                        // console.log(value);
                    }
                    if (this.isBlank(value)) {
                        var field = this.getSchemaNode(formSchema, fieldsToCheck[i]);
                        missing.push(field);
                    }
                }

                var percentComplete = Math.round(100 * (fieldsToCheck.length - missing.length) / fieldsToCheck.length);

                if (percentComplete < 100) {
                    return {
                        status: 'incomplete',
                        message: 'The profile is complete, but could be richer.',
                        percentComplete: percentComplete,
                        missingFields: missing
                    }
                } else {
                    return {
                        status: 'complete',
                        message: 'Congratulations, your profile is complete!'
                    }
                }


            }
        },

        
        // DOM QUERY
        getFieldValue: {
            value: function(name) {
                var field = this.places.content.find('[data-field="' + name + '"]');
                if (!field || field.length === 0) {
                    return undefined;
                } else {
                    var control = field.find('input, textarea, select');
                    var tag = control.prop('tagName').toLowerCase();
                    switch (tag) {
                        case 'input':
                            var inputType = control.attr('type');
                            switch (inputType) {
                                case 'checkbox':
                                    return control.map(function() {
                                        var $el = $(this);
                                        if ($el.prop('checked')) {
                                            return $el.val();
                                        } else {
                                            return null;
                                        }
                                    }).get();
                                case 'radio':
                                    var value = control.map(function() {
                                        var $el = $(this);
                                        if ($el.prop('checked')) {
                                            return $el.val();
                                        } else {
                                            return null;
                                        }
                                    }).get();
                                    if (value.length === 1) {
                                        return value[0];
                                    } else {
                                        return null;
                                    }
                                default:
                                    var value = control.val();
                                    if (value && value.length > 0) {
                                        return value;
                                    } else {
                                        return null;
                                    }
                            }
                        case 'textarea':
                            var value = control.val();
                            if (value) {
                                if (value.length === 0) {
                                    value = null;
                                }
                            }
                            return value;
                            break;
                        case 'select':
                            var value = control.val();
                            if (value) {
                                if (value.length === 0) {
                                    value = null;
                                }
                            }
                            return value;
                            break;
                    }
                }

            }
        },

        // DOM UPDATE

        // main views

        render: {
            value: function() {
                // Generate initial view based on the current state of this widget.
                // Head off at the pass -- if not logged in, can't show profile.
                var state = this.calcState();
                switch (state) {
                    case 'notloggedin': 
                        // NOT LOGGED IN
                        this.renderLayout();
                        this.places.title.html('Unauthorized');
                        this.places.content.html(this.renderTemplate('unauthorized'));
                        break;
                    case 'profile': 
                        // NORMAL PROFILE 
                        // Title can be be based on logged in user infor or the profile.
                        this.renderViewEditLayout();
                        this.renderInfoView();
                        break;
                    case 'stub':
                        // STUB PROFILE
                        // Title can be be based on logged in user infor or the profile.
                        this.renderViewEditLayout();
                        this.renderMessages();
                        this.renderStubProfileView();
                        break;
                    case 'accountonly':
                        // NO PROFILE
                        // NB: should not be here!!
                        // no profile, but have basic account info.
                        this.renderLayout();
                        this.places.title.html(this.accountRecord.fullName + ' (' + this.accountRecord.userName + ')');
                        // this.renderPicture();
                        this.renderNoProfileView();
                        break;
                    case 'error': 
                        this.renderLayout();
                        this.renderErrorView('Profile is in error state');
                        break;
                    case 'none':               
                        // NOT FOUND
                        // no profile, no basic aaccount info
                        this.renderLayout();
                        this.places.title.html('User Not Found');
                        this.renderPicture();
                        this.places.content.html(this.renderTemplate('no_user'));
                        break;
                    default:
                        this.renderLayout();
                        this.renderErrorView('Invalid profile state "'+state+'"')
                }
                this.renderMessages();
                return this;
            }
        },

        renderInfoView: {
            value: function() {
                if (this.userOwnsProfile) {
                    this.places.title.html('You - ' + this.loggedInName + ' (' + this.userRecord.user.username + ')');
                } else {
                    this.places.title.html(this.userRecord.user.realname + ' (' + this.userRecord.user.username + ')');
                }
                this.renderPicture();
                this.places.content.html(this.renderTemplate('view'));
                this.places.content.find('[data-button="edit"]').on('click', function(e) {
                    this.clearMessages();
                    this.renderEditView();
                }.bind(this));
                this.places.content.find('[data-button="optout"]').on('click', function(e) {
                    this.deleteProfile();
                }.bind(this));
            }
        },

        deleteProfile: {
            value: function() {
                this.clearMessages();
                this.userRecord.profile.userdata = null;
                this.userRecord.profile.metadata.modified = (new Date()).toISOString();
                this.saveUserRecord({
                    success: function() {
                        this.addSuccessMessage('Your profile has been successfully removed.')
                        this.render();
                    }.bind(this),
                    error: function(err) {
                        this.renderErrorView(err);
                    }.bind(this)

                })
            }
        },

        showFieldError: {
            value: function(container, field, message) {
                if (typeof field === 'string') {
                    field = container.find('[data-field="' + field + '"]');
                }
                field.addClass('has-error');
                var messageNode = field.find('[data-element="message"]');
                if (message) {
                    messageNode.html(message);
                }
                this.formHasError = true;
            }
        },

        renderEditView: {
            value: function() {
                this.places.content.html(this.renderTemplate('edit'));

                // wire up basic form crud buttons.
                $('[data-button="save"]').on('click', function(e) {
                    if (this.updateUserRecordFromForm()) {
                        this.saveUserRecord({
                            success: function() {
                                this.calcState();
                                this.renderViewEditLayout();
                                this.addSuccessMessage('Success!', 'Your user profile has been updated.');
                                this.renderInfoView();
                            }.bind(this),
                            error: function(err) {
                                this.renderErrorView(err);
                            }.bind(this)
                        });
                    }
                }.bind(this));
                $('[data-button="cancel"]').on('click', function(e) {
                    this.clearMessages();
                    this.renderInfoView();
                }.bind(this));

                // wire up affiliation add/remove buttons.
                $('[data-button="add-affiliation"]').on('click', function(e) {
                    // grab the container 
                    var affiliations = this.places.content.find('[data-field="profile.userdata.affiliations"]');

                    // render a new affiliation
                    var newAffiliation = this.renderTemplate('new_affiliation', {
                        generatedId: this.genId()
                    });

                    // append to the container
                    affiliations.append(newAffiliation);
                }.bind(this));

                // Wire up remove button for any affiliation.
                this.places.content.find('[data-field="profile.userdata.affiliations"]').on('click', '[data-button="remove"]', function(e) {
                    // remove the containing affiliation group.
                    $(this).closest('[data-field-group="affiliation"]').remove();
                });
                // on any field change events, we update the relevant affiliation panel title
                this.places.content.find('[data-field="profile.userdata.affiliations"]').on('keyup', 'input', function(e) {
                    // remove the containing affiliation group.
                    var panel = $(this).closest('[data-field-group="affiliation"]');
                    var title = panel.find('[data-field="title"] input').val();
                    var institution = panel.find('[data-field="institution"] input').val();
                    var startYear = panel.find('[data-field="start_year"] input').val();
                    var endYear = panel.find('[data-field="end_year"] input').val();
                    endYear = endYear ? endYear : 'present';

                    panel.find('.panel-title').html(title + ' @ ' + institution + ', ' + startYear + '-' + endYear);
                });
            }
        },

        renderNoProfileView: {
            value: function() {
                this.places.content.html(this.renderTemplate('no_profile'));
                var that = this;
                if (this.isOwner()) {
                    $('[data-button="create-profile"]').on('click', function(e) {
                        that.createUserRecord({
                            success: function() {
                                this.recalcState({
                                  success: function() {
                                    this.clearMessages();
                                    this.addSuccessMessage('Success!', 'Your user profile has been created.');
                                  }.bind(this),
                                  error: function (err) {
                                    this.renderErrorView();
                                  }
                                });
                            }.bind(that),
                            error: function(err) {
                                this.renderErrorView(err);
                            }.bind(that)
                        });
                    });
                }
            }
        },

        renderStubProfileView: {
            value: function() {
                this.renderPicture();
                this.places.title.html(this.userRecord.user.realname + ' (' + this.userRecord.user.username + ')');
                this.places.content.html(this.renderTemplate('stub_profile'));
                var that = this;
                if (this.isOwner()) {
                    $('[data-button="create-profile"]').on('click', function(e) {
                        that.createUserRecord({
                            success: function() {
                                this.clearMessages();
                                this.addSuccessMessage('Success!', 'Your user profile has been created.');
                                this.render();                                
                            }.bind(that),
                            error: function(err) {
                                this.renderErrorView(err);
                            }.bind(that)
                        });
                    });
                }
            }
        },

        // dom  update utils
        clearErrors: {
            value: function() {
                this.clearMessages();
                this.clearFieldMessages();
                this.places.content.find('.has-error').removeClass('has-error');
                this.places.content.find('.error-message').removeClass('error-message');
                this.formHasError = false;
            }
        },

        clearFieldMessages: {
            value: function() {
                $('[data-field-message]').empty();
            }
        },

        renderPicture: {
            value: function() {
                this.container
                    .find('[data-placeholder="picture"]')
                    .html(this.renderTemplate('picture'));
            }
        },
        isOwner: {
            value: function() {
                // the current session user is the owner if their username matches the queried username.
                if (this.auth && this.auth.username === this.params.userId) {
                    return true;
                } else {
                    return false;
                }
            }
        },

        renderViewEditLayout: {
            value: function() {
                nunjucks.configure({
                    autoescape: true
                });
                this.container.html(this.renderTemplate('view_edit_layout'));
                // These are just convenience placeholders.
                this.places = {
                    title: this.container.find('[data-placeholder="title"]'),
                    alert: this.container.find('[data-placeholder="alert"]'),
                    content: this.container.find('[data-placeholder="content"]')
                };
            }
        },

        renderLayout: {
            value: function() {
                nunjucks.configure({
                    autoescape: true
                });
                this.container.html(this.renderTemplate('layout'));
                this.places = {
                    title: this.container.find('[data-placeholder="title"]'),
                    content: this.container.find('[data-placeholder="content"]')
                };
            }
        }

    });

    return ProfileWidget;
});