(function($, undefined) {
    $.KBWidget({
        name: "KBaseMAKBiclusterCard",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            // title: "MAK Bicluster",
            isInCard: false,
            width: 600,
            height: 700
       },
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

            return this.render();
        },
        render: function(options) {

            var self = this;
            self.bicluster = this.options.bicluster[0];
            self.bicluster_type = this.options.bicluster[1].bicluster_type;
            
            self.$elem.append($("<div />")
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
			
			var DataTable = ["DataTable", [{"bicluster_id":"kb|bicluster.4314","num_genes":173,"num_conditions":75,"condition_ids":["29","30","37","38","42","44"],"condition_labels":["In-frame deletion mutant for ORF SO3389_WT_stationary anoxic_vs._WT_aerobic mid-log","In-frame deletion mutant for ORF SO3389_WT_aerobic biofilm_vs._WT_aerobic mid-log (planktonic)","In-frame deletion mutant for ORF SO3389_Mutant_stationary anoxic (102 h)_vs._Mutant_mid-log anoxic","In-frame deletion mutant for ORF SO3389_WT_stationary anoxic_vs._WT_10 h into anoxic","Salt:NaCl_0.6_120_vs._0_120","BU0_A_BU0_A_null_vs._mean gene expression in 207 S.oneidensis experiments (M3d v4 Build 2)_null"],"gene_ids":["kb|g.371.peg.362","kb|g.371.peg.180","kb|g.371.peg.1427","kb|g.371.peg.1854","kb|g.371.peg.1241"],"gene_labels":["199208","199336","199412","199413","199414"],"exp_mean":1.2781754203886797,"score":0.9944320883479909,"miss_frxn":-1.0,"data":[[0.847005,0.729055,-1.4168,-1.52138,-1.64155,-1.16694],[0.817856,1.10411,-2.86187,-2.81284,-1.40497,-1.4577],[0.825148,0.807097,-3.23414,-6.40135,-1.5801,-2.97321],[0.856129,0.865829,-1.16332,-0.509081,-1.93448,-2.32617],[0.856129,0.865829,-1.16332,-0.509081,-1.93448,-2.32617]]}]]
			
			self.$elem.append($("<div />")
                    .append("<h3>heatmap</h3>")
					.append($("<button />").attr('id', 'toggle_heatmap').addClass("btn btn-default").append("Toggle")));

			$("#toggle_heatmap").click(function() {
				self.trigger("showHeatMap", {bicluster: DataTable, event: event})
                //$("#heatmap").toggle();
				
            });

            //Genes
            self.$elem.append($("<div />")
                    .append("<h3>genes</h3>")
					.append($("<button />").attr('id', 'toggle_genes').addClass("btn btn-default").append("Toggle")));

			$("#toggle_genes").click(function() {
                $("#gene_list").toggle();
            });

            var $genesTable = '<table id="genes-table' + self.bicluster.id + '" class="kbgo-table">';
            $genesTable += "<tr><th>Gene ID</th><th>Gene label</th></tr>";

            for (var i = 0; i < self.bicluster.num_genes; i++) {
                $genesTable += "<tr><td>" + self.bicluster.gene_ids[i] + "</td><td>" + self.bicluster.gene_labels[i] + "</td></tr>";
            }

            $genesTable += "</table>";
			
            self.$elem.append($("<div id='gene_list' style='display:none'/>").append($genesTable));
			
            //Conditions
            self.$elem.append($("<div />")
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

            self.$elem.append($("<div id='condition_list' style='display:none'/>").append($conditionsTable));
            
            //Enriched terms
            self.$elem.append($("<div />")
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
			
            self.$elem.append($("<div id='term_list' style='display:none'/>").append($termsTable));

            self.$elem.append($("<div />")
                    .append("&nbsp;"));

            return this;
        },
        getData: function() {
            return {
                type: "MAKBicluster",
                id: this.options.bicluster.id,
                workspace: this.options.workspace_id,
                title: this.options.title
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


