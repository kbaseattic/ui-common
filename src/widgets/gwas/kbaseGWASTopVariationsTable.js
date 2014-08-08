(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASTopVariationsTable",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            width: 800,
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
                    var config = self.collection.data.contigs;
                    var variations = self.collection.data.variations;

                    var contTable = $("<dir/>").css('height', 'auto').css('overflow-y', 'scroll');
                    var domainTable = $("<table/>").addClass("table table-bordered table-striped").attr('id', 'popTable');                        

                    var innerHTML = "<thead><tr><th>Chromosome Id</th><th>Position</th><th>pvalue</th></tr></thead><tbody>";

                    for (var i = 0; i < variations.length; i++) {
                        innerHTML += "<tr>" +
                                     "<td>" + (config[variations[i][0]]).id + "</td>" + 
                                     "<td>" + variations[i][1] + "</td>" + 
                                     "<td>" + parseFloat(variations[i][3]).toExponential() + "</td>" + 
                                     "</tr>";
                    }
                    innerHTML += "</tbody>";
                    
                    domainTable.html(innerHTML);
                    contTable.append(domainTable);

                    self.$elem.append(contTable);

                    $("#popTable").dataTable({"iDisplayLength": Math.floor((window.innerHeight - 180)/50), "bLengthChange": false})
                    $("#popTable_wrapper").css("overflow-x","hidden");                    
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
                title: "GWAS Top Variations"
            };
        }
    });
})( jQuery )
