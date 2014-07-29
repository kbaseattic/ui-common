(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseNarrativesUsingData",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        //wsUrl: "http://dev04.berkeley.kbase.us:7058",
        wsUrl:"https://kbase.us/services/ws",
        
        options: {
            wsNameOrId: null,
            objNameOrId: null,
            objVer: null,
            kbCache:{},
            width:800
        },

        
        wsName:"",
	objName:"",
	kbws:null, //this is the ws client
	
        narList:[],
        
        init: function(options) {
            this._super(options);
            var self = this;
	    self.narList=[];
	    
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
			console.error("Error in finding referencing narratives!");
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
		self.wsName = options.wsNameOrId;
		self.getTheRefsAndRender();
            }
	    
	    return this;
	},
	
	getTheRefsAndRender : function () {
	    var self = this;
	    var objectIdentity = self.getObjectIdentity(self.options.wsNameOrId, self.options.objNameOrId, self.options.objVer);
	
	    // We need to check if there are narrative references
	    var narrrativeTypeName = "KBaseNarrative.Narrative"; var dependentDataPaths =["/metadata/data_dependencies","/metadata/name"];
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
		       narList.push({ref:data[i][6]+"/"+data[i][0]+"/"+data[i][4],included:dependentDataPaths});
		   }
		   // then we get subdata containing the data dependencies
		   if (narList.length>0) {
		       self.kbws.get_object_subset(narList, function(data) {
			        for(var i = 0; i < data.length; i++) {
				    var depList = data[i]['data']['metadata']['data_dependencies'];
				    var niceName = data[i]['data']['metadata']['name'];
				    for(var k=0; k<depList.length; k++) {
				       var name = depList[k].trim().split(/\s+/)[1];
				        if (name) {
					    if (name == self.objName) {
						var objInfo = data[i]['info'];
						var savedate = new Date(objInfo[3]);
						var narName = '<a target="_blank" href="/narrative/ws.'+objInfo[6]+'.obj.'+objInfo[0]+'">'+niceName + "</a> ("+objInfo[6]+"/"+objInfo[0]+"/"+objInfo[4]+")";
					        self.narList.push({
						    name:narName,
						    details:"last edited by "+objInfo[5]+" on "+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()
					        });
					        continue; // we found the narrative, no need to do anything else...
					    }
				        }
				    }
			        }
				if (self.narList.length > 0) {
				    // finally, render the table
				    self.renderTable();
				} else {
				    self.$elem.find('#loading-mssg').remove();
				    self.$elem.append("<br><b>There are no narratives that are using this data object.</b>");
				}
			       
			    },
			    function(err) {
				self.$elem.find('#loading-mssg').remove();
				self.$elem.append("<br><b>Error: Could not access data for this object.</b><br>");
				self.$elem.append("<i>Error was:</i><br>"+err['error']['message']+"<br>");
				console.error("Error in finding narratives!");
				console.error(err);
			    });
		   } else {
		       // no nars here, render now!
			self.$elem.find('#loading-mssg').remove();
			self.$elem.append("<br><b>There are no narratives that are using this data object.</b>");
		   }
	        } else {
		    self.$elem.find('#loading-mssg').remove();
		    self.$elem.append("<br><b>There are no narratives that are using this data object.</b>");
	        }
	    },
	    function(err) {
		self.$elem.find('#loading-mssg').remove();
		self.$elem.append("<br><b>Error: Could not access data for this object.</b><br>");
		self.$elem.append("<i>Error was:</i><br>"+err['error']['message']+"<br>");
		console.error("Error in finding narratives!");
		console.error(err);
	    });
            
            return this;
        },
        
	
	renderTable : function() {
	    var self = this;
	    
            var $maindiv = self.$elem.find('#mainview');
            $maindiv.append('<table cellpadding="0" cellspacing="0" border="0" id="ref-table" \
                            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>');

            var sDom = 't<fip>'
            if (self.narList.length<=10) { sDom = 'ti'; }
            var tblSettings = {
            			//"sPaginationType": "full_numbers",
            			"iDisplayLength": 10,
                                "sDom": sDom,
            			"aoColumns": [
            				{sTitle: "Narrative Name (reference)", mData: "name", sWidth:"30%"},
            				{sTitle: "Details", mData: "details"},
            			],
            			"aaData": self.narList
			    };
            var refTable = self.$elem.find('#ref-table').dataTable(tblSettings);
            self.$elem.find('#loading-mssg').remove();
	},
	
	
	
        getData: function() {
            return {title:"Narratives using this data object.",id:this.options.objNameOrId, workspace:this.options.wsNameOrId};
        },
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )