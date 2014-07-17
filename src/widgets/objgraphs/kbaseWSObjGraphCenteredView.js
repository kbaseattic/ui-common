(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseWSObjGraphCenteredView",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        
        wsUrl: "http://dev04.berkeley.kbase.us:7058",
        //wsUrl:"https://kbase.us/services/ws",
        ws:null, // the ws client
	
        options: {
            wsNameOrId: null,
            objNameOrId: null,
            kbCache:{},
            width:1200,
	    height:600
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
            self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>building object reference graph...</center></p></div>');
	    
	    // load the basic things from the cache and options
            //if (self.options.kbCache.ws_url) { self.wsUrl = self.options.kbCache.ws_url; }
            if (self.options.kbCache.token) { self.ws = new Workspace(self.wsUrl, {token: self.options.kbCache.token}); }
            else { self.ws = new Workspace(self.wsUrl); }
            self.wsNameOrId = options.wsNameOrId;

	    self.$elem.append("<div id=\"objgraphview\">");
	    
	    // do the stuff
	    self.needColorKey = true; // so that the key renders
	    self.buildDataAndRender(self.getObjectIdentity(options.wsNameOrId,options.objNameOrId));
	    
	    return this;
	},
	
	
	typeToColor: {
	    "core":"#00ACE9",
	    "ref":"#D43F3F",
	    "included":"#FFE361"
	    //"KBaseNarratives.Narrative":"#50d07d"
	},
	
	typeToName: {
	    "core":"Data objects of interest (all versions)",
	    "ref":"Data that references the objects of interest",
	    "included":"Data that is referenced by the objects of interest"
	    
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
		var html = '<table cellpadding="2" cellspacing="0" border="0" id="graphkey vertical-align:middle" \
				style="">'
		for(var t in self.typeToColor) {
		    html += "<tr><td><svg width=\"40\" height=\"20\"><rect x=\"0\" y=\"0\" width=\"40\" height=\"20\" fill=\""+self.typeToColor[t] +"\" \
		    stroke=\""+ d3.rgb(self.typeToColor[t]).darker(2) +"\" /></svg></td><td valign=\"middle\"><b> \
		    "+self.typeToName[t]+"</b></td></tr>";
		}
		html += "</table>";
		self.$elem.append(html);
		self.needColorKey=false;
	    }
	},
	
	renderSankeyStyleGraph: function() {
	    var self = this;
	    if (self.graph.links.length>0) {
		
		var margin = {top: 10, right: 10, bottom: 10, left: 10};
		var width = self.options.width - 100 - margin.left - margin.right;
		var height = self.graph.nodes.length*35 - margin.top - margin.bottom;
		var color = d3.scale.category20();
		
		// append the svg canvas to the page
		d3.select("#objgraphview").html("");
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
			self.buildDataAndRender({ref:d['objId']});
		    });;
    
	
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
				      "  workspace:  "+info[7]+"\n"+
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
		    
	    } else {
		alert("no links for this obj");
	    }
            return this;
        },
	
	getNodeLabel: function(info) {
	    return info[1] + " (v"+info[4]+")";
	},
	
	buildDataAndRender: function (objref) {
	    var self = this;
	    // init the graph
	    self.graph = {nodes:[],links:[]}; self.objRefToNodeIdx = {};
	    self.ws.get_object_history(
		objref,
		function (data) {
		    var objIdentities = [];
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
			self.objRefToNodeIdx[objId] = nodeId;
			objIdentities.push({ref:objId});
		    }
		    
		    
		    // we have the history of the object of interest, now we can fetch all referencing object, and get prov info for each of these objects
		    var getDataJobList = [
			self.ws.list_referencing_objects(
			    objIdentities,
			    function(refData) {
				for(var i = 0; i < refData.length; i++) {
				    for(var k=0; k<refData[i].length; k++) {
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
				self.$elem.find('#loading-mssg').remove();
				self.$elem.append("<br><b>Error in building object graph!</b><br>");
				self.$elem.append("<i>Error was:</i></b> &nbsp ");
				self.$elem.append(err.error.message+"<br>");
				console.error("Error in building object graph!");
				console.error(err);
			    }
			)
			/*self.ws.get_objects( // need to get obj prov here, then we can get the objects that these ref, then we can get obj info for each of those
			    [objref],
			    function(objdata) {
				
			    }, function(err) {
				self.$elem.find('#loading-mssg').remove();
				self.$elem.append("<br><b>Error in building object graph!</b><br>");
				self.$elem.append("<i>Error was:</i></b> &nbsp ");
				self.$elem.append(err.error.message+"<br>");
				console.error("Error in building object graph!");
				console.error(err);
			    }
			)*/
		    ];
		    
		    $.when.apply($, getDataJobList).done(function() {
			self.addVersionEdges();
			self.renderSankeyStyleGraph();
			self.addNodeColorKey();
			self.$elem.find('#loading-mssg').remove();
			//self.renderSankeyStyleGraph();
		    });
		    
		    
		    
		},
		function (err) {
		    self.$elem.find('#loading-mssg').remove();
		    self.$elem.append("<br><b>Error in building object graph!</b><br>");
		    self.$elem.append("<i>Error was:</i></b> &nbsp ");
		    self.$elem.append(err.error.message+"<br>");
		    console.error("Error in building object graph!");
		    console.error(err);
		}
	    );
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
            return {title:"Data Object Reference Graph", workspace:this.wsNameOrId, id:"This view shows the data reference connections to object "+this.options.objNameOrId};
        },
        
        
        /* Construct an ObjectIdentity that can be used to query the WS*/
        getObjectIdentity: function(wsNameOrId, objNameOrId, objVer) {
            if (objVer) { return {ref:wsNameOrId+"/"+objNameOrId+"/"+objVer}; }
            return {ref:wsNameOrId+"/"+objNameOrId } ;
        },
        
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    });
})( jQuery )