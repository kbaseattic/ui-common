(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSObjGraphView",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        //wsUrl: "http://dev04.berkeley.kbase.us:7058",
        wsUrl:"https://kbase.us/services/ws",
        ws:null, // the ws client
	
        options: {
            wsNameOrId: null,
            kbCache:{},
            width:1200,
	    height:700
        },

        wsNameOrId:"",
	wsId:null,
	
	//should be a struct with fields of type name, values are type info.  type info has 'info', 'refs'
	//'prov'
	objData: {},
	
	// maps REF to info, ref, prov
	objDataLookup: {},
	
        
        init: function(options) {
            this._super(options);
            var self = this;
	    // show loading message
	    self.$elem.append("<center><b><i>Mouse over objects to get more info. Double click on an object to select and recenter the graph on that object. </i></b></center><br>");
            self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>building object reference graph...</center></p></div>');
	    
	    // load the basic things from the cache and options
            if (self.options.kbCache.ws_url) { self.wsUrl = self.options.kbCache.ws_url; }
            if (self.options.kbCache.token) { self.ws = new Workspace(self.wsUrl, {token: self.options.kbCache.token}); }
            else { self.ws = new Workspace(self.wsUrl); }
            self.wsNameOrId = options.wsNameOrId;

	    var listObjParams = { showAllVersions: 1, includeMetadata:1 };
            if (/^\d+$/.exec(options.wsNameOrId))
                listObjParams['ids'] = [ options.wsNameOrId ];
            else
                listObjParams['workspaces'] = [ options.wsNameOrId ];
	    
	    var listObjJobs = self.getObjInfoJobs(listObjParams, ["KBaseGenomes.Genome","KBaseFBA.FBAModel", "KBaseFBA.FBA"]);
            $.when.apply($, listObjJobs).done(function() {
		var getProvJobs = self.getProvInfoJobs(self.wsNameOrId);
		$.when.apply($, getProvJobs).done(function() {
		    self.buildGraphData();
		    self.renderSankeyStyleGraph();
		    self.addNodeColorKey();
                    self.$elem.find('#loading-mssg').remove();
		});
	    });
	    
	    self.$elem.append("<div id=\"objgraphview\">");
	    
	    return this;
	},
	
	graph: null,
	
	buildNodeData: function(idx, nodeInfo, ref) {
	    return {node:idx,name:nodeInfo[ref]['name']+" (v"+nodeInfo[ref]['ver']+")", ref:ref};
	},
	
	buildGraphData: function() {
	    var self = this;
	    
	    var genomeNodeInfo = {}; // map ref to edges and other info
	    var modelNodeInfo = {};
	    var fbaNodeInfo = {};
	    
	    //first gather node and edge info
	    var gData = self.objData["KBaseGenomes.Genome"];
	    var mData = self.objData["KBaseFBA.FBAModel"];
	    var fData = self.objData["KBaseFBA.FBA"];
	    for(var objId in gData) {
		for(var ver in gData[objId]) {
		    var prevVer = null;
		    if (ver>=2) { prevVer=ver-1; }
		    genomeNodeInfo[self.wsId + "/" + objId+"/"+ver] = {name:gData[objId][ver]['info'][1], modelrefs:[], ver:ver};
		    if (prevVer) {
			genomeNodeInfo[self.wsId + "/" + objId+"/"+ver]['prevVer']= self.wsId + "/" + objId+"/"+prevVer;
			genomeNodeInfo[self.wsId + "/" + objId+"/"+prevVer]['nextVer']= self.wsId + "/" + objId+"/"+ver;
		    }
		}
	    }
	    
	    for(var objId in mData) {
		for(var ver in mData[objId]) {
		    var prevVer = null;
		    if (ver>=2) { prevVer=ver-1; }
		    modelNodeInfo[self.wsId + "/" + objId+"/"+ver] = {name:mData[objId][ver]['info'][1], genomerefs:[], fbarefs:[], ver:ver};
		    if (prevVer) {
			modelNodeInfo[self.wsId + "/" + objId+"/"+ver]['prevVer']= self.wsId + "/" + objId+"/"+prevVer;
			modelNodeInfo[self.wsId + "/" + objId+"/"+prevVer]['nextVer']= self.wsId + "/" + objId+"/"+ver;
			}
		    for(var i=0; i<mData[objId][ver]['refs'].length; i++) {
			var ref = mData[objId][ver]['refs'][i];
			if (ref in genomeNodeInfo) {
			    genomeNodeInfo[ref]['modelrefs'].push(self.wsId + "/" + objId+"/"+ver);
			    modelNodeInfo[self.wsId + "/" + objId+"/"+ver]['genomerefs'].push(ref);
			}
		    }
		}
	    }
	    
	    for(var objId in fData) {
		for(var ver in fData[objId]) {
		    var prevVer = null;
		    if (ver>=2) { prevVer=ver-1; }
		    fbaNodeInfo[self.wsId + "/" + objId+"/"+ver] = {name:fData[objId][ver]['info'][1], modelrefs:[] , ver:ver };
		    if (prevVer) {
			fbaNodeInfo[self.wsId + "/" + objId+"/"+ver]['prevVer']= self.wsId + "/" + objId+"/"+prevVer;
			fbaNodeInfo[self.wsId + "/" + objId+"/"+prevVer]['nextVer']= self.wsId + "/" + objId+"/"+ver;
		    }
		    for(var i=0; i<fData[objId][ver]['refs'].length; i++) {
			var ref = fData[objId][ver]['refs'][i];
			if (ref in modelNodeInfo) {
			    modelNodeInfo[ref]['fbarefs'].push(self.wsId + "/" + objId+"/"+ver);
			    fbaNodeInfo[self.wsId + "/" + objId+"/"+ver]['modelrefs'].push(ref);
			}
		    }
		}
	    }
	    
	    // package the info into the data object
	    var refToNodeIdx = {};
	    var nodeList = []; var nodeIdx = 0;
	    for (var gRef in genomeNodeInfo) {
		nodeList.push(self.buildNodeData(nodeIdx,genomeNodeInfo,gRef));
		refToNodeIdx[gRef]=Number(nodeIdx);
		nodeIdx++;
	    }
	    for (var mRef in modelNodeInfo) {
		nodeList.push(self.buildNodeData(nodeIdx,modelNodeInfo,mRef));
		refToNodeIdx[mRef]=Number(nodeIdx);
		nodeIdx++;
	    }
	    for (var fRef in fbaNodeInfo) {
		nodeList.push(self.buildNodeData(nodeIdx,fbaNodeInfo,fRef));
		refToNodeIdx[fRef]=Number(nodeIdx);
		nodeIdx++;
	    }
	    
	    var edgeList = [];
	    var defValue = 1;
	    for (var gRef in genomeNodeInfo) {
		if (genomeNodeInfo[gRef]['nextVer']) {
		    edgeList.push({ source:refToNodeIdx[gRef], target:refToNodeIdx[genomeNodeInfo[gRef]['nextVer']], value:defValue,
				  text:"A new version of this Genome was saved."});
		}
		for (var i=0; i<genomeNodeInfo[gRef]['modelrefs'].length; i++) {
		    //var modelData = self.objDataLookup[genomeNodeInfo[gRef]['modelrefs'][i]];
		    edgeList.push({ source:refToNodeIdx[gRef], target:refToNodeIdx[genomeNodeInfo[gRef]['modelrefs'][i]], value:defValue,
				  text:"Genome is referenced by this FBA Model."});
		}
	    }
	    for (var mRef in modelNodeInfo) {
		if (modelNodeInfo[mRef]['nextVer']) {
		    edgeList.push({ source:refToNodeIdx[mRef], target:refToNodeIdx[modelNodeInfo[mRef]['nextVer']], value:defValue,
				  text:"A new version of this Model was saved."});
		}
		for (var i=0; i<modelNodeInfo[mRef]['fbarefs'].length; i++) {
		    edgeList.push({ source:refToNodeIdx[mRef], target:refToNodeIdx[modelNodeInfo[mRef]['fbarefs'][i]], value:defValue,
				  text:"FBA was run on this Model"});
		}
	    }
	    for (var fRef in fbaNodeInfo) {
		if (fbaNodeInfo[fRef]['nextVer']) {
		    edgeList.push({ source:refToNodeIdx[fRef], target:refToNodeIdx[fbaNodeInfo[fRef]['nextVer']], value:defValue,
				  text:"A new version of this FBA was saved."});
		}
	    }
	    
	    
	    // self.$elem.append(JSON.stringify(genomeNodeInfo)+"<br><br>");
	    // self.$elem.append(JSON.stringify(modelNodeInfo)+"<br><br>");
	    // self.$elem.append(JSON.stringify(fbaNodeInfo)+"<br><br>");
	    
	    // self.$elem.append("nodes:<br>"+JSON.stringify(nodeList)+"<br><br>");
	    // self.$elem.append("links:<br>"+JSON.stringify(edgeList)+"<br><br>");
	    // self.$elem.append("lookup:<br>"+JSON.stringify(refToNodeIdx)+"<br><br>");
	    
	    // set the data
	    self.graph = { nodes:nodeList, links:edgeList };
	},
	
	
	typeToColor: {
	    "KBaseGenomes.Genome":"#00ACE9",
	    "KBaseFBA.FBAModel":"#D43F3F",
	    "KBaseFBA.FBA":"#FFE361"
	    //"KBaseNarratives.Narrative":"#50d07d"
	},
	/*
	    #00ACE9
	    #D43F3F
	    #6A9A1F
	    #F6F6E8
	    #404040
	*/
	addNodeColorKey: function() {
	    var self = this;
	    // probably a better jquery way to do this, but this is what I know...
	    var html = '<table cellpadding="2" cellspacing="0" border="0" id="graphkey vertical-align:middle" \
                            style="">'
	    for(var t in self.typeToColor) {
		html += "<tr><td><svg width=\"40\" height=\"20\"><rect x=\"0\" y=\"0\" width=\"40\" height=\"20\" fill=\""+self.typeToColor[t] +"\" \
		stroke=\""+ d3.rgb(self.typeToColor[t]).darker(2) +"\" /></svg></td><td valign=\"middle\"><b> \
		<a href=\"#/spec/type/"+t+"\">"+t+"</a></b></td></tr>";
	    }
	    html += "</table>";
	    self.$elem.append(html);
	},
	
	
	renderSankeyStyleGraph: function() {
	    var self = this;
	    var margin = {top: 10, right: 10, bottom: 10, left: 10};
	    var width = self.options.width - 100 - margin.left - margin.right;
	    var height = self.graph.nodes.length*35 - margin.top - margin.bottom;
	    
	    var color = d3.scale.category20();
	    
	    // append the svg canvas to the page
	    var svg = d3.select("#objgraphview").append("svg")
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
	    var node = svg.append("g").selectAll(".node")
		.data(self.graph.nodes)
	      .enter().append("g")
		.attr("class", "sankeynode")
		.attr("transform", function(d) { 
		    return "translate(" + d.x + "," + d.y + ")"; })
	      .call(d3.behavior.drag()
		.origin(function(d) { return d; })
		.on("dragstart", function() { 
		    this.parentNode.appendChild(this); })
		.on("drag", dragmove))
	      .on('dblclick', function (d) {
			if (d3.event.defaultPrevented) return;
			// TODO: toggle switch between redirect vs redraw
			
			//alternate reload page so we can go forward and back
			window.location.href = "#/objgraphview/"+encodeURI(self.objDataLookup[d.ref]['info'][7]+"/"+self.objDataLookup[d.ref]['info'][1]);
		    });
    
	    // add the rectangles for the nodes
	    node.append("rect")
		.attr("height", function(d) { return Math.max(10,d.dy); })
		.attr("width", sankey.nodeWidth())
		.style("fill", function(d) {
		      return d.color = self.typeToColor[self.objDataLookup[d.ref]['info'][2].split('-')[0]];
		})
		.style("stroke", function(d) { 
		    return d3.rgb(d.color).darker(2); })
		.append("title")
		    .text(function(d) {
			  //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
			  var info = self.objDataLookup[d.ref]['info'];
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
		 .attr("text-anchor", "start");
     
	    // the function for moving the nodes
	    function dragmove(d) {
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
	    };
    
            return this;
        },
	
	
	
	/**
	 * Get a list of jobs that can be run to get info on all objects in a WS
	 */
	getObjInfoJobs: function (listObjParams, typeNames) {
	    var self = this;
	    var listObjJobs = [];
	    for(var j=0; j<typeNames.length; j++) {
		var typeName = typeNames[j];
		listObjParams['type']=typeName;
		self.objData[typeName]={};
		listObjJobs.push(
		    self.ws.list_objects(
		        listObjParams,
			function(data) {
			    for(var i = 0; i < data.length; i++) {
				//0:obj_id objid, 1:obj_name name, 2:type_string type,3:timestamp save_date, 4:int version, 5:username saved_by,
				//6:ws_id wsid, 7:ws_name workspace, 8:string chsum, 9:int size, 10:usermeta meta>
				//object_info;
				var t = data[i][2].split("-")[0];
				var wsInfo = {info:data[i]};
				self.wsId = wsInfo['info'][6]; // we probably shouldn't put this in the loop, but make a separate ws call.  oh well...
				if(self.objData[t][data[i][0]]) {
				    self.objData[t][data[i][0]][data[i][4]] = wsInfo;
				} else {
				    self.objData[t][data[i][0]]={}; //todo: make this an array... ?
				    self.objData[t][data[i][0]][data[i][4]] = wsInfo;
				}
			    }
			},
			function(err) {
			    self.$elem.find('#loading-mssg').remove();
			    self.$elem.append("<br><b>Error in building object graph!</b><br>");
			    self.$elem.append("<i>Error was:</i></b> &nbsp ");
			    self.$elem.append(err.error.message+"<br>");
			    console.error("Error in building object graph!");
			    console.error(err);
			}
		    )
		);
	    }
	    return listObjJobs;
	},
	
	getProvInfoJobs: function(wsNameOrId) {
	    var self = this;
	    var getProvJobs = [];
	    var getProvObjs = [];
	    
	    for(var type in self.objData) {
		for (var objid in self.objData[type]) {
		    for (var ver in self.objData[type][objid]) {
			getProvObjs.push({ref:wsNameOrId+"/"+objid+"/"+ver});
		    }
		}
	    }
	    getProvJobs.push(
		self.ws.get_object_provenance( // todo: need to add v0.2.1 ws client
		    getProvObjs,
		    function(data) {
			    for(var i = 0; i < data.length; i++) {
				var info = data[i]['info'];
				//0:obj_id objid, 1:obj_name name, 2:type_string type,3:timestamp save_date, 4:int version, 5:username saved_by,
				//6:ws_id wsid, 7:ws_name workspace, 8:string chsum, 9:int size, 10:usermeta meta>
				//object_info;
				var t = info[2].split("-")[0];
				self.objData[t][info[0]][info[4]]['refs'] = data[i]['refs'];
				self.objData[t][info[0]][info[4]]['prov'] = data[i]['provenance'];
				self.objData[t][info[0]][info[4]]['creator'] = data[i]['creator'];
				self.objData[t][info[0]][info[4]]['created'] = data[i]['created'];
				
				// also include a fast lookup table
				self.objDataLookup[info[6]+"/"+info[0]+"/"+info[4]] = self.objData[t][info[0]][info[4]];
			    }
		    },
		    function(err) {
			    self.$elem.find('#loading-mssg').remove();
			    self.$elem.append("<br><b>Error in building object graph!</b><br>");
			    self.$elem.append("<i>Error was:</i></b> &nbsp ");
			    self.$elem.append(err.error.message+"<br>");
			    console.error("Error in building object graph!");
			    console.error(err);
		    }
		)
	    );
	    return getProvJobs;
	},
	
        
        getData: function() {
            return {title:"Data Object Reference Graph", workspace:this.wsNameOrId, id:"This view highlights the connections between Genome and FBA related data objects in this project."};
        },
        
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )