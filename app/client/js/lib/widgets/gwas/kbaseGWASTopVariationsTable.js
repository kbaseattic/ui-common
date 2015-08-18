(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASTopVariationsTable",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        options: {
            width: window.innerWidth/2 + window.innerWidth/6,
            height: window.innerHeight - 120,
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
                    var config = self.collection.data.contigs;
                    var variations = self.collection.data.variations;

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
                    self.$elem.append(domainTable);

                    $("#popTable").dataTable({"iDisplayLength": Math.floor((window.innerHeight - 180)/50), "bLengthChange": false})
                    $("#popTable_wrapper").css("overflow-x","hidden");                    
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
                title: "GWAS Top Variations",
                draggable: false,
                resizable: false,
                dialogClass: 'no-close'
            };
        }
    });
})( jQuery )
