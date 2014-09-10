(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseUserCollaboratorNetwork",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
        options: {
            userInfo:null,
	    wsUserInfoUrl:"https://dev04.berkeley.kbase.us:7058",
	    wsUserInfoRef:"",
            kbCache:{},
        },
    
	ws:null,
	wsUrl:"https://kbase.us/services/ws",
	
	wsUserInfoClient:null,
	loggedIn:false,
	loggedInUserId:null,
	isMe:false,
	
	$alertPanel:null,
	$mainPanel:null,
	
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
	    if (options.userInfo) {
		self.userInfoData = options.userInfo['data'];
		if (self.userInfoData['basic_personal_info']['user_name']===self.loggedInUserId) {
		    self.isMe = true;
		}
	    }*/
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
	    
	    //if we are not logged in, we cannot really see anything
	    if (!self.loggedIn) {
		self.$elem.append("<strong>You must be logged in to see your common collaborator network</strong>");
		return this;
	    }
	    
	    
	    
	    // setup the alert panel
            self.$alertPanel = $("<div></div>");
	    self.$elem.append(self.$alertPanel);
            self.$mainPanel = $("<div></div>").css("overflow","auto").css("height","500px");;
	    self.$elem.append(self.$mainPanel);
	    
            self.buildCollaboratorNetwork();
	    //self.renderView();
	    return this;
	},
	
	
	collaboratorNetwork: {},
	
	buildCollaboratorNetwork: function () {
	    var self = this;
	    
	    // step 1: list workspaces
	    self.collaboratorNetwork["workspaces"] = {};
	    self.collaboratorNetwork["users"] = {};
	    self.collaboratorNetwork["all_links"] = [];
	    self.ws.list_workspace_info({excludeGlobal:1},
		function(data) {
		    // container to store calls to get the people that have share access to each workspace
		    var getWsUsersCalls = [];
		    var createUserPermCall = function (wsid) {
			return self.ws.get_permissions({id:wsid},
			    function(permdata) {
				// save perm data with the workspace
				self.collaboratorNetwork["workspaces"][wsid]['perms'] = permdata;
				var wsOwner = self.collaboratorNetwork["workspaces"][wsid]['owner'];
				
				// save unique user list
				for (var un in permdata) {
				    if (permdata.hasOwnProperty(un)) {
					if (un!=="*" && permdata[un]!=="n") {
					    self.collaboratorNetwork["users"][un] = {name:null};
					    if (wsOwner !== un) {
						self.collaboratorNetwork["all_links"].push({
							u1  : wsOwner,
							u2  : un,
							rel : "owns",
							ws  : wsid
						    });
					    }
					    for(var un2 in permdata) {
						if (permdata.hasOwnProperty(un2)) {
						    if (un2!=="*" && un !== un2) {
							self.collaboratorNetwork["all_links"].push({
								u1  : un,
								u2  : un2,
								rel : "share",
								ws  : wsid
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
		    
		    for(var k=0; k<data.length; k++) {
			//tuple<ws_id id, ws_name workspace, username owner, timestamp moddate,
			//int object, permission user_permission, permission globalread,
			//lock_status lockstat, usermeta metadata> workspace_info
			var wsid = data[k][0];
			var wsData = {
			    name  : data[k][1],
			    owner : data[k][2],
			    moddate : data[k][3],
			    size : data[k][4],
			    myPermission : data[k][5],
			    global : data[k][6],
			    lockstat : data[k][7],
			    metadata : data[k][8],
			};
			self.collaboratorNetwork["workspaces"][wsid] = wsData;
			self.collaboratorNetwork["users"][data[k][2]] = {name:null};
			getWsUsersCalls.push(createUserPermCall(wsid));
		    }
		    self.renderView();
		    
		    $.when.apply($, getWsUsersCalls).done(function() {
			self.assembleCollaborators();
			self.renderView();
			self.getNiceUserNames();
		    });
		    
		},
		function(err) {
		    
		});
	},
	
	
	assembleCollaborators: function() {
	    var self = this;
	    // simple table view
	    
	    self.collaboratorNetwork["collaborators"] = {};
	    if (self.collaboratorNetwork["all_links"]) {
		var thisUser = self.options.userInfo['data']['basic_personal_info']['user_name'];
		var links = self.collaboratorNetwork["all_links"];
		var $tbl = $('<table class="table table-condensed">');
		for(var k=0; k<links.length; k++) {
		    if (links[k]["u1"] === thisUser) {
			if (self.collaboratorNetwork["collaborators"][links[k]["u2"]]) {
			    self.collaboratorNetwork["collaborators"][links[k]["u2"]]['ws'][links[k]['ws']]=1;
			} else {
			    self.collaboratorNetwork["collaborators"][links[k]["u2"]] = { ws:{ } };
			    self.collaboratorNetwork["collaborators"][links[k]["u2"]]['ws'][links[k]['ws']]=1;
			}
		    }
		    if (links[k]["u2"] === thisUser) {
			if (self.collaboratorNetwork["collaborators"][links[k]["u1"]]) {
			    self.collaboratorNetwork["collaborators"][links[k]["u1"]]['ws'][links[k]['ws']]=1;
			} else {
			    self.collaboratorNetwork["collaborators"][links[k]["u1"]] = { ws:{ } };
			    self.collaboratorNetwork["collaborators"][links[k]["u1"]]['ws'][links[k]['ws']]=1;
			}
		    }
		}
	    }
	},
	
	
	
	
	
	renderView: function () {
	    var self = this;
	    self.$mainPanel.empty();
	    //self.$mainPanel.append("<pre>"+JSON.stringify(self.collaboratorNetwork, undefined,'\t')+"</pre>");
	    
	    // simple table view
	    if (self.collaboratorNetwork["collaborators"]) {
		var cols = self.collaboratorNetwork["collaborators"];
		var tblData = [];
		for(var c in cols) {
		    var rowData = {
			name:" - ",
			user_id:'<a href="#/people/'+c+'">'+c+'</a>',
			ws:""
		    };
		    var n = 0; var nObjs = 0;
		    for(var w in cols[c]['ws']) {
			var wsName = self.collaboratorNetwork["workspaces"][w]['name'];
			nObjs += self.collaboratorNetwork["workspaces"][w]['size'];
			var wsText = '<a href="#/ws/objects/'+wsName+'">'+wsName+'</a>';
			if (n===0) { rowData['ws'] += wsText; }
			else { rowData['ws'] += ", " + wsText; }
			n++;
		    }
		    if (self.collaboratorNetwork["users"][c]) {
			if(self.collaboratorNetwork["users"][c]['name']) {
			    rowData['name'] = self.collaboratorNetwork["users"][c]['name'];
			}
		    }
		    rowData['nWs'] = n;
		    rowData['nObj'] = nObjs;
		    tblData.push(rowData);
		}
		
		self.$mainPanel.append($('<table id="coltble" cellpadding="0" cellspacing="0" border="0" class="table table-bordered table-striped"'
				+' style="width: 100%; margin-left: 0px; margin-right: 0px;">'));
		var sDom = 't<ip>'
		if (tblData.length<=5) { sDom = 'ti'; }
		var tblSettings = {
				    //"sPaginationType": "full_numbers",
				    "iDisplayLength": 5,
				    "oLanguage": { "sZeroRecords": "No common collaborators found." },
				    "order": [3,'dsc',4,'dsc'],
				    "sDom": sDom,
				    "aoColumns": [
					    {sTitle: "Name", mData: "name", sWidth:"30%"},
					    {sTitle: "User Id", mData: "user_id"},
					    {sTitle: "Workspaces", mData: "ws"},
					    {sTitle: "<i>n</i>_WS", mData: "nWs"},
					    {sTitle: "<i>n</i>_Objs", mData: "nObj"}
				    ],
				    "aaData": tblData
				};
		var refTable = self.$mainPanel.find("#coltble").dataTable(tblSettings);
	    }
	    else {
		self.$mainPanel.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>building common collaborator network...</center></p></div>');
	    }
	},
	
	getNiceUserNames: function() {
	    var self = this;
	    // todo : use globus to populate user names, but we use a hack because of globus CORS headers
	    if (self.collaboratorNetwork["users"]) {
		var userNames = "";
		var firstOne = true;
		for(var u in self.collaboratorNetwork["users"]) {
		    if (firstOne) { firstOne = false; }
		    else { userNames +=',' }
		    userNames+=u;
		}
		
		$.ajax({
			type: "GET",
			url: self.userNameFetchUrl + userNames + "&token="+self.options.kbCache.token,
			dataType:"json",
                        crossDomain : true,
			success: function(data,res,jqXHR) {
			    for(var u in self.collaboratorNetwork["users"]) {
				if (u in data['data'] && data['data'][u]['fullName']) {
				    if (u === self.loggedInUserId) {
					data['data'][u]['fullName'] = "You - "+data['data'][u]['fullName'];
				    }
				    self.collaboratorNetwork["users"][u]['name'] = data['data'][u]['fullName'];
				} else {
				    self.collaboratorNetwork["users"][u]['name'] = "Name not found.";
				}
			    }
			    self.renderView();
			},
			error: function(jqXHR, textStatus, errorThrown) {
			    //do nothing
			}
		    })
	    }
	}
	
    }
    
    
    
    
    
    );
})( jQuery )