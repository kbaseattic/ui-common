(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASTopVariations",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        options: {
            width: window.innerWidth/4 - 20,
            height: window.innerHeight - 80,
            type:"KBaseGwasData.GwasTopVariations"
        },
        workspaceURL: "https://kbase.us/services/ws/",


        init: function(options) {
            this._super(options);

            this.workspaceClient = new Workspace(this.workspaceURL, {token: this.authToken()});

            return this.render();
        },
        render: function () {
            var self = this;

            this.workspaceClient.get_objects([{name : this.options.id, workspace: this.options.ws}], 
                function(data){
                    self.collection = data[0];
                    
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
                    
                    self.$elem.append(tableHTML);
                },
                function (e) {
                    self.$elem.append("<div class='alert alert-danger'>" + e.error.message + "</div>");
                }
            );

            return this;
        },
        getData: function() {
            return {
                type:this.options.type,
                id: this.options.id,
                workspace: this.options.ws,
                title: "GWAS Top Variation Details",
                draggable: false,
                resizable: false,
                dialogClass: 'no-close'
            };
        }
    });
})( jQuery )
