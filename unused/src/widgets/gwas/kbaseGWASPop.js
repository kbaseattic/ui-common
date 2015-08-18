(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASPop",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        //width: 600,
        options: {
            width: 400,
            type: "KBaseGwasData.GwasPopulation"
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
                    self.$elem.append($("<div/>").
                    append($("<table/>").addClass("kbgo-table")
                        .append($("<tr/>").append("<td>ID</td><td>" + self.collection.data.genome.kbase_genome_id + "</td>"))
                        .append($("<tr/>").append("<td>Name</td><td>" + self.collection.data.genome.kbase_genome_name + "</td>"))
                        .append($("<tr/>").append("<td>Source Name</td><td>" + self.collection.data.genome.source_genome_name + "</td>"))
                        .append($("<tr/>").append("<td>Description</td><td>" + self.collection.data.GwasPopulation_description + "</td>"))
                    ));
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
                title: "GWAS Population Details",
                draggable: false,
                resizable: false,
                dialogClass: 'no-close'
            };
        }
    });
})( jQuery )
