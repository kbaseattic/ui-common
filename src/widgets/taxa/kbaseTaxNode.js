/**
 * @author Bill Riehl <wjriehl@lbl.gov>, Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */

(function($, undefined) {
    $.KBWidget({
        name: 'kbaseTaxNode',
        parent: 'kbaseAuthenticatedWidget',
        version: '0.0.1',
        options: {
            taxID: null,
            workspaceID: null,
            taxVer: null,
            token: null,
            workspaceURL: "http://dev04.berkeley.kbase.us:7058",  // "https://kbase.us/services/ws",
            loadingImage: "static/kbase/images/ajax-loader.gif",
            width: 1045,
            height: 600
        },

        pref: null,
        loadingImage: "static/kbase/images/ajax-loader.gif",
        wsClient: null,

        init: function(options) {
            this._super(options);
            this.pref = this.uuid();
            if (!this.authToken()) {
                this.renderError("You're not logged in!");
            } else {
                this.wsClient = new Workspace(this.options.workspaceURL, {token: this.authToken()});
                this.$messagePane = $("<div/>")
                                    .addClass("kbwidget-message-pane kbwidget-hide-message");
                this.$elem.append(this.$messagePane);
                this.render();
            }
            return this;
        },

        render: function() {
            this.loading(false);
            var self = this;
            var objId = self.buildObjectIdentity(self.options.workspaceID, self.options.taxID, self.options.taxVer);
            var nodes = [];
            self.loadNode(objId, nodes);
        },
        
        loadNode: function(objId, nodes) {
            var self = this;
            var prom = this.wsClient.get_objects([objId]);
            $.when(prom).done($.proxy(function(objArr) {
                var taxon = objArr[0].data;
                nodes.push(objArr[0]);
                var node_id = taxon.tax_id;
                var par_id = taxon.parent_id;
                var par_ref = taxon.parent_ref;
                if ((par_id) && !(par_id === node_id)) {
                	self.loadNode(self.buildObjectIdentity(null, null, null, par_ref), nodes);
                } else {
                	self.loadChildren(nodes);
                }
            }, this));
            $.when(prom).fail($.proxy(function(error) { 
            	self.renderError(error); 
            }, this));
        },
        
        loadChildren: function(nodes) {
            var self = this;
            var info = nodes[0].info;
            var prom1 = self.wsClient.list_referencing_objects([{ref: info[6]+"/"+info[0]+"/"+info[4]}]);
            $.when(prom1).done(function(data) {
            	var objids = [];
            	var nodesCount = 0;
            	var genomeCount = 0;
            	for(var i = 0; i < data[0].length; i++) {
            		var oinfo = data[0][i];
            		//0:obj_id objid, 1:obj_name name, 2:type_string type,3:timestamp save_date, 4:int version, 5:username saved_by,
            		//6:ws_id wsid, 7:ws_name workspace, 8:string chsum, 9:int size, 10:usermeta meta>
            		var type = oinfo[2];
            		type = type.substr(0, type.indexOf('-'));
            		var objid = {ref: oinfo[6]+"/"+oinfo[0]+"/"+oinfo[4]};
            		if (type === 'KBaseTaxonomy.Taxon') {
            			if (nodesCount < 10) {
            				objids.push(objid);
            				nodesCount++;
            			}
            		} else if (type === 'KBaseTaxonomy.GenomeTaxon') {
            			if (genomeCount < 10) {
            				objids.push(objid);
            				genomeCount++;
            			}
            		} else {
            			console.log("Unsupported type: " + type);
            		}
            	}
            	if (objids.length > 0) {
            		var prom2 = self.wsClient.get_objects(objids);
            		$.when(prom2).done($.proxy(function(objArr) {
            			var subnodes = [];
            			var genometaxons = [];
            			for (var i in objArr) {
            				if (objArr[i].data.name) {
            					subnodes.push(objArr[i]);
            				} else if (objArr[i].data.genome_ref) {
            					genometaxons.push(objArr[i]);
            				}
            			}
            			self.showResults(nodes, subnodes, genometaxons);
            		}, this));
            		$.when(prom2).fail($.proxy(function(error) { 
            			self.renderError(error); 
            		}, this));
            	} else {
            		self.showResults(nodes, [], []);
            	}
            }, this);
    		$.when(prom1).fail($.proxy(function(error) { 
    			self.renderError(error); 
    		}, this));
        },
            
        showResults: function(nodes, subnodes, genometaxons) {    
            var self = this;
            self.$elem.empty();
            var panel = $('<div class="loader-table"/>');
        	self.$elem.append(panel);
        	var parents = '';
        	for (var i = nodes.length - 1; i >= 0; i--) {  // Skip root node
        		var data = nodes[i];
        		var node = data.data;
        		if (parents.length > 0)
        			parents += "; ";
        		var ws = data.info[7];
        		var objname = data.info[1];
        		var nodename = (i == nodes.length - 1) ? "All" : node.name; 
        		if (i > 0) {
        			parents += '<a href="/functional-site/#/taxnode/' + ws + '/' + objname + '">' + nodename + '</a>';
        		} else {
        			parents += nodename;
        		}
        	}
        	panel.append(parents);
        	taxon = nodes[0].data;
        	var table = $('<table class="table table-striped table-bordered" \
        			style="margin-left: auto; margin-right: auto;" id="'+self.pref+'overview-table"/>');
        	panel.append(table);
        	table.append('<tr><td>Tax ID</td><td>'+taxon.tax_id+'</td></tr>');
        	table.append('<tr><td>Name</td><td>'+taxon.name+'</td></tr>');
        	table.append('<tr><td>Aliases</td><td>'+taxon.aliases+'</td></tr>');
        	table.append('<tr><td>Rank</td><td>'+taxon.rank+'</td></tr>');
        	table.append('<tr><td>Genetic code</td><td>'+taxon.genetic_code+'</td></tr>');
        	if (taxon.mito_genetic_code && taxon.mito_genetic_code != 0)
        		table.append('<tr><td>Mito-genetic code</td><td>'+taxon.mito_genetic_code+'</td></tr>');
        	table.append('<tr><td>Division</td><td>'+taxon.division+'</td></tr>');
        	var table2 = $('<table class="table table-striped table-bordered" \
        			style="margin-left: auto; margin-right: auto;" id="'+self.pref+'overview-table"/>');
        	panel.append(table2);
        	table2.append('<tr><td>Sub-nodes</td><td>Genomes</td></tr>');
        	var subNodeLinks = "";
        	for (var i in subnodes) {
        		var data = subnodes[i];
        		var node = data.data;
        		var ws = data.info[7];
        		var objname = data.info[1];
        		var nodename = node.name; 
        		subNodeLinks += '<a href="/functional-site/#/taxnode/' + ws + '/' + objname + '">' + nodename + '</a><br>';
        	}
        	if (subnodes.length == 10)
        		subNodeLinks += "...";
        	var genomeLinks = "";
        	for (var i in genometaxons) {
        		var data = genometaxons[i];
        		var ref = data.data.genome_ref;
        		genomeLinks += '<a href="/functional-site/#/genome/' + ref + '">' + ref + '</a><br>';
        	}
        	if (genometaxons.length == 10)
        		genomeLinks += "...";
        	table2.append('<tr><td>' + subNodeLinks + '</td><td>' + genomeLinks + '</td></tr>');
        },
        
        renderError: function(error) {
            errString = "Sorry, an unknown error occurred";
            if (typeof error === "string")
                errString = error;
            else if (error.error && error.error.message)
                errString = error.error.message;
            
            var $errorDiv = $("<div>")
                            .addClass("alert alert-danger")
                            .append("<b>Error:</b>")
                            .append("<br>" + errString);
            this.$elem.empty();
            this.$elem.append($errorDiv);
        },

        getData: function() {
            return {
                type: 'TaxNone',
                id: this.options.taxID,
                workspace: this.options.workspaceID,
                title: 'Taxonomy node'
            };
        },

        buildObjectIdentity: function(workspaceID, objectID, objectVer, wsRef) {
            var obj = {};
            if (wsRef) {
            	obj['ref'] = wsRef;
            } else {
            	if (/^\d+$/.exec(workspaceID))
            		obj['wsid'] = workspaceID;
            	else
            		obj['workspace'] = workspaceID;

            	// same for the id
            	if (/^\d+$/.exec(objectID))
            		obj['objid'] = objectID;
            	else
            		obj['name'] = objectID;
            	
            	if (objectVer)
            		obj['ver'] = objectVer;
            }
            return obj;
        },

        loading: function(doneLoading) {
            if (doneLoading)
                this.hideMessage();
            else
                this.showMessage("<img src='" + this.options.loadingImage + "'/>");
        },

        showMessage: function(message) {
            var span = $("<span/>").append(message);

            this.$messagePane.append(span);
            this.$messagePane.show();
        },

        hideMessage: function() {
            this.$messagePane.hide();
            this.$messagePane.empty();
        },

        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
                function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
        }
    });
})( jQuery );