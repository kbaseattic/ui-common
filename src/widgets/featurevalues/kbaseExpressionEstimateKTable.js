/**
 * Output widget to vizualize EstimateKResult object.
 * Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */

$.KBWidget({
		name: 'kbaseExpressionEstimateKTable',
		parent: 'kbaseAuthenticatedWidget',
		version: '1.0.0',
		options: {
			estimateKID: null,
			workspaceID: null,
			loadingImage: "static/kbase/images/ajax-loader.gif",
		},

		// Extracted data for vizualization
		estimateK: null,
		expMatrixRef: null,
		genomeRef: null,
		featureMapping: null,
		matrixRowIds: null,
		matrixColIds: null,
		genomeID: null,
		genomeName: null,
		features: null,
					
		init: function(options) {
			this._super(options);
			// Create a message pane
            this.$messagePane = $("<div/>").addClass("kbwidget-message-pane kbwidget-hide-message");
            this.$elem.append(this.$messagePane);		
			return this;
		},

		loggedInCallback: function(event, auth) {

			
			// error if not properly initialized
			if (this.options.estimateKID == null) {
				this.showMessage("[Error] Couldn't retrieve cluster number estimation");
				return this;
			}

			// Create a new workspace client
			this.ws = kb.ws;
		   
			// Let's go...
			this.loadAndrender();           
		   
			return this;
		},

		loggedOutCallback: function(event, auth) {
			this.ws = null;
			this.isLoggedIn = false;
			return this;
		},

		loadAndrender: function(){

			var self = this;
            var container = this.$elem;
            var pref = this.uuid();
            self.pref = pref;

			self.loading(true);

			var kbws = this.ws;
			var estimateKRef = self.buildObjectIdentity(this.options.workspaceID, this.options.estimateKID);

			kbws.get_objects([estimateKRef], function(data) {
			    self.estimateK = data[0].data;
			    console.log(self.estimateK);
			    self.loading(false);
			    container.empty();
	            var tableData = [];
	            for(var i = 0; i < self.estimateK.estimate_cluster_sizes.length; i++){
	                var item = self.estimateK.estimate_cluster_sizes[i];
	                tableData.push({
	                    number: item[0],
	                    quality: item[1]
	                });
	            }
			    var table = $('<table id="'+pref+'estimatek-table" \
			            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;">\
			            </table>'
			    ).appendTo(container).dataTable( {
			        "sDom": 'lftip',
			        "aaData": tableData,
			        "aoColumns": 
			            [{ sTitle: "Number of Clusters", mData:"number" },
			             { sTitle: "Silhouette Quality", mData:"quality" }]
			    } );
			}, function(error) {
                self.clientError(error);
			});
		},

		getData: function() {
			return {
				type: 'EstimateK',
				id: this.options.estimateKID,
				workspace: this.options.workspaceID,
				title: 'K-means Cluster Number Estimation'
			};
		},

		loading: function(isLoading) {
			if (isLoading)
				this.showMessage("<img src='" + this.options.loadingImage + "'/>");
			else
				this.hideMessage();                
		},

		showMessage: function(message) {
			var span = $("<span/>").append(message);

			this.$messagePane.append(span);
			this.$messagePane.show();
		},

		hideMessage: function() {
			this.$messagePane.hide();
			this.$messagePane.empty();
		},

		uuid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
				function(c) {
					var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
					return v.toString(16);
				});
		},

		buildObjectIdentity: function(workspaceID, objectID, objectVer, wsRef) {
			var obj = {};
			if (wsRef) {
				obj['ref'] = wsRef;
			} else {
				if (/^\d+$/.exec(workspaceID))
					obj['wsid'] = workspaceID;
				else
					obj['workspace'] = workspaceID;

				// same for the id
				if (/^\d+$/.exec(objectID))
					obj['objid'] = objectID;
				else
					obj['name'] = objectID;
				
				if (objectVer)
					obj['ver'] = objectVer;
			}
			return obj;
		},        

		clientError: function(error){
			this.loading(false);
			this.showMessage(error.error.error);
		}        

});