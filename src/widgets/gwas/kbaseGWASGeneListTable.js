(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASGeneListTable",
        parent: "kbaseWidget",
        version: "1.0.0",
        //width: 600,
        options: {
            width: window.innerWidth - 0.05*window.innerWidth,
            height: window.innerHeight - 80,
            type: "KBaseGwasData.GwasGeneList-1.0"
        },
        workspaceURL: "https://kbase.us/services/ws/",


        init: function(options) {
            this._super(options);

            var self = this;

            this.workspaceClient = new Workspace(this.workspaceURL);

            //this.workspaceClient.get_object({"id" : 'arabidopsis_population_atwell_et_al', "type" : this.options.type, "workspace": 'genotype_phenotype'}, 
            this.workspaceClient.get_objects([{name : this.options.id, workspace: this.options.ws}], 
                function(data){
                    self.collection = data[0];
                    console.log(self.collection);

                    var containerDiv = $("<dir/>").css('height', 'auto').css('overflow-y', 'scroll');                    
                    var domainTable = $("<table/>").addClass("table table-bordered table-striped").attr("id", "popTable"); 
                    
                    var innerHTML = "<thead>" + 
                                        "<tr>" + 
                                            "<th>Chromosome Id</th>" + 
                                            "<th>KBase Chromosome Id</th>" + 
                                            "<th>Gene Id</th>" + 
                                            "<th>KBase Gene Id</th>" + 
                                            "<th>Gene Function</th>" + 
                                        "</tr>" + 
                                    "</thead>" + 
                                    "<tbody>";

                    for (var i = 0; i < self.collection.data.genes.length; i++) {
                        innerHTML += "<tr>" + 
                                         "<td>" + self.collection.data.genes[i][4] + "</td>" +
                                         "<td>" + self.collection.data.genes[i][0] + "</td>" +
                                         "<td>" + self.collection.data.genes[i][1] + "</td>" +
                                         "<td>" + self.collection.data.genes[i][2] + "</td>" +
                                         "<td>" + self.collection.data.genes[i][3] + "</td>" +
                                     "</tr>";
                    }

                    innerHTML += "</tbody>";

                    //make the table contents what we just created as a string
                    domainTable.html(innerHTML);

                    containerDiv.append(domainTable);
                    self.$elem.append(containerDiv);

                    $("#popTable").dataTable({"iDisplayLength": Math.floor((window.innerHeight - 180)/50), "bLengthChange": false, "sScrollY": false})
                    $("#popTable_wrapper").css("overflow-x","hidden");
                    $("#popTable_wrapper").css("overflow-y","hidden");
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
                title: "GWAS Gene List Details"
            };
        }
    });
})( jQuery )
