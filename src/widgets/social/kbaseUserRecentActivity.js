(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseUserRecentActivity",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
	
        options: {
            userInfo:null,
	    wsUserInfoUrl:"https://dev04.berkeley.kbase.us:7058",
	    wsUserInfoRef:"",
            kbCache:{},
        },
    
	wsUserName:"",
	wsUserInfoClient:null,
	loggedIn:false,
	loggedInUserId:null,
	userInfoData:null,
	isMe:false,
	
	alertPanel:null,
	
        init: function(options) {
            this._super(options);
            var self = this;
	    /* we don't need the user profile data for now...
	     if (options.wsUserInfoUrl) {
		if (options.kbCache.token) {
		    self.wsUserInfoClient = new Workspace(options.wsUserInfoUrl, {token: self.options.kbCache.token});
		} else {
		    self.wsUserInfoClient = new Workspace(options.wsUserInfoUrl);
		}
            }
	    */
	    if (self.options.kbCache.ws_url) {
                self.wsUrl = self.options.kbCache.ws_url;
            }
            if (self.options.kbCache.token) {
                self.ws = new Workspace(self.wsUrl, {token: self.options.kbCache.token});
		self.loggedIn = true;
		self.loggedInUserId = $('<div></div>').kbaseLogin().get_kbase_cookie('user_id');
            } else {
                self.ws = new Workspace(self.wsUrl);
            }
	    
	    if (options.userInfo) {
		self.userInfoData = options.userInfo['data'];
		self.wsUserName = self.userInfoData['basic_personal_info']['user_name'];
		if (self.wsUserName===self.loggedInUserId) {
		    self.isMe = true;
		}
	    }
	    // setup the alert panel
            self.alertPanel = $("<div></div>");
	    self.$elem.append(self.alertPanel);
            self.$mainPanel = $("<div></div>").css("overflow","auto").css("height","500px");
	    self.$elem.append(self.$mainPanel);
	    
	    self.getRecentActivity();
	    self.render();
	    
	    return this;
	},
    
	recentActivity:null,
    
	getRecentActivity : function () {
	    var self = this;
	    
	    // we want to look at data in all workspaces
	    self.ws.list_workspace_info({},
		function(data) {
		    var wsids = [];
		    for(var k=0; k<data.length; k++) {
			//tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
			//int object, permission user_permission, permission globalread,
			//lock_status lockstat, usermeta metadata> workspace_info
			if (data[k][2]===self.wsUserName) {
			    //for now, only include workspaces owned by this user
			    wsids.push(data[k][0]);
			}
		    }
		    var d = new Date();
		    d.setMonth(d.getMonth()-3);
		    var params = {savedby:[self.wsUserName], after:d.toISOString(), ids:wsids};
		    self.ws.list_objects(params,
			function(data) {
			    self.recentActivity=[];
			    for(var k=0; k<data.length; k++) {
				//<obj_id objid, obj_name name, type_string type,
				//timestamp save_date, int version, username saved_by,
				//ws_id wsid, ws_name workspace, string chsum, int size, usermeta meta>
				self.recentActivity.push({
				    name:data[k][1],
				    ws:data[k][7],
				    type: (data[k][2].split("-")[0]).split("\.")[1],
				    date:data[k][3]
				});
			    }
			    
			    self.recentActivity.sort(function(a,b) {
				var x = new Date(a.date);
				var y = new Date(b.date);
				return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
			    });
			    var limit = 10;
			    if (self.recentActivity.length>limit) {
				self.recentActivity = self.recentActivity.slice(0,limit);
			    }
			    self.render();
			},
			function(err) {
			    self.recentActivity=[];
			    self.render();
			});
		},
		function(err) {
		    self.recentActivity=[];
		    self.render();
		});
	},
	
	render : function () {
	    var self = this;
	    
	    self.$mainPanel.empty();
	    
	    // simple table view
	    if (self.recentActivity) {
		var $tbl = $('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered table-striped">').css("width","90%");
		
		if (self.recentActivity.length>0) {
		    for (var k=0; k<self.recentActivity.length; k++) {
			var d = new Date(self.recentActivity[k]["date"]);
			
			var time = "";
			var minutes = d.getMinutes(); if (minutes<10) { minutes = "0"+minutes; }
			if (d.getHours()>=12) {
			    if(d.getHours()!=12) { time = (d.getHours()-12) + ":"+minutes+"pm"; }
			    else { time = "12:"+minutes+"pm"; }
			} else {
			    time = d.getHours() + ":"+minutes+"am";
			}
			var objhtml = self.recentActivity[k]["name"]+" ("+self.recentActivity[k]["type"]+")<br><i><small>modified on "+
			self.monthLookup[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()+" at " + time +
			"</small></i>";
			
			$tbl.append($("<tr>").append($("<td>").append(objhtml)));
		    }
		    self.$mainPanel.append($tbl);
		} else {
		    self.$mainPanel.append("<b>No visible activity in the last 3 months.</b>");
		}
	    }
	    else {
		self.$mainPanel.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>searching for recent activity...</center></p></div>');
	    }
	    
	    
	},
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]
    

    });
})( jQuery )