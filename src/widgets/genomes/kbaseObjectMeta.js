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
			//kbCache: null,
			//embedInCard: false,
			auth: null,
		},
		
		workspaceURL: "https://kbase.us/services/workspace",

		//cdmiURL: "https://kbase.us/services/cdmi_api",

		/**
		 * Initializes the widget.
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

			this.workspaceClient = new Workspace(this.newWorkspaceServiceUrl, {'token': this.options.auth, 'user_id': this.options.userId});
			
	this.workspaceClient.get_objects([{workspace: this.options.workspaceID, name: this.options.objectId}],
            function(data) {
                self.collection = data[0];
                var d = new Date(parseInt(self.collection.data.timestamp));
                var creationMonth = d.getMonth() + 1;

                self.contentDiv.append($("<h4 />").append("MEME Run Info"));

                self.contentDiv.append($("<div />").
                        append($("<table/>").addClass("invtable")
                                .append($("<tr/>")
                                        .append($("<td/>").append("Object name"))
                                        .append($("<td/>").addClass("invtable-boldcell").append(self.collection.data.id)))
                                .append($("<tr/>")
                                        .append($("<td/>").append("Created"))
                                        .append($("<td/>").addClass("invtable-cell").append(creationMonth + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds())))
                                .append($("<tr/>")
                                        .append($("<td/>").append("Number of motifs"))
                                        .append($("<td/>").addClass("invtable-boldcell").append(self.collection.data.motifs.length)))
                                ));

                self.contentDiv.append($("<h4 />").append("View motifs"));

                var $dropdown = $("<select />");
                for (var motif in self.collection.data.motifs) {
                    $dropdown.append("<option id='" + motif + "'>" + self.collection.data.motifs[motif].description + "</option>");
                }
                self.contentDiv.append($dropdown);
                self.contentDiv.append($("<button class='btn btn-default'>Show Motif</button>")
                        .on("click",
                                function(event) {
                                    $($(self.elem).find('div').selector + " > select option:selected").each(function() {
                                                              	console.log(event);
                                        self.trigger("showBambiMotif", {motif: self.collection.data.motifs[$(this).attr("id")], event: event});
                                    });
                                })
                        );

                self.contentDiv.append($("<div />").append("<br><button class='btn btn-default'>Show BAMBI run parameters</button>")
                        .on("click",
                                function(event) {
                                    self.trigger("showBambiRunParameters", {collection: self.collection, event: event});
                                })
                        );

                self.contentDiv.append($("<div />").append("<br><button class='btn btn-default'>Show BAMBI raw output</button>")
                        .on("click",
                                function(event) {
                                    self.trigger("showBambiRawOutput", {raw_output: self.collection.data.raw_output, event: event});
                                })
                        );
                self.loading(false);

            },
                    function(data) {
                        self.contentDiv.remove();
                        self.loading(false);
                        self.$elem.append('<p>[Error] ' + data.error.message + '</p>');
                        return;
                    }
            );
			return this.renderWorkspace();
		},
		
		/**
		 *Renders a table with workspace object meta data.
		 */		
	renderWorkspace: function() {
            this.$infoPanel.hide();
            this.showMessage("<img src='" + this.options.loadingImage + "'>");

            //var obj = this.buildObjectIdentity(this.options.workspaceID, this.options.objectId);
	    var fullobjectid = getObjectIdentity(this.options.workspaceID, this.options.objectId);
            var wsobject = this.options.kbCache.req('ws', 'get_objects', [obj]);
	    
	    
	    
            $.when(wsobject).fail($.proxy(function(error) {
                this.renderError(error);
                console.log(error);
            }, this));
            $.when(wsobject).done($.proxy(function(wsobject) {
                var objectmeta = null;
                if (wsobject) {
                
                        this.$infoTable.empty();
                        
			this.$infoTable.append(this.makeRow("Name", wsobject.info.name));
			this.$infoTable.append(this.makeRow("Id", id));
                        this.$infoTable.append(this.makeRow("Owner", owner));
			this.$infoTable.append(this.makeRow("Version", version));			
                    
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

		/**
		 * Returns a data object used for landing pages.
		 * @returns {Object} the data object used for building a landing page card.
		 * 
		 * @public
		 */
        getData: function() {
            return {
                type: "Feature",
                id: this.options.objectID,
                workspace: this.options.workspaceID,
                title: "Workspace object"
            };
        },

		clientError: function(error) {

		},
		
		getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId +"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
	
	})
})( jQuery );
