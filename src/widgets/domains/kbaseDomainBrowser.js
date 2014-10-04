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
            treeWorkspace: "KBasePublicGeneDomains",
            maxNumberOfTreeNeighbors: 50,
            rowHeight: 25,
            maxGenomeNameLength: 30
        },

        pref: null,
        wsClient: null,

        init: function(options) {
            this._super(options);
            this.pref = this.uuid();
            if (!this.authToken()) {
                this.renderError("You're not logged in!");
            } else {
            	if (this.options.workspaceID === '*')
            		this.options.workspaceID = "KBasePublicGeneDomains";
            	if (this.options.dcsrID == "*")
            		this.options.dcsrID = "CogAndPfam.dcsr";
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
        						domainPlaces.push({genome: genomeName, domain: ahref+domainName+'</a>', 
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
        		var dc = objArr[0].data;
        		var domainPlaces = [];
        		for (var genomeRef in dc.data) {
    				var genomeName = dcsr.genome_statistics[genomeRef].scientific_name;
        			var elems = dc.data[genomeRef];
        			for (var elemPos in elems) {
        				var elem = elems[elemPos];
        				var featureId = elem[1];
        				var places = elem[3];
        				for (var dpPos in places) {
        					var dp = places[dpPos];
        					var start = dp[0];
        					var stop = dp[1];
        					var evalue = dp[2];
        					var bitscore = dp[3];
        					var coverage = dp[4];
        					var ahref = '<a class="show-places_'+self.pref+'" data-gnm="'+genomeRef+'" '+
        						'data-dom="'+domainRef+'" data-feat="'+featureId+'" data-start="'+start+'">';
        					domainPlaces.push({genome: ahref+genomeName+'</a>', domain: domainName, 
        						feature: featureId, start: start, stop: stop, evalue: evalue, bitscore: bitscore, 
        						coverage: coverage});
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
    				var tabName = "Browser " + domainName + " (" + genomeName + ", " + featureId + ":" + start + ")";
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
        		//console.log("startLabel=" + startLabel);
            	var startNodeId = null;
            	for (var nodeId in treeObj.default_node_labels) {
            		//console.log("label=" + treeObj.default_node_labels[nodeId]);
            		if (treeObj.default_node_labels[nodeId] === startLabel) {
            			startNodeId = nodeId;
                    	//console.log("startNodeId=" + startNodeId);
            			break;
            		}
            	}
            	//console.log("startNodeId=" + startNodeId);
        		var tree = self.cutTree(treeObj.tree, startNodeId, self.options.maxNumberOfTreeNeighbors);
        		var fullNodeLabels = {};
        		//var included = [];
        		for (var nodeId in treeObj.default_node_labels) {
        			var label = treeObj.default_node_labels[nodeId];
        			var us1 = label.indexOf('_');
        			var us2 = label.lastIndexOf('_');
        			var genome = label.substring(0, us1);
        			var feature = label.substring(us1 + 1, us2);
        			var start = parseInt(label.substring(us2 + 1));
        			var genomeName = dcsr.genome_statistics[genome].scientific_name;
        			var gnl = genomeName.length;
        			var hnl = Math.floor(self.options.maxGenomeNameLength / 2);
        			if (gnl > hnl * 2)
        				genomeName = genomeName.substring(0, hnl) + "..." + genomeName.substring(gnl - hnl, gnl);
        			fullNodeLabels[nodeId] = genomeName + ", " + feature + ", " + start;
        			//included.push("data/\"" + genome + "\"");
        		}
            	//var dcRef = dcsr.domain_cluster_refs[domainRef];
                //var prom2 = this.wsClient.get_object_subset([{ref: dcRef, included: included}]);
                //$.when(prom2).done($.proxy(function(objArr) {
            	//	var dc = objArr[0].data;
            	//	var genomeRefAndFId2contigAndFInd = {};
            	//	for (var genomeRef in dc.data) {
        		//		var genomeName = dcsr.genome_statistics[genomeRef].scientific_name;
            	//		var elems = dc.data[genomeRef];
            	//		for (var elemPos in elems) {
            	//			var elem = elems[elemPos];
            	//			var contigId = elem[0];
            	//			var featureId = elem[1];
            	//			var featureIndex = elem[2];
            	//			genomeRefAndFId2contigAndFInd[genomeRef + "_" + featureId] = [contigId, featureIndex];
            	//		}
            	//	}
        		var table = $('<table style="margin: 0px; padding: 0px;"/>');
        		panel.append(table);
        		var tr = $('<tr style="margin: 0px; padding: 0px;"/>');
        		table.append(tr);
        		var leftTd = $('<td style="margin: 0px; padding: 0px;"/>');
        		tr.append(leftTd);
        		var rightTd = $('<td style="margin: 0px; padding: 0px;"/>');
        		tr.append(rightTd);
        		var canvasId = "knhx-canvas-" + self.uuid();
        		leftTd.append('<canvas id="' + canvasId + '">');
        		new EasyTree(canvasId, tree, fullNodeLabels, function(node) {}, function(node) {
        			if (node.id && node.id === startNodeId)
        				return "#0000ff";
        			return null;
        		}, {width: 500, yskip: self.options.rowHeight - 0.3, mode_switcher: false, 
        			collapsible: false, ymargin: 5});
        		var rows = [];
        		for (var i in tree.node) {
        			var node = tree.node[i];
        			if (node.child.length == 0) {
        				var nodeId = node.id;
        				var label = treeObj.default_node_labels[nodeId];
        				var us1 = label.indexOf('_');
        				var us2 = label.lastIndexOf('_');
        				var genome = label.substring(0, us1);
        				var feature = label.substring(us1 + 1, us2);
        				var start = parseInt(label.substring(us2 + 1));
        				rows.push({id: nodeId, y: node.y, genome: genome, feature: feature, start: start});
        			}
        		}
        		rows.sort(function(a,b){return a.y-b.y});
        		var geneTable = $('<table style="margin: 0px; padding: 0px;"/>');
        		rightTd.append(geneTable);
        		var h = self.options.rowHeight;
        		var idToColor = {};
        		for (var rowPos in rows) {
        			var geneTr = $('<tr style="margin: 0px; padding: 0px;"/>');
        			geneTable.append(geneTr);
        			var geneTd = $('<td style="margin: 0px; padding: 0px; height: '+h+'px; min-height: '+h+'px; max-height:'+h+'px;"/>');
        			geneTr.append(geneTd);
        			geneTd.append('loading...');
        			rows[rowPos].panel = geneTd;
        			//self.loadGenes(dcsr, rows, rowPos, idToColor);
        		}
        		var groupMap = {};
        		for (var rowPos in rows) {
        			var row = rows[rowPos];
        			var gnmRef = row.genome;
        			var group = groupMap[gnmRef];
        			if (!group) {
        				group = [];
        				groupMap[gnmRef] = group
        			}
        			group.push(row);
        		}
        		var groupLists = [[],[],[],[],[]];
        		var listPos = 0;
        		for (var key in groupMap) {
        			var groups = groupLists[listPos];
        			groups.push(groupMap[key]);
        			listPos = (listPos + 1) % groupLists.length;
        		}
        		for (var listPos in groupLists) {
        			var groups = groupLists[listPos];
        			self.loadGenes(dcsr, groups, 0, idToColor, null);
        		}
                //}, this));
                //$.when(prom2).fail($.proxy(function(error) { 
            	//	panel.empty();
                //	panel.append($("<div>")
                //                .addClass("alert alert-danger")
                //                .append("<b>Error:</b>")
                //                .append("<br>" + error.error.message));
                //}, this));
            }, this));
            $.when(prom).fail($.proxy(function(error) { 
        		panel.empty();
            	panel.append($("<div>")
                            .addClass("alert alert-danger")
                            .append("<b>Error:</b>")
                            .append("<br>" + error.error.message));
            }, this));
        },
        
        cutTree: function(treeString, startNodeName, numberOfNeighbors) {
        	var self = this;
        	//console.log("treeString=" + treeString);
        	//console.log("startNodeName=" + startNodeName);
        	var tree = kn_parse(treeString);
        	var nodeNameToDist = {};
        	collectDistFromStart(tree.root, startNodeName, nodeNameToDist);
        	var nodeNames = [];
        	for (var name in nodeNameToDist)
        		nodeNames.push(name);
        	nodeNames.sort(function(a,b){return nodeNameToDist[a]-nodeNameToDist[b]});
        	var closeNodeNames = {};
        	closeNodeNames[startNodeName] = 1;
        	for (var i = 0; i < Math.min(numberOfNeighbors, nodeNames.length); i++)
        		closeNodeNames[nodeNames[i]] = 1;
        	var leafs = cutAbsent(tree.root, closeNodeNames);
        	for (var i = tree.node.length - 1; i >= 0; i--) {
        		if (tree.node[i].meta === "del")
        			tree.node.splice(i, 1);
        	}
        	tree.n_tips = leafs;
        	//console.log(tree);
        	//rotateToStart(tree.root, startNodeName);
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
        		return Math.max(0, node.d);
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
        			if (ret == 0) {
        				node.meta = "del";
        			} else if (node.child.length == 1) {
        				var child = node.child[0].child;
        				var d = node.child[0].d;
        				var name = node.child[0].name;
        				var x = node.child[0].name;
        				var y = node.child[0].name;
        				node.child[0].meta = "del";
        				node.child = child;
        				if (node.d > -1) {
        					node.d += d;
        					node.name = name;
        					node.x = x;
        					node.y = y;
        				}
            			for (var i in node.child)
            				node.child[i].parent = node;
        			}
        			return ret;
        		} else {
        			if (!nodeNameToDist[node.name]) {
        				node.meta = "del";
        				return 0;
        			}
        			return 1;
        		}
        	}
        	
        	/*function rotateToStart(node, startName) {
        		if (node.child.length > 0) {
        			var startPos = null;
        			for (var pos in node.child) {
        				var ch = node.child[pos];
        				if (rotateToStart(ch, startName))
        					startPos = pos;
        			}
        			if (startPos != null && startPos > 0) {
            			console.log(startPos + ", *");
        				var ch = node.child[0];
        				node.child[0] = node.child[startPos];
        				node.child[startPos] = ch;
        			}
        			var ret = startPos != null;
        			console.log(startPos + ", " + ret);
        			return ret;
        		} else {
        			console.log(node.name + " <> " + startName)
        			return node.name === startName;
        		}
        	}*/
        },

        loadGenes: function(dcsr, groups, groupPos, idToColor, genomeRefAndFId2contigAndFInd) {
        	var self = this;
        	//console.log("In loadGenes: groupPos=" + groupPos);
        	if (groupPos >= groups.length)
        		return;
            function err(error) {
        		panel.empty();
            	panel.append("<b>Error:</b> " + error.error.message);
            	self.loadGenes(dcsr, groups, groupPos, idToColor, genomeRefAndFId2contigAndFInd);
            }
        	var rows = groups[groupPos];
        	groupPos++;
        	//console.log(rows);
        	var included1 = [];
        	var genomeRef = null;
        	var annRef = null;
        	for (var rowPos in rows) {
        		var row = rows[rowPos];
        		var featureId = row.feature;
        		included1.push("feature_to_contig_and_index/" + featureId);
        		if (!annRef) {
            		genomeRef = row.genome;
            		annRef = dcsr.annotation_refs[genomeRef];
        		}
        	}
            var prom = this.wsClient.get_object_subset([{ref: annRef, included: included1}]);
            $.when(prom).done($.proxy(function(objArr) {
            	var included2 = [];
            	for (var rowPos in rows) {
            		var row = rows[rowPos];
            		var featureId = row.feature;
            		var contigIdAndFeatIndex = objArr[0].data.feature_to_contig_and_index[featureId];
            		var contigId = contigIdAndFeatIndex[0];
            		var featureIndex = contigIdAndFeatIndex[1];
            		//var contigIdAndFeatIndex2 = genomeRefAndFId2contigAndFInd[genomeRef + "_" + featureId];
            		//var contigId2 = contigIdAndFeatIndex2[0];
            		//var featureIndex2 = contigIdAndFeatIndex2[1];
            		//console.log("contigId=" + contigId + ", contigId2=" + contigId2 + ", "+
            		//		"featureIndex=" + featureIndex + ", featureIndex2=" + featureIndex2);
            		row.contig = contigId;
            		row.fIndex = featureIndex;
            		included2.push("contig_to_size_and_feature_count/" + contigId);
            	}
                var prom2 = self.wsClient.get_object_subset([{ref: annRef, included: included2}]);
                $.when(prom2).done($.proxy(function(objArr) {
                	var ctg2ind2rows = {};
                	for (var rowPos in rows) {
                		var row = rows[rowPos];
                		var contigId = row.contig;
                		var ind2rows = ctg2ind2rows[contigId];
                		if (!ind2rows) {
                			ind2rows = {};
                			ctg2ind2rows[contigId] = ind2rows;
                		}
                		var contigLenAndFeatCount = objArr[0].data.contig_to_size_and_feature_count[contigId];
                		var contigLen = contigLenAndFeatCount[0];
                		var featureCount = contigLenAndFeatCount[1];
                		var featureIndex = row.fIndex;
                		var featureMinIndex = Math.max(0, featureIndex - 10);
                		var featureMaxIndex = Math.min(featureIndex + 10, featureCount - 1);
                    	for (var i = featureMinIndex; i <= featureMaxIndex; i++) {
                    		var rowsForIndex = ind2rows[i];
                    		if (!rowsForIndex) {
                    			rowsForIndex = [];
                    			ind2rows[i] = rowsForIndex;
                    		}
                    		rowsForIndex.push(row);
                    	}
                	}
                	var included3 = [];
                	var ctg2listOfIndAndRows = {};
                	for (var contigId in ctg2ind2rows) {
                		var ind2rows = ctg2ind2rows[contigId];
                		var listOfIndAndRows = [];
                		for (var i in ind2rows) 
                			listOfIndAndRows.push({index: i, rows: ind2rows[i]});
                		listOfIndAndRows.sort(function(a,b){ return a.index-b.index; });
                		ctg2listOfIndAndRows[contigId] = listOfIndAndRows;
                		for (var entryPos in listOfIndAndRows) 
                			included3.push("data/" + contigId + "/" + listOfIndAndRows[entryPos].index);
                	}
                    var prom3 = self.wsClient.get_object_subset([{ref: annRef, included: included3}]);
                    $.when(prom3).done($.proxy(function(objArr) {
                    	self.loadGenes(dcsr, groups, groupPos, idToColor, genomeRefAndFId2contigAndFInd);
                    	for (var contigId in objArr[0].data.data) {
                    		var elems = objArr[0].data.data[contigId];
                        	var listOfIndAndRows = ctg2listOfIndAndRows[contigId];
                        	//console.log("contigId=" + contigId + ", elems=" + elems.length + ", listOfIndAndRows=" + listOfIndAndRows.length);
                    		for (var elemPos in elems) {
                    			var elem = elems[elemPos];
                    			for (var rowPos in listOfIndAndRows[elemPos].rows) {
                    				var row = listOfIndAndRows[elemPos].rows[rowPos];
                    				if (!row.elems)
                    					row.elems = [];
                    				row.elems.push(elem);
                    			}
                        	}
                    	}
                    	for (var rowPos in rows) {
                    		var row = rows[rowPos];
                    		var panel = row.panel;
                    		var featureId = row.feature;
                    		var items = [];
                    		var minPos = null;
                    		var maxPos = null;
                    		for (var elemPos in row.elems) {
                    			var elem = row.elems[elemPos];
                    			var fId = elem[0];
                    			var fStart = elem[1];
                    			var fStop = elem[2];
                    			var fDir = elem[3];
                    			var domToPlace = elem[4];
                    			for (var domRef in domToPlace) {
                    				if (!dcsr.domain_cluster_statistics[domRef])
                    					continue;
                    				var domName = dcsr.domain_cluster_statistics[domRef].name;
                    				var places = domToPlace[domRef];
                    				for (var placePos in places) {
                    					var place = places[placePos];
                    					var startInF = place[0];
                    					var stopInF = place[1];
                    					if (fStart + 3 * stopInF > fStop)
                    						fStop = fStart + 3 * stopInF;
                    				}
                    			}
                    			if (fStop < fStart + 100)
                    				fStop = fStart + 100;
                    			var domText = "";
                    			var dItems = [];
                    			for (var domRef in domToPlace) {
                    				if (!dcsr.domain_cluster_statistics[domRef])
                    					continue;
                    				var domName = dcsr.domain_cluster_statistics[domRef].name;
                    				if (domName.indexOf('.domain') > 0)
                    					domName = domName.substring(0, domName.indexOf('.domain'));
                    				var places = domToPlace[domRef];
                    				for (var placePos in places) {
                    					var place = places[placePos];
                    					var startInF = place[0];
                    					var stopInF = place[1];
                    					var evalue = place[2];
                    					var bitscore = place[3];
                    					var coverage = place[4];
                    					domText += domName + ":" + place + "; ";
                    					var domDescr = domName + ": [" + startInF + ".." + stopInF + "], e-value=" + 
                    					evalue + ", bit-score=" + bitscore + ", domain-coverage=" + coverage;
                    					var dStart = fDir > 0 ? (fStart + 3 * startInF) : (fStop - 3 * stopInF);
                    					var dStop = fDir > 0 ? (fStart + 3 * stopInF) : (fStop - 3 * startInF);
                    					var color = self.getColorForId(idToColor, domName);
                    					dItems.push({id: fId + "-" + domName, descr: domDescr, 
                    						start: dStart, stop: dStop, dir: fDir, color: color, h: 8});
                    				}
                    			}
                    			dItems.sort(function(a,b){ return a.stop-a.start-(b.stop-b.start)});
                    			var descr = fId + ": [" + fStart + ".." + fStop + "]" + (fDir > 0 ? "+" : "-") + ", [" + domText + "]";
                    			items.push({id: fId, descr: descr, start: fStart, stop: fStop, dir: fDir, color: '#dddddd', h: 16});
                    			for (var dItem in dItems)
                    				items.push(dItems[dItem]);
                    			if (fId === featureId) {
                    				minPos = fStart - 5000;
                    				maxPos = fStop + 5000;
                    			}
                    		}
                    		panel.empty();
                    		self.prepareSvg(minPos, maxPos, items, panel, 500, 20);
                    	}
                    }, this));
                    $.when(prom3).fail($.proxy(function(error) {err(error);}, this));            	
                }, this));
                $.when(prom2).fail($.proxy(function(error) {err(error);}, this));            	
            }, this));
            $.when(prom).fail($.proxy(function(error) {err(error);}, this));
        },

        prepareSvg: function(minPos, maxPos, items, panel, pw, ph) {
        	var posLen = maxPos - minPos;
            var tooltip = d3.select("body")
            	.append("div")
            	.classed("kbcb-tooltip", true);
        	var svg = d3.select(panel[0]).append("svg")
        		.attr("width", pw)
        		.attr("height", ph)
        		.classed("kbcb-widget", true);
            var trackContainer = svg.append("g");
            var pathRight = function(left, top, height, width) {
                var path = "M" + left + " " + top;
                if (width > 10) {
                    path += " L" + (left+(width-10)) + " " + top +
                            " L" + (left+width) + " " + (top+height/2) +
                            " L" + (left+(width-10)) + " " + (top+height) +
                            " L" + left + " " + (top+height) + " Z";
                } else {
                    path += " L" + (left+width) + " " + (top+height/2) +
                            " L" + left + " " + (top+height) + " Z";
                }
                return path;
            };
            var pathLeft = function(left, top, height, width) {
                var path = "M" + (left+width) + " " + top;
                if (width > 10) {
                    path += " L" + (left+10) + " " + top +
                            " L" + left + " " + (top+height/2) +
                            " L" + (left+10) + " " + (top+height) +
                            " L" + (left+width) + " " + (top+height) + " Z";
                } else {
                    path += " L" + left + " " + (top+height/2) +
                            " L" + (left+width) + " " + (top+height) + " Z";
                }
                return path;
            };
            var itemPath = function(d) {
            	var left = Math.floor(pw * (d.start - minPos) / posLen);
            	var width = Math.floor(pw * (d.stop - d.start) / posLen);
            	var height = Math.floor(d.h);
            	var top = Math.floor((ph - height) / 2);
            	var ret = d.dir > 0 ? pathRight(left, top, height, width) :
            		pathLeft(left, top, height, width);
            	//console.log(ret);
            	return ret;
            };
            var trackSet = trackContainer.selectAll("path")
            	.data(items, function(d) { return d.id; });
            trackSet.enter()
            	.append("path")
            	.attr("id", function(d) { return d.id; })
            	.attr("d", function(d) { return itemPath(d); })
            	.style("fill", function(d) { return d.color; })
            	.style("stroke", "black")
            	.on("mouseover", function(d) { 
            		d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker()); 
            		tooltip = tooltip.text(d.descr);
            		return tooltip.style("visibility", "visible"); 
            	})
            	.on("mouseout", function() { 
            		d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter()); 
            		return tooltip.style("visibility", "hidden"); 
            	})
            	.on("mousemove", function() { 
            		return tooltip.style("top", (d3.event.pageY+15) + "px").style("left", (d3.event.pageX-10)+"px");
            	})
            	.on("click", function(d) { 
            	});
            trackSet.exit().remove();
        },

        getColorForId: function(idToColor, id) {
        	var ret = idToColor[id];
        	if (!ret) {
        		var hash = 0;
        	    for (var i = 0; i < id.length; i++)
        	       hash = id.charCodeAt(i) + ((hash << 5) - hash);
        	    var code = Math.abs(hash + Math.floor(Math.random() * 1000)) % 1000;
        		ret = this.rainbow(1000, code);
        	    //console.log(id + " -> " + hash + " -> " + code + " -> " + ret);
        		idToColor[id] = ret;
        	}
        	return ret;
        },

        rainbow: function(numOfSteps, step) {
            // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal 
        	// for creating easily distinguishable vibrant markers in Google Maps and other apps.
            // Adam Cole, 2011-Sept-14
            // HSV to RBG adapted from: 
        	// http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
            var r, g, b;
            var h = step / numOfSteps;
            var i = ~~(h * 6);
            var f = h * 6 - i;
            var q = 1 - f;
            switch(i % 6){
                case 0: r = 1, g = f, b = 0; break;
                case 1: r = q, g = 1, b = 0; break;
                case 2: r = 0, g = 1, b = f; break;
                case 3: r = 0, g = q, b = 1; break;
                case 4: r = f, g = 0, b = 1; break;
                case 5: r = 1, g = 0, b = q; break;
            }
            var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + 
            	("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
            return (c);
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
                type: 'DomainBrowser',
                id: this.options.taxID,
                workspace: this.options.workspaceID,
                title: 'Domain Browser'
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