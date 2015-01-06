(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseUserPopularNarratives",
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
            self.$mainPanel = $("<div></div>").css("overflow","auto").css("height","300px");
	    self.$elem.append(self.$mainPanel);
	    
	    self.getRecentActivity();
	    self.render();
	    
	    return this;
	},
    
	popularNarratives:null,
    
	getRecentActivity : function () {
	    var self = this;
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
		    var params = {savedby:[self.wsUserName], type:"KBaseNarrative.Narrative",ids:wsids,includeMetadata:1};
		    self.ws.list_objects(params,
			function(data) {
			    self.popularNarratives=[];
			    for(var k=0; k<data.length; k++) {
				//<obj_id objid, obj_name name, type_string type,
				//timestamp save_date, int version, username saved_by,
				//ws_id wsid, ws_name workspace, string chsum, int size, usermeta meta>
				self.popularNarratives.push({
				    name:data[k][10]['name'],
				    ws:data[k][7],
				    size:data[k][9],
				    version: data[k][4],
				    date:data[k][3]
				});
			    }
				    
			    self.popularNarratives.sort(function(a,b) {
				//var x = new Date(a.date);
				//var y = new Date(b.date);
				//return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
				return ((a.version < b.version) ? 1 : ((a.version > b.version) ?  -1 : 0));
			    });
			    var limit = 5;
			    if (self.popularNarratives.length>limit) {
				self.popularNarratives = self.popularNarratives.slice(0,limit);
			    }
			    self.render();
			},
			function(err) {
			    self.popularNarratives=[];
			    self.render();
			});
		},
		function(err) {
		    self.popularNarratives=[];
		    self.render();
		});
		
	},
	
	render : function () {
	    var self = this;
	    
	    self.$mainPanel.empty();
	    
	    // simple table view
	    if (self.popularNarratives) {
		var $tbl = $('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered table-striped">').css("width","90%");
		
		if (self.popularNarratives.length>0) {
		    for (var k=0; k<self.popularNarratives.length; k++) {
			var d = new Date(self.popularNarratives[k]["date"]);
			
			var time = "";
			var minutes = d.getMinutes(); if (minutes<10) { minutes = "0"+minutes; }
			if (d.getHours()>=12) {
			    if(d.getHours()!=12) { time = (d.getHours()-12) + ":"+minutes+"pm"; }
			    else { time = "12:"+minutes+"pm"; }
			} else {
			    time = d.getHours() + ":"+minutes+"am";
			}
			var objhtml = self.popularNarratives[k]["name"]+" (v"+self.popularNarratives[k]["version"]+")<br><i><small>modified on "+
			self.monthLookup[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()+" at " + time +
			"</small></i>";
			
			$tbl.append($("<tr>").append($("<td>").append(objhtml)));
		    }
		    self.$mainPanel.append($tbl);
		} else {
		    self.$mainPanel.append("<b>No visible narratives.</b>");
		}
	    }
	    else {
		self.$mainPanel.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>searching for recent activity...</center></p></div>');
	    }
	    
	    
	},
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]
    

    });
})( jQuery )