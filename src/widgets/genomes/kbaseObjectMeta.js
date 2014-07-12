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
			workspaceID: null,
			objectId: null,
			loadingImage: "assets/img/loading.gif",
			kbCache:{}
			
		},
		
		workspaceURL: "https://kbase.us/services/workspace",

		//cdmiURL: "https://kbase.us/services/cdmi_api",

		/**
		 * Initialize the widget.
		 */
		init: function(options) {
			this._super(options);
			var self = this;
			
			console.log("here!");
			if (this.options.objectID === null) {
				this.renderError({ error: "No object id: " + 
                                              this.options.workspaceID + "/" + 
                                              this.options.objectId });
				return this;
			}
			
			if (options.wsUrl) {
			self.wsUrl = options.wsUrl;
			}
			
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
			
			self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>finding all data that references this object...</center></p></div>');
			self.$elem.append('<div id="mainview">')
            
	    
			
			 this.$infoPanel = $("<div>");
			 this.$infoTable = $("<table>")
                              .addClass("table table-striped table-bordered");
			 this.$infoPanel.append(this.$infoTable)
                           .append(this.$buttonPanel);

			this.$elem.append(this.$infoPanel);
			
			  var objectIdentity = self.getObjectIdentity(options.wsNameOrId, options.objNameOrId, options.objVer);
			 kbws.list_referencing_objects([objectIdentity], function(data) {
				
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
        	
			
				
        } , function(err) {
                    self.$elem.find('#loading-mssg').remove();
                    self.$elem.append("<br><b>No workspace or object found with these ids.</b>");
                    console.error("No workspace or object found with these ids.");
                    console.error(err);
                });
	return this;
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
