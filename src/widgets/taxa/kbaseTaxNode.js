/**
 * Taxonomy page showing KBaseTaxonomy.Taxon objects and links to parents, children and genomes.
 * @author Roman Sutormin <rsutormin@lbl.gov>
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
            loadingImage: "assets/img/ajax-loader.gif",
            width: 1045,
            height: 600
        },

        pref: null,
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
            	var subnodeinfos = [];
            	var genometaxoninfos = [];
            	for(var i = 0; i < data[0].length; i++) {
            		var oinfo = data[0][i];
            		//0:obj_id objid, 1:obj_name name, 2:type_string type,3:timestamp save_date, 4:int version, 5:username saved_by,
            		//6:ws_id wsid, 7:ws_name workspace, 8:string chsum, 9:int size, 10:usermeta meta>
            		var type = oinfo[2];
            		type = type.substr(0, type.indexOf('-'));
            		if (type === 'KBaseTaxonomy.Taxon') {
            			subnodeinfos.push(oinfo);
            		} else if (type === 'KBaseTaxonomy.GenomeTaxon') {
            			genometaxoninfos.push(oinfo);
            		} else {
            			// Do nothing
            			//console.log("Unsupported type: " + type);
            		}
            	}
            	self.showResults(nodes, subnodeinfos, genometaxoninfos);
            }, this);
    		$.when(prom1).fail($.proxy(function(error) { 
    			self.renderError(error); 
    		}, this));
        },
            
        showResults: function(nodes, subnodeinfos, genometaxoninfos) {    
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
        	table.append('<tr><td>Genetic code</td><td><a href="http://www.ncbi.nlm.nih.gov/Taxonomy/taxonomyhome.html/index.cgi?chapter=cgencodes#SG'+taxon.genetic_code+'" target="_blank">'+taxon.genetic_code+'</a></td></tr>');
        	if (taxon.mito_genetic_code && taxon.mito_genetic_code != 0)
        		table.append('<tr><td>Mito-genetic code</td><td>'+taxon.mito_genetic_code+'</td></tr>');
        	table.append('<tr><td>Division</td><td>'+taxon.division+'</td></tr>');
        	var table2 = $('<table class="table table-striped table-bordered" \
        			style="margin-left: auto; margin-right: auto;" id="'+self.pref+'overview-table"/>');
        	panel.append(table2);
        	table2.append('<tr><td>Sub-taxa</td><td>Genomes</td></tr>');
        	var genomeLinks = "";
        	for (var i in genometaxoninfos) {
        		var info = genometaxoninfos[i];
        		var ws = info[7];
        		var objname = info[1];
        		genomeLinks += '<a href="/functional-site/#/genome/' + ws + '/' + objname + '">' + objname + '</a><br>';
        	}
        	var tr = $('<tr/>');
        	table2.append(tr);
        	var td1 = $('<td/>');
        	tr.append(td1);
        	if (subnodeinfos.length > 0) {
        		td1.append('<span style="display:block;">Loading...<img src="' + self.options.loadingImage + '"/></span>');
        		self.loadSubNode(td1, subnodeinfos, 0);
        	}
        	var td2 = $('<td/>');
        	tr.append(td2);
        	if (genometaxoninfos.length > 0) {
        		td2.append('<span style="display:block;">Loading...<img src="' + self.options.loadingImage + '"/></span>');
        		self.loadGenome(td2, genometaxoninfos, 0);
        	}
        },
        
        loadSubNode: function(panel, objinfos, pos) {
            var self = this;
            if (!pos)
            	pos = 0;
            if (pos >= objinfos.length) {
            	return;
            }
            var objrefs = "";
            var objids = [];
            var block_size = 0;
            while (pos < objinfos.length && block_size < 100) {
            	var oinfo = objinfos[pos];
            	var objref = oinfo[6]+"/"+oinfo[0]+"/"+oinfo[4];
            	objids.push({ref: objref, included: ["name"]});
            	//objids.push({ref: objref});
            	if (objrefs.length > 0)
            		objrefs += ", ";
            	objrefs += objref;
            	pos++;
            	block_size++;
            }
    		var prom1 = self.wsClient.get_object_subset(objids);
    		//var prom1 = self.wsClient.get_objects(objids);
    		$.when(prom1).done($.proxy(function(objArr) {
        		self.loadSubNode(panel, objinfos, pos);
    			for (var i in objArr) {
    				var data = objArr[i];
    				var node = data.data;
    				var ws = data.info[7];
    				var objname = data.info[1];
    				var nodename = node.name; 
    				panel.append('<span style="display:block;"><a href="/functional-site/#/taxnode/' + 
    						ws + '/' + objname + '">' + nodename + '</a></span>');
    			}
    			self.sortSpanAhrefs(panel, true);
        		self.updateFirstSpan(panel, pos, objinfos);
    		}, this));
    		$.when(prom1).fail($.proxy(function(error) { 
        		panel.append('Error loading object refs=[' + objrefs + ']: ' + error.error.message + '<br>');
        		self.loadSubNode(panel, objinfos, pos);
        		self.updateFirstSpan(panel, pos, objinfos);
    		}, this));
        },

        sortSpanAhrefs: function(panel, skipFirst) {
			var set = panel.children();
			if (skipFirst)
				set = set.slice(1);
			set.sort(function(a, b) {
				var compA = $(a).children().first().text();
				var compB = $(b).children().first().text();
				var ret = (compA === compB) ? 0 : ((compA < compB) ? -1 : 1)
				return ret;
			});
			panel.append(set);
        },
        
        updateFirstSpan: function(panel, pos, objinfos) {
			var elem = panel.children().first();
			if (pos < objinfos.length) {
				elem.html('Loading (' + pos + ' out of ' + objinfos.length + ')...<img src="' + this.options.loadingImage + '"/>');
			} else {
    			elem.remove();
			}
        },
        
        loadGenome: function(panel, objinfos, pos) {
            var self = this;
            if (!pos)
            	pos = 0;
            if (pos >= objinfos.length)
            	return;
            var objids = [];
            var objrefs = "";
            var blocksize = 0;
            while (pos < objinfos.length && blocksize < 10) {
            	var oinfo = objinfos[pos];
            	var objref = oinfo[6]+"/"+oinfo[0]+"/"+oinfo[4];
            	objids.push({ref: objref});
            	if (objrefs.length > 0)
            		objrefs += ", ";
            	objrefs += objref;
        		pos++;
        		blocksize++;
            }
    		var prom1 = self.wsClient.get_objects(objids);
    		$.when(prom1).done($.proxy(function(objArr) {
    			var subsets = [];
    			objrefs = "";
    			for (var i in objArr) {
    				objref = objArr[i].data.genome_ref;
    				subsets.push({ref: objref, included: ["scientific_name"]});
    				if (objrefs.length > 0)
    					objrefs += ", ";
    				objrefs += objref;
    			}
        		var prom2 = self.wsClient.get_object_subset(subsets);
        		$.when(prom2).done($.proxy(function(objArr) {
            		self.loadGenome(panel, objinfos, pos);
            		for (var i in objArr) {
            			var data = objArr[i];
            			var node = data.data;
            			var ws = 'KBasePublicGenomesV4';  //data.info[7];
            			var objname = data.info[1];
            			var nodename = node.scientific_name + " (" + objname + ")"; 
            			panel.append('<span style="display:block;"><a href="/functional-site/#/genomes/' + 
            					ws + '/' + objname + '" target="_blank">' + nodename + '</a></span>');
            		}
        			self.sortSpanAhrefs(panel, true);
            		self.updateFirstSpan(panel, pos, objinfos);
        		}, this));
        		$.when(prom2).fail($.proxy(function(error) { 
            		panel.append('Error loading object refs=' + objrefs + ': ' + error.error.message + '<br>');
            		self.loadGenome(panel, objinfos, pos);
            		self.updateFirstSpan(panel, pos, objinfos);
        		}, this));            		
    		}, this));
    		$.when(prom1).fail($.proxy(function(error) { 
        		panel.append('Error loading object refs=' + objrefs + ': ' + error.error.message + '<br>');
        		self.loadGenome(panel, objinfos, pos);
        		self.updateFirstSpan(panel, pos, objinfos);
    		}, this));
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
                title: 'Taxonomy'
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