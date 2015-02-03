(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseGenomePage", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            genomeID: null,
            workspaceID: null,
            loadingImage: "assets/img/ajax-loader.gif"
        },

        init: function(options) {
            this._super(options);
            if (this.options.workspaceID === 'CDS')
            	this.options.workspaceID = 'KBasePublicGenomesV4';
            this.render();
            return this;
        },

        render: function() {
            var self = this;
            var scope = {ws: this.options.workspaceID, id: this.options.genomeID};
            ///////////////////////////////////////////////////////////////////////////////
            var row1 = $('<div class="row">');
            self.$elem.append(row1);
            var cell1 = $('<div class="col-md-12 panel panel-default">');
            row1.append(cell1);
            var panel1 = cell1.kbasePanel({title: 'Overview', rightLabel: '', subText: ''});
            panel1.loading();
            ///////////////////////////////////////////////////////////////////////////////
            var row2 = $('<div class="row">');
            self.$elem.append(row2);
            var cell2 = $('<div class="col-md-12 panel panel-default">');
            row2.append(cell2);
            var panel2 = cell2.kbasePanel({title: 'Publications', rightLabel: '', subText: ''});
            panel2.loading();
            ///////////////////////////////////////////////////////////////////////////////
            var row3 = $('<div class="row">');
            self.$elem.append(row3);
            var cell3 = $('<div class="col-md-12 panel panel-default">');
            row3.append(cell3);
            var panel3 = cell3.kbasePanel({title: 'KBase Community', rightLabel: '', subText: ''});
            panel3.loading();
            ///////////////////////////////////////////////////////////////////////////////
            var row4 = $('<div class="row">');
            self.$elem.append(row4);
            var cell4 = $('<div class="col-md-12 panel panel-default">');
            row4.append(cell4);
            var panel4 = cell4.kbasePanel({title: 'Taxonomy', rightLabel: '', subText: ''});
            panel4.loading();
            ///////////////////////////////////////////////////////////////////////////////
            var row5 = $('<div class="row">');
            self.$elem.append(row5);
            var cell5 = $('<div class="col-md-12 panel panel-default">');
            row5.append(cell5);
            var panel5 = cell5.kbasePanel({title: 'Assembly and Annotation', rightLabel: '', subText: ''});
            panel5.loading();

            var ready = function(genomeInfo) {
            	$(panel1.body()).KBaseGenomeWideOverview({genomeID: scope.id, workspaceID: scope.ws, 
            		kbCache: kb, loadingImage: "assets/img/ajax-loader.gif", genomeInfo: genomeInfo});
            	var searchTerm = "";
            	if (genomeInfo && genomeInfo.data['scientific_name'])
            		searchTerm = genomeInfo.data['scientific_name'];
            	$(panel2.body()).KBaseLitWidget({literature:searchTerm, kbCache: kb,
            		loadingImage: "assets/img/ajax-loader.gif", genomeInfo: genomeInfo});
        	    $(panel3.body()).KBaseGenomeWideCommunity({genomeID: scope.id, workspaceID: scope.ws, kbCache: kb, 
        	    	genomeInfo: genomeInfo});
                $(panel4.body()).KBaseGenomeWideTaxonomy({genomeID: scope.id, workspaceID: scope.ws, kbCache: kb,
                    loadingImage: "assets/img/ajax-loader.gif", genomeInfo: genomeInfo});
                $(panel5.body()).KBaseGenomeWideAssemAnnot({genomeID: scope.id, workspaceID: scope.ws, kbCache: kb,
                    loadingImage: "assets/img/ajax-loader.gif", genomeInfo: genomeInfo});
            };
            
            var objId = scope.ws + "/" + scope.id;
            var included = ["/complete","/contig_ids","/contig_lengths","contigset_ref","/dna_size",
                            "/domain","/gc_content","/genetic_code","/id","/md5","num_contigs",
                            "/scientific_name","/source","/source_id","/tax_id","/taxonomy",
                            "features/[*]/aliases","features/[*]/annotations",
                            "features/[*]/function","features/[*]/id","features/[*]/location",
                            "features/[*]/protein_translation_length","features/[*]/type"];
            kb.ws.get_object_subset( [ {ref:objId, included:included} ], function(data) {
            	var genomeInfo = data[0];
            	console.log(genomeInfo);
            	ready(genomeInfo);
            },
            function(error) {
            	console.error("Error loading genome subdata");
            	console.error(error);
            	ready(null);
            });
        },

        getData: function() {
            return {
                type: "Genome Page",
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: "Genome Page"
            };
        }

    });
})( jQuery );