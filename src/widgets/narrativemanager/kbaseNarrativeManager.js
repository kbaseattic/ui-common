/**
 * Widget to that routes to the narrative interface, or creates new narratives for you
 *
 * @author Michael Sneddon <mwsneddon@lbl.gov>
 * @public
 */
(function( $, undefined ) {

    $.KBWidget({
        name: "kbaseNarrativeManager", 
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",


        /*
          params should have the following fields:

          action: start | new
         */
        options: {
            loadingImage: "assets/img/ajax-loader.gif",
            nms_url: "https://kbase.us/services/narrative_method_store/rpc",
            ws_url: "https://kbase.us/services/ws",
//            ws_url: "https://dev03.berkeley.kbase.us/services/ws",
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
            if (!this._attributes.auth) {
                window.location.replace("#/login/");
            }
            if (!this._attributes.auth.token) {
                window.location.replace("#/login/");
            }
            if (!this._attributes.auth.user_id) {
                window.location.replace("#/login/");
            }

            this.$mainPanel = $('<div>').css({'height': '300px'})
                    .append('<img src=' + this.options.loadingImage +
                            '> loading...');
            this.$elem.append(this.$mainPanel);

            this.manager = new NarrativeManager({ws_url:this.options.ws_url,
                nms_url:this.options.nms_url},this._attributes.auth);

            this.determineActionAndDoIt();

            return this;
        },

        determineActionAndDoIt: function() {
            var self = this;
            if (self.options.params) {
                // START - load up last narrative, or start the user's first narrative
                if (self.options.params.action === 'start') {
                    self.manager.detectStartSettings(self.options.params,
                            function(result) {
                                console.log(result);
                                if (result.last_narrative) {
                                    // we have a last_narrative, so go there
                                    //console.log('should redirect...');
                                    self.$mainPanel.html(
                                            'redirecting to <a href="/narrative/ws.' +
                                            result.last_narrative.ws_info[0] +
                                            '.obj.' +
                                            result.last_narrative.nar_info[0] +
                                            '">/narrative/ws.' +
                                            result.last_narrative.ws_info[0] +
                                            '.obj.' +
                                            result.last_narrative.nar_info[0] +
                                            '</a>');
                                    window.location.replace("/narrative/ws." +
                                            result.last_narrative.ws_info[0] +
                                            ".obj." +
                                            result.last_narrative.nar_info[0]);
                                } else {
                                    //we need to construct a new narrative- we have a first timer
                                    self.manager.createTempNarrative(
                                            { cells:[],parameters:[],importData : [] },
                                            function(info) {
                                                var newWsId = info.nar_info[6];
                                                var newNarId = info.nar_info[0];
                                                self.$mainPanel.html(
                                                        'redirecting to <a href="/narrative/ws.' +
                                                        newWsId + '.obj.' +
                                                        newNarId +
                                                        '">/narrative/ws.' +
                                                        newWsId + '.obj.' +
                                                        newNarId + '</a>');
                                                window.location.replace(
                                                        "/narrative/ws." +
                                                        newWsId + ".obj." +
                                                        newNarId);
                                            },
                                            function(error) {
                                                console.error(error);
                                                $mainPanel.html(
                                                        'Unexpected error in loading KBase.');
                                            }
                                    );
                                }
                        },
                        function(error) {
                            console.error(error);
                        });
                } else if (self.options.params.action === 'new') {

                    var importData = null;
                    if (self.options.params.copydata) {
                        importData = self.options.params.copydata.split(';');
                    }

                    var cells=[];
                    if (self.options.params.app) {
                        cells = [ {app:self.options.params.app} ];
                    }
                    self.manager.createTempNarrative(
                            { cells:cells,parameters:[],importData : importData },
                            function(info) {
                                var newWsId = info.nar_info[6];
                                var newNarId = info.nar_info[0];
                                self.$mainPanel.html(
                                        'redirecting to <a href="/narrative/ws.' +
                                        newWsId + '.obj.' + newNarId +
                                        '">/narrative/ws.' + newWsId + '.obj.' +
                                        newNarId + '</a>');
                                window.location.replace(
                                        "/narrative/ws." + newWsId + ".obj." +
                                        newNarId);
                            },
                            function(error) {
                                console.error(error);
                                $mainPanel.html(
                                        'Unexpected error in loading KBase.');
                            }
                    );
                } else {
                    self.$mainPanel.html('action "' +
                            self.options.params.action +
                            '" not supported; only "start" or "new" accepted.');
                }

                // else do something if action isn't correct!!

            } // else do something if params weren't defined!!
        }
    });

})( jQuery );
