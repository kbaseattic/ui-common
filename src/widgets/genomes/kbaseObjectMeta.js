/**
 * Shows info for a workspace object.
 *
 */
(function( $, undefined ) {
	$.KBWidget({
		name: "KBaseObjectMeta",
		parent: "kbaseWidget",
		version: "1.0.0",

		options: {
			objNameOrId: null,
			wsNameOrId: null,
			loadingImage: "assets/img/loading.gif",
			kbCache:{},
			objVer: null,
			
		},
		
		objName:"",
		wsName:"",
		
		workspaceURL: "https://kbase.us/services/workspace",

		//cdmiURL: "https://kbase.us/services/cdmi_api",

		/**
		 * Initialize the widget.
		 */
		init: function(options) {
			this._super(options);
			var self = this;
			
			
			console.log(this.options.objNameOrId+"   "+this.options.wsNameOrId);
			
			/*
			console.log("here!");
			if (this.options.objNameOrId === null) {
				this.renderError({ error: "No object id: " + 
                                              this.options.objNameOrId + "/" + 
                                              this.options.wsNameOrId });
				return this;
			}
			
			if (options.wsUrl) {
			self.wsUrl = options.wsUrl;
			}
			*/
			
			var kbws;
			
			if (self.options.kbCache.ws_url) {
			    self.wsUrl = self.options.kbCache.ws_url;
			}
			if (self.options.kbCache.token) {
			    kbws = new Workspace(self.wsUrl, {token: self.options.kbCache.token});
			} else {
			    kbws = new Workspace(self.wsUrl);
			}
			
			self.objName = options.objNameOrId;
			self.wsName = options.wsNameOrId;
			
			self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>Finding metadata for this object...</center></p></div>');
			self.$elem.append('<div id="mainview">')
            
	    
			
			 this.$infoPanel = $("<div>");
			 this.$infoTable = $("<table>")
                              .addClass("table table-striped table-bordered");
			 this.$infoPanel.append(this.$infoTable)
                           .append(this.$buttonPanel);

			this.$elem.append(this.$infoPanel);
			
			  var objectIdentity = self.getObjectIdentity(options.wsNameOrId, options.objNameOrId, options.objVer);
			 kbws.get_objects([objectIdentity], function(data) {
				
		console.log(data[0].length);
		console.log(data.length);
		if (data[0].length == 0) {
                        self.$elem.append("<br><b>There no workspaces or objects with this id.</b>");
                    } else {
                        var refList = {};
			
                        for(var i = 0; i < data[0].length; i++) {
                            var objInfo = data[0][i];
                            //0:obj_id objid, 1:obj_name name, 2:type_string type,3:timestamp save_date, 4:int version, 5:username saved_by,
                            //6:ws_id wsid, 7:ws_name workspace, 8:string chsum, 9:int size, 10:usermeta meta>
                            //object_info;
                            if (!(objInfo[6]+"/"+objInfo[1] in refList)) {
                                refList[objInfo[6]+"/"+objInfo[1]] = objInfo;
                                
                            } else {
                                if (refList[objInfo[6]+"/"+objInfo[1]][4] < objInfo[4]) {
                                    refList[objInfo[6]+"/"+objInfo[1]] = objInfo;
                                    
                            }
                        }
                        
                        // load the data into a data object
                        var refTableData = [];
                        for(var ref in refList) {
                            var objInfo = refList[ref];
                            var savedate = new Date(objInfo[3]);
                                    refTableData.push({
                                            na:objInfo[1]+ " ("+objInfo[6]+"/"+objInfo[0]+"/"+objInfo[4]+")",
                                            ty:objInfo[2],
                                            de:"saved by "+objInfo[5]+" on "+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()
                                        })
                                }
                            //self.$elem.append("<b>"+objInfo[1]+"</b> <i>"+objInfo[2]+"</i> ("+objInfo[6]+"/"+objInfo[0]+"/"+objInfo[4]+", saved by "
                            //            +objInfo[5]+" on "+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()+")<br>")
                        }
                        
                        self.$elem.find('#loading-mssg').remove();
                        
                        var $maindiv = self.$elem.find('#mainview');
                        $maindiv.append('<table cellpadding="0" cellspacing="0" border="0" id="ref-table" \
                            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>');

            		var tblSettings = {
            				"sPaginationType": "full_numbers",
            				"iDisplayLength": 10,
                                        "sDom": 't<flip>',
            				"aoColumns": [
            				              {sTitle: "Object Name (reference)", mData: "na", sWidth:"30%"},
            				              {sTitle: "Type", mData: "ty"},
            				              {sTitle: "Details", mData: "de"}
            				              ],
            				              "aaData": refTableData            				              
            		};
            		var refTable = self.$elem.find('#ref-table').dataTable(tblSettings);
                    }
		    
	/*
			 $.when(wsobject).fail($.proxy(function(error) {
                this.renderError(error);
                console.log(error);
            }, this));
			 
            $.when(wsobject).done($.proxy(function(wsobject) {
                if (wsobject) {
                
                        this.$infoTable.empty();
			
			//0:obj_id objid, 1:obj_name name, 2:type_string type,3:timestamp save_date, 4:int version, 5:username saved_by,
                            //6:ws_id wsid, 7:ws_name workspace, 8:string chsum, 9:int size, 10:usermeta meta>
			
			this.$infoTable.append(this.makeRow("Name", wsobject[2]));
			this.$infoTable.append(this.makeRow("Id", wsobject[1]));
			this.$infoTable.append(this.makeRow("Last save", wsobject[3]));
			this.$infoTable.append(this.makeRow("Version", wsobject[4]));
                        this.$infoTable.append(this.makeRow("Owner", wsobject[5]));
			this.$infoTable.append(this.makeRow("Workspace Id", wsobject[6]));
			this.$infoTable.append(this.makeRow("Workspace name", wsobject[7]));
			this.$infoTable.append(this.makeRow("Checksum", wsobject[8]));
			this.$infoTable.append(this.makeRow("Size", wsobject[9]));
			this.$infoTable.append(this.makeRow("User metadata", wsobject[10]));
			
                    
                }
                else {
                    this.renderError({ error: "No object id: " + 
                                              this.options.wsNameOrId + "/" + 
                                              this.options.objNameOrId });
                }

                this.hideMessage();
                this.$infoPanel.show();
            }, this));
	    */
        	
			
				
        } , function(err) {
                    self.$elem.find('#loading-mssg').remove();
                    self.$elem.append("<br><b>No workspace or object found with these ids.</b>");
                    console.error("No workspace or object found with these ids.");
                    console.error(err);
                });
	return this;
        },
		
		
		  getData: function() {
            return {title:"Metadata for :",id:this.objName, workspace:this.wsName};
        },
        
		/**
		 *Returns the full workspace identified, even with version.
		 */
		getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
			if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId +"/"+objVer}; }
			return {ref:wsNameOrId+"/"+objNameOrId } ;
		},
	
	});
})( jQuery );
