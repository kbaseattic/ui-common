(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSObjRefUsers",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        //wsUrl: "http://dev04.berkeley.kbase.us:7058",
        wsUrl:"https://kbase.us/services/ws",
        userNameFetchUrl:"https://kbase.us/services/genome_comparison/users?usernames=",
	
        options: {
            wsNameOrId: null,
            objNameOrId: null,
            objVer: null,
            kbCache:{},
            width:350
        },

        
        wsName:"",
	objName:"",
	kbws:null, //this is the ws client
	
        userList:{},
        loggedIn: false,
        
        init: function(options) {
            this._super(options);
            var self = this;
	    self.userList={};
	    
            if (options.wsUrl) {
                self.wsUrl = options.wsUrl;
            }
            if (self.options.kbCache.ws_url) {
                self.wsUrl = self.options.kbCache.ws_url;
            }
            if (self.options.kbCache.token) {
                self.kbws = new Workspace(self.wsUrl, {token: self.options.kbCache.token});
		self.loggedIn = true;
            } else {
                self.kbws = new Workspace(self.wsUrl);
            }
            
            self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>finding all data that references this object...</center></p></div>');
            self.$elem.append($('<div id="mainview">').css("overflow","auto"));
            //self.$elem.append(JSON.stringify(options)+"<br>");
            
	    if ( (/^\d+$/.exec(options.wsNameOrId)) || ( /^\d+$/.exec(options.objNameOrId)) ){
		// it is an ID, so we need to get the object name
		// (this one is gonna be blocking on getting everything else...)
		var objectIdentity = self.getObjectIdentity(options.wsNameOrId, options.objNameOrId, options.objVer);
		var getInfoJob = [
		self.kbws.get_object_info([objectIdentity],0,
		    function(data) {
			self.objName = data[0][1];
			self.wsName  = data[0][7];
		    },
		    function(err) {
			self.$elem.find('#loading-mssg').remove();
			self.$elem.append("<br><b>Error: Could not access data for this object.</b><br>");
			self.$elem.append("<i>Error was:</i><br>"+err['error']['message']+"<br>");
			console.error("Error in finding referencing objects! (note: v0.1.6 throws this error if no referencing objects were found)");
			console.error(err);
		    })
		];
		$.when.apply($, getInfoJob).done(function() {
		    self.getTheRefsAndRender();
		});
	    }
            else {
		// it is a name already, so we can get right to the fun
		wsName = options.wsNameOrId;
		self.objName = options.objNameOrId;
		self.wsName  = options.wsNameOrId;
		self.getTheRefsAndRender();
            }
	    
	    return this;
	},
	
	getTheRefsAndRender : function () {
	    var self = this;
	    var objectIdentity = self.getObjectIdentity(self.options.wsNameOrId, self.options.objNameOrId, self.options.objVer);
	    // get the refs
	    self.kbws.list_referencing_objects([objectIdentity], function(data) {
		for(var i = 0; i < data[0].length; i++) {
		    //var savedate = new Date(objInfo[3]); // todo: add last save date
		    var refName = data[0][i][1] + " ("+data[0][i][6]+"/"+data[0][i][0]+"/"+data[0][i][4]+")";
		    if (data[0][i][5] in self.userList) {
			self.userList[data[0][i][5]]['refCount']++;
			self.userList[data[0][i][5]]['refs'].push(refName);
		    } else {
			self.userList[data[0][i][5]] = {refCount:1, name:"[Login to view name]", narCount:0, refs:[refName], nars:{}};
		    }
		}
		self.renderTable(true);
	    }, function(err) {
		self.$elem.find('#loading-mssg').remove();
		self.$elem.append("<br><b>Error: Could not access data for this object.</b><br>");
		self.$elem.append("<i>Error was:</i><br>"+err['error']['message']+"<br>");
		console.error("Error in finding referencing objects! (note: v0.1.6 throws this error if no referencing objects were found)");
		console.error(err);
	    });
	    
	    
	    // We also need to check if there are narrative references
	    var narrrativeTypeName = "KBaseNarrative.Narrative"; var dependentDataPath ="/metadata/data_dependencies";
	    var listObjParams = { includeMetadata:0, type:narrrativeTypeName};
	    if (/^\d+$/.exec(self.options.wsNameOrId))
		listObjParams['ids'] = [ self.options.wsNameOrId ];
	    else
		listObjParams['workspaces'] = [ self.options.wsNameOrId ];
	    self.kbws.list_objects( listObjParams, function(data) {
		if (data.length>0) {
		    var narList = [];
		    for(var i = 0; i < data.length; i++) {
			//0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
			narList.push({ref:data[i][6]+"/"+data[i][0]+"/"+data[i][4],included:[dependentDataPath]});
		    }
		    // then we get subdata containing the data dependencies
		    if (narList.length>0) {
			self.kbws.get_object_subset(narList, function(data) {
				    for(var i = 0; i < data.length; i++) {
					var depList = data[i]['data']['metadata']['data_dependencies'];
					for(var k=0; k<depList.length; k++) {
					    var name = depList[k].trim().split(/\s+/)[1];
					    if (name) {
						if (name == self.objName) {
						    var narName = data[i]['info'][1] + " ("+data[i]['info'][6]+"/"+data[i]['info'][0]+"/"+data[i]['info'][4]+")";
						    if (data[i]['info'][5] in self.userList) {
							self.userList[data[i]['info'][5]]['narCount']++;
							self.userList[data[i]['info'][5]]['nars'][narName]=1;
						    } else {
							self.userList[data[i]['info'][5]] = {refCount:0, name:"[Login to view name]", narCount:0, refs:[], nars:{}};
							self.userList[data[i]['info'][5]]['narCount']++;
							self.userList[data[i]['info'][5]]['nars'][narName]=1;
						    }
						}
					    }
					    
					}
				    }
				    // finally, render the table
				    self.renderTable(true);
			},
			function(err) {
			    // we couldn't get the subdata, so do nothing
			});
		    }
		}
	    },
	    function(err) {
		// do nothing, this isn't critical to this widget
	    });
	    
            return this;
        },
        
	
	renderTable : function(getNiceNames) {
	    var self = this;
	    var tblData = [];
	    for (var ud in self.userList) {
		// do a little prettifying
		var limit = 10; var count = 0;
		var narToolTip = "Narratives:\n"; 
		for(var narName in self.userList[ud]['nars']){
		    if (count==limit) {
			narToolTip += "...";
			break;
		    }
		    narToolTip += narName+"\n";
		    count++;
		}
		var refToolTip = "Data objects (includes all versions):\n";
		for(var r=0; r<self.userList[ud]['refs'].length; r++) {
		    if (r==limit) {
			refToolTip += "...";
			break;
		    }
		    refToolTip += self.userList[ud]['refs'][r]+"\n";
		    count++;
		}
		
		var mentionStr = "";
		if (self.userList[ud]['narCount']>0) {
		    mentionStr += '<span style="cursor:help;" title="'+narToolTip+'">'+self.userList[ud]['narCount']+' in narratives</span>';
		}
		if (self.userList[ud]['refCount'] > 0) {
		    if (mentionStr.length>0) { mentionStr += ",<br>"}
		    mentionStr += '<span style="cursor:help;" title="'+refToolTip+'">'+self.userList[ud]['refCount']+" in data objects</span>";
		}
		tblData.push({name:self.userList[ud]['name'],user_id:ud,mentions:mentionStr});
	    }
			
            if (tblData.length>0) {
		var $maindiv = self.$elem.find('#mainview');
		$maindiv.html(""); // clear it all out in case we are reloading
		$maindiv.append('<table cellpadding="0" cellspacing="0" border="0" id="ref-table" \
				class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>');
    
		var sDom = 't<fip>'
		if (tblData.length<=10) { sDom = 'ti'; }
		var tblSettings = {
				    //"sPaginationType": "full_numbers",
				    "iDisplayLength": 10,
				    "sDom": sDom,
				    "aoColumns": [
					    {sTitle: "Name", mData: "name", sWidth:"30%"},
					    {sTitle: "User Id", mData: "user_id"},
					    {sTitle: "Mentions", mData: "mentions"}
				    ],
				    "aaData": tblData
				};
		var refTable = self.$elem.find('#ref-table').dataTable(tblSettings);
		self.$elem.find('#loading-mssg').remove();
		if(getNiceNames) { self.getNiceUserNames(); }
	    } else {
		var $maindiv = self.$elem.find('#mainview');
		self.$elem.find('#loading-mssg').remove();
		$maindiv.append("<br><b>There are no other users that have referenced or used this object.</b>");
	    }
	},
	
	
	
	getNiceUserNames: function() {
	    var self = this;
	    // todo : use globus to populate user names, but we use a hack because of globus CORS headers
	    if (self.loggedIn) {
		var userNames = ""
		var firstOne = true;
		for(var u in self.userList) {
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
			    for(var u in self.userList) {
				if (u in data['data'] && data['data'][u]['fullName']) {
				    self.userList[u]['name'] = data['data'][u]['fullName'];
				} else {
				    self.userList[u]['name'] = "Full name not set or found.";
				}
			    }
			    self.renderTable(false);
			},
			error: function(jqXHR, textStatus, errorThrown) {
			    //do nothing
			}
		    })
	    }
	},
	
        getData: function() {
            return {title:"People using this data object.",id:this.options.objNameOrId, workspace:this.options.wsNameOrId};
        },
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )