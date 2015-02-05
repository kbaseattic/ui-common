/**
 * Shows taxonomic lineage.
 *
 */
(function ($, undefined) {
    $.KBWidget({
        name: "KBaseGenomeLineage",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",

        options: {
            genomeID: null,
            workspaceID: null,
            objVer: null,
            loadingImage: "../../widgets/images/ajax-loader.gif",
            kbCache: null,
            width:600,
            //isInCard: false,
            genomeInfo: null
        },

        token: null,
        cdmiURL: "https://kbase.us/services/cdmi_api",
        treesURL: "https://kbase.us/services/trees",
        $infoTable: null,
        pref: null,

        init: function (options) {

            this._super(options);

            if (this.options.genomeID === null) {
                //throw an error
                return;
            }
            
            this.pref = this.uuid();

            this.$messagePane = $("<div/>").hide();
            this.$elem.append(this.$messagePane);

            this.render();
            if (this.options.workspaceID === null) {
                this.renderCentralStore();
            } else {
                this.renderWorkspace();
            }

            return this;
        },


        render: function () {
            var self = this;

            this.$infoPanel = $("<div>");


            this.$infoTable = $("<table>").addClass("table table-striped table-bordered");
            this.$infoPanel.append($("<div>").append(this.$infoTable));

            var self = this;

            this.$infoPanel.hide();
            this.$elem.append(this.$infoPanel);
        },

        renderCentralStore: function () {
            var self = this;
            this.cdmiClient = new CDMI_API(this.cdmiURL);
            this.entityClient = new CDMI_EntityAPI(this.cdmiURL);

            this.$infoPanel.hide();
            this.showMessage("<center><img src='" + this.options.loadingImage + "'> loading ...</center>");

            // Fields to show:
            // ID
            // Workspace (if from a workspace)
            // Owner (KBase Central Store vs. username)
            // Scientific Name
            // Taxonomy
            // Taxonomy
            this.entityClient.get_entity_Genome(
            		[this.options.genomeID], 
            		['id', 'scientific_name', 'domain', 'taxonomy'],
            		$.proxy(
            				function (genome) {
            					genome = genome[0].data;
            					self.showData(genome);
            				}, 
            				this
            		),
            		this.renderError
            );
        },

        renderWorkspace: function () {
            var self = this;
            //console.log( this.options.loadingImage);
            this.showMessage("<center><img src='" + this.options.loadingImage + "'> loading ...</center>");
            this.$infoPanel.hide();
            //console.log("rendering");
            //console.log(this.options.kbCache);
            var isInt = function (n) {
                    return typeof n === 'number' && n % 1 == 0;
            };
            //console.log("renderWorkspace " + this.options.workspaceID + " " + this.options.genomeID);
            //console.log("obj " + obj);

            if (self.options.genomeInfo) {
                self.showData(self.options.genomeInfo.data);
            } else {
                var obj = this.getObjectIdentity(this.options.workspaceID, this.options.genomeID);
                obj['included'] = ["/taxonomy","/scientific_name"];
                self.options.kbCache.ws.get_object_subset( [ obj ], function(data) {
                    if (data[0]) {
                        var genome = data[0]['data'];
                        self.showData(genome);
                    }
                },
                function(error) {
                    var obj = self.buildObjectIdentity(self.options.workspaceID, self.options.genomeID);
                    obj['included'] = ["/scientific_name"];
                    self.options.kbCache.ws.get_object_subset( [ obj ], function(data) {
                        if (data[0]) {
                            var genome = data[0]['data'];
                            self.showData(genome);
                        }
                    },
                    function(error) {self.renderError(error);});
                });
            }
            // old style that waits on entire genome
            /*var obj = this.getObjectIdentity(this.options.workspaceID, this.options.genomeID);
            var prom = this.options.kbCache.req('ws', 'get_objects', [obj]);
            $.when(prom).done($.proxy(function (genome) {
                genome = genome[0].data;
                self.showData(genome);
            }, this));
            $.when(prom).fail($.proxy(function (error) {
                this.renderError(error);
            }, this));*/
        },

        showData: function(genome) {
            var self = this;
            //console.log(genome);
            
            this.$infoTable.empty()
            	//.append(this.addInfoRow("ID", genome.id))
            	.append(this.addInfoRow("Name", genome.scientific_name))
            	.append('<tr><th>Taxonomic Lineage</th><td id="tax_td_'+this.pref+'"/></tr>');

            self.hideMessage();
            this.$infoPanel.show();
            this.showLinage(genome.taxonomy);
        },
        
        showLinage: function(taxonomy) {
        	var self = this;
            //console.log("Taxonomy: " + taxonomy);
            var finaltax = "";
            var needGuess = this.options.workspaceID != null;
            if (taxonomy) {
            	var splittax = taxonomy.replace("/ /g", "");
            	splittax = splittax.split(";");
            	if (splittax.length >= 2)
            		needGuess = false;
            	finaltax += "<pre>";
            	for(a=0;a<splittax.length;a++) {
            		var pad ="";
            		for(b=0;b<a;b++){
            			pad+=" ";
            		}
            		//http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=drosophila+miranda
            		var searchtax = splittax[a].replace("/ /g", "+");
            		//console.log(searchtax);
            		var str =pad+'<a href="http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name='+searchtax+'" target="_blank">'+splittax[a]+'</a><br>';
            		//console.log(str);
            		finaltax+=str; 
            	}
            	finaltax += "</pre>";
            } else {
            	finaltax += "No taxonomic data for this genome.";
            }
            if (needGuess) {
            	finaltax += '<button id="guess_btn_'+this.pref+'">Search by similarity</button>';
            }
			var tdElem = $('#tax_td_'+self.pref);
			tdElem.html(finaltax);

            if (needGuess) {
            	$('#guess_btn_'+this.pref).click(function() {
            		self.guessLinage();
            	});
            }
        },
        
        guessLinage: function() {
        	var self = this;
			var tdElem = $('#tax_td_'+self.pref);
			tdElem.html("<img src='" + this.options.loadingImage + "'>");
        	var treesSrv = new KBaseTrees(this.treesURL, {token: this.authToken()});
    		//console.log("kbaseGenomeLineage: guess_taxonomy_path...");
    		var genomeRef = this.options.workspaceID + "/" + this.options.genomeID;
        	treesSrv.guess_taxonomy_path({query_genome: genomeRef}, function(data) {
        		//console.log(data);
        		self.showLinage(data);
        	},
        	function(data) {
				tdElem.html("Error accessing [trees] service: " + data.error.message);
    		});
        },
        
        getData: function () {
            return {
                title: "Taxonomic lineage for :",
                id: this.options.genomeID,
                workspace: this.options.workspaceID
            };
        },

        /**
         *Returns the full workspace identifier, optionally with the version.
         */
        getObjectIdentity: function (wsNameOrId, objNameOrId, objVer) {
            //console.log(wsNameOrId + " " + objNameOrId + " " + objVer);
            if (objVer) {
                return {
                    ref: wsNameOrId + "/" + objNameOrId + "/" + objVer
                };
            }
            return {
                ref: wsNameOrId + "/" + objNameOrId
            };
        },

        showMessage: function(message) {
	    
            var span = $("<span/>").append(message);

            this.$messagePane.empty()
                             .append(span)
                             .show();
        },

        hideMessage: function() {
            this.$messagePane.hide();
        },
        
        renderError: function (error) {
            var errString = "Sorry, an unknown error occurred";
            if (typeof error === "string") {
                errString = error;
            } else if (error.error && error.error.message) {
                errString = error.error.message;
            }


            var $errorDiv = $("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>" + errString);
            this.$elem.empty();
            this.$elem.append($errorDiv);
        },

        addInfoRow: function (a, b) {
            return "<tr><th>" + a + "</th><td>" + b + "</td></tr>";
        },

        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
                function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
        }
    });
})(jQuery);