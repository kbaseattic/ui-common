(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseJgiDataImportView",
        parent: "kbaseAuthenticatedWidget",
	
        options: {
            ws: null,
            obj: null,
            loadingImage: "assets/img/ajax-loader.gif",
            ws_url: "https://kbase.us/services/ws"
        },

	ws: null, // the ws client
	
	$mainPanel: null,
	$errorPanel: null,

        init: function(options) {
            this._super(options);
	    
	    this.$errorPanel = $('<div>').addClass('alert alert-danger').hide();
	    this.$elem.append(this.$errorPanel);

            this.$mainPanel = $("<div>");
	    this.$elem.append(this.$mainPanel);
	    
	    // check if we are already logged in
	    if (!this._attributes.auth.token) {
		this.notLoggedIn();
	    } else {
		this.ws = new Workspace(this.options.ws_url, this._attributes.auth);
		this.getDataAndRender();
	    }
	    
            return this;
        },
	
	loggedInCallback: function(event, auth) {
            this.ws = new Workspace(this.options.ws_url, auth);
            this.getDataAndRender();
            return this;
        },
        loggedOutCallback: function(event, auth) {
            this.ws = null;
            this.notLoggedIn();
            return this;
        },
        
        refresh: function() {
            this.getDataAndRender();
        },
	
	objData: null,
	
	getDataAndRender: function() {
	    var self = this;
	    
	    self.ws.get_object_info(
		[{ref:self.options.ws+"/"+self.options.obj}],1,
		function(objInfoList) {
		    if (objInfoList[0]) {
			self.objData = {info:objInfoList[0]};
			
			// TODO: some logic to detect the type, check what apps should show, etc.
			
			self.render();
		    } else {
			self.showError({error:{message:'Could not fetch the data information for some reason.'}});
		    }
		},
		function(error) {
		    self.showError(error);
		}
	    );
	},
	
	
        render: function() {
            var self = this;
	    if (self.objData) {
		// do things
		self.$mainPanel.empty();
		
		// TODO: actually format the data properly
		
		self.$mainPanel.append(JSON.stringify(self.objData.info));
            }
        },

        
	notLoggedIn: function() {
	    this.$mainPanel.empty();
	    this.$mainPanel.append("You must be logged in to view this data.");
	},
	
	showError: function(error) {
	    this.$errorPanel.empty();
	    this.$errorPanel.append('<strong>Error when retrieving imported JGI data.</strong><br><br>');
	    this.$errorPanel.append(error.error.message);
	    this.$errorPanel.append('<br>');
	    this.$errorPanel.show();
	}

    });
})( jQuery );