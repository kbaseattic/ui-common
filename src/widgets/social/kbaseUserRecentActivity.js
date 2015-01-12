define(['jquery', 'nunjucks', 'kbasesocialwidget',  'kbaseworkspaceserviceclient', 'q'], 
function ($, nunjucks, SocialWidget, WorkspaceService, Q) {
	var RecentActivityWidget = Object.create(SocialWidget, {
		init: {
			value: function (cfg) {
				cfg.name = 'RecentActivity';
				cfg.title = 'Recently Updated Narratives';
				this.SocialWidget_init(cfg);

        // Prepare templating.
				this.templates.env.addFilter('dateFormat', function(dateString) {					
					return this.niceElapsedTime(dateString);
        }.bind(this));
				
				// TODO: get this from somewhere, allow user to configure this.
				this.params.limit = 10;
        
        this.syncApp();

        return this;
			}
		},
    
    // To be called whenever the params or auth have changed.
    // Rebuild the widget.
    syncApp: {
      value: function () {
    		if (this.isLoggedIn()) {
          if (this.hasConfig('workspace_url')) {
    				this.workspaceClient = new WorkspaceService(this.getConfig('workspace_url'), {
    					token: this.auth.authToken
    				});
          } else {
    			  throw 'The workspace client url is not defined';
    		  }
        } else {
          this.workspaceClient = null;
        }
      }
    },
    
    
    go: {
      value: function () {
        this.start();
        return this;
      }
    },
    
		getCurrentState: {
			value: function(options) {
				// Reset or create the recent activity list.
        var def = Q.defer();
        
				var recentActivity = [];
        
        // We only run any queries if the session is authenticated.
        if (!this.isLoggedIn()) {
          //options.success();
          def.resolve();
          return def.promise;
        }

				// Note that Narratives are now associated 1-1 with a workspace. 
				// Some new narrative attributes, such as name and (maybe) description, are actually
				// stored as attributes of the workspace itself.
				// At present we can just use the presence of "narrative_nice_name" metadata attribute 
				// to flag a compatible workspace.
				var d = new Date();
				d.setMonth(d.getMonth() - 3);
        this.to_promise(this.workspaceClient, 'list_workspace_info',{
					after: d.toISOString(),
					showDeleted: 0,
					owners: [this.params.userId]
				})
        .then(function(data) {
					var workspaceIds = [];
					var workspaceMap = {};
					// First we both transform each ws info object into a nicer js object,
					// and filter for modern narrative workspaces.
					for (var i=0; i<data.length; i++) {
						//tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
						//int object, permission user_permission, permission globalread,
						//lock_status lockstat, usermeta metadata> workspace_info
						var wsInfo = this.workspace_metadata_to_object(data[i]);

						if (wsInfo.metadata.narrative_nice_name) {
							workspaceIds.push(wsInfo.id);
							workspaceMap[wsInfo.name] = wsInfo;
						}
					}

					// Then we need to get the actual narratives because we need the ids in order
					// to form a url.
					// NB this is a bit awkward -- perhaps there will be a way soon to open a narrative
					// just by specifying the workspace.

					// Get details for, sort, and limit the list of workspace objects.
					if (workspaceIds.length > 0) {
						
						var params = {
							savedby: [this.params.userId],
							after: d.toISOString(),
							ids: workspaceIds,
							type: 'KBaseNarrative.Narrative',
							includeMetadata: 1
						};
						var workspacesWithNarratives = {};
            
            this.to_promise(this.workspaceClient, 'list_objects', params)
            .then(function(data) {
								for (var i=0; i<data.length; i++) {
									//<obj_id objid, obj_name name, type_string type,
									//timestamp save_date, int version, username saved_by,
									//ws_id wsid, ws_name workspace, string chsum, int size, usermeta meta>
									var narrativeInfo = this.narrative_info_to_object(data[i]);
                  
									if (workspacesWithNarratives[narrativeInfo.ws]) {
										this.addWarningMessage('Workspace '+narrativeInfo.ws+' already has a narrative ' +
											workspacesWithNarratives[narrativeInfo.ws].name + ', ' +
											narrativeInfo.name + ' was skipped.');
									} else {										
										var workspaceInfo = workspaceMap[narrativeInfo.ws];
										if (workspaceInfo) {
                      // only keep the narrative with a matching name.
                      if (workspaceInfo.metadata.narrative_nice_name === narrativeInfo.metadata.name) {
											  narrativeInfo.nice_name = workspaceInfo.metadata.narrative_nice_name;
											  narrativeInfo.description = workspaceInfo.metadata.narrative_description;
											  recentActivity.push(narrativeInfo);
                        workspacesWithNarratives[narrativeInfo.ws] = narrativeInfo;
                      } else {
                        this.addWarningMessage('Narrative '+ narrativeInfo.name + ' does not match the workspace narrative ' + workspaceInfo.metadata.narrative_nice_name);
                      }
										} else {
											this.addWarningMessage('Workspace ' + narrativeInfo.ws + ' for narrative '+narrativeInfo.name + ' not found.');
										}
									}
								}
								// We should now have the list of recently active narratives.
								// Now we sort and limit the list.
								recentActivity.sort(function(a, b) {
									var x = new Date(a.date);
									var y = new Date(b.date);
									return ((x < y) ? 1 : ((x > y) ? -1 : 0));
								});
                this.setState('recentActivity', recentActivity);
                // options.success();
                def.resove();
						}.bind(this))
            .catch(function(err) {
                def.reject(err);
                //return def.promise
								// options.error(err.error.message);
						});
					} else {
						// Didn't find anything, but still considered "success"
						// options.success();
            def.resolve();
            //return def.promise;
					}
				}.bind(this));
        return def.promise;
			}	
		}
	});

	return RecentActivityWidget;
});
