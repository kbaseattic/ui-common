define(['jquery', 'nunjucks', 'kbasesocialwidget'], function ($, nunjucks, SocialWidget) {
	var PopularNarrativesWidget = Object.create(SocialWidget, {
		init: {
			value: function (cfg) {
				cfg.name = 'UserPopularNarratives';
				cfg.title = 'Popular Narratives';
				this.SocialWidget_init(cfg);

				this.templates.env.addFilter('dateFormat', function(dateString) {					
					var d = new Date(dateString);
					var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

					var time = "";
					var minutes = d.getMinutes();
					if (minutes < 10) {
						minutes = "0" + minutes;
					}
					if (d.getHours() >= 12) {
						if (d.getHours() != 12) {
							time = (d.getHours() - 12) + ":" + minutes + "pm";
						} else {
							time = "12:" + minutes + "pm";
						}
					} else {
						time = d.getHours() + ":" + minutes + "am";
					}
					return shortMonths[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " at " + time;
                });
                this.templates.env.addFilter('typeIcon', function (type) {
                	var initial = type.charAt(0);
                	return '<span style="border: 1px red solid; padding: 6px;font-weight: bold; font-size: 150%">' + initial + '</span>';
                })
				
				if (cfg.workspaceURL) {
					if (this.auth.authToken) {
						this.workspaceClient = new Workspace(cfg.workspaceURL, {
							token: this.auth.authToken
						});
					} else {
						this.workspaceClient = new Workspace(cfg.workspaceURL); 
					}
				} else {
					throw 'The workspace client url is not defined';
				}

				// TODO: get this from somewhere, allow user to configure this.
				this.params.limit = 10;

                return this;
			}
		},

		render: {
			value: function () {
				//console.log('Context');
				//console.log(this.context);
				this.places.content.html(this.getTemplate('popular_narratives').render(this.context));
			}
		},

		getCurrentState: {
			value: function(cfg) {
				// Reset or create the popular narratives list.
				this.data.popularNarratives = [];


				// Note that Narratives are now associated 1-1 with a workspace. 
				// Some new narrative attributes, such as name and (maybe) description, are actually
				// stored as attributes of the workspace itself.
				// At present we can just use the presence of "narrative_nice_name" metadata attribute 
				// to flag a compatible workspace.
				var d = new Date();
				d.setMonth(d.getMonth() - 3);
				this.workspaceClient.list_workspace_info({					
					showDeleted: 0,
					owners: [this.params.userId]
				}, function(data) {
					var workspaceIds = [];
					var workspaceMap = {};

					// First we both transfor each ws info object into a nicer js object,
					// and filter for modern narrative workspaces.
					for (var i=0; i<data.length; i++) {
						//tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
						//int object, permission user_permission, permission globalread,
						//lock_status lockstat, usermeta metadata> workspace_info
						var wsInfo = {
							id: data[i][0],
							name: data[i][1],
							owner: data[i][2],
							modified: data[i][3],
							object_count: data[i][4],
							permission: data[i][5],
							globalread: data[i][6],
							lockstat: data[i][7],
							metadata: data[i][8]
						};

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
						
						var workspacesWithNarratives = {};
						this.workspaceClient.list_objects({
								savedby: [this.params.userId],
								ids: workspaceIds,
								type: 'KBaseNarrative.Narrative',
								includeMetadata: 1
							},
							function(data) { 
								for (var i=0; i<data.length; i++) {
									//console.log('data: ' + i);
									//console.log(data[i]);
									//<obj_id objid, obj_name name, type_string type,
									//timestamp save_date, int version, username saved_by,
									//ws_id wsid, ws_name workspace, string chsum, int size, usermeta meta>
									// only consider narratives.
									// just get the second component of the type name.
									// var dataType = (data[i][2].split("-")[0]).split("\.")[1];
									//if (dataType === 'Narrative') {
									var narrativeInfo = {
										id: data[i][0],
										name: data[i][1],
										type: data[i][2],
										save_date: data[i][3],
										version: data[i][4],
										saved_by: data[i][5],
										wsid: data[i][6],
										ws: data[i][7],
										// type: dataType, 
										checksum: data[i][8],
										size: data[i][9],
										metadata: data[i][10],
										ref: data[i][7] + '/' + data[i][1],
										obj_id: 'ws.' + data[i][6] + '.obj.' + data[i][0]
									};
									var workspaceName = narrativeInfo.ws;
									if (workspacesWithNarratives[workspaceName]) {
										this.addWarningMessage('Workspace '+workspaceName+' already has a narrative ' +
											workspacesWithNarratives[workspaceName].name + ', ' +
											narrativeInfo.name + ' was skipped.');
									} else {
										
										//var dataType = narrativeInfo.(data[i][2].split("-")[0]).split("\.")[1];
										var workspaceInfo = workspaceMap[narrativeInfo.ws];
										if (workspaceInfo) {
											narrativeInfo.nice_name = workspaceInfo.metadata.narrative_nice_name;
											narrativeInfo.description = workspaceInfo.metadata.narrative_description;
											this.data.popularNarratives.push(narrativeInfo);
										} else {
											this.addWarningMessage('Workspace ' + narrativeInfo.ws + ' for narrative '+narrativeInfo.name + ' not found.');
										}
										
										workspacesWithNarratives[workspaceName] = narrativeInfo;
									}

								}

								// Sort by the version, from higher to lower.
								this.data.popularNarratives.sort(function(a, b) {
									if (a.version < b.version) {
										return 1;
									} else if (a.version > b.version) {
										return -1;
									} else {
										return 0;
									}
								});
								
								if (this.data.popularNarratives.length > this.params.limit) {
									this.data.popularNarratives = this.data.popularNarratives.slice(0, this.params.limit);
								}

								cfg.success();

							}.bind(this),
							function(err) {
								cfg.error(err.error.message);
							}.bind(this));
					} else {
						// Didn't find anything, but still considered "success"
						cfg.success();
					}
				}.bind(this),
				function(err) {
					cfg.error(err.error.message);
				}.bind(this));
			}	
		}

	});

	return PopularNarrativesWidget;
});