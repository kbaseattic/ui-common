(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseGenomeWideTaxonomy", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            genomeID: null,
            workspaceID: null,
            loadingImage: "assets/img/ajax-loader.gif",
            kbCache: null,
            genomeInfo: null
        },

        init: function(options) {
            this._super(options);
            this.render();
            return this;
        },

        render: function() {
            var self = this;
            var row = $('<div class="row">');
            self.$elem.append(row);
            var taxonomyinfo = $('<div class="col-md-5">');
            row.append(taxonomyinfo);
            var tree = $('<div class="col-md-7">');
            row.append(tree);
            taxonomyinfo.KBaseGenomeLineage({genomeID: self.options.genomeID, 
            	workspaceID: self.options.workspaceID, kbCache: self.options.kbCache,
                loadingImage: self.options.loadingImage, genomeInfo: self.options.genomeInfo});
            this.prepareTree({ws: self.options.workspaceID, id: self.options.genomeID}, tree);
        },

        prepareTree: function(scope, $div) {
        	var objectIdentity = { ref:scope.ws+"/"+scope.id };
            kb.ws.list_referencing_objects([objectIdentity], function(data) {
            	var treeName = null;
            	for (var i in data[0]) {
            		var objInfo = data[0][i]
            		var wsName = objInfo[7];
                    var objName = objInfo[1];
                    var type = objInfo[2].split('-')[0];
                	//console.log("Links: " + wsName + "(" + scope.ws + ")" + "/" + objName + ", " + type);
                    if (wsName === scope.ws && type === "KBaseTrees.Tree") {
                    	treeName = objName;
                    	break;
                    }
            	}
            	if (treeName) {
                    $div.kbaseTree({treeID: treeName, workspaceID: scope.ws, genomeInfo: self.options.genomeInfo});           		
            	} else {
                    
                    var createTreeNar = function() {
                        $div.empty();
                        $div.append("<b> creating your narrative, please hold on...<br>");
                                        
                        $.getJSON( "assets/data/speciesTreeNarrativeTemplate.json", function( data ) {
                          
                          var narData = data;
                          // genome name
                          narData["worksheets"][0]["cells"][0]["metadata"]["kb-cell"]["widget_state"][0]['state']['param0'] = scope.id;
                          // number
                          narData["worksheets"][0]["cells"][0]["metadata"]["kb-cell"]["widget_state"][0]['state']['param1'] = "20";
                          // tree name
                          narData["worksheets"][0]["cells"][0]["metadata"]["kb-cell"]["widget_state"][0]['state']['param2'] = scope.id+".tree";
                          narData["metadata"]["data_dependencies"] = [
                            "KBaseGenomes.Genome "+scope.id
                          ];
                          var metadata = {};
                          for (var key in narData["metadata"]) {
                            metadata[key] = narData["metadata"][key];
                          }
                          if (metadata["data_dependencies"]) {
                            metadata["data_dependencies"] = JSON.stringify(metadata["data_dependencies"]);
                          }
                          var objSaveData = {
                            type:"KBaseNarrative.Narrative",
                            data:narData,
                            name:scope.id+".tree.narrative",
                            meta:metadata,
                            provenance:[]
                          };
                          var saveParams = {
                            objects:[objSaveData]
                          };
                          if (/^\d+$/.exec(scope.ws))
                            saveParams['id'] = scope.ws;
                          else
                            saveParams['workspace'] = scope.ws;
                          
                          kb.ws.save_objects(saveParams,
                                    function(result) {
                                        $div.empty();
                                        $div.append("<b> Successfully created a new Narrative named "+result[0][1]+"!<br>");
                                        window.location.href="/narrative/ws."+result[0][6]+".obj."+result[0][0];
                                    },
                                    function(error) {
                                        $div.empty();
                                        $div.append("<b>Unable to create Narrative.</b>  You probably do not have write permissions to this workspace.</b><br><br>");
                                        
                                        $div.append("You should copy this Genome to a workspace that you have access to, and build a species tree there.<br><br>");
                                        $div.append("<i>Error was:</i><br>"+error.error.message+"<br><br>");
                                    });
                          
                        });
                    }
                    
                    var $buildNarPanel = $("<div>").append($("<button>")
                           .addClass("btn btn-primary")
                           .append("Launch Species Tree Building Narrative")
                           .attr("type", "button")
                           .on("click", 
                               function(event) {
                                   createTreeNar();
                               })
                           );
                    
                    $div
                        .append('<b>There are no species trees created for this genome, but you can use the Narrative to build a new species tree of closely related genomes.</b>');
                        
                    $div.append("<br><br>");
                    $div.append($buildNarPanel);
                    $div.append("<br><br>");
            	}
            },
            function(error) {
        		var err = '<b>Sorry!</b>  Error retreiveing species trees info';
        		if (typeof error === "string") {
                    err += ": " + error;
        		} else if (error.error && error.error.message) {
                    err += ": " + error.error.message;
        		}
                $div.append(err);
            });
        },
        
        getData: function() {
            return {
                type: "Genome Taxonomy",
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: "Taxonomy"
            };
        }

    });
})( jQuery );