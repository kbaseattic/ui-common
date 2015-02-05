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
            var cell1 = $('<div panel panel-default">');
            self.$elem.append(cell1);
            var panel1 = self.makePleaseWaitPanel();
            self.makeDecoration(cell1, 'Overview', panel1);
            ///////////////////////////////////////////////////////////////////////////////
            var cell2 = $('<div panel panel-default">');
            self.$elem.append(cell2);
            var panel2 = self.makePleaseWaitPanel();
            self.makeDecoration(cell2, 'Publications', panel2);
            ///////////////////////////////////////////////////////////////////////////////
            var cell3 = $('<div panel panel-default">');
            self.$elem.append(cell3);
            var panel3 = self.makePleaseWaitPanel();
            self.makeDecoration(cell3, 'KBase Community', panel3);
            ///////////////////////////////////////////////////////////////////////////////
            var cell4 = $('<div panel panel-default">');
            self.$elem.append(cell4);
            var panel4 = self.makePleaseWaitPanel();
            self.makeDecoration(cell4, 'Taxonomy', panel4);
            ///////////////////////////////////////////////////////////////////////////////
            var cell5 = $('<div panel panel-default">');
            self.$elem.append(cell5);
            var panel5 = self.makePleaseWaitPanel();
            self.makeDecoration(cell5, 'Assembly and Annotation', panel5);

            var ready = function(genomeInfo) {
            	panel1.empty();
            	panel1.KBaseGenomeWideOverview({genomeID: scope.id, workspaceID: scope.ws, 
            		kbCache: kb, loadingImage: "assets/img/ajax-loader.gif", genomeInfo: genomeInfo});
            	var searchTerm = "";
            	if (genomeInfo && genomeInfo.data['scientific_name'])
            		searchTerm = genomeInfo.data['scientific_name'];
            	panel2.empty();
            	panel2.KBaseLitWidget({literature:searchTerm, kbCache: kb,
            		loadingImage: "assets/img/ajax-loader.gif", genomeInfo: genomeInfo});
            	panel3.empty();
        	    panel3.KBaseGenomeWideCommunity({genomeID: scope.id, workspaceID: scope.ws, kbCache: kb, 
        	    	genomeInfo: genomeInfo});
            	panel4.empty();
                panel4.KBaseGenomeWideTaxonomy({genomeID: scope.id, workspaceID: scope.ws, kbCache: kb,
                    loadingImage: "assets/img/ajax-loader.gif", genomeInfo: genomeInfo});
            	panel5.empty();
                panel5.KBaseGenomeWideAssemAnnot({genomeID: scope.id, workspaceID: scope.ws, kbCache: kb,
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

        makePleaseWaitPanel: function() {
        	return $('<div>').append('<p class="muted ajax-loader"><img src="' +
        			this.options.loadingImage + '"> loading...</p>');
        },
        
        makeDecoration: function($panel, title, $widgetDiv) {
            var id = this.genUUID();
            $panel.append(
                    $('<div class="panel-group" id="accordion_'+id+'" role="tablist" aria-multiselectable="true">')
                    .append($('<div class="panel panel-default">')
                            .append(''+
                                    '<div class="panel-heading" role="tab" id="heading_'+id+'">'+
                                    '<h4 class="panel-title">'+
                                    '<span data-toggle="collapse" data-parent="#accordion_'+id+'" data-target="#collapse_'+id+'" aria-expanded="false" aria-controls="collapse_'+id+'" style="cursor:pointer;">'+
                                    '<span class="fa fa-angle-right pull-left"></span>' + title + 
                                    '</span>'+
                                    '</h4>'+
                                    '</div>'
                            )
                            .append($('<div id="collapse_'+id+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading_'+id+'" area-expanded="true">')
                                    .append($('<div class="panel-body">').append($widgetDiv))
                            )
                    )
            );
        },
        
        getData: function() {
            return {
                type: "Genome Page",
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: "Genome Page"
            };
        },

        genUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
    });
})( jQuery );