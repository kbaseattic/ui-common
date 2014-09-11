(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseUserProjectMembership",
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
    
	projects:[{name:"Project Alpha", role:"Data Contributer", ws:[]},
		  {name:"Project Beta", role:"PI", ws:[]},
		  {name:"Project Omega", role:"Member", ws:[]}],
    
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
			    var idx = Math.floor((Math.random() * 3));
			    self.projects[idx]['ws'].push(data[k][1]);
			}
		    }
		    self.render();
		},
		function(err) {
		    self.render();
		});
		
	},
	
	render : function () {
	    var self = this;
	    
	    self.$mainPanel.empty();
	    
	    // simple table view
	    if (self.projects) {
		var $tbl = $('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered table-striped">').css("width","90%");
		
		if (self.projects.length>0) {
		    for (var k=0; k<self.projects.length; k++) {
			
			var objhtml = '<strong>'+self.projects[k]["name"]+"</strong> (<i><small>role: "+
			self.projects[k]['role']+'</small></i>)<br><ul style="list-style-type:disc;">';
			for(var w=0;w<self.projects[k]["ws"].length;w++) {
			    objhtml += '<li  style="list-style-type:disc;">'+self.projects[k]["ws"][w] + "</li>";
			}
			objhtml += "</ul>";
			
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