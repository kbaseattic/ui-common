/**
 * Taxonomy page showing KBaseTaxonomy.Taxon objects and links to parents, children and genomes.
 * @author Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */

(function($, undefined) {
    $.KBWidget({
        name: 'kbaseDomainBrowser',
        parent: 'kbaseAuthenticatedWidget',
        version: '0.0.1',
        options: {
            dcsrID: null,
            workspaceID: null,
            token: null,
            workspaceURL: "http://dev04.berkeley.kbase.us:7058",  // "https://kbase.us/services/ws",
            loadingImage: "assets/img/ajax-loader.gif",
            width: 1045,
            height: null, //600,
            treeWorkspace: "KBasePublicGeneDomains"
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
        	var container = this.$elem;
            var objId = self.buildObjectIdentity(self.options.workspaceID, self.options.dcsrID, self.options.taxVer);
            var prom = this.wsClient.get_objects([objId]);
            $.when(prom).done($.proxy(function(objArr) {
            	self.loading(true);
        		container.empty();
        		var data = objArr[0].data;
        		var tabPane = $('<div id="'+self.pref+'tab-content">');
        		container.append(tabPane);
        		var tabs = tabPane.kbTabs({tabs: []});
        		///////////////////////////////////// Genomes /////////////////////////////////////////////
        		var tableG = $('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered ' +
        				'table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;">');
        		var tabG = $("<div/>");
        		tabG.append(tableG);
    			tabs.addTab({name: 'Genomes', content: tabG, active: true, removable: false});
    			var genomeData = [];
    			for (var genomeRef in data.genome_statistics) {
    				var gs = data.genome_statistics[genomeRef];
    				var id = gs.kbase_id;
    				var name = '<a class="show-genomes_'+self.pref+'" data-id="'+genomeRef+'">'+gs.scientific_name+'</a>';
    				var feat = gs.features;
    				var fwd = gs.features_with_domains;
    				var dmod = gs.domain_models;
    				var dom = gs.domains;
    				genomeData.push({id: id, name: name, feat: feat, fwd: fwd, dmod: dmod, dom: dom});
    			}
        		var tableGSettings = {
        				"sPaginationType": "bootstrap",
        				"iDisplayLength": 10,
        				"aaData": genomeData,
        				"aaSorting": [[1, "asc"], [0, "asc"]],
        				"aoColumns": [
        				              { "sTitle": "KBase ID", 'mData': 'id'},
        				              { "sTitle": "Genome name", 'mData': 'name'},
        				              { "sTitle": "Features", 'mData': 'feat'},
        				              { "sTitle": "Features with Domains", 'mData': 'fwd'},
        				              { "sTitle": "Domain Models", 'mData': 'dmod'},
        				              { "sTitle": "Domain Hits", 'mData': 'dom'}
        				              ],
        				              "oLanguage": {
        				            	  "sEmptyTable": "No objects in result",
        				            	  "sSearch": "Search: "
        				              },
        				              'fnDrawCallback': eventsG
        		}
        		tableG.dataTable(tableGSettings);
        		function eventsG() {
        			$('.show-genomes_'+self.pref).unbind('click');
        			$('.show-genomes_'+self.pref).click(function() {
        				var genomeRef = $(this).data('id');
        				var genomeName = data.genome_statistics[genomeRef].scientific_name;
        				var tabName = "Genome " + genomeName;
        				if (tabs.tabContent(tabName)[0]) {
        					tabs.showTab(tabName);
        					return;
        				}
                		var tabContent = $("<div/>");
        				self.buildGenomeTab(data, genomeName, genomeRef, tabContent, tabs);
            			tabs.addTab({name: tabName, content: tabContent, active: true, removable: true});
            			tabs.showTab(tabName);
        			})
        		}
        		///////////////////////////////////// Domains /////////////////////////////////////////////
        		var tableD = $('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered ' +
        				'table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;">');
        		var tabD = $("<div/>");
        		tabD.append(tableD);
    			tabs.addTab({name: 'Domains', content: tabD, active: false, removable: false});
    			var domainData = [];
    			for (var domainRef in data.domain_cluster_statistics) {
    				var dcs = data.domain_cluster_statistics[domainRef];
    				var name = '<a class="show-domains_'+self.pref+'" data-id="'+domainRef+'">'+dcs.name+'</a>';
    				var gnm = dcs.genomes;
    				var feat = dcs.features;
    				var dom = dcs.domains;
    				domainData.push({name: name, gnm: gnm, feat: feat, dom: dom});
    			}
        		var tableDSettings = {
        				"sPaginationType": "bootstrap",
        				"iDisplayLength": 10,
        				"aaData": domainData,
        				"aaSorting": [[0, "asc"]],
        				"aoColumns": [
        				              { "sTitle": "Domain model name", 'mData': 'name'},
        				              { "sTitle": "Genomes", 'mData': 'gnm'},
        				              { "sTitle": "Features", 'mData': 'feat'},
        				              { "sTitle": "Domain Hits", 'mData': 'dom'}
        				              ],
        				              "oLanguage": {
        				            	  "sEmptyTable": "No objects in result",
        				            	  "sSearch": "Search: "
        				              },
        				              'fnDrawCallback': eventsD
        		}
        		tableD.dataTable(tableDSettings);
        		function eventsD() {
        			$('.show-domains_'+self.pref).unbind('click');
        			$('.show-domains_'+self.pref).click(function() {
        				var domainRef = $(this).data('id');
        				var domainName = data.domain_cluster_statistics[domainRef].name;
        				var tabName = "Domain " + domainName;
        				if (tabs.tabContent(tabName)[0]) {
        					tabs.showTab(tabName);
        					return;
        				}
                		var tabContent = $("<div/>");
        				self.buildDomainTab(data, domainName, domainRef, tabContent, tabs);
            			tabs.addTab({name: tabName, content: tabContent, active: true, removable: true});
            			tabs.showTab(tabName);
        			})
        		}
            }, this));
            $.when(prom).fail($.proxy(function(error) { 
            	self.renderError(error); 
            }, this));
        },
        
        buildGenomeTab: function(dcsr, genomeName, genomeRef, panel, tabs) {
        	panel.append($('<span/>').append('<img src="' + this.options.loadingImage + '"/>'));
        	var self = this;
        	var annRef = dcsr.annotation_refs[genomeRef];
            var prom = this.wsClient.get_objects([{ref: annRef}]);
            $.when(prom).done($.proxy(function(objArr) {
        		panel.empty();
        		var ann = objArr[0].data;
        		var domainPlaces = [];
        		for (var contigId in ann.data) {
        			var elems = ann.data[contigId];
        			for (var elemPos in elems) {
        				var elem = elems[elemPos];
        				var featureId = elem[0];
        				var domainMap = elem[4];
        				for (var domainRef in domainMap) {
        					if (!dcsr.domain_cluster_statistics[domainRef])
        						continue;
        					var domainName = dcsr.domain_cluster_statistics[domainRef].name;
        					for (var dpPos in domainMap[domainRef]) {
        						var dp = domainMap[domainRef][dpPos];
        						var start = dp[0];
        						var stop = dp[1];
        						var evalue = dp[2];
        						var bitscore = dp[3];
        						var coverage = dp[4];
        						var ahref = '<a class="show-places_'+self.pref+'" data-gnm="'+genomeRef+'" '+
        							'data-dom="'+domainRef+'" data-feat="'+featureId+'" data-start="'+start+'">';
        						domainPlaces.push({genome: ahref+genomeName+'</a>', domain: ahref+domainName+'</a>', 
        							feature: featureId, start: start, stop: stop, evalue: evalue, bitscore: bitscore, 
        							coverage: coverage});
        					}
        				}
        			}
        		}
        		self.buildDomainPlaceTable(dcsr, domainPlaces, panel, tabs);
            }, this));
            $.when(prom).fail($.proxy(function(error) { 
            	panel.append($("<div>")
                            .addClass("alert alert-danger")
                            .append("<b>Error:</b>")
                            .append("<br>" + error.error.message));
            }, this));
        },

        buildDomainTab: function(dcsr, domainName, domainRef, panel, tabs) {
        	panel.append($('<span/>').append('<img src="' + this.options.loadingImage + '"/>'));
        	var self = this;
        	var dcRef = dcsr.domain_cluster_refs[domainRef];
            var prom = this.wsClient.get_objects([{ref: dcRef}]);
            $.when(prom).done($.proxy(function(objArr) {
        		panel.empty();
            }, this));
            $.when(prom).fail($.proxy(function(error) { 
            	panel.append($("<div>")
                            .addClass("alert alert-danger")
                            .append("<b>Error:</b>")
                            .append("<br>" + error.error.message));
            }, this));
        },

        buildDomainPlaceTable: function(dcsr, domainPlaces, panel, tabs) {
        	var self = this;
    		var table = $('<table cellpadding="0" cellspacing="0" border="0" class="table table-bordered ' +
				'table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;">');
    		panel.append(table);
    		var tableSettings = {
    				"sPaginationType": "bootstrap",
    				"iDisplayLength": 10,
    				"aaData": domainPlaces,
    				"aaSorting": [[0, "asc"]],
    				"aoColumns": [
    				              { "sTitle": "Genome name", 'mData': 'genome'},
    				              { "sTitle": "Domain model name", 'mData': 'domain'},
    				              { "sTitle": "Feature ID", 'mData': 'feature'},
    				              { "sTitle": "Start", 'mData': 'start'},
    				              { "sTitle": "Stop", 'mData': 'stop'},
    				              { "sTitle": "E-value", 'mData': 'evalue'},
    				              { "sTitle": "Bit-score", 'mData': 'bitscore'},
    				              { "sTitle": "Coverage", 'mData': 'coverage'}
    				              ],
    				              "oLanguage": {
    				            	  "sEmptyTable": "No objects in result",
    				            	  "sSearch": "Search: "
    				              },
    				              'fnDrawCallback': events
    		};
    		table.dataTable(tableSettings);
    		function events() {
    			$('.show-places_'+self.pref).unbind('click');
    			$('.show-places_'+self.pref).click(function() {
    				var domainRef = $(this).data('dom');
    				var genomeRef = $(this).data('gnm');
    				var featureId = $(this).data('feat');
    				var start = $(this).data('start');
    				var genomeName = dcsr.genome_statistics[genomeRef].scientific_name;
					var domainName = dcsr.domain_cluster_statistics[domainRef].name;
    				var tabName = "Browser " + genomeName + "+" + domainName + "+" + start;
    				if (tabs.tabContent(tabName)[0]) {
    					tabs.showTab(tabName);
    					return;
    				}
    				var tabContent = $("<div/>");
    				self.buildBrowserTab(dcsr, genomeRef, domainRef, featureId, start, tabContent);
    				tabs.addTab({name: tabName, content: tabContent, active: true, removable: true});
    				tabs.showTab(tabName);
    			})
    		}
        },
        
        buildBrowserTab: function(dcsr, genomeRef, domainRef, featureId, startInFeature, panel) {
        	panel.append($('<span/>').append('<img src="' + this.options.loadingImage + '"/>'));
        	var self = this;
			var domainName = dcsr.domain_cluster_statistics[domainRef].name;
        	var treeRef = this.options.treeWorkspace + '/' + domainName + '.msa.tree';
            var prom = this.wsClient.get_objects([{ref: treeRef}]);
            $.when(prom).done($.proxy(function(objArr) {
        		panel.empty();
        		var treeObj = objArr[0].data;
        		var startLabel = '' + genomeRef + '_' + featureId + '_' + startInFeature;
        		//panel.append(treeObj.tree);
        		var tree = self.cutTree(treeObj.tree, treeObj.default_node_labels, startLabel);
                var canvasId = "knhx-canvas-" + self.pref;
                panel.append('<canvas id="' + canvasId + '">');
                new EasyTree(canvasId, tree, treeObj.default_node_labels, 
                		function(node) {}, function(node) {return null;});
            }, this));
            $.when(prom).fail($.proxy(function(error) { 
        		panel.empty();
            	panel.append($("<div>")
                            .addClass("alert alert-danger")
                            .append("<b>Error:</b>")
                            .append("<br>" + error.error.message));
            }, this));
        },
        
        cutTree: function(treeString, nodeLabels, startLabel) {
        	var self = this;
        	var tree = kn_parse(treeString);
        	console.log(tree);
        	var startNodeName = null;
        	for (var node in nodeLabels) {
        		if (nodeLabels[node] === startLabel) {
        			startNodeName = node;
        			break;
        		}
        	}
        	console.log(startLabel + " -> " + startNodeName);
        	var nodeNameToDist = {};
        	collectDistFromStart(tree.root, startNodeName, nodeNameToDist);
        	//console.log(nodeNameToDist);
        	var nodeNames = [];
        	for (var name in nodeNameToDist)
        		nodeNames.push(name);
        	nodeNames.sort(function(a,b){return nodeNameToDist[a]-nodeNameToDist[b]});
        	var closeNodeNames = {};
        	closeNodeNames[startNodeName] = 1;
        	for (var i = 0; i < 50; i++)
        		closeNodeNames[nodeNames[i]] = 1;
        	console.log(closeNodeNames);
        	var leafs = cutAbsent(tree.root, closeNodeNames);
        	for (var i = tree.node.length - 1; i >= 0; i--) {
        		if (tree.node[i].meta === "del")
        			tree.node.splice(i, 1);
        	}
        	tree.n_tips = leafs;
        	return tree;
        	function collectDistFromStart(node, startName, nameToDist) {
        		var startPos = null;
        		var startDist = null;
        		if (node.child.length > 0) {
        			for (var pos in node.child) {
        				var ch = node.child[pos];
        				var ret = collectDistFromStart(ch, startName, nameToDist);
        				if (ret >= 0) {
        					startPos = pos;
        					startDist = ret;
        					break;
        				}
        			}
        			if (!startPos)
        				return -1;
        			for (var pos in node.child) {
        				if (pos == startPos)
        					continue;
        				var ch = node.child[pos];
        				collectDistFromStartSubTree(startDist, ch, nameToDist);
        			}
        			return startDist + d(node);
        		} else {
        			return node.name === startName ? d(node) : -1;
        		}
        	}
        	
        	function collectDistFromStartSubTree(startDist, node, nodeNameToDist) {
        		startDist += d(node);
        		if (node.child.length > 0) {
        			for (var pos in node.child)
        				collectDistFromStartSubTree(startDist, node.child[pos], nodeNameToDist);
        		} else {
        			nodeNameToDist[node.name] = startDist;
        		}
        	}
        	
        	function d(node) {
        		return node.d;
        	}
        	
        	function cutAbsent(node, nodeNameToDist) {
        		if (node.child.length > 0) {
        			var ret = 0;
        			for (var i = node.child.length - 1; i >= 0; i--) {
        				var leafs = cutAbsent(node.child[i], nodeNameToDist);
        				if (leafs == 0)
        					node.child.splice(i, 1);
        				ret += leafs;
        			}
        			if (ret == 0)
        				node.meta = "del";
        			return ret;
        		} else {
        			if (!nodeNameToDist[node.name]) {
        				node.meta = "del";
        				return 0;
        			}
        			return 1;
        		}
        	}
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