(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseGWASPopTable",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        //width: 600,
        options: {
            width: window.innerWidth/2 - 60,
            height: window.innerHeight/2 - 20,
            type: "KBaseGwasData.GwasPopulation"
        },
        workspaceURL: "https://kbase.us/services/ws/",


        init: function(options) {
            this._super(options);

            this.workspaceClient = new Workspace(this.workspaceURL, {token: this.authToken()});

            return this.render();
        },

        render: function() {
            var self = this;

            var success = function(data) {
                self.collection = data[0];

                var domainTable = $("<table/>").addClass("table table-bordered table-striped").attr("id", "popTable"); 
                
                if (self.collection.data.hasOwnProperty("ecotype_details")) {                       
                    var ecotypeDetails = self.collection.data.ecotype_details;

                    var innerHTML = "<thead><tr><th>Country</th><th>Ecotype Id</th><th>Native Name</th><th>Region</th><th>Site</th><th>Stock Parent</th></tr></thead><tbody>";

                    for (var i = 0; i < ecotypeDetails.length; i++) {
                        innerHTML = innerHTML +
                            "<tr>" +
                            "<td>" + ecotypeDetails[i].country + "</td>" +
                            "<td>" + ecotypeDetails[i].ecotype_id + "</td>" +
                            "<td>" + ecotypeDetails[i].nativename + "</td>" +
                            "<td>" + ecotypeDetails[i].region + "</td>" +
                            "<td>" + ecotypeDetails[i].site + "</td>" +
                            "<td>" + ecotypeDetails[i].stockparent + "</td>" +
                            "</tr>";
                    }
                    innerHTML += "</tbody>";

                    //make the table contents what we just created as a string
                    domainTable.html(innerHTML);
                }
                else {
                    var details = self.collection.data.observation_unit_details;
                    
                    var innerHTML = "<thead><tr><th>Country</th><th>Observation Unit Id</th><th>Native Names</th><th>Region</th><th>Source</th></tr></thead><tbody>";

                    for (var i = 0; i < details.length; i++) {
                        innerHTML = innerHTML +
                            "<tr>" +
                            "<td>" + details[i].country + "</td>" +
                            "<td>" + details[i].observation_unit_id + "</td>" +
                            "<td>" + details[i].nativenames + "</td>" +
                            "<td>" + details[i].region + "</td>" +
                            "<td>" + details[i].source_id + "</td>" +
                            "</tr>";
                    }
                    innerHTML += "</tbody>";

                    //make the table contents what we just created as a string
                    domainTable.html(innerHTML);
                }

                self.$elem.append(domainTable);

                $("#popTable").dataTable({"iDisplayLength": Math.floor(window.innerHeight/200), "bLengthChange": false})
                $("#popTable_wrapper").css("overflow-x","hidden");
            };

            var errorFunc = function (e) {
                self.$elem.append("<div class='alert alert-danger'>" + e.error.message + "</div>");
            };


            if (this.options.id.indexOf('/') > -1) {
                this.workspaceClient.get_objects([{ref : this.options.id}]).then(success, errorFunc);
            }
            else {
                this.workspaceClient.get_objects([{name : this.options.id, workspace: this.options.ws}]).then(success, errorFunc);            
            }
            
            return this;
        },
        getData: function() {
            return {
                type:this.options.type,
                id: this.options.id,
                workspace: this.options.ws,
                title: "GWAS Population Observation Details",
                draggable: false,
                resizable: false,
                dialogClass: 'no-close'
            };
        }
/*
        loggedInCallback: function(event, auth) {
            this.workspaceClient = new Workspace(this.workspaceURL, auth);
            
            return this.render();
        },
        loggedOutCallback: function(event, auth) {
            this.workspaceClient = new Workspace(this.workspaceURL, auth);
            
            return this.render();
        },
        loggedInQueryCallback: function(args) {
            console.log(args);

            if (this.loggedInCallback) {
                this.loggedInCallback(undefined, args);
            }
            else {
                this.loggedOutCallback(undefined, args);
            }
        }            
*/
        
    });
})( jQuery )
