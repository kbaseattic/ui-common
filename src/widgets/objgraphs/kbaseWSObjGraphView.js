(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSObjGraphView",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        wsUrl: "http://dev04.berkeley.kbase.us:7058",
        //wsUrl:"https://kbase.us/services/ws",
        ws:null, // the ws client
	
        options: {
            wsNameOrId: null,
            kbCache:{},
            width:1200
        },

        wsNameOrId:"",
	wsId:null,
	
	//should be a struct with fields of type name, values are type info.  type info has 'info', 'refs'
	//'prov'
	objData: {},
	
        
        init: function(options) {
            this._super(options);
            var self = this;

	    // load the basic things from the cache and options
            //if (self.options.kbCache.ws_url) { self.wsUrl = self.options.kbCache.ws_url; }
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
		    //self.$elem.append(JSON.stringify(self.objData));
		});
	    });
	    
	    self.$elem.append("<div id=\"chart\">");
	    
	    return this;
	},
	
	graph: null,
	
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
		if (genomeNodeInfo[gRef]['modelrefs'].length>0) {
		    nodeList.push({node:nodeIdx,name:genomeNodeInfo[gRef]['name']+" (v"+genomeNodeInfo[gRef]['ver']+")"});
		    refToNodeIdx[gRef]=Number(nodeIdx);
		    nodeIdx++;
		} else if (genomeNodeInfo[gRef]['ver']>1) {
		    nodeList.push({node:nodeIdx,name:genomeNodeInfo[gRef]['name']+" (v"+genomeNodeInfo[gRef]['ver']+")"});
		    refToNodeIdx[gRef]=Number(nodeIdx);
		    nodeIdx++;
		} else if (genomeNodeInfo[gRef]['nextVer']) {
		    nodeList.push({node:nodeIdx,name:genomeNodeInfo[gRef]['name']+" (v"+genomeNodeInfo[gRef]['ver']+")"});
		    refToNodeIdx[gRef]=Number(nodeIdx);
		    nodeIdx++;
		} else {
		    // add to genome no mention list (one version, no model refs)
		}
	    }
	    for (var mRef in modelNodeInfo) {
		if (modelNodeInfo[mRef]['genomerefs'].length>0 || modelNodeInfo[mRef]['fbarefs'].length>0) {
		    nodeList.push({node:nodeIdx,name:modelNodeInfo[mRef]['name']+" (v"+modelNodeInfo[mRef]['ver']+")"});
		    refToNodeIdx[mRef]=Number(nodeIdx);
		    nodeIdx++;
		} else if (modelNodeInfo[mRef]['ver']>1) {
		    nodeList.push({node:nodeIdx,name:modelNodeInfo[mRef]['name']+" (v"+modelNodeInfo[mRef]['ver']+")"});
		    refToNodeIdx[mRef]=Number(nodeIdx);
		    nodeIdx++;
		} else if (modelNodeInfo[mRef]['nextVer']) {
		    nodeList.push({node:nodeIdx,name:modelNodeInfo[mRef]['name']+" (v"+modelNodeInfo[mRef]['ver']+")"});
		    refToNodeIdx[mRef]=Number(nodeIdx);
		    nodeIdx++;
		} else {
		    // add to model no mention list
		}
	    }
	    for (var fRef in fbaNodeInfo) {
		if (fbaNodeInfo[fRef]['modelrefs'].length>0) {
		    nodeList.push({node:nodeIdx,name:fbaNodeInfo[fRef]['name']+" (v"+fbaNodeInfo[fRef]['ver']+")"});
		    refToNodeIdx[fRef]=Number(nodeIdx);
		    nodeIdx++;
		} else if (fbaNodeInfo[fRef]['ver']>1) {
		    nodeList.push({node:nodeIdx,name:fbaNodeInfo[fRef]['name']+" (v"+fbaNodeInfo[fRef]['ver']+")"});
		    refToNodeIdx[fRef]=Number(nodeIdx);
		    nodeIdx++;
		} else if (fbaNodeInfo[fRef]['nextVer']) {
		    nodeList.push({node:nodeIdx,name:fbaNodeInfo[fRef]['name']+" (v"+fbaNodeInfo[fRef]['ver']+")"});
		    refToNodeIdx[fRef]=Number(nodeIdx);
		    nodeIdx++;
		} else {
		    // add to genome no mention list
		}
	    }
	    
	    var edgeList = [];
	    var defValue = 1;
	    for (var gRef in genomeNodeInfo) {
		if (genomeNodeInfo[gRef]['nextVer']) {
		    edgeList.push({ source:refToNodeIdx[gRef], target:refToNodeIdx[genomeNodeInfo[gRef]['nextVer']], value:defValue});
		}
		for (var i=0; i<genomeNodeInfo[gRef]['modelrefs'].length; i++) {
		    edgeList.push({ source:refToNodeIdx[gRef], target:refToNodeIdx[genomeNodeInfo[gRef]['modelrefs'][i]], value:defValue});
		}
	    }
	    for (var mRef in modelNodeInfo) {
		if (modelNodeInfo[mRef]['nextVer']) {
		    edgeList.push({ source:refToNodeIdx[mRef], target:refToNodeIdx[modelNodeInfo[mRef]['nextVer']], value:defValue});
		}
		for (var i=0; i<modelNodeInfo[mRef]['fbarefs'].length; i++) {
		    edgeList.push({ source:refToNodeIdx[mRef], target:refToNodeIdx[modelNodeInfo[mRef]['fbarefs'][i]], value:defValue});
		}
	    }
	    for (var fRef in fbaNodeInfo) {
		if (fbaNodeInfo[fRef]['nextVer']) {
		    edgeList.push({ source:refToNodeIdx[fRef], target:refToNodeIdx[fbaNodeInfo[fRef]['nextVer']], value:defValue});
		}
	    }
	    
	    
	    
	    
	    //self.$elem.append(JSON.stringify(genomeNodeInfo)+"<br><br>");
	    //self.$elem.append(JSON.stringify(modelNodeInfo)+"<br><br>");
	   // self.$elem.append(JSON.stringify(fbaNodeInfo)+"<br><br>");
	    
	    self.$elem.append("nodes:<br>"+JSON.stringify(nodeList)+"<br><br>");
	    self.$elem.append("links:<br>"+JSON.stringify(edgeList)+"<br><br>");
	    self.$elem.append("lookup:<br>"+JSON.stringify(refToNodeIdx)+"<br><br>");
	    
	    // set the data
	    self.graph = { nodes:nodeList, links:edgeList };
	    
	    
	    
	    
	    
	    /*self.graph = {
	    "nodes":[
	    {"node":'a',"name":"alpha"},
	    {"node":1,"name":"node1"},
	    {"node":0,"name":"node0"},
	    {"node":2,"name":"node2"},
	    {"node":3,"name":"node3"},
	    {"node":4,"name":"node4"}
	    ],
	    "links":[
	    {"source":0,"target":2,"value":2},
	    {"source":1,"target":2,"value":2},
	    {"source":1,"target":3,"value":1},
	    {"source":0,"target":4,"value":2},
	    {"source":2,"target":3,"value":2},
	    {"source":2,"target":4,"value":2},
	    {"source":3,"target":4,"value":4}
	    ]};*/
	},
	
	
	renderSankeyStyleGraph: function() {
	    var self = this;
	    var mymargin = {top: 10, right: 10, bottom: 10, left: 10};
	    var width = 1100 - mymargin.left - mymargin.right;
	    var height = 300 - mymargin.top - mymargin.bottom;
	    
	    var formatNumber = d3.format(",.0f"),    // zero decimal places
		format = function(d) { return formatNumber(d) + " refs"; },
		color = d3.scale.category20();
	    
	    // append the svg canvas to the page
	    var svg = d3.select("#chart").append("svg")
		.attr("width", width + mymargin.left + mymargin.right)
		.attr("height", height + mymargin.top + mymargin.bottom)
	      .append("g")
		.attr("transform", 
		      "translate(" + mymargin.left + "," + mymargin.top + ")");





    // Set the sankey diagram properties
    var sankey = d3.sankey()
	.nodeWidth(36)
	.nodePadding(40)
	.size([width, height]);
    var path = sankey.link();
    sankey
	  .nodes(self.graph.nodes)
	  .links(self.graph.links)
	  .layout(32);
    
    // add in the links
      var link = svg.append("g").selectAll(".link")
	  .data(self.graph.links)
	.enter().append("path")
	  .attr("class", "link")
	  .attr("d", path)
	  .style("stroke-width", function(d) { return Math.max(1, d.dy); })
	  .sort(function(a, b) { return b.dy - a.dy; });
    
    // add the link titles
      link.append("title")
	    .text(function(d) {
		return d.source.name + " → " + 
		    d.target.name + "\n" + format(d.value); });
    
	// add in the nodes
      var node = svg.append("g").selectAll(".node")
	  .data(self.graph.nodes)
	.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { 
	      return "translate(" + d.x + "," + d.y + ")"; })
	.call(d3.behavior.drag()
	  .origin(function(d) { return d; })
	  .on("dragstart", function() { 
	      this.parentNode.appendChild(this); })
	  .on("drag", dragmove));
    
    // add the rectangles for the nodes
      node.append("rect")
	  .attr("height", function(d) { return d.dy; })
	  .attr("width", sankey.nodeWidth())
    //      .style("fill", function(d) { 
    //          return d.color = color(d.name.replace(/ .*/, "")); })
	  .style("stroke", function(d) { 
	      return d3.rgb(d.color).darker(2); })
	.append("title")
	  .text(function(d) { 
	      return d.name + "\n" + format(d.value); });
    
    // add in the title for the nodes
      node.append("text")
	  .attr("x", -6)
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
     
		
               // }, function(err) {
               //     self.$elem.find('#loading-mssg').remove();
               //     self.$elem.append("<br><b>There are no other data objects (you can access) that reference this object.</b>");
               //     console.error("Error in finding referencing objects! (note: v0.1.6 throws this error if no referencing objects were found)");
               //     console.error(err);
               //     //self.$elem.append("<br><div><i>Error was:</i></div><div>"+err['error']['message']+"</div><br>");
               // });
            
            return this;
        },
	
	
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
				    self.objData[t][data[i][0]]={}; //todo: make this an array...
				    self.objData[t][data[i][0]][data[i][4]] = wsInfo;
				}
			    }
			},
			function(err) {
			    self.$elem.append(JSON.stringify(err));
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
				var t = info[2].split("-")[0];
				self.objData[t][info[0]][info[4]]['refs'] = data[i]['refs'];
				self.objData[t][info[0]][info[4]]['prov'] = data[i]['provenance'];
				self.objData[t][info[0]][info[4]]['creator'] = data[i]['creator'];
				self.objData[t][info[0]][info[4]]['created'] = data[i]['created'];
			    }
		    },
		    function(err) {
			self.$elem.append(JSON.stringify(err));
		    }
		)
	    );
	    return getProvJobs;
	},
	
        
        getData: function() {
            return {title:"Data Object Reference Graph", workspace:this.wsName};
        },
        
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )