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
			objectId: null
		},
		
		workspaceURL: "https://kbase.us/services/workspace",

		//cdmiURL: "https://kbase.us/services/cdmi_api",

		/**
		 * Initialize the widget.
		 */
		init: function(options) {
			this._super(options);
			
			console.log("here!");
			if (this.options.objectID === null) {
				this.renderError({ error: "No object id: " + 
                                              this.options.workspaceID + "/" + 
                                              this.options.objectId });
				return this;
			}
			
			return this.renderWorkspace();
		},
			
		/**
		 *Render a table with workspace object meta data.
		 */		
	renderWorkspace: function() {
            this.$infoPanel.hide();
            this.showMessage("<img src='" + this.options.loadingImage + "'>");

	    var fullobjectid = getObjectIdentity(this.options.workspaceID, this.options.objectId);
	    this.workspaceClient = new Workspace(this.newWorkspaceServiceUrl, {'token': this.options.auth, 'user_id': this.options.userId});
	    var wsobject = this.workspaceClient.get_objects([{workspace: this.options.workspaceID, name: this.options.objectId}]);
	    
	    
            $.when(wsobject).fail($.proxy(function(error) {
                this.renderError(error);
                console.log(error);
            }, this));
            $.when(wsobject).done($.proxy(function(wsobject) {
                var objectmeta = null;
                if (wsobject) {
                
                        this.$infoTable.empty();
                        this.$infoTable.append(this.makeRow("Name", "test"));
			/*
			this.$infoTable.append(this.makeRow("Name", wsobject[1]));
			this.$infoTable.append(this.makeRow("Id", wsobject[2]));
                        this.$infoTable.append(this.makeRow("Owner", wsobject[3]));
			this.$infoTable.append(this.makeRow("Version", wsobject[4]));
			*/
                    
                }
                else {
                    this.renderError({ error: "No object id: " + 
                                              this.options.workspaceID + "/" + 
                                              this.options.objectId });
                }

                this.hideMessage();
                this.$infoPanel.show();
            }, this));
        },

		clientError: function(error) {

		},
		
		/**
		 *Returns the full workspace identified, even with version.
		 */
		getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId +"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
	
	})
})( jQuery );
