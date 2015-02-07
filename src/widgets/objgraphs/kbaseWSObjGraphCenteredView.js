(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSObjGraphCenteredView",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        //wsUrl: "http://dev04.berkeley.kbase.us:7058",
        wsUrl:"https://kbase.us/services/ws",
        ws:null, // the ws client
	
        options: {
            wsNameOrId: null,
            objNameOrId: null,
            kbCache:{},
            width:1200,
	    height:700
        },

        wsNameOrId:"",
	objNameOrId:"",
	wsId:null,
	
	//should be a struct with fields of type name, values are type info.  type info has 'info', 'refs'
	//'prov'
	objData: {},
	
	// maps ws REF to graph node id
	objRefToNodeIdx: null,
	
        // the actual graph data
	graph: null,
	
        init: function(options) {
            this._super(options);
            var self = this;
	    // show loading message
	    self.$elem.append("<center><b><i>Mouse over objects to get more info (shown below the graph). Double click on an object to select and recenter the graph on that object. </i></b></center><br>");
            self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>building object reference graph...</center></p></div>');
	    
	    // load the basic things from the cache and options
            if (self.options.kbCache.ws_url) { self.wsUrl = self.options.kbCache.ws_url; }
            if (self.options.kbCache.token) { self.ws = new Workspace(self.wsUrl, {token: self.options.kbCache.token}); }
            else { self.ws = new Workspace(self.wsUrl); }
            self.wsNameOrId = options.wsNameOrId;

	    self.$elem.append('<div id="objgraphview" style="overflow:auto;height:450px;resize:vertical">');
	    
	    // do the stuff
	    self.needColorKey = true; // so that the key renders
	    self.buildDataAndRender(self.getObjectIdentity(options.wsNameOrId,options.objNameOrId));
	    
	    return this;
	},
	
	
	typeToColor: {
	    "selected":"#FFFF33",
	    "core":"#FFDE88",
	    "ref":"#D43F3F",
	    "included":"#00ACE9",
	    "none":'FFFFFF'
	    //"prov": "#50d07d"
	    //"KBaseNarratives.Narrative":"#50d07d"
	},
	
	typeToName: {
	    "selected": " Latest version of the data object",
	    "core":" Previous versions of the data object",
	    "ref":" Data that references the selected object",
	    "included":" Data that is referenced by the selected object",
	    //"prov":"Data that is in the provenance of the selected object"
	},
	
	needColorKey:false,
	/*
	    #00ACE9
	    #D43F3F
	    #6A9A1F
	    #F6F6E8
	    #404040
	*/
	addNodeColorKey: function() {
	    var self = this;
	    if(self.needColorKey) {
		// probably a better jquery way to do this, but this is what I know...
		var html = '<br>' +
			    '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td valign=\"top\"><table cellpadding="2" cellspacing="0" border="0" id="graphkey" \
				style="">'
		for(var t in self.typeToName) {
		    html += "<tr><td><svg width=\"40\" height=\"20\"><rect x=\"0\" y=\"0\" width=\"40\" height=\"20\" fill=\""+self.typeToColor[t] +"\" \
		    stroke=\""+ d3.rgb(self.typeToColor[t]).darker(2) +"\" /></svg></td><td valign=\"middle\"><b> \
		    "+self.typeToName[t]+"</b></td></tr>";
		}
		html += "</table></td><td><div id=\"objdetailsdiv\"></div></td></tr></table>";
		self.$elem.append(html);
		self.needColorKey=false;
	    }
	},
	
	renderSankeyStyleGraph: function() {
	    var self = this;
	    if (self.graph.links.length==0) {
		// in order to render, we need at least two nodes
		self.graph['nodes'].push({
						node : 1,
						name : "No references found",
						info : [-1,"No references found","No Type",0,0,"N/A",0,"N/A",0,0,{}],
						nodeType : "none",
						objId : "-1",
						isFake : true
					    });
		self.objRefToNodeIdx["-1"] = 1;
		self.graph.links.push({target:0, source:1, value:1});
	    }
		var margin = {top: 10, right: 10, bottom: 10, left: 10};
		var width = self.options.width - 50 - margin.left - margin.right;
		var height = self.graph.nodes.length*35 - margin.top - margin.bottom;
		var color = d3.scale.category20();
		if (height<450) {
		    self.$elem.find("#objgraphview").height(height+40);
		}
		/*var zoom = d3.behavior.zoom()
		    .translate([0, 0])
		    .scale(1)
		    .scaleExtent([1, 8])
		    .on("zoom", function() {
			features.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			//features.select(".state-border").style("stroke-width", 1.5 / d3.event.scale + "px");
			//features.select(".county-border").style("stroke-width", .5 / d3.event.scale + "px");
		    });
		    */
		// append the svg canvas to the page
		d3.select(self.$elem.find("#objgraphview")[0]).html("");
		self.$elem.find('#objgraphview').show();
		var svg = d3.select(self.$elem.find("#objgraphview")[0]).append("svg");
		/*svg.append("rect")
		    .attr("class", "overlay")
		    .attr("width",width + margin.left + margin.right)
		    .attr("height",300)
		    .call(zoom);*/
		svg    
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", 
			  "translate(" + margin.left + "," + margin.top + ")");
		    
		// Set the sankey diagram properties
		var sankey = d3.sankey()
		    .nodeWidth(20)
		    .nodePadding(40)
		    .size([width, height]);
		    
		var path = sankey.link();
		sankey
		    .nodes(self.graph.nodes)
		    .links(self.graph.links)
		    .layout(40);
	
		// add in the links
		var link = svg.append("g").selectAll(".link")
		    .data(self.graph.links)
		    .enter().append("path")
			.attr("class", "sankeylink")
			.attr("d", path)
			.style("stroke-width", function(d) { return 10; /*Math.max(1, d.dy);*/ })
			.sort(function(a, b) { return b.dy - a.dy; });
	
		// add the link titles
		link.append("title")
		    .text(function(d) {
			return d.text;
		    });
	
		// add in the nodes
		var node = svg.append("g")
		  .selectAll(".node")
		    .data(self.graph.nodes)
		  .enter().append("g")
		    .attr("class", "sankeynode")
		    .attr("transform", function(d) { 
			return "translate(" + d.x + "," + d.y + ")"; })
		  .call(d3.behavior.drag()
		    .origin(function(d) { return d; })
		    .on("dragstart", function() { 
			this.parentNode.appendChild(this); })
		    .on("drag",
			function (d) {
				d3.select(this).attr("transform", 
				    "translate(" + (
					//d.x = d.x //Math.max(0, Math.min(width - d.dx, d3.event.x))
					d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
				    )
				    + "," + (
					d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
				    ) + ")");
				sankey.relayout();
				link.attr("d", path);
		    }))
		    .on('dblclick', function (d) {
			if (d3.event.defaultPrevented) return;
			// TODO: toggle switch between redirect vs redraw
			
			// alternate redraw
			//self.$elem.find('#objgraphview').hide();
			//self.buildDataAndRender({ref:d['objId']});
			
			//alternate reload page so we can go forward and back
			if (d['isFake']) {
			    alert("Cannot expand this node.");
			} else {
			    if(d['info'][1].indexOf(' ') >= 0) {
				window.location.href = "#/objgraphview/"+encodeURI(d['info'][7]+"/"+d['info'][0]);
			    } else {
				window.location.href = "#/objgraphview/"+encodeURI(d['info'][7]+"/"+d['info'][1]);
			    }
			}
		    })
		    .on('mouseover', function(d) {
			
			if (d['isFake']) {
			    var info = d['info'];
			    var savedate = new Date(info[3]);
			    var text = '<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>';
			    text += '<h4>Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">';
			    text+= '<tr><td><b>Name</b></td><td>'+info[1]+ "</td></tr>";
			    text += "</td></tr></table></td><td>";
			    text+= '<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">'
			    text+= '<tr><td><b>N/A</b></td></tr>';
			    text+='</table>';
			    text+= "</td></tr></table>";
			    self.$elem.find('#objdetailsdiv').html(text);
			} else {
			    self.ws.get_object_provenance(
			    //self.ws.get_objects(
				[{ref:d['objId']}],
				// should refactor this so there is not all this copy paste...
				function(objdata) {
					var info = d['info'];
					var savedate = new Date(info[3]);
					var text = '<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>';
					text += '<h4>Data Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">';
					text+= '<tr><td><b>Name</b></td><td>'+ info[1]+ ' (<a href="#/dataview/'+info[6]+"/"+info[1]+"/"+info[4] +'" target="_blank">'+info[6]+"/"+info[0]+"/"+info[4]+"</a>)</td></tr>";
					text+= '<tr><td><b>Type</b></td><td><a href="#/spec/type/'+info[2]+'">'+info[2]+'</a></td></tr>';
					text+= '<tr><td><b>Saved on</b></td><td>'+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()+"</td></tr>";
					text+= '<tr><td><b>Saved by</b></td><td><a href="#/people/'+info[5] +'" target="_blank">'+info[5]+"</td></tr>";
					var found = false; var metadata = '<tr><td><b>Meta data</b></td><td><div style="width:250px;word-wrap: break-word;">';
					for( var m in info[10]) {
					    found = true;
					    metadata += "<b>"+m+"</b> : "+info[10][m]+"<br>"
					}
					if (found) { text += metadata +"</div></td></tr>"; }
					text += "</div></td></tr></table></td><td>";
					text+= '<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">'
					if (objdata.length>0) {
					    if (objdata[0]['provenance'].length>0) {
						var prefix = ""; 
						for(var k=0; k<objdata[0]['provenance'].length; k++) {
						    if (objdata[0]['provenance'].length > 1) {
							prefix = "Action "+k+": ";
						    }
						    text+=self.getProvRows(objdata[0]['provenance'][k],prefix);
						}
					    } else {
						text+= '<tr><td><b><span style="color:red">No provenance data set.</span></b></td></tr>';
					    }
					} else {
					    text+= '<tr><td><b><span style="color:red">No provenance data set.</span></b></td></tr>';
					}
					text+='</table>';
					text+= "</td></tr></table>";
					self.$elem.find('#objdetailsdiv').html(text);
				    
				}, function(err) {
					var info = d['info']; 
					var savedate = new Date(info[3]);
					var text = '<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>';
					text += '<h4>Data Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">';
					text+= '<tr><td><b>Name</b></td><td>'+ info[1]+ '(<a href="#/dataview/'+info[6]+"/"+info[1]+"/"+info[4] +'" target="_blank">'+info[6]+"/"+info[0]+"/"+info[4]+"</a>)</td></tr>";
					text+= '<tr><td><b>Type</b></td><td><a href="#/spec/type/'+info[2]+'">'+info[2]+'</a></td></tr>';
					text+= '<tr><td><b>Saved on</b></td><td>'+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()+"</td></tr>";
					text+= '<tr><td><b>Saved by</b></td><td><a href="#/people/'+info[5] +'" target="_blank">'+info[5]+"</td></tr>";
					var found = false; var metadata = '<tr><td><b>Meta data</b></td><td><div style="width:250px;word-wrap: break-word;">';
					for( var m in info[10]) {
					    found = true;
					    metadata += "<b>"+m+"</b> : "+info[10][m]+"<br>"
					}
					if (found) { text += metadata +"</div></td></tr>"; }
					text += "</div></td></tr></table></td><td>";
					text+= '<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">'
					text+= "error in fetching provenance";
					text+='</table>';
					text+= "</td></tr></table>";
					self.$elem.find('#objdetailsdiv').html(text);
					console.error(err);
				});
			}
		    });
    
	
		// add the rectangles for the nodes
		node.append("rect")
		    .attr("height", function(d) { return Math.max(10,d.dy); })
		    .attr("width", sankey.nodeWidth())
		    .style("fill", function(d) {
			  return d.color = self.typeToColor[d['nodeType']];
		    })
		    .style("stroke", function(d) {
			return d3.rgb(d.color).darker(2); })
		    .append("title")
			.text(function(d) {
			      //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
			      var info = d['info'];
			      var savedate = new Date(info[3]);
			      var text =
				      info[1]+ " ("+info[6]+"/"+info[0]+"/"+info[4]+")\n"+
				      "--------------\n"+
				      "  type:  "+info[2]+"\n"+
				      "  saved on:  "+self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear()+"\n"+
				      "  saved by:  "+info[5]+"\n";
			      var found = false; var metadata = "  metadata:\n";
			      for( var m in info[10]) {
				  text += "     "+m+" : "+info[10][m]+"\n"
				  found = true;
			      }
			      if (found) {
				  text += metadata;
			      }
			      return text;
			});
	
		// add in the title for the nodes
		node.append("text")
		    .attr("y", function(d) { return d.dy / 2; })
		    .attr("dy", ".35em")
		    .attr("text-anchor", "end")
		    .attr("transform", null)
		    .text(function(d) { return d.name; })
		    .filter(function(d) { return d.x < width / 2; })
		    .attr("x", 6 + sankey.nodeWidth())
		    .attr("text-anchor", "start")
		    
	   // } else {
	//	alert("Cannot recenter on the selected object, as it has no links.");
	//	self.$elem.find('#objgraphview').show();
	//    }
            return this;
        },
	
	getProvRows: function(provenanceAction, prefix) {
	    var self = this;
	   /* structure {
		timestamp time;
		string service;
		string service_ver;
		string method;
		list<UnspecifiedObject> method_params;
		string script;
		string script_ver;
		string script_command_line;
		list<obj_ref> input_ws_objects;
		list<obj_ref> resolved_ws_objects;
		list<string> intermediate_incoming;
		list<string> intermediate_outgoing;
		string description;
	    } ProvenanceAction;*/
	    var text = "";
	    if ('description' in provenanceAction) {
		text += self.getTableRow(prefix+"Description",provenanceAction['description']);
	    }
	    if ('service' in provenanceAction) {
		text += self.getTableRow(prefix+"Service Name",provenanceAction['service']);
	    }
	    if ('service_ver' in provenanceAction) {
		text += self.getTableRow(prefix+"Service Version",provenanceAction['service_ver']);
	    }
	    if ('method' in provenanceAction) {
		text += self.getTableRow(prefix+"Method",provenanceAction['method']);
	    }
	    if ('method_params' in provenanceAction) {
		text += self.getTableRow(prefix+"Method Parameters",JSON.stringify(provenanceAction['method_params']));
	    }
	    
	    if ('script' in provenanceAction) {
		text += self.getTableRow(prefix+"Command Name",provenanceAction['script']);
	    }
	    if ('script_ver' in provenanceAction) {
		text += self.getTableRow(prefix+"Script Version",provenanceAction['script_ver']);
	    }
	    if ('script_command_line' in provenanceAction) {
		text += self.getTableRow(prefix+"Command Line Input",provenanceAction['script_command_line']);
	    }
	    
	    if ('intermediate_incoming' in provenanceAction) {
		text += self.getTableRow(prefix+"Action Input",JSON.stringify(provenanceAction['intermediate_incoming']));
	    }
	    if ('intermediate_outgoing' in provenanceAction) {
		text += self.getTableRow(prefix+"Action Output",JSON.stringify(provenanceAction['intermediate_outgoing']));
	    }
	    
	    if ('time' in provenanceAction) {
		var savedate = new Date(provenanceAction['time']);
		text += self.getTableRow(prefix+"Timestamp",self.monthLookup[savedate.getMonth()]+" "+savedate.getDate()+", "+savedate.getFullYear() );
	    }
	    
	    return text;
	},
	
	
	getTableRow: function(rowTitle, rowContent) {
	    var title = null;
	    if (rowContent.length>500) {
		title = rowContent;
		rowContent = rowContent.substr(0,500) +" ...";
	    }
	    if (title) {
		title = title.replace(/"/g, '&quot;');
		return "<tr><td><b>"+rowTitle+'</b></td><td style="width:250px;"><span title="'+title+'" style="width:250px;word-wrap: break-word;">'+rowContent+"</span></td></tr>";
	    }
	    return "<tr><td><b>"+rowTitle+'</b></td><td><div style="width:250px;word-wrap: break-word;">'+rowContent+"</div></td></tr>";
	},
	
	getNodeLabel: function(info) {
	    return info[1] + " (v"+info[4]+")";
	},
	
	tempRefData:null,
	buildDataAndRender: function (objref) {
	    var self = this;
	    // init the graph
	    self.$elem.find('#loading-mssg').show();
	    self.$elem.find('#objgraphview').hide();
	    self.graph = {nodes:[],links:[]}; self.objRefToNodeIdx = {};
	    self.ws.get_object_history(
		objref,
		function (data) {
		    var objIdentities = [];
		    var latestVersion = 0; var latestObjId = "";
		    for(var i = 0; i < data.length; i++) {
			//0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
			var t = data[i][2].split("-")[0];
			var objId = data[i][6] + "/" + data[i][0] + "/" + data[i][4];
			var nodeId = self.graph['nodes'].length;
			self.graph['nodes'].push({
			    node : nodeId,
			    name : self.getNodeLabel(data[i]),
			    info : data[i],
			    nodeType : "core",
			    objId : objId
			});
			if (data[i][4]>latestVersion) {
			    latestVersion = data[i][4];
			    latestObjId = objId;
			}
			self.objRefToNodeIdx[objId] = nodeId;
			objIdentities.push({ref:objId});
		    }
		    if (latestObjId.length>0) {
			self.graph['nodes'][self.objRefToNodeIdx[latestObjId]]['nodeType'] = 'selected';
		    }
		    
		    
		    // we have the history of the object of interest, now we can fetch all referencing object, and get prov info for each of these objects
		    var getDataJobList = [
			self.ws.list_referencing_objects(
			    objIdentities,
			    function(refData) {
				for(var i = 0; i < refData.length; i++) {
				    var limit = 50;
				    for(var k=0; k<refData[i].length; k++) {
					if (k>=limit) {
					    //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
					    var nodeId = self.graph['nodes'].length;
					    var nameStr = refData[i].length-limit + " more ...";
					    self.graph['nodes'].push({
						node : nodeId,
						name : nameStr,
						info : [-1,nameStr,"Multiple Types",0,0,"N/A",0,"N/A",0,0,{}],
						nodeType : "ref",
						objId : "-1",
						isFake : true
					    });
					    self.objRefToNodeIdx[objId] = nodeId;
					    
					    // add the link now too
					    self.graph['links'].push({
						source:self.objRefToNodeIdx[objIdentities[i]['ref']],
						target:nodeId,
						value:1,
					    });
					    break;
					}
					
					var refInfo = refData[i][k];
					//0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
					var t = refInfo[2].split("-")[0];
					var objId = refInfo[6] + "/" + refInfo[0] + "/" + refInfo[4];
					var nodeId = self.graph['nodes'].length;
					self.graph['nodes'].push({
					    node : nodeId,
					    name : self.getNodeLabel(refInfo),
					    info : refInfo,
					    nodeType : "ref",
					    objId : objId
					});
					self.objRefToNodeIdx[objId] = nodeId;
					
					// add the link now too
					self.graph['links'].push({
					    source:self.objRefToNodeIdx[objIdentities[i]['ref']],
					    target:nodeId,
					    value:1,
					});
					
				    }
				}
			    }, function(err) {
				self.$elem.find('#loading-mssg').hide();
				self.$elem.append("<br><b>Error in building object graph!</b><br>");
				self.$elem.append("<i>Error was:</i></b> &nbsp ");
				self.$elem.append(err.error.message+"<br>");
				console.error("Error in building object graph!");
				console.error(err);
			    }
			),
			self.ws.get_object_provenance(
			//self.ws.get_objects(
			    objIdentities,
			    function(objdata) {
				var uniqueRefs = {}; var uniqueRefObjectIdentities = []; var links = [];
				// first get refs from the 
				for(var i=0; i<objdata.length; i++) {
				    for(var r=0; r<objdata[i]['refs'].length; r++) {
					if (!(objdata[i]['refs'][r] in uniqueRefs)) {
					    uniqueRefs[objdata[i]['refs'][r]] = 'included';
					    uniqueRefObjectIdentities.push({ref:objdata[i]['refs'][r]});
					}
					links.push({source:objdata[i]['refs'][r], target:objIdentities[i]['ref'], value:1});
				    }
				    for(var p=0; p<objdata[i]['provenance'].length; p++) {
					if ('resolved_ws_objects' in objdata[i]['provenance'][p]) {
					    for(var pRef = 0; pRef<objdata[i]['provenance'][p].length; pRef++) {
						if (!(objdata[i]['provenance'][p][pRef] in uniqueRefs)) {
						    uniqueRefs[objdata[i]['provenance'][p][pRef]] = 'included'; // TODO switch to prov??
						    uniqueRefObjectIdentities.push({ref:objdata[i]['provenance'][p][pRef]});
						}
						links.push({source:objdata[i]['provenance'][p][pRef], target:objIdentities[i]['provenance'], value:1});
					    }
					}
				    }
				}
				self.tempRefData = {uniqueRefs:uniqueRefs, uniqueRefObjectIdentities:uniqueRefObjectIdentities, links:links};
				
			    }, function(err) {
				self.$elem.find('#loading-mssg').hide();
				self.$elem.append("<br><b>Error in building object graph!</b><br>");
				self.$elem.append("<i>Error was:</i></b> &nbsp ");
				self.$elem.append(err.error.message+"<br>");
				console.error("Error in building object graph!");
				console.error(err);
			    }
			)
		    ];
		    
		    $.when.apply($, getDataJobList).done(function() {
			if ("uniqueRefObjectIdentities" in self.tempRefData) {
			    if (self.tempRefData["uniqueRefObjectIdentities"].length>0) {
				var getRefInfoJobList = [
				    self.ws.get_object_info(self.tempRefData['uniqueRefObjectIdentities'], 1, 
					function(objInfoList) {
					    var objInfoStash = {};
					    for(var i=0; i<objInfoList.length; i++) {
						objInfoStash[objInfoList[i][6]+"/"+objInfoList[i][0]+"/"+objInfoList[i][4]] = objInfoList[i];
					    }
					    // add the nodes
					    var uniqueRefs = self.tempRefData['uniqueRefs'];
					    for(var ref in uniqueRefs) {
						var refInfo = objInfoStash[ref];
						//0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
						var t = refInfo[2].split("-")[0];
						var objId = refInfo[6] + "/" + refInfo[0] + "/" + refInfo[4];
						var nodeId = self.graph['nodes'].length;
						self.graph['nodes'].push({
						    node : nodeId,
						    name : self.getNodeLabel(refInfo),
						    info : refInfo,
						    nodeType : uniqueRefs[ref],
						    objId : objId
						});
						self.objRefToNodeIdx[objId] = nodeId;
					    }
					    // add the link info
					    var links = self.tempRefData['links'];
					    for(var i=0; i<links.length; i++) {
						self.graph['links'].push({
						    source:self.objRefToNodeIdx[links[i]['source']],
						    target:self.objRefToNodeIdx[links[i]['target']],
						    value:links[i]['value']
						});
					    }
					},
					function (err) {
					    // we couldn't get info for some reason, could be if objects are deleted or not visible
					    var uniqueRefs = self.tempRefData['uniqueRefs'];
					    for(var ref in uniqueRefs) {
						var nodeId = self.graph['nodes'].length;
						var refTokens =ref.split("/");
						self.graph['nodes'].push({
						    node : nodeId,
						    name : ref,
						    info : [refTokens[1],"Data not found, object may be deleted",
							    "Unknown", "",refTokens[2], "Unknown", refTokens[0],
							    refTokens[0], "Unknown", "Unknown", {}],
						    nodeType : uniqueRefs[ref],
						    objId : ref
						});
						self.objRefToNodeIdx[ref] = nodeId;
					    }
					    // add the link info
					    var links = self.tempRefData['links'];
					    for(var i=0; i<links.length; i++) {
						self.graph['links'].push({
						    source:self.objRefToNodeIdx[links[i]['source']],
						    target:self.objRefToNodeIdx[links[i]['target']],
						    value:links[i]['value']
						});
					    }
					}
				    )
				];
				$.when.apply($, getRefInfoJobList)
				.done(function() { self.finishUpAndRender(); })
				.fail(function() { self.finishUpAndRender(); });
			    } else {
				self.finishUpAndRender();
			    }
			} else {
			    self.finishUpAndRender();
			}
			
		    });
		    
		    
		    
		},
		function (err) {
		    self.$elem.find('#loading-mssg').hide();
		    self.$elem.append("<br><b>Error in building object graph!</b><br>");
		    self.$elem.append("<i>Error was:</i></b> &nbsp ");
		    self.$elem.append(err.error.message+"<br>");
		    console.error("Error in building object graph!");
		    console.error(err);
		}
	    );
	},
	
	finishUpAndRender: function() {
	    var self = this;
	    self.addVersionEdges();
	    self.renderSankeyStyleGraph();
	    self.addNodeColorKey();
	    self.$elem.find('#loading-mssg').hide();
	},
	
	addVersionEdges: function() {
	    var self = this;
	    //loop over graph nodes, get next version, if it is in our node list, then add it
	    for(var i=0; i<self.graph.nodes.length; i++) {
		//0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
		var expectedNextVersion = self.graph.nodes[i]['info'][4] + 1;
		var expectedNextId = self.graph.nodes[i]['info'][6]+"/"+self.graph.nodes[i]['info'][0]+"/"+expectedNextVersion;
		if(expectedNextId in self.objRefToNodeIdx) {
		    // add the link now too
		    self.graph['links'].push({
			source:self.objRefToNodeIdx[self.graph.nodes[i]['objId']],
			target:self.objRefToNodeIdx[expectedNextId],
			value:1,
		    });
		}
	    }
	},
	
        
        getData: function() {
            return {title:"Data Object Reference Network", workspace:this.wsNameOrId, id:"This view shows the data reference connections to object "+this.options.objNameOrId};
        },
        
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )