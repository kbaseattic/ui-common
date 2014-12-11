/**
 * Widget to that routes to the narrative interface, or creates new naarratives for you
 *
 * @author Michael Sneddon <mwsneddon@lbl.gov>
 * @public
 */
(function( $, undefined ) {

    $.KBWidget({
        name: "kbaseNarrativeManager", 
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
	
        options: {
	    loadingImage: "assets/img/ajax-loader.gif",
            ws_url: "https://kbase.us/services/ws",
            nms_url: "https://kbase.us/services/narrative_method_store/rpc",
            params: null
        },
        
        manager:null,
        
        ws_name: null,
        nar_name: null,
        
        $mainPanel: null,
        $newNarrativeLink: null, // when a new narrative is created, gives a place to link to it
        
        init: function(options) {
            this._super(options);
	    
	    // must be logged in!
	    if (!this._attributes.auth) { window.location.replace("#/login/"); }
	    if (!this._attributes.auth.token) { window.location.replace("#/login/"); }
	    if (!this._attributes.auth.user_id) { window.location.replace("#/login/"); }
	    
            this.$mainPanel = $('<div>').css({'height':'300px'}).append('<img src='+this.options.loadingImage+'> loading...');
            this.$elem.append(this.$mainPanel);
	    
            this.manager = new NarrativeManager({ws_url:this.options.ws_url, nms_url:this.options.nms_url},this._attributes.auth);
	    
	    this.determineActionAndDoIt();
	    
            return this;
        },
        
	determineActionAndDoIt: function() {
	    var self = this;
	    if (self.options.params) {
		// START - load up last narrative, or start the user's first narrative
		if (self.options.params.action === 'start') {
		    this.manager.detectStartSettings(self.options.params,
			function(result) {
			    console.log(result);
			    if (result.last_narrative) {
				// we have a last_narrative, so go there
				//console.log('should redirect...');
				window.location.replace("/narrative/ws."+result.last_narrative.ws_info[0]+".obj."+result.last_narrative.nar_info[0]);
			    } else {
				// we need to construct a new narrative- we have a first timer
				self.manager.createTempNarrative(
				    { cells:[],parameters:[],importData : [] },
				    function(info) {
					var newWsId = info.nar_info[6];
					var newNarId = info.nar_info[0];
					window.location.replace("/narrative/ws."+newWsId+".obj."+newNarId);
				    },
				    function(error) {
					console.error(error);
					$mainPanel.html('Unexpected error in loading KBase.');
				    }
				);
			    }
			},
			function(error) {
			    console.error(error);
			});
		}
		
		// else do something if action isn't correct!!
		
	    } // else do something if params weren't defined!!
	}
    });

})( jQuery );
