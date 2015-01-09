define(['jquery', 'nunjucks', 'kbasesocialwidget', 'kbaseworkspaceserviceclient', 'kbaseuserprofileserviceclient', 'q', 'json!functional-site/config.json'], 
       function ($, nunjucks, SocialWidget, WorkspaceService, UserProfileService,  Q, config) {
  "use strict";
	var Widget = Object.create(SocialWidget, {
		init: {
			value: function (cfg) {
				cfg.name = 'CommonCollaboratorNetwork';
				cfg.title = 'Common Collaborator Network';
				this.SocialWidget_init(cfg);
        
        console.log('config?');
        console.log(config);
        
        
        return this;
			}
		},
    
    calcContext: {
      value: function () {
        return {};
      }
    },

		render: {
			value: function () {
        if (this.isLoggedIn()) {
          this.places.content.html(this.getTemplate('view').render(this.calcContext()));
        } else {
          this.places.content.html(this.getTemplate('unauthorized').render({}));
        }
			}
		},

		getCurrentState: {
			value: function(options) {
        // get the current user profile...
        
        
        // build the collaborator network...
        
        
        options.success();
      }
		},
    
    // Specialized methods
    
    buildCollaboratorNetwork: function() {
      // step 1: list workspaces
      var widget = this;
      this.state.network = {
        workspaces: {},
        users: {},
        all_links: []
      };
      this.workspaceClient.ws.list_workspace_info({
          excludeGlobal: 1
        },
        function(data) {
          // container to store calls to get the people that have share access to each workspace
          var getWsUsersCalls = [];
          var createUserPermCall = function(wsid) {
            return widget.workspaceClient.get_permissions({
                id: wsid
              },
              function(permdata) {
                // save perm data with the workspace
                widget.state.network.workspaces[wsid].perms = permdata;
                var wsOwner = widget.state.network.workspaces[wsid].owner;

                // save unique user list
                for (var un in permdata) {
                  if (permdata.hasOwnProperty(un)) {
                    if (un !== "*" && permdata[un] !== "n") {
                      widget.state.network.users[un] = {
                        name: null
                      };
                      if (wsOwner !== un) {
                        widget.state.network.all_links.push({
                          u1: wsOwner,
                          u2: un,
                          rel: 'owns',
                          ws: wsid
                        });
                      }
                      for (var un2 in permdata) {
                        if (permdata.hasOwnProperty(un2)) {
                          if (un2 !== "*" && un !== un2) {
                            widget.state.network.all_links.push({
                              u1: un,
                              u2: un2,
                              rel: "share",
                              ws: wsid
                            });
                          }
                        }
                      }
                    }
                  }
                }
              },
              function(err) {
                console.error("Error in finding permissions!");
                console.error(err);
              });
          };

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
            widget.state.network.workspaces[wsid] = wsData;
            widget.state.network.users[wsData.owner] = {
              name: null
            };
            getWsUsersCalls.push(createUserPermCall(wsid));
          }
          widget.renderView();

          $.when.apply($, getWsUsersCalls).done(function() {
            widget.assembleCollaborators();
            widget.renderView();
            widget.getNiceUserNames();
          });

        },
        function(err) {
          widget.renderErrorView(err);
        });
    },
    
    assembleCollaborators: function() {
      this.state.network.collaborators = {};
      if (this.state.network.all_links) {
        var thisUser = this.options.userInfo['data']['basic_personal_info']['user_name'];
        var links = self.collaboratorNetwork["all_links"];
        var $tbl = $('<table class="table table-condensed">');
        for (var k = 0; k < links.length; k++) {
          if (links[k]["u1"] === thisUser) {
            if (self.collaboratorNetwork["collaborators"][links[k]["u2"]]) {
              self.collaboratorNetwork["collaborators"][links[k]["u2"]]['ws'][links[k]['ws']] = 1;
            } else {
              self.collaboratorNetwork["collaborators"][links[k]["u2"]] = {
                ws: {}
              };
              self.collaboratorNetwork["collaborators"][links[k]["u2"]]['ws'][links[k]['ws']] = 1;
            }
          }
          if (links[k]["u2"] === thisUser) {
            if (self.collaboratorNetwork["collaborators"][links[k]["u1"]]) {
              self.collaboratorNetwork["collaborators"][links[k]["u1"]]['ws'][links[k]['ws']] = 1;
            } else {
              self.collaboratorNetwork["collaborators"][links[k]["u1"]] = {
                ws: {}
              };
              self.collaboratorNetwork["collaborators"][links[k]["u1"]]['ws'][links[k]['ws']] = 1;
            }
          }
        }
      }
    },
    

	});

	return Widget;
});
