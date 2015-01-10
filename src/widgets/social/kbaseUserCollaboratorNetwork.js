define(['jquery', 'nunjucks', 'kbasesocialwidget', 'kbaseworkspaceserviceclient', 'kbaseuserprofileserviceclient', 'q', 'json!functional-site/config.json'], 
       function ($, nunjucks, SocialWidget, WorkspaceService, UserProfileService,  Q, config) {
  "use strict";
	var Widget = Object.create(SocialWidget, {
		init: {
			value: function (cfg) {
				cfg.name = 'CommonCollaboratorNetwork';
				cfg.title = 'Common Collaborator Network';
				this.SocialWidget_init(cfg);
        
        var configURLs = config[config.setup];
        
        // Set up workspace client
				if (cfg.workspaceURL) {
					if (this.auth.authToken) {
						this.workspaceClient = new WorkspaceService(configURLs.workspace_url, {
							token: this.auth.authToken
						});
					} else {
						this.workspaceClient = new WorkspaceService(configURLs.workspace_url); 
					}
				} else {
					throw 'The workspace client url is not defined';
				}
        
        // User profile service
        if (this.isLoggedIn()) {
          if (cfg.userProfileServiceURL) {
            this.userProfileClient = new UserProfileService(configURLs.user_profile_url, {
                token: this.auth.authToken
            });
          } else {
					  throw 'The user profile client url is not defined';
				  }
        }        
        
        $.ajaxSetup({
            timeout: 10000
        });
        
        return this;
			}
		},
    
    calcContext: {
      value: function () {
        return {
          state: this.state,
          generatedId: this.genId()
        }
      }
    },

		render: {
			value: function () {
        if (this.isLoggedIn()) {
          console.log(this.calcContext());
          this.places.content.html(this.getTemplate('view').render(this.calcContext()));
        } else {
          this.places.content.html(this.getTemplate('unauthorized').render({}));
        }
			}
		},

		getCurrentState: {
			value: function(options) {
        this.state = {};
        // get the current user profile...
        if (!this.isLoggedIn()) {
          options.error('Not authorized');
        }
        
        this.userProfileClient.get_user_profile([this.params.userId],
            function(data) {
              if (data) {
                this.state.currentUserProfile = data[0];
                
                this.buildCollaboratorNetwork({
                  success: function () {
                    console.log('Built collaborator network...');
                    console.log(this.state);
                    this.render();
                  }.bind(this),
                  error: function (err) {
                    this.renderErrorView(err);
                  }.bind(this)
                })
                
                options.success();
              } else {
                options.error('User not found');
              }
            }.bind(this),
            function(err) {
              options.error(err);
            }.bind(this)
        );
      }
		},
    
    // Specialized methods
    
    buildCollaboratorNetwork: {
      value: function(options) {
        // step 1: list workspaces
        this.state.network = {
          workspaces: {},
          users: {},
          all_links: []
        };
        this.workspaceClient.list_workspace_info({
            excludeGlobal: 1
          },
          function(data) {
          
            // A function which modifies the widget state to help build the network and associated
            // data objects for a single workspace. The function is returned so that it can be run
            // with others in async parallel.
            // TODO: switch from jquery to Q based promises.
            var createUserPermCall = function(wsid) {
              return this.workspaceClient.get_permissions({
                  id: wsid
                },
                function(permdata) {
                  // save perm data with the workspace
                  // NB: perm data is a map of username => permission
                	/* Represents the permissions a user or users have to a workspace:
	
                		'a' - administrator. All operations allowed.
                		'w' - read/write.
                		'r' - read.
                		'n' - no permissions.
                	*/
                  this.state.network.workspaces[wsid].perms = permdata;
                  var wsOwner = this.state.network.workspaces[wsid].owner;

                  // save unique user list
                  for (var username in permdata) {
                    if (permdata.hasOwnProperty(username)) {
                      if (username !== "*" && permdata[username] !== "n") {
                        // Name to be filled in later.
                        this.state.network.users[username] = {
                          name: null
                        };
                        // Store the network link with the 'owns' relationship
                        // for the current user only.
                        if (wsOwner !== username) {
                          this.state.network.all_links.push({
                            userA: wsOwner,
                            userB: username,
                            rel: 'owns',
                            ws: wsid
                          });
                        }
                        // Otherwise for all other users in this permdata list
                        // create a network link (skipping the current user so that
                        // we don't link it to itself!) with the 'share' relationship.
                        for (var un2 in permdata) {
                          if (permdata.hasOwnProperty(un2)) {
                            if (un2 !== "*" && username !== un2) {
                              this.state.network.all_links.push({
                                userA: username,
                                userB: un2,
                                rel: "share",
                                ws: wsid
                              });
                            }
                          }
                        }
                      }
                    }
                  }
                }.bind(this),
                function(err) {
                  console.error("Error in finding permissions!");
                  console.error(err);
                }.bind(this));
            }.bind(this);

            // And here we assmeble the array of calls.
            // container to store calls to get the people that have share access to each workspace
            var userPermCalls = [];
            for (var k = 0; k < data.length; k++) {
              //tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
              //int object, permission user_permission, permission globalread,
              //lock_status lockstat, usermeta metadata> workspace_info
              var wsid = data[k][0];
              var wsData = {
                name: data[k][1],
                owner: data[k][2],
                moddate: data[k][3],
                size: data[k][4],
                myPermission: data[k][5],
                global: data[k][6],
                lockstat: data[k][7],
                metadata: data[k][8],
              };
              this.state.network.workspaces[wsid] = wsData;
              this.state.network.users[wsData.owner] = {
                name: null
              };
              userPermCalls.push(createUserPermCall(wsid));
            }
            this.render();
            $.when.apply($, userPermCalls).done(function() {
              this.assembleCollaborators();
              // Get user profiles for all the users, update the colloborators adding the real name.
              var collaboratorUsers = this.set_to_array(this.state.network.collaborators);
              console.log(collaboratorUsers);
              this.userProfileClient.get_user_profile(collaboratorUsers,
                function (data) {
                  
                  try {
                    for (var i=0; i<data.length; i++) {
                      var username = data[i].user.username;
                      var realname = data[i].user.realname;
                      this.state.network.collaborators[username].realname = realname;
                    }
                  
                    // Now reformat as a list with properties for easier display.
                    this.state.network.collaboratorTable = this.obj_to_array(this.state.network.collaborators, 'username', function (x) {
                      x.ws = this.set_to_array(x.ws);
                      return x;
                    }.bind(this));
            
                    options.success();
                  } catch (ex) {
                    console.log('EX');
                    console.log(ex);
                    options.error(ex);
                  }
                  
                }.bind(this),
                
                function (err) {
                  console.log('ERR');
                  console.log(err);
                  options.error(err);
                }
              );
            }.bind(this));

          }.bind(this),
          function(err) {
            options.error(err);
          }.bind(this));
      }
    },
    
    set_prop_set: {
      value: function (obj, path, key) {
        if (typeof path === 'string') {
          path = path.split('.');
        }
        for (var i=0; i<path.length; i++) {
          var k = path[i];
          if (!obj[k]) {
            obj[k] = {};
          }
          obj = obj[k];
        }
        obj[key] = 1;
      }
    },

    set_to_array: {
      value: function (obj) {
        var a = [];
        for (var key in obj) {
          if (!obj.hasOwnProperty(key)) {continue;}
          a.push(key);
        }
        return a;
      }
    },
    
    obj_to_array: {
      value: function (obj, keyPropName, fun) {
        var keyPropName = keyPropName ? keyPropName : 'key';
        var a = [];
        for (var key in obj) {
          if (!obj.hasOwnProperty(key)) {continue;}        
          var item = fun ? fun(obj[key]) : obj[key];
          item[keyPropName] = key;
          a.push(item);
        }
        return a;
      }
    },
    
    assembleCollaborators: {
      value: function() {
        this.state.network.collaborators = {};
        if (this.state.network.all_links) {
          var thisUser = this.state.currentUserProfile.user.username;
          var links = this.state.network.all_links;
        
          var $tbl = $('<table class="table table-condensed">');
          for (var k = 0; k < links.length; k++) {
            var link = links[k];
          
            // collect links in which the current user is a participant (userA or userB).
            // use a set since there will be duplication (e.g. both relationships A-B, B-A are in the network...)
            if (links[k].userA === thisUser) {
              this.set_prop_set(this.state.network.collaborators, [link.userB, 'ws'], link.ws);
            }
            if (links[k].userB === thisUser) {
              this.set_prop_set(this.state.network.collaborators, [link.userA, 'ws'], link.ws);
            }
          }
        }
       
      }
    }
    

	});

	return Widget;
});
