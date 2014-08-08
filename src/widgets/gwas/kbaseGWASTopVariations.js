(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASTopVariations",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            width: 400,
            type:"KBaseGwasData.GwasTopVariations-1.0"
        },
        workspaceURL: "https://kbase.us/services/ws/",


        init: function(options) {
            this._super(options);

            var self = this;

            this.workspaceClient = new Workspace(this.workspaceURL);

            this.workspaceClient.get_objects([{name : this.options.id, workspace: this.options.ws}], 
                function(data){
                    self.collection = data[0];
                    //console.log(data[0].data);
                    
                    var tableHTML = "<table class='kbgo-table'>" +
                                        "<tbody>" + 
                                        "<tr><td><strong>Kinship Id</strong></td><td>" + self.collection.data.GwasPopulationKinship_obj_id + "</td></tr>" +
                                        "<tr><td><strong>Structure Id</strong></td><td>" + self.collection.data.GwasPopulationStructure_obj_id + "</td></tr>" + 
                                        "<tr><td><strong>Trait Id</strong></td><td>" + self.collection.data.GwasPopulationTrait_obj_id+ "</td></tr>" + 
                                        "<tr><td><strong>Variation Id</strong></td><td>" + self.collection.data.GwasPopulationVariation_obj_id+ "</td></tr>" + 
                                        "<tr><td><strong>Gwas Population Object</strong></td><td>" + self.collection.data.GwasPopulation_obj_id+ "</td></tr>" + 
                                        "<tr><td><strong>Assay</strong></td><td>" + self.collection.data.assay + "</td></tr>" + 
                                        "<tr><td><strong>KBase Genome Id</strong></td><td>" + self.collection.data.genome.kbase_genome_id + "</td></tr>" + 
                                        "<tr><td><strong>KBase Genome Name</strong></td><td>" + self.collection.data.genome.kbase_genome_name + "</td></tr>" + 
                                        "<tr><td><strong>Source</strong></td><td>" + self.collection.data.genome.source_genome_name + "</td></tr>" + 
                                        "<tr><td><strong>Originator</strong></td><td>" + self.collection.data.originator + "</td></tr>" + 
                                        "<tr><td><strong>Population Size</strong></td><td>" + self.collection.data.num_population + "</td></tr>" +
                                        "<tr><td><strong>Protocol</strong></td><td>" + self.collection.data.protocol + "</td></tr>" + 
                                        "<tr><td><strong>Comments</strong></td><td>" + self.collection.data.comment + "</td></tr>" +
                                        "</tbody>" +
                                    "</table>";
                    
                    var containerDiv = $("<div/>");
                    containerDiv.html(tableHTML);
                    self.$elem.append(containerDiv);
                },

                self.rpcError
            );

            return this;
        },

        getData: function() {
            return {
                type:this.options.type,
                id: this.options.id,
                workspace: this.options.ws,
                title: "GWAS Top Variation Details"
            };
        }
    });
})( jQuery )
