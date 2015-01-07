define(['nunjucks', 'jquery', 'md5', 'kbaseuserprofileserviceclient'], function (nunjucks, $, md5, UserProfileService) {
    "use strict";

    var ProfileWidget = Object.create({}, {

        init: {
            value: function (cfg) {                
                this._generatedId = 0; 

                this.container = cfg.container;
                if (typeof this.container === 'string') {
                    this.container = $(this.container);
                }

                this.userProfileService = {
                    // host: 'dev19.berkeley.kbase.us'
                    url:'https://kbase.us/services/user_profile/rpc'
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
                
                this.accountRecord = null;
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
                

                var that = this;
                this.templateEnv.addFilter('roleLabel', function(role) {
                    if (that.userRolesMap[role]) {
                        return that.userRolesMap[role];
                    } else {
                        return role;
                    }
                });
                this.templateEnv.addFilter('userClassLabel', function(userClass) {
                    if (that.userClassesMap[userClass]) {
                        return that.userClassesMap[userClass];
                    } else {
                        return userClass;
                    }
                });
                this.templateEnv.addFilter('titleLabel', function(title) {
                    if (that.titlesMap[title]) {
                        return that.titlesMap[title];
                    } else {
                        return title;
                    }
                });
                // create a gravatar-url out of an email address and a 
                // default option.
                this.templateEnv.addFilter('gravatar', function(email, size, rating, gdefault) {
                    // TODO: http/https.
                    var md5Hash = md5(email);
                    // window.location.protocol
                    var url = 'https://www.gravatar.com/avatar/' + md5Hash + '?s=' + size + '&amp;r=' + rating + '&d=' + gdefault
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

                this.messages = [];

                // Set up listeners for any kbase events we are interested in:
                // NB: following tradition, the auth listeners are namespaced for kbase; the events
                // are not actually emitted in the kbase namespace.
                $(document).on('loggedIn.kbase', function(e, auth) {
                   this.onLoggedIn(e, auth);
                }.bind(this));

                $(document).on('loggedOut.kbase', function(e, auth) {
                    this.onLoggedOut(e, auth);
                }.bind(this));

                return this;
            }
        },

        // STATE CHANGES

        /*
            Calculate cached state properties.
            Should be run after state is loaded, and after any state changes. 
        */
        calcState: {
            value: function () {

                if (this.userRecord) {
                    this.hasProfile = true;
                    if (this.accountRecord) {
                        this.userRecord.profile.account = this.accountRecord;
                    }
                } else {
                    this.hasProfile = false;
                    if (this.accountRecord) {
                        this.hasAccount = true;
                    }
                }

                // Context for templates -- should be a separate method.
                this.context.profileStatus = this.getProfileStatus();
                this.context.accountRecord = this.accountRecord;
                this.context.userRecord = this.userRecord;

                /*
                this.userRecord.profile.account = {
                    realname: data.fullName,
                    email: data.email,
                    username: data.userName
                };
                */

            }
        },

        /*
            getCurrentState 
        */
        getCurrentState: {
            value: function (callbacks) {
                // DATA
                // This is where we get the data to feed to the widget.
                // Each widget has its own independent data fetch.
                // This may be called at any point to
                if (!this.authToken) {
                    // We don't fetch any data if a user is not logged in.
                    this.userRecord = null;
                    if (callbacks.success) {
                        callbacks.success.call(this);
                    }
                } else {
                    var userProfile;

                    this.userProfileClient = new UserProfileService(this.userProfileService.url, {
                        token: this.authToken
                    });
                    $.ajaxSetup({
                        timeout: 10000 
                    });
                    this.userProfileClient.get_user_profile([this.userId], 
                        function(data) {
                            //console.log('got user data');
                            //console.log(data);
                            if (data[0]) {
                                // profile found
                                this.userRecord = data[0];

                                // NB: this is just for now. We should probably incorporate
                                // the account <-> profile syncing somewhere else/
                                // This is the cached version of the globus user record.
                                this.accountRecord = this.userRecord.account;

                                if (!this.accountRecord) {
                                    this.getUserAccountInfo({
                                        userId: this.userId, 
                                        success: function (data) {
                                            this.accountRecord = data;
                                            this.calcState();
                                            if (callbacks.success) {
                                                callbacks.success.call(this);
                                            }
                                        }.bind(this),
                                        error: function (err) {
                                            this.renderErrorView(err);
                                            // this.status = 'error';
                                        }.bind(this)
                                    });
                                } else {
                                    this.calcState();
                                }
                            } else {
                                // no profile ... create a bare bones one.
                                this.userRecord = null;
                                this.getUserAccountInfo({
                                    userId: this.userId, 
                                    success: function (data) {
                                        this.accountRecord = data;
                                        this.calcState();
                                        if (callbacks.success) {
                                            callbacks.success.call(this);
                                        }
                                    }.bind(this),
                                    error: function (err) {
                                        // this.status = 'error';
                                        this.renderErrorView(err);
                                    }.bind(this)
                                });
                            }
                        }.bind(this), 
                        function(err) {
                            this.renderErrorView(err);
                            console.log('[UserProfile.sync] Error getting user profile.');
                            console.log(err);
                            this.renderErrorView(err);
                        }.bind(this)
                    );
                }
                return this;
            }
        },

        onLoggedIn: {
            value: function (e, auth) {
                this.authToken = auth.token;
                this.getCurrentState({
                    success: function () {
                        this.render()
                    }.bind(this)
                });
            }
        },
        onLoggedOut: {
            value: function (e, auth) {
                this.authToken = null;
                this.getCurrentState({
                    success: function () {
                        this.render()
                    }.bind(this)
                });
            }
        },

        go: {
            value: function () {
                this.renderWaitingView();
                this.getCurrentState({
                	success: function() {
                    	this.render()
                    }.bind(this)
                });
            }
        },

        stop: {
            value: function () {

            }
        },


        // TEMPLATES
        getTemplate: {
            value: function(name) {
                if (this.templates[name] === undefined) {
                    this.templates[name] = this.templateEnv.getTemplate('userProfile_' + name + '.html');
                }
                return this.templates[name];
            }
        },
       
        

        genId: {
            value: function() {
                return 'gen_' + this._generatedId++;
            }
        },

        ensureAccountData: {
            value: function(cfg) {
            	// assumes the user record has been loaded, inspects to ensure the account
            	// property is set, and if not, fetches it and sets it.
                if (!this.accountRecord) {
                	//console.log('GETTING user account');
                	// console.log(this.userRecord);
                    this.getUserAccountInfo({
                        userId: this.userId, 
                        success: function (data) {
                            this.accountRecord = data;
                            if (data) {
                                this.hasAccount = true;
                                this.userRecord.profile.account = {
                                    realname: data.fullName,
                                    email: data.email,
                                    username: data.userName
                                };
                            } else {
                                this.hasAccount = false;
                            	this.renderErrorView({
                            		title: 'Error', 
                            		message: 'No information returned about the user account'
                            	});
                            };
                            cfg.success();
                        }.bind(this),
                        error: function (err) {
                            this.status = 'error';
                            this.renderErrorView({
                                title: 'Error Getting User Account Info', 
                                message: 'There was a system error retrieving your account information.'
                            });
                        }.bind(this)
                    });
                } else {
                    cfg.success();
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
        	value: function (schema) {
        		// walk the schema, building an object out of any form values 
        		// that we find.
        		var that = this;
        		var form = this.places.content.find['form'];
                var fieldValidationErrors = [];
                var objectValidationErrors = [];
        		var parser = Object.create({}, {
        			init: {
        				value: function (cfg) {
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
        				value: function (schema) {
	        				var newObject = {};
		        			var propNames = Object.getOwnPropertyNames(schema.properties);
		        			for (var i=0; i<propNames.length; i++) {
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
                                        //console.log('GOT INTEGER');
			        					var value = this.parseInteger(propSchema);
                                        //console.log('The Value is ' + value); 
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
                                for (var i=0; i<schema.required.length; i++) {
                                    var requiredProp = schema.required[i];
                                    //console.log('Required: ' + requiredProp);
                                    //console.log(newObject[requiredProp]);
                                    if (newObject[requiredProp] === undefined || newObject[requiredProp] === null) {
                                        this.currentPath.push(requiredProp);
                                        var propPath = this.currentPath.join('.');
                                        //console.log('missing: ' + requiredProp + ':' + propPath);
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
	        			value: function (schema) {
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
		        					var value =  this.container.find('[data-field="'+path+'"] fieldset').map(function (i) {
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
                        value: function (value, schema) {
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
	        			value: function (schema) {
							var fieldName = this.currentPath.join('.');
							return this.getFieldValue(fieldName);
		        		}
		        	},
                    addFieldError: {
                        value: function (err) {
                            err.container = this.container;
                            this.fieldValidationErrors.push(err);
                        }
                    },
	        		parseInteger: {
	        			value: function (schema) { 
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
        		var result =  parser.init({
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

                //console.log(fieldValidationErrors);
                //console.log(objectValidationErrors);
                if (errors) {
                    throw 'Validation errors processing the form';
                } else {
                    return result;
                }
        	}
        },

        showFieldValidationErrors: {
            value: function (errors) {
                for (var i=0; i<errors.length; i++) {
                    var error = errors[i];
                    this.showFieldError(error.container, error.propPath, error.message);
                }
            }
        },

		updateUserRecord: {
			value: function (newRecord) {
				var merger = {
					init: function (obj) {
						this.dest = obj;
						return this;
					},
					getType: function  (x) {
						var t = typeof x;
						if (t === 'object') {
							if (x === null) {
								return 'null';
							} else if (x.pop && x.push) {
								return 'array';
							} else {
								return 'object';
							}
						} else {
							return t;
						}
					},
					merge: function (obj) {
						switch (this.getType(obj)) {
							case 'string': 
							case 'integer':
							case 'boolean':
							case 'null': 
								throw "Can't merge a '" + (typeof val) + "'";
								break;
							case 'object':
								return this.mergeObject(obj);
								break;
							case 'array':
								return this.mergeArray(obj);
								break;
							default:
								throw "Can't merge a '" + (typeof val) + "'";
						}

					},	
					mergeObject: function (obj) {
						var keys = Object.keys(obj);
						for (var i=0; i<keys.length; i++) {
							var key = keys[i];
							var val = obj[key];
							var t = this.getType(val);
							switch (t) {
								case 'string': 
								case 'number':
								case 'boolean':
								case 'null': 
									this.dest[key] = val;
									break;
								case 'object':
									if (!this.dest[key]) {
										this.dest[key] = {};
									}
									this.dest[key] = Object.create(merger).init(this.dest[key]).mergeObject(obj[key]);
									break;
								case 'array':
									if (!this.dest[key]) {
										this.dest[key] = [];
									} else {
                                        this.dest[key] = [];
                                    }
									this.dest[key] = Object.create(merger).init(this.dest[key]).mergeArray(obj[key]);
									break;
								case 'undefined':
									if (this.dest[key]) {
										delete this.dest[key];
									}
									break;
							}
						}
						return this.dest;
					},
					mergeArray: function (arr) {
						var deleted  = false;
						for (var i=0; i<arr.length; i++) {
							var val = arr[i];
							var t = this.getType(val);
							switch (t) {
								case 'string': 
								case 'number':
								case 'boolean':
								case 'null': 
									this.dest[i] = val;
									break;
								case 'object':
									if (!this.dest[i]) {
										this.dest[i] = {};
									}
									this.dest[i] = Object.create(merger).init(this.dest[i]).mergeObject(arr[i]);
									break;
								case 'array':
									if (!this.dest[i]) {
										this.dest[i] = [];
									}
									this.dest[i] = Object.create(merger).init(this.dest[i]).mergeArray(obj[i]);
									break;
								case 'undefined':
									if (this.dest[i]) {
										this.dest[i] = undefined;
									}
									break;
							}
						}
						if (deleted) {
							return this.dest.filter(function (value) {
								if (value === undefined) {
									return false;
								} else {
									return true;
								}
							});
						} else {
							return this.dest;
						}
					}
				};
				//console.log("1");
				//console.log('userRecord');
				//console.log(this.userRecord);
				var recordCopy = Object.create(merger).init({}).mergeObject(this.userRecord);
				//console.log("2");
				//console.log('newRecord');
				//console.log(newRecord);
				var merged = Object.create(merger).init(recordCopy).mergeObject(newRecord);
				//console.log("3");
				return merged;
			}
		},
        getUserProfileFormSchema: {
            value: function () {
                // For building and validating user form input for a user profile.
                // This is a subset of the user profile schema.
                // FORNOW: fairly loose, other than sensible limits and formatting checks.
                // NB: 
                return {
                    type: 'object', 
                    properties: {
                        user: {
                            type: 'object',
                            properties: {
                                realname: {type: 'string', maxLength: 100}
                            },
                            required: ['realname']
                        },
                        profile: {
                            type: 'object',
                            properties: {
                                avatar : {
                                    type: 'object', 
                                    properties: {
                                        gravatar_default: {type: 'string'},
                                        avatar_color: {type: 'string'},
                                        avatar_initials: {type: 'string'}
                                    }
                                },
                                title: {type: 'string'},
                                suffix: {type: 'string'},
                                location: {type: 'string', maxLength: 25},
                                email: {type: 'string', format: 'email'},
                                personal_statement: {type: 'string'},
                                user_class: {type: 'string'},
                                roles: {
                                    type: 'array',
                                    items: {type: 'string'}
                                },
                                affiliations: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            title: {type: 'string'},
                                            institution: {type: 'string'},
                                            start_year: {type: 'integer', minimum: 1900, maximum: 2100},
                                            end_year: {type: 'integer', minimum: 1900, maximum: 2100}
                                        },
                                        required: ['title', 'institution', 'start_year']
                                    }
                                }
                            },
                            required: ['email', 'user_class', 'roles', 'location']             
                        }
                    }
                };
            }
        },
        getUserProfileSchema: {
            value: function () {
                return {
                    type: 'object', 
                    properties: {
                        user: {
                            type: 'object',
                            properties: {
                                username: {type: 'string'},
                                realname: {type: 'string'}
                            },
                            required: ['username', 'realname']
                        },
                        profile: {
                            type: 'object',
                            properties: {
                                avatar : {
                                    type: 'object', 
                                    properties: {
                                        gravatar_default: {type: 'string'},
                                        avatar_color: {type: 'string'},
                                        avatar_initials: {type: 'string'}
                                    }
                                },
                                title: {type: 'string'},
                                suffix: {type: 'string'},
                                location: {type: 'string'},
                                email: {type: 'string'},
                                personal_statement: {type: 'string'},
                                user_class: {type: 'string'},
                                roles: {
                                    type: 'array',
                                    items: {type: 'string'}
                                },
                                affiliations: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            title: {type: 'string'},
                                            institution: {type: 'string'},
                                            start_year: {type: 'integer'},
                                            end_year: {type: 'integer'}
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

                // console.log(this.updateUserRecord);
                //console.log('JSON');
                //console.log(json);
                var updated = this.updateUserRecord(json);

                // Check the updated form ...

                // If errors, emit them.

                // Otherwise, set the userRecord to the new one.

                this.userRecord = updated; 

                // And in the context as well, since we have replaced the entire object.
                this.context.userRecord = updated;

                console.log('UPDATED'); 
                console.log(updated); 

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

                //console.log('saving...');
                //console.log(toSave);

                // Clean up the user info data object.

               
                return true;
            }
        },

        createUserRecord: {
            value: function (cfg) {
                // Get basic user account info (may already have it).

                this.getUserAccountInfo({
                    userId: this.userId, 
                    success: function (data) {
                        this.accountRecord = data;

                        // account data has been set ... copy the account fields to the corresponding user and profile fields.
                        this.userRecord = {
                            user: {
                                username: data.userName,
                                realname: data.fullName
                            },
                            profile: {
                                email: data.email,
                                account: data
                            }
                        };

                        this.calcState();
                        if (cfg.success) {
                            cfg.success(this);
                        }
                    }.bind(this),
                    error: function (err) {
                        // this.status = 'error';
                        if (cfg.error) {
                            cfg.error(err);
                        }
                    }.bind(this)
                });
            }
        },

        saveUserRecord: {
            value: function (cfg) {
                this.userProfileClient.set_user_profile({
                        profile: this.userRecord
                },
                function(response) {                    
                    if (cfg.success) {
                        cfg.success.call(this);
                    }
                }.bind(this),
                function(err) {
                	if (cfg.success) {
                        cfg.success.call(this, err.error);
                    }
                    //that.addErrorMessage('Error!', 'Your user profile could not be saved: ' + err.error.message);
                    //console.log('Error setting user profile: ' + err);
                }.bind(this));
            }
        },

        setProfileField: {
            value: function(path, name, value) {
                var rec = this.userRecord;
                for (var i=0; i<path.length; path++) {
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
                 for (var i=0; i<path.length; path++) {
                    if (!rec[path[i]]) {
                        return
                    }
                    rec = rec[path[i]];
                }
                delete rec[name];
            }
        },

        renderErrorView: {
        	value: function (data) {
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
        		// NB: use a template here in case we have more interesting things to say.
        		var context = data;
				this.places.content.html(this.getTemplate('error').render(context));
        	}
        },

        getUserAccountInfo: {
            value: function (cfg) {
               
                var userProfile;

                this.userProfileClient = new UserProfileService(this.userProfileService.url, {
                    token: this.authToken
                });
                $.ajaxSetup({
                    timeout: 10000 
                });
                this.userProfileClient.lookup_globus_user([cfg.userId], 
                    function(data) {
                        //console.log('got user data');
                        //console.log(data);
                        if (data) {
                           if (cfg.success) {
                            cfg.success(data[cfg.userId]);
                           }
                        } else {
                            if (cfg.error) {
                                cfg.error({
                                    title: 'User not found',
                                    message: 'No account information found for this user.'
                                });
                            }
                        }
                    }.bind(this), 
                    function(err) {
                        if (cfg.error) {
                            cfg.error({
                                title: 'User not found',
                                message: 'No account information found for this user.'
                            });
                        }
                    }.bind(this)
                );
            }
        },

        getProp: {
            value: function (obj, prop) {
                var props = prop.split('.');

                var temp = obj;
                for (var i=0; i<props.length; i++) {
                    var key = props[i];
                    //console.log(key);
                    //console.log(temp[key]);
                    if (temp[key] === undefined) {
                        return obj[key];
                    } else {
                        temp = temp[key];
                    }
                }
                return temp;
            }
        },

        getProfileStatus: {
            value: function () {
                // if profile is present
                var status = null;
                if (!this.hasProfile) {
                    return {
                        status: 'none'
                    }
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
                    'user.username', 'profile.email', 'profile.user_class'
                ];

                var fieldsToCheck = [
                    'user.username', 'profile.location', 'profile.email', 'profile.user_class', 'profile.roles',
                    'profile.affiliations', 'profile.personal_statement'
                ];

                // ensure required fields.
                var missing = [];

                // console.log('profile?'); console.log(this.userRecord);
                for (var i=0; i<requiredFields.length; i++) {
                    var value = this.getProp(this.userRecord, requiredFields[i]);
                    if (this.isBlank(value)) {
                        status = 'incomplete;'
                        missing.push(requiredFields[i]);
                    }
                }

                if (status) {
                    return {
                        status: status, 
                        message: 'The following required profile fields are missing: ' + missing.join(', ')
                    }
                }

                for (var i=0; i<fieldsToCheck.length; i++) {
                    var value = this.getProp(this.userRecord, fieldsToCheck[i]);
                    if (fieldsToCheck[i] === 'profile.personal_statement') {
                        console.log('PERSONAL: ');
                        console.log(value);
                    }
                    if (this.isBlank(value)) {
                        missing.push(fieldsToCheck[i]);
                    }
                }

                var percentComplete = Math.round(100 * (fieldsToCheck.length - missing.length) /  fieldsToCheck.length);

                if (percentComplete < 100) {
                    return {
                        status: 'minimal',
                        message: 'The profile is complete, but could be richer.',
                        percentComplete: percentComplete
                    }
                } else {
                    return {
                        status: 'complete',
                        message: 'Congratulations, your profile is complete!'
                    }
                }

                
            }
        },

        isBlank: {
            value: function (value) {
                if (value === undefined) {
                   return true;
                } else if (typeof value === 'object') {
                    //console.log('STATUS ' + requiredFields[i] + ':' + value.push);
                    if (value.push && value.pop) {
                        if (value.length === 0) {
                            return true;
                        }
                    } else {
                        if (value.getOwnPropertyNames().length === 0) {
                            return true;
                        }
                    }
                } else if (typeof value === 'string' && value.length === 0) {
                    return true;
                }
                return false;
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
                	// console.log('tag for '+name+' is ' + tag);
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
            value: function () {
                // Generate initial view based on the current state of this widget.
                // Head off at the pass -- if not logged in, can't show profile.
                this.calcState();
                if (!this.authToken) {
                    this.places.title.html('Unauthorized');
                    this.renderPicture();
                    this.places.content.html(this.getTemplate('unauthorized').render(this.context));
                } else if (this.hasProfile) {
                    // Title can be be based on logged in user infor or the profile.
                    this.renderViewEditLayout();
                    this.renderInfoView();
                } else if (this.hasAccount) {
                    // no profile, but have basic account info.
                    this.places.title.html(this.accountRecord.fullName + ' (' + this.accountRecord.userName + ')');
                    this.renderPicture();
                    this.renderNoProfileView();
                } else {
                    // no profile, no basic aaccount info
                    this.places.title.html('User Not Found');
                    this.renderPicture();
                    this.places.content.html(this.getTemplate('no_user').render(this.context));
                }
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
                //console.log('CONTENT');
                //console.log(this.places);
                this.places.content.html(this.getTemplate('view').render(this.context));
                this.places.content.find('[data-button="edit"]').on('click', function(e) {
                    this.clearMessages();
                    this.renderEditView();
                }.bind(this));
            }
        },

        showFieldError: {
            value: function(container, field, message) {
                //if (!container) {
                //    container = this.places.content;
                //}
                //console.log('[showFieldError]');
                //console.log(container);
                //console.log(field);
                if (typeof field === 'string') {
                    field = container.find('[data-field="'+field+'"]');
                }
                field.addClass('has-error');
                var messageNode = field.find('[data-element="message"]');
                //console.log('message: ');
                //console.log(message);
                //console.log(field);
                //console.log(messageNode);
                if (message) {
                    messageNode.html(message);
                    // messageNode.addClass('error-message');
                }
                //var fieldControl = this.contentPlace.find('[data-field="' + name + '"]').closest('.form-group');
                //if (fieldControl) {
                //    fieldControl.addClass('has-error');
                //}
                /*
                var fieldMessage = this.contentPlace.find('[data-message-for-field="' + name + '"]');
                if (fieldMessage) {
                    fieldMessage.html(message);
                    fieldMessage.addClass('error-message');
                } else {
                    console.log('no message container: ' + message);
                }
                */
                this.formHasError = true;
            }
        },

        createInitialUI: {
            value: function () {
                // Set up the basic panel layout.
                // This adds stuff like the message area at the top of the panel body,
                // and a main body div.
                this.renderLayout();

                // Set up listeners for any kbase events we are interested in:
                $(document).on('loggedIn.kbase', function(e, auth) {
                    this.authToken = auth.token;
                    this.getCurrentState({
                    	success: function () {
                    		this.render()
                    	}.bind(this)
                    });
                }.bind(this));

                $(document).on('loggedOut.kbase', function(e, auth) {
                    this.authToken = null;
                    this.getCurrentState({
                    	success: function () {
                    		this.render()
                    	}.bind(this)
                    });
                }.bind(this));
            }
        },

        

        renderEditView: {
            value: function() {
                this.places.content.html(this.getTemplate('edit').render(this.context));

                // wire up basic form crud buttons.
                $('[data-button="save"]').on('click', function(e) {
                    if (this.updateUserRecordFromForm()) {
                        this.saveUserRecord({
                            success: function() {
                                this.calcState();
                                this.renderViewEditLayout();
                                this.addSuccessMessage('Success!', 'Your user profile has been updated.');
                                this.renderInfoView();
                            }
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
                    var affiliations = this.places.content.find('[data-field="profile.affiliations"]');

                    // render a new affiliation
                    var id = this.genId();
                    var newAffiliation = this.getTemplate('new_affiliation').render({
                        generatedId: id
                    });

                    // append to the container
                    affiliations.append(newAffiliation);
                }.bind(this));

                // Wire up remove button for any affiliation.
                this.places.content.find('[data-field="profile.affiliations"]').on('click', '[data-button="remove"]', function(e) {
                    // remove the containing affiliation group.
                    $(this).closest('[data-field-group="affiliation"]').remove();
                });
                // on any field change events, we update the relevant affiliation panel title
                this.places.content.find('[data-field="profile.affiliations"]').on('keyup', 'input', function(e) {
                    // remove the containing affiliation group.
                    var panel  = $(this).closest('[data-field-group="affiliation"]');
                    var title = panel.find('[data-field="title"] input').val();
                    var institution = panel.find('[data-field="institution"] input').val();
                    var startYear = panel.find('[data-field="start_year"] input').val();
                    var endYear = panel.find('[data-field="end_year"] input').val();
                    endYear = endYear ? endYear : 'present';

                    panel.find('.panel-title').html(title + ' @ ' + institution + ', ' + startYear+'-'+endYear);
                });
            }
        },

        renderNoProfileView: {
            value: function() {
                this.places.content.html(this.getTemplate('no_profile').render(this.context));
                var that = this;
                if (this.isProfileOwner) {
                    $('[data-button="create-profile"]').on('click', function(e) {
                        that.createUserRecord({
                            success: function () {
                                this.renderViewEditLayout();
                                this.renderPicture();
                                this.renderEditView();
                                this.addSuccessMessage('Success!', 'Your user profile has been created.');
                            }.bind(that),
                            error: function (err) {
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

        renderMessages: {
            value: function () {
                if (this.places.alert) {
                    this.places.alert.empty();
                    for (var i=0; i<this.messages.length; i++) {
                        var message = this.messages[i];
                        var alertClass = 'default';
                        switch (message.type) {
                            case 'success': alertClass = 'dismissable';break;
                            case 'error': alertClass = 'danger'; break; 
                        }
                        this.places.alert.append(
                        '<div class="alert alert-success alert-'+alertClass+'" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                        '<strong>' + message.title + '</strong> ' + message.message + '</div>');
                    }
                }
            }
        },

        clearMessages: {
            value: function() {
                this.messages = [];
                this.renderMessages();
            }
        },

        addSuccessMessage: {
            value: function(title, message) {
                this.messages.push({
                    type: 'success', title: title, message: message
                });
                this.renderMessages();
                /*
                this.places.alert.html(
                    '<div class="alert alert-success alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>' + title + '</strong> ' + message + '</div>');
                */
            }
        },

        addErrorMessage: {
            value: function(title, message) {
                this.messages.push({
                    type: 'error', title: title, message: message
                });
                this.renderMessages();
                /*
                this.places.alert.append(
                    '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>' + title + '</strong> ' + message + '</div>');
                */
            }
        },

        renderPicture: {
            value: function() {
                var pic = this.getTemplate('picture').render(this.context);
                this.container.find('[data-placeholder="picture"]').html(pic);
            }
        },

        renderViewEditLayout: {
            value: function() {
                nunjucks.configure({
                    autoescape: true
                });
                this.container.html(this.getTemplate('view_edit_layout').render(this.context));
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
                this.container.html(this.getTemplate('layout').render(this.context));
                this.places = {
                	title: this.container.find('[data-placeholder="title"]'),
                	content: this.container.find('[data-placeholder="content"]')
                };
            }
        },

        renderWaitingView: {
            value: function () {
            	this.renderLayout();
                this.places.content.html('<img src="assets/img/ajax-loader.gif"></img>');
            }
        }

    });

    return ProfileWidget;
});