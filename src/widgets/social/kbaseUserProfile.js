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

                this.messages = [];



                return this;
            }
        },

        go: {
            value: function () {
                this.renderWaitingView();
                this.getInitialData({
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


        // PATTERNS
        getTemplate: {
            value: function(name) {
                if (this.templates[name] === undefined) {
                    this.templates[name] = this.templateEnv.getTemplate('userProfile_' + name + '.html');
                }
                return this.templates[name];
            }
        },
       
        getInitialData: {
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
                    var userProfileServiceURL = window.location.protocol + '//dev19.berkeley.kbase.us/services/user_profile/rpc';
                    var userProfile;

                    this.userProfileClient = new UserProfile(userProfileServiceURL, {
                        token: this.authToken
                    });
                   
                    this.userProfileClient.get_user_profile([this.userId], 
                        function(data) {
                        	//console.log('got user data');
                        	//console.log(data);
                            if (data[0]) {
                                // profile found
                                this.hasProfile = true;
                                this.userRecord = data[0];
                                this.context.userRecord = this.userRecord;
                                // NB: this is just for now. We should probably incorporate
                                // the account <-> profile syncing somewhere else/
                                this.ensureAccountData(function() {
                                    if (callbacks.success) {
				                    	callbacks.success.call(this);
				                    }
                                }.bind(this));
                            } else {
                                // no profile ... create a bare bones one.
                                this.hasProfile = false;
                                this.userRecord = {
                                	user: {}, profile: {}
                                }
                                this.context.userRecord = this.userRecord;
                                this.ensureAccountData(function() {
                                    if (callbacks.success) {
				                    	callbacks.success.call(this);
				                    }
                                }.bind(this));
                            }
                        }.bind(this), 
                        function(err) {
                            console.log('[UserProfile.sync] Error getting user profile.');
                            console.log(err);
                            this.renderErrorView({
                            	title: 'Error Getting Profile', 
                            	message: 'Error getting profile: ' + err
                            });
                        }.bind(this)
                    );
                }
                return this;
            }
        },

        genId: {
            value: function() {
                return 'gen_' + this._generatedId++;
            }
        },

        ensureAccountData: {
            value: function(callback) {
            	// assumes the user record has been loaded, inspects to ensure the account
            	// property is set, and if not, fetches it and sets it.
                if (!this.userRecord.profile.account) {
                	//console.log('GETTING user account');
                	// console.log(this.userRecord);
                    this.getUserAccountInfo({userId: this.userId}, function (data) {
                        if (data.realname) {
                            this.hasAccount = true;
                            this.userRecord.profile.account = {
                                realname: data.realname,
                                email: data.email,
                                username: this.userId
                            };
                        } else {
                            this.hasAccount = false;
                        	this.renderErrorView({
                        		title: 'Error', 
                        		message: 'No user info returned from Genome Comparison'
                        	});
                        };
                        callback.call(this);
                    }.bind(this));
                } else {
                    callback.call(this);
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




       
        // MODEL UPDATE

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

        formToObject: {
        	value: function (schema) {
        		// walk the schema, building an object out of any form values 
        		// that we find.
        		var that = this;
        		var form = this.places.content.find['form'];
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
	        				return this;
	        			}
	        		},
        			getFieldValue: {
			            value: function(name) {
			                var field = this.container.find('[data-field="' + name + '"]');
			                if (!field || field.length === 0) {
			                	// NB: this is not null, which is reserved for a field with empty data.
			                	return undefined;
			                	//throw 'Unable to find field "' + name + '"';
			                }
		                	var control = field.find('input, textarea, select');
		                	if (!control || control.length === 0) {
		                		// NB: this is not null, which is reserved for a field with empty data.
		                		return undefined;
			                	//throw 'Unable to find field control in "' + name + '"';
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
			        					
			        					newObject[propName] = this.parseObject(propSchema); 

			        					this.currentPath.pop();
			        					break;
			        				case 'array':
			        					this.currentPath.push(propName);
			        					newObject[propName] = this.parseArray(propSchema);
			        					this.currentPath.pop();
			        					break;
			        				case 'string':
			        					this.currentPath.push(propName);
			        					var value = this.parseString(propSchema);
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
		        					var value =  this.container.find('[data-field="'+path+'"] fieldset').map(function () {
		        						return Object.create(parser).init({container: $(this)}).parseObject(itemSchema);
		        					}).get();
		        					return value;
		        				default:
		        					throw "Can't make array out of " + itemSchema.type + " yet.";	        					
		        			}
		        		}

	        		},
	        		parseString: {
	        			value: function (schema) {
							var fieldName = this.currentPath.join('.');
							return this.getFieldValue(fieldName);
		        		}
		        	},
	        		parseInteger: {
	        			value: function (schema) {
							var fieldName = this.currentPath.join('.');
							var strVal = this.getFieldValue(fieldName);
        					if (strVal) {
        						var intVal = parseInt(strVal);
        						if (intVal !== NaN) {
        							return intVal;
        						}
        					}
        					return undefined;
		        		}
		        	}
        		});
        		return parser.init({container: this.places.content}).parseObject(schema);
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
        updateUserRecordFromForm: {
            value: function() {
                this.clearErrors();

                var schema = {
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


                var json = this.formToObject(schema);

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

                //console.log('UPDATED'); 
                //console.log(updated); 

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
            value: function () {
                // Get basic user account info (may already have it).
                this.ensureAccountData(function () {
                	// account data has been set ... copy the account fields to the corresponding user and profile fields.
                	this.userRecord.user.username = this.userRecord.profile.account.username;
                	this.userRecord.user.realname = this.userRecord.profile.account.realname;
                    this.userRecord.profile.email = this.userRecord.profile.account.email

                    this.saveUserRecord({
                        success: function() {
                        	this.renderViewEditLayout();
                        	this.renderPicture();
                            this.renderEditView();
                            this.addSuccessMessage('Success!', 'Your user profile has been created.');
                        },
                        error: function (error) {
                        	this.renderLayout();
                        	this.renderErrorView({
                        		title: 'Error',
                        		message: 'Your user profile could not be saved: ' + error.message
                        	})
                        }
                    });
                    
                })

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
            value: function(cfg, callback) {
                // Can't use this, because the globus CORS policy does 
                // not allow us to.
                // TODO: need to incorporate this into the user profile
                // service.
                // FORNOW: use the getGenomeComparisonUserInfo workaround for now.
                if (!this.authToken) {
                    callback.call(that, {});
                }
                var host = 'kbase.us'; 
                // var host = 'mock.kbase.us';
                var path = '/services/genome_comparison/users';
                var query = 'usernames=' + cfg.userId + '&token=' + this.authToken;
                var url = 'https://' + host + path + '?' + query;
                $.ajax(url, {
                    dataType: 'json',
                    success: function (responseData) {  
                         if (responseData.data[cfg.userId] && responseData.data[cfg.userId].fullName) {
                            callback.call(this, {
                                realname: responseData.data[cfg.userId].fullName, 
                                email: responseData.data[cfg.userId].email,
                                username: cfg.userId
                            });
                        } else {
                            callback.call(this, {realname: null});
                        }
                    }.bind(this),
                    error: function (jqxhr, status, error) {  
                    	var message = 'Error getting account data from Genome Comparison. ';
                    	if (jqxhr.status < 3) {
                    		message += 'A network error has occurred with status "'+jqxhr.status+'". ';
                    	} else {
                    		message += 'An error occured with the service. The code is "'+jqxhr.status+'", "'+jqxhr.statusText+'". ';
                    	}
                    	this.renderErrorView({
                    		title: 'Error', 
                    		message: message,
                    		responseText: jqxhr.responseText,
                    		status: status,
                    		error: error,
                    		jqxhr: jqxhr
                    	});

                        console.log('[UserProfile.getUserAcountInfo] Error getting data: ' + jqxhr.responseText + ', ' + error);
                        console.log(jqxhr); console.log(status); console.log(error);
                    }.bind(this)
                });
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

        setFieldError: {
            value: function(field, message) {

                if (typeof field === 'string') {
                    field = this.places.content.find('[data-field="'+field+'"]');
                }
                field.find('.form-control').addClass('has-error');
                var messageNode = field.find('[data-element="message"]');
                console.log('message: ');
                console.log(messageNode);
                if (message) {
                    messageNode.html(message);
                    messageNode.addClass('error-message');
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
                    this.getInitialData({
                    	success: function () {
                    		this.render()
                    	}.bind(this)
                    });
                }.bind(this));

                $(document).on('loggedOut.kbase', function(e, auth) {
                    this.authToken = null;
                    this.getInitialData({
                    	success: function () {
                    		this.render()
                    	}.bind(this)
                    });
                }.bind(this));
            }
        },

        render: {
            value: function () {
                // Generate initial view based on the current state of this widget.
                // Head off at the pass -- if not logged in, can't show profile.
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
                    this.places.title.html(this.userRecord.profile.account.realname + ' (' + this.userRecord.profile.account.username + ')');
                    this.renderPicture();
                    this.showNoProfileView();
                } else {
                    // no profile, no basic aaccount info
                    this.places.title.html('User Not Found');
                    this.renderPicture();
                    this.places.content.html(this.getTemplate('no_user').render(this.context));
                }
                return this;
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

        showNoProfileView: {
            value: function() {
                this.places.content.html(this.getTemplate('no_profile').render(this.context));
                if (this.isProfileOwner) {
                    $('[data-button="create-profile"]').on('click', function(e) {
                        this.createUserRecord();
                    }.bind(this));
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