(function($, undefined) {
	$.KBWidget({
		name: "KBaseUserRecentActivity",
		parent: "kbaseAuthenticatedWidget",
		version: "1.0.0",

		options: {
			userId: null,
			kbCache: {},
		},

		alertPanel: null,

		init: function(options) {
			this._super(options);
			console.log('ws url?');
			console.log(this.options.kbCache.ws_url);
			console.log(this.options.kbCache.token);
			if (this.options.kbCache.ws_url) {
				this.wsUrl = this.options.kbCache.ws_url;
			}
			if (this.options.kbCache.token) {
				this.ws = new Workspace(this.wsUrl, {
					token: this.options.kbCache.token
				});
			} else {
				this.ws = new Workspace(this.wsUrl);
			}

			this.userId = this.options.userId;

			// setup the alert panel
			this.alertPanel = $("<div></div>");
			this.$elem.append(this.alertPanel);
			this.$mainPanel = $("<div></div>").css("overflow", "auto").css("max-height", "500px");
			this.$elem.append(this.$mainPanel);

			this.recentActivity = [];

			this.renderLoading();
			this.getRecentActivity();

			return this;
		},

		getRecentActivity: function() {
			var that = this;

			// we want to look at data in all workspaces
			this.ws.list_workspace_info({},
				function(data) {
					var wsids = [];
					for (var k = 0; k < data.length; k++) {
						//tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
						//int object, permission user_permission, permission globalread,
						//lock_status lockstat, usermeta metadata> workspace_info
						if (data[k][2] === that.userId) {
							//for now, only include workspaces owned by this user
							wsids.push(data[k][0]);
						}
					}
					console.log('hmm, recent activity?');
					console.log(that.userId);
					console.log(data);
					if (wsids.length > 0) {
						var d = new Date();
						d.setMonth(d.getMonth() - 3);
						var params = {
							savedby: [that.userId],
							after: d.toISOString(),
							ids: wsids
						};
						that.ws.list_objects(params,
							function(data) {
								that.recentActivity = [];
								for (var k = 0; k < data.length; k++) {
									//<obj_id objid, obj_name name, type_string type,
									//timestamp save_date, int version, username saved_by,
									//ws_id wsid, ws_name workspace, string chsum, int size, usermeta meta>
									that.recentActivity.push({
										name: data[k][1],
										ws: data[k][7],
										type: (data[k][2].split("-")[0]).split("\.")[1],
										date: data[k][3]
									});
								}

								that.recentActivity.sort(function(a, b) {
									var x = new Date(a.date);
									var y = new Date(b.date);
									return ((x < y) ? 1 : ((x > y) ? -1 : 0));
								});
								var limit = 10;
								if (that.recentActivity.length > limit) {
									that.recentActivity = that.recentActivity.slice(0, limit);
								}
								that.render();
							},
							function(err) {
								that.renderError(err);
							});
					} else {
						that.render();
					}
				},
				function(err) {
					that.renderError(err);
				});
		},

		renderLoading: function () {
			this.$mainPanel.empty();
			this.$mainPanel.append('<div id="loading-msg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>searching for recent activity...</center></p></div>');
		},

		renderError: function (err) {
			this.$mainPanel.empty();
			console.log('ERROR');
			console.log(err);
			this.$mainPanel.append('<p>Error loading recent activity:</p>' +err.error.message);
		},

		render: function() {
			
			this.$mainPanel.empty();
			// simple table view
			if (this.recentActivity) {
				var $tbl = $('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered table-striped">').css("width", "90%");

				if (this.recentActivity.length > 0) {
					for (var k = 0; k < this.recentActivity.length; k++) {
						var d = new Date(this.recentActivity[k]["date"]);

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
						var objhtml = this.recentActivity[k]["name"] + " (" + this.recentActivity[k]["type"] + ")<br><i><small>modified on " +
							this.monthLookup[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " at " + time +
							"</small></i>";

						$tbl.append($("<tr>").append($("<td>").append(objhtml)));
					}
					this.$mainPanel.append($tbl);
				} else {
					this.$mainPanel.append("<b>No activity in the last 3 months.</b>");
				}
			} else {
				this.$mainPanel.append('<b>Error loading activity.</b>');
			}

		},
		monthLookup: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	});

})(jQuery)