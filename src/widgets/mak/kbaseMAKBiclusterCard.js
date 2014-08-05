(function($, undefined) {
    $.KBWidget({
        name: "KBaseMAKBiclusterCard",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            title: "MAK Bicluster",
            isInCard: false,
			loadingImage: "assets/img/ajax-loader.gif",
            width: 600,
            height: 700
       },
	   
	   newWorkspaceServiceUrl: "https://kbase.us/services/ws",
	   
        init: function(options) {
            this._super(options);
            if (this.options.bicluster === null) {
                //throw an error
                return;
            }

            this.$messagePane = $("<div/>")
                    .addClass("kbwidget-message-pane")
                    .addClass("kbwidget-hide-message");
            this.$elem.append(this.$messagePane);

			this.workspaceClient = new Workspace(this.newWorkspaceServiceUrl, { 'token' : this.options.auth, 'user_id' : this.options.userId});
			
            return this.render();
        },
        render: function(options) {
		
            var self = this;
			console.log(self)
			self.bicluster_index = this.options.bicluster[1];
            self.bicluster = this.options.bicluster[0][self.bicluster_index];
            self.bicluster_type = this.options.bicluster[2].bicluster_type;
			var tiles = this.options.tiles
			console.log(self.bicluster)
			$.each(tiles,function(i,d) {				
				d.on("click", function() {
					self.$elem.empty()
					self.options.bicluster[1] = d.val()
					self.render()
					self.getData()
				})
			})
			
			var loader = $("<span style='display:none'><img src='"+self.options.loadingImage+"'/></span>").css({"width":"100%","margin":"0 auto"})            
			$biclusterOverview = $("<div id='biclusterOverview'/>")
			self.$elem.append($biclusterOverview)
			$biclusterOverview.append(loader)
			loader.show()
            $biclusterOverview.append($("<div />")
						.append($("<table/>").addClass("kbgo-table")
					    .append(self.bicluster.bicluster_id!=-1&&self.bicluster.bicluster_id!=0 ? $("<tr/>")
					    	.append("<td>ID</td><td>" + self.bicluster.bicluster_id + "</td>") : '')
					    .append(self.bicluster_type!=-1&&self.bicluster_type!=0 ? $("<tr/>").
					    	append("<td>Cluster type</td><td>" + self.bicluster_type + "</td>") : '')
					    .append(self.bicluster.num_genes!=-1&&self.bicluster.num_genes!=0 ? $("<tr/>").
					    	append("<td>Genes</td><td>" + self.bicluster.num_genes + "</td>") : '')
					    .append(self.bicluster.num_conditions!=-1&&self.bicluster.num_conditions!=0 ? $("<tr/>").
					    	append("<td>Conditions</td><td>" + self.bicluster.num_conditions + "</td>") : '')
					    .append(self.bicluster.exp_mean!=-1&&self.bicluster.exp_mean!=0 ? $("<tr/>").
					    	append("<td>Expression mean</td><td>" + self.bicluster.exp_mean + "</td>") : '')
					    .append(self.bicluster.exp_mean_crit!=-1&&self.bicluster.exp_mean_crit!=0 ? $("<tr/>").
					    	append("<td>Expression mean criterion</td><td>" + self.bicluster.exp_mean_crit + "</td>") : '')
					    .append(self.bicluster.exp_crit!=-1&&self.bicluster.exp_crit!=0 ? $("<tr/>").
					    	append("<td>Expression cohesion criterion</td><td>" + self.bicluster.exp_crit + "</td>") : '')
					    .append(self.bicluster.ppi_crit!=-1&&self.bicluster.ppi_crit!=0 ? $("<tr/>").
					    	append("<td>PPI criterion</td><td>" + self.bicluster.ppi_crit + "</td>") : '')
					    .append(self.bicluster.TF_crit!=-1&&self.bicluster.TF_crit!=0 ? $("<tr/>").
					    	append("<td>TF criterion</td><td>" + self.bicluster.TF_crit + "</td>") : '')
					    .append(self.bicluster.ortho_crit!=-1&&self.bicluster.ortho_crit!=0 ? $("<tr/>").
					    	append("<td>Orthology criterion</td><td>" + self.bicluster.ortho_crit + "</td>") : '')
					    .append(self.bicluster.full_crit!=-1&&self.bicluster.full_crit!=0 ? $("<tr/>").
					    	append("<td>Full criterion</td><td>" + self.bicluster.full_crit + "</td>") : '')
					    .append(self.bicluster.miss_frxn!=-1&&self.bicluster.miss_frxn!=0 ? $("<tr/>").
					    	append("<td>Fraction of missing data</td><td>" + self.bicluster.miss_frxn + "</td>") : '')
			));
			
			//Heatmap			
					
								
			$.when(this.workspaceClient.get_objects([{workspace: self.options.ws, name: self.bicluster.bicluster_id}]))
			.then(
				function(data){
					
					$biclusterOverview.append($("<div />")
							.append("<h3>heatmap</h3>")
							.append($("<button />").attr('id', 'toggle_heatmap').addClass("btn btn-default").append("Toggle")));

					self.$elem.find("#toggle_heatmap").click(function() {
						loader.show()
						
						if (d3.select("#heatmap").empty()) self.trigger("showHeatMap", {bicluster: data[0].data, ws: self.options.ws, id: self.bicluster.bicluster_id, tiles: tiles, mak: this.options.bicluster[0], event: event})
						$("#heatmap").toggle();
						loader.hide()
						
					});
					if (d3.select("#heatmap").empty()) self.trigger("showHeatMap", {bicluster: data[0].data, ws: self.options.ws, id: self.bicluster.bicluster_id, tiles: tiles, mak: self.options.bicluster[0]})
					loader.hide()
				}
			)						

            //Genes
            $biclusterOverview.append($("<div />")
                    .append("<h3>genes</h3>")
					.append($("<button />").attr('id', 'toggle_genes').addClass("btn btn-default").append("Toggle")));

			$("#toggle_genes").click(function() {
                $("#gene_list_"+self.bicluster.bicluster_id.replace( /\D+/g, '')).toggle();
            });
			
            var $genesTable = '<table id="genes-table-' + self.bicluster.bicluster_id.replace( /\D+/g, '') + '" class="kbgo-table">';
            $genesTable += "<tr><th>Gene ID</th><th>Gene label</th></tr>";

            for (var i = 0; i < self.bicluster.num_genes; i++) {
                $genesTable += "<tr><td>" + self.bicluster.gene_ids[i] + "</td><td>" + self.bicluster.gene_labels[i] + "</td></tr>";
            }

            $genesTable += "</table>";
			
            $biclusterOverview.append($("<div id='gene_list_"+self.bicluster.bicluster_id.replace( /\D+/g, '')+"' style='display:none'/>").append($genesTable));
			
            //Conditions
            $biclusterOverview.append($("<div />")
                    .append("<h3>conditions</h3>")
					.append($("<button />").attr('id', 'toggle_conditions').addClass("btn btn-default").append("Toggle")));
			
			$("#toggle_conditions").click(function() {
                $("#condition_list").toggle();
            });
			
            var $conditionsTable = '<table id="conditions-table' + self.bicluster.id + '" class="kbgo-table">';
            $conditionsTable += "<tr><th>Condition ID</th><th>Condition label</th></tr>";

            for (var i = 0; i < self.bicluster.num_conditions; i++) {
                $conditionsTable += "<tr><td>" + self.bicluster.condition_ids[i] + "</td><td>" + self.bicluster.condition_labels[i] + "</td></tr>";
            }

            $conditionsTable += "</table>";

            $biclusterOverview.append($("<div id='condition_list' style='display:none'/>").append($conditionsTable));
            
            //Enriched terms
            $biclusterOverview.append($("<div />")
                    .append("<h3>enriched terms</h3>")
					.append($("<button />").attr('id', 'toggle_terms').addClass("btn btn-default").append("Toggle")));
					
			$("#toggle_terms").click(function() {
                $("#term_list").toggle();
            });
			
            var $termsTable = '<table id="terms-table' + self.bicluster.id + '" class="kbgo-table">';
            $termsTable += "<tr><th>Key</th><th>Value</th></tr>";

            for (var enrichedTerm in self.bicluster.enriched_terms) {
                $termsTable += "<tr><td>" + enrichedTerm.key + "</td><td>" + enrichedTerm.value + "</td></tr>";
            }

            $termsTable += "</table>";
			
            $biclusterOverview.append($("<div id='term_list' style='display:none'/>").append($termsTable));

            $biclusterOverview.append($("<div />")
                    .append("&nbsp;"));

            return this;
        },
        getData: function() {
            return {
                type: "MAKBicluster",
                id: this.options.bicluster[0][this.options.bicluster[1]].bicluster_id,
                ws: this.options.ws,
                title: "MAK Bicluster"
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
})(jQuery);


