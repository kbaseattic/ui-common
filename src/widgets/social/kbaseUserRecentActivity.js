define(['jquery', 'nunjucks', 'kbasesocialwidget'], function ($, nunjucks, SocialWidget) {
	var RecentActivityWidget = Object.create(SocialWidget, {
		init: {
			value: function (cfg) {
				cfg.name = 'RecentActivity';
				cfg.title = 'Recent Activity';
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
				this.places.content.html(this.getTemplate('recent_activity').render(this.context));
			}
		},

		getCurrentState: {
			value: function(cfg) {
				// Reset or create the recent activity list.
				this.data.recentActivity = [];

				// NB: this loads and inspects data in all workspaces. Is this really advisable??
				this.workspaceClient.list_workspace_info({}, function(data) {
					// collect all the workspace objects available to this user, filtering 
					// out those that are actually owned by the user.
					var wsids = [];
					for (var i=0; i<data.length; i++) {
						//tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
						//int object, permission user_permission, permission globalread,
						//lock_status lockstat, usermeta metadata> workspace_info
						if (data[i][2] === this.params.userId) {
							//for now, only include workspaces owned by this user
							wsids.push(data[i][0]);
						}
					}

					// Get details for, sort, and limit the list of workspace objects.
					if (wsids.length > 0) {
						var d = new Date();
						d.setMonth(d.getMonth() - 3);
						var params = {
							savedby: [this.params.userId],
							after: d.toISOString(),
							ids: wsids
						};
						this.workspaceClient.list_objects(params,
							function(data) { 
								for (var i=0; i<data.length; i++) {
									//console.log('data: ' + i);
									//console.log(data[i]);
									//<obj_id objid, obj_name name, type_string type,
									//timestamp save_date, int version, username saved_by,
									//ws_id wsid, ws_name workspace, string chsum, int size, usermeta meta>
									// only consider narratives.
									// just get the second component of the type name.
									var dataType = (data[i][2].split("-")[0]).split("\.")[1];
									if (dataType === 'Narrative') {
										this.data.recentActivity.push({
											name: data[i][1],
											ws: data[i][7],
											ref: data[i][7] + '/' + data[i][1],
											type: dataType, 
											date: data[i][3],
											checksum: data[i][8],
											obj_id: 'ws.' + data[i][6] + '.obj.' + data[i][0]
										});
									}
								}

								this.data.recentActivity.sort(function(a, b) {
									var x = new Date(a.date);
									var y = new Date(b.date);
									return ((x < y) ? 1 : ((x > y) ? -1 : 0));
								});
								var recentActivityMap = {};
								if (this.data.recentActivity.length > this.params.limit) {
									this.data.recentActivity = this.data.recentActivity.slice(0, this.params.limit);
									
									this.data.recentActivity.forEach(function (x) {
										recentActivityMap[x.ref] = x;
									});
								}

								var wsrefs = this.data.recentActivity.map(function (x) {
									return {
										ref: x.ref
									};
								});

								this.workspaceClient.get_objects(wsrefs, 
									function (wsobjs) {
										for (var i=0; i<wsobjs.length; i++) {
											var wsobj = wsobjs[i];
											var ref = wsobj.info[7] + '/' + wsobj.info[1];
											recentActivityMap[ref].ws_object = wsobj;
										}
										cfg.success();
									}.bind(this), 
									function (err) {
										cfg.error(err);
									}
								);
							}.bind(this),
							function(err) {
								cfg.error(err);
							}.bind(this));
					} else {
						// Didn't find anything, but still considered "success"
						cfg.success();
					}
				}.bind(this),
				function(err) {
					this.renderError(err);
				}.bind(this));
			}	
		}

	});

	return RecentActivityWidget;
});
