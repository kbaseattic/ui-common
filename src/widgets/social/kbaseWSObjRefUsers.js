(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSObjRefUsers",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        //wsUrl: "http://dev04.berkeley.kbase.us:7058",
        wsUrl:"https://kbase.us/services/ws",
        
        options: {
            wsNameOrId: null,
            objNameOrId: null,
            objVer: null,
            kbCache:{},
            width:350
        },

        
        objVerifiedName:"",
        objVerifiedVer:"",
        wsVerifiedName:"",
	
        userList:{},
        loggedIn: false,
        
        init: function(options) {
            this._super(options);
            var self = this;

            if (options.wsUrl) {
                self.wsUrl = options.wsUrl;
            }
            var kbws;
            if (self.options.kbCache.ws_url) {
                self.wsUrl = self.options.kbCache.ws_url;
            }
            if (self.options.kbCache.token) {
                kbws = new Workspace(self.wsUrl, {token: self.options.kbCache.token});
		self.loggedIn = true;
            } else {
                kbws = new Workspace(self.wsUrl);
            }
            
            self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>finding all data that references this object...</center></p></div>');
            self.$elem.append('<div id="mainview">')
            //self.$elem.append(JSON.stringify(options)+"<br>");
            
	    // get object info first (this one is gonna be blocking on getting everything else...)
	    
	    var objectIdentity = self.getObjectIdentity(options.wsNameOrId, options.objNameOrId, options.objVer);
	    var getInfoJob = [
		kbws.get_object_info([objectIdentity],0,
		    function(data) {
			self.objVerifiedName = data[0][1];
			self.objVerifiedVer = data[0][4];
			self.wsVerifiedName  = data[0][7];
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
		// get the refs
		kbws.list_referencing_objects([objectIdentity], function(data) {
		    var foundAnything = false;
                    if (data[0].length > 0) {
			foundAnything = true;
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
		    }
			
		    // We also need to check if there are narrative references
		    var narrrativeTypeName = "KBaseNarrative.Narrative"; var dependentDataPath ="/metadata/data_dependencies";
		    var listObjParams = { includeMetadata:0, type:narrrativeTypeName};
		    if (/^\d+$/.exec(options.wsNameOrId))
		        listObjParams['ids'] = [ options.wsNameOrId ];
		    else
		        listObjParams['workspaces'] = [ options.wsNameOrId ];
		    kbws.list_objects( listObjParams, function(data) {
			if (data.length>0) {
			    foundAnything = true;
			    var narList = [];
			    for(var i = 0; i < data.length; i++) {
				//0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
				narList.push({ref:data[i][6]+"/"+data[i][0]+"/"+data[i][4],included:[dependentDataPath]});
			    }
			    // then we get subdata containing the data dependencies
			    if (narList.length>0) {
				kbws.get_object_subset(narList, function(data) {
					for(var i = 0; i < data.length; i++) {
					    var depList = data[i]['data']['metadata']['data_dependencies'];
					    for(var k=0; k<depList.length; k++) {
						var name = depList[k].trim().split(/\s+/)[1];
						if (name) {
						    if (name === self.objVerifiedName) {
							var narName = data[i]['info'][1] + " ("+data[i]['info'][6]+"/"+data[i]['info'][0]+"/"+data[i]['info'][4]+")";
							if (data[i]['info'][5] in self.userList) {
							    self.userList[data[i]['info'][5]]['narCount']++;
							    self.userList[data[i]['info'][5]]['nars'][narName]=1;
							} else {
							    self.userList[data[i]['info'][5]] = {refCount:0, name:"[Login to view name]", narCount:0, refs:[], nars:{narName:1}};
							}
						    }
						}
							
					    }
					}
					// finally, render the table
					self.renderTable();
					},
					function(err) {
					    // do nothing, this isn't critical to this widget, so we render anyway
					    self.renderTable();
					});
				    } else {
					// no nars here, render now!
					self.renderTable();
				    }
			} else {
			    if (!foundAnything) {
				self.$elem.append("<br><b>There are no other users that have referenced or used this object.</b>");
			    } else {
				self.renderTable();
			    }
			}
		    },
		    function(err) {
			// do nothing, this isn't critical to this widget, so we render anyway
			self.renderTable();
		    });
			
                }, function(err) {
                    self.$elem.find('#loading-mssg').remove();
                    self.$elem.append("<br><b>Error: Could not access data for this object.</b><br>");
                    self.$elem.append("<i>Error was:</i><br>"+err['error']['message']+"<br>");
                    console.error("Error in finding referencing objects! (note: v0.1.6 throws this error if no referencing objects were found)");
                    console.error(err);
                });
            
	    });
            return this;
        },
        
	
	renderTable : function() {
	    var self = this;
	    self.getNiceUserNames();
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
		var refToolTip = "Objects:\n";
		for(var r=0; r<self.userList[ud]['refs'].length; r++) {
		    if (r==limit) {
			refToolTip += "...";
			break;
		    }
		    refToolTip += self.userList[ud]['refs'][r]+"\n";
		    count++;
		}
		
		var mentionStr = ""
		if (self.userList[ud]['narCount']>0) {
		    mentionStr += '<span title="'+narToolTip+'">'+self.userList[ud]['narCount']+' in narratives</span>';
		}
		if (self.userList[ud]['refCount'] > 0) {
		    if (mentionStr.length>0) { mentionStr += ",<br>"}
		    mentionStr += '<span title="'+refToolTip+'">'+self.userList[ud]['refCount']+" in data objects</span>";
		}
		tblData.push({name:self.userList[ud]['name'],user_id:ud,mentions:mentionStr});
	    }
			
                        
            var $maindiv = self.$elem.find('#mainview');
            $maindiv.append('<table cellpadding="0" cellspacing="0" border="0" id="ref-table" \
                            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>');

            var tblSettings = {
            			"sPaginationType": "full_numbers",
            			"iDisplayLength": 10,
                                "sDom": 't<lip>',
            			"aoColumns": [
            				{sTitle: "Name", mData: "name", sWidth:"30%"},
            				{sTitle: "User Id", mData: "user_id"},
            				{sTitle: "Mentions", mData: "mentions"}
            			],
            			"aaData": tblData
			    };
            var refTable = self.$elem.find('#ref-table').dataTable(tblSettings);
            self.$elem.find('#loading-mssg').remove();
	},
	
	
	getNiceUserNames: function() {
	    var self = this;
	    // todo : use globus to populate user names, but we use a hack because of globus CORS headers
	    if (self.loggedIn) {
		
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