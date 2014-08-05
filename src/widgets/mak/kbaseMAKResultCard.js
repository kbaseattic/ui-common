(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseMAKResultCard", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            loadingImage: "../../widgets/images/ajax-loader.gif",
            title: "MAK Result Overview",
            isInCard: false,
            width: 600,
            height: 700
        },

//        workspaceURL: "https://kbase.us/services/workspace",
        newWorkspaceServiceUrl: "https://kbase.us/services/ws", 
		
		//"http://dev04.berkeley.kbase.us:7058", //"https://kbase.us/services/ws", //http://140.221.84.209:7058/",

        init: function(options) {
            this._super(options);
            if (this.options.id === null) {
                //throw an error
                return;
            }

            this.$messagePane = $("<div/>")
                                .addClass("kbwidget-message-pane")
                                .addClass("kbwidget-hide-message");
            this.$elem.append(this.$messagePane);

//            this.workspaceClient = new workspaceService(this.workspaceURL);
              this.workspaceClient = new Workspace(this.newWorkspaceServiceUrl, { 'token' : this.options.auth, 'user_id' : this.options.userId});

            return this.render();
        },

        render: function(options) {
            this.showMessage("<img src='" + this.options.loadingImage + "'/>");

            /**
             * Fields to show:
             * ID
             * Timestamp
             * Number of motifs
             */
            var self = this;

			//"MAKbiclusters"
			//"SOMR1_expr_refine_top_0.25_1.0_c_reconstructed.txt_MAKResult"
			// console.log(this.options.ws)
			// console.log(this.options.id)
			
            this.workspaceClient.get_objects([{workspace: this.options.ws, name: this.options.id}], 
				
				function(data){
					console.log(data)
					self.collection = data[0];
					self.$elem.append("<h3>MAK Run Info</h3>");
					var temp = document.URL.indexOf("/functional-site")
					var baseURL = document.URL.substring(0,temp)					
					temp = self.collection.data.parameters.genome_id.indexOf(".")
					var genome = self.collection.data.parameters.genome_id.substring(temp+1)
			        self.$elem.append($("<div />")
					.append($("<table/>").addClass("kbgo-table")
					    .append(self.collection.data.id!=-1 ? $("<tr/>").append("<td>ID</td><td>" + self.collection.data.id + "</td>") : '')
					    .append(self.collection.data.start_time!=-1 ? $("<tr/>").append("<td>Run started </td><td>" + self.collection.data.start_time + "</td>") : '')
					    .append(self.collection.data.finish_time!=-1 ? $("<tr/>").append("<td>Run finished </td><td>" + self.collection.data.finish_time + "</td>") : '')
                        .append(self.collection.data.sets[0].version!=-1 ? $("<tr/>").append("<td>MAK version</td><td>" + self.collection.data.sets[0].version + "</td>") : '')
                        .append(self.collection.data.sets[0].number!=-1 ? $("<tr/>").append("<td>Number of biclusters in set</td><td>" + self.collection.data.sets[0].number + "</td>") : '')
                        .append(self.collection.data.sets[0].min_genes!=-1 ? $("<tr/>").append("<td>Min genes for bicluster in set</td><td>" + self.collection.data.sets[0].min_genes + "</td>") : '')
                        .append(self.collection.data.sets[0].max_genes!=-1 ? $("<tr/>").append("<td>Max genes for bicluster in set</td><td>" + self.collection.data.sets[0].max_genes + "</td>") : '')
                        .append(self.collection.data.sets[0].min_conditions!=-1 ? $("<tr/>").append("<td>Min conditions for bicluster in set</td><td>" + self.collection.data.sets[0].min_conditions + "</td>") : '')
                        .append(self.collection.data.sets[0].max_conditions!=-1 ? $("<tr/>").append("<td>Max conditions for bicluster in set</td><td>" + self.collection.data.sets[0].max_conditions + "</td>") : '')
                        .append(self.collection.data.sets[0].taxon!=-1 ? $("<tr/>").append("<td>NCBI taxonomy id</td><td>" + self.collection.data.sets[0].taxon + "</td>") : '')
                        .append(self.collection.data.sets[0].bicluster_type!=-1 ? $("<tr/>").append("<td>Type of bicluster</td><td>" + self.collection.data.sets[0].bicluster_type + "</td>") : '')
						.append("<td>Genome</td><td>" + "<a href=" +baseURL+"/functional-site/#/genomes/KBasePublicGenomesV3/kb%7Cg." + genome + " target=_blank>Link to Genome Landing Page</a>" + "</td>")
					));														
					
					self.$elem.append("<h3>Bicluster List</h3>");

					var $biclusterTable = $("<table/>").addClass("kbgo-table").append($("<td>Bicluster ID</td><td>Full Criterion</td><td>Genes</td><td>Conditions</td>").css("font-weight","bold"));
					for (var bicluster in self.collection.data.sets[0].biclusters) {
						// $dropdown.append($("<option id='" + bicluster + "'>"+self.collection.data.sets[0].biclusters[bicluster].bicluster_id+"; Full Criterion = " + self.collection.data.sets[0].biclusters[bicluster].full_crit.toFixed(4) + "; genes = " + self.collection.data.sets[0].biclusters[bicluster].num_genes + "; conditions = " + self.collection.data.sets[0].biclusters[bicluster].num_conditions + " </option>")											
						$biclusterTable.append($("<tr id='" + bicluster + "'>").append("<td>"+self.collection.data.sets[0].biclusters[bicluster].bicluster_id+"</td><td>" + self.collection.data.sets[0].biclusters[bicluster].full_crit.toFixed(4) + "</td><td>" + self.collection.data.sets[0].biclusters[bicluster].num_genes + "</td><td>" + self.collection.data.sets[0].biclusters[bicluster].num_conditions + "</td>")
							.on("mouseover",
								function() {															
									var tileSelector = self.collection.data.sets[0].biclusters[$(this).attr("id")].bicluster_id.replace(/\./g,'').replace(/\|/,'')
									if (!$("#MAK_tile_"+tileSelector).hasClass('picked')) d3.select("#MAK_tile_"+tileSelector).style("background", "#00FFCC")			
								}
							)
							.on("mouseout",
								function() {									
									var tileSelector = self.collection.data.sets[0].biclusters[$(this).attr("id")].bicluster_id.replace(/\./g,'').replace(/\|/,'')
									if (!$("#MAK_tile_"+tileSelector).hasClass('picked')) d3.select("#MAK_tile_"+tileSelector).style("background", "steelblue")
								}
							)
						);
					}
					self.$elem.append($biclusterTable);
					// self.$elem.append($("<button class='btn btn-default'>Show Bicluster</button>")
                                            // .on("click", 
                                                // function(event) {
                                                    // $(self.$elem.selector + " > select option:selected").each(function() {
                                                    // self.trigger("showMAKBicluster", { bicluster: [self.collection.data.sets[0].biclusters[$(this).attr("id")],self.collection.data.sets[0]], ws: self.options.ws, event: event });
                                                // });
                                            // })
                                        // );
										
                    self.$elem.append("<h3>MAK Run Parameters</h3>");
			        self.$elem.append($("<div />").
					append($("<table/>").addClass("kbgo-table")
                                            .append($("<tr/>").append("<td>Minimum score</td><td>" + self.collection.data.parameters.min_raw_bicluster_score + "</td>"))
                                            .append($("<tr/>").append("<td>Maximum merging overlap</td><td>" + self.collection.data.parameters.max_bicluster_overlap + "</td>"))
                                            .append($("<tr/>").append("<td>Maximum enrichment p-value</td><td>" + self.collection.data.parameters.max_enrich_pvalue + "</td>"))
                                            .append($("<tr/>").append("<td>Discovery rounds</td><td>" + self.collection.data.parameters.rounds + "</td>"))
                                            .append($("<tr/>").append("<td>Merging linkage</td><td>" + self.collection.data.parameters.linkage + "</td>"))
                                            .append($("<tr/>").append("<td>Null distributions</td><td>" + self.collection.data.parameters.null_data_path + "</td>"))
                                            .append($("<tr/>").append("<td>R</td><td>" + self.collection.data.parameters.Rcodepath + "</td>"))
                                            .append($("<tr/>").append("<td>Rdata</td><td>" + self.collection.data.parameters.Rdatapath + "</td>"))
					));
                               self.$elem.append($("<div />")
                                       .append("&nbsp;"));


						
                        },

			    function(data) {
                                $('.loader-table').remove();
                                self.$elem.append('<p>[Error] ' + data.error.message + '</p>');
                                return;
                            }
		    );
            this.hideMessage();
            return this;
        },


        getData: function() {
            return {
                type: "MAKResult",
                id: this.options.id,
                ws: this.options.ws,
                title: "MAK Result Overview"
            };
        },

        showMessage: function(message) {
            var span = $("<span/>").append(message);

            this.$messagePane.append(span);
            this.$messagePane.removeClass("kbwidget-hide-message");
        },

        hideMessage: function() {
            this.$messagePane.addClass("kbwidget-hide-message");
            this.$messagePane.empty();
        },

        rpcError: function(error) {
            console.log("An error occurred: " + error);
        }
	
    });
})( jQuery );
