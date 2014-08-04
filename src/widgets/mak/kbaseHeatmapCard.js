(function($, undefined) {
	$.KBWidget({
		name: "KBaseHeatMapCard",
		parent: "kbaseWidget",
		version: "1.0.0",
		options: {
			title: "HeatMap Card",
			isInCard: true,
			width: 1000,
			height: 1000
		},
		
		newWorkspaceServiceUrl: "https://kbase.us/services/ws",
		
		init: function(options) {
			this._super(options);

			if (this.options.bicluster === null) {
				//throw an error
				return;
			}		
			this.workspaceClient = new Workspace(this.newWorkspaceServiceUrl, { 'token' : this.options.auth, 'user_id' : this.options.userId});
			
            return this.render();
		},
		render: function(options) {

            var self = this;		
			var $heatmapDiv = $("<div id='heatmap'>");			
			self.$elem.append("<h3>Click on a gene for plot of expression values across all conditions. Click another gene to add to the plot.</h3>")
			self.$elem.append($heatmapDiv)
			
			// var $tooltipExpression = $("<div>")
			// var $tooltipGene = $("<div>")
			// var $tooltipCondition = $("<div>")
			// self.tooltip = d3.select("body")
                             // .append($tooltipExpression)
							 // .append($tooltipGene)
							 // .append($tooltipCondition)
                             // .classed("kbcb-tooltip", true);
			self.tooltip1 = d3.select("body")
                             .append("div")
                             .classed("kbcb-tooltip", true);
			self.tooltip2 = d3.select("body")
                             .append("div")
                             .classed("kbcb-tooltip", true);
			self.tooltip3 = d3.select("body")
                             .append("div")
                             .classed("kbcb-tooltip", true);
			console.log(self.tooltip1)
									
			var datatable = self.options.bicluster
			
			if (typeof datatable == "string") {
				this.workspaceClient.get_objects([{workspace: self.options.ws, name: self.options.bicluster}],
					function(data){
						console.log(data)
					}
				)
			}
			
			console.log(datatable)
			var dataflat = 	[]
			var datadict = []
			for (var y = 0; y < datatable.data.length; y+=1) {
				for (var x = 0; x < datatable.data[0].length; x+=1) {
					datadict.push({
						"condition": x,
						"gene": y,
					});
					dataflat.push(datatable.data[y][x]) //obsolete
				}
			}
						
			var gene_labels_ids = [];
			for (var y = 0; y < datatable.row_labels.length; y+=1) {
				gene_labels_ids.push({
					"label": datatable.row_labels[y],
					"id": datatable.row_ids[y]
				});
			}
					
			var gene_labels = datatable.row_labels,
				gene_ids = datatable.row_ids,
				conditions = datatable.column_labels,
				expression = datatable.data;

			var margin = { top: 100, right: 50, bottom: 100, left: 200 },
				width = 2000 - margin.left - margin.right,
				height = 2000 - margin.top - margin.bottom			 
			if(Math.floor(Math.min(width/conditions.length,width/gene_labels.length))>15) {gridSize = Math.floor(Math.min(width/conditions.length,width/gene_labels.length))}
			else {
				gridSize = 15
				width = gridSize*conditions.length
				height = gridSize*gene_labels.length
			}
			var legendElementWidth = gridSize*2,
			colors = ["#0000ff","#0066ff","#66FFFF","#ffffff","#FFC6AA","#ff6600","#ff0000"]
			
			console.log(gridSize)
			
			var colorScale = function(d) {
				if (d > 2.5) return colors[6]
				if (d > 1.5 && d <= 2.5) return colors[5]
				if (d > 0.5 && d <= 1.5) return colors[4]
				if (d > -0.5 && d <= 0.5) return colors[3]
				if (d <= 0.5 && d > -1.5) return colors[2]
				if (d <= 1.5 && d > -2.5) return colors[1]
				if (d <= -2.5) return colors[0]
			};

			var svg = d3.select($heatmapDiv.get(0)).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var geneLabels = svg.selectAll(".geneLabel")
				.data(gene_labels_ids)
				.enter().append("text")
				.text(function (d) { return d.label; })
				.attr("x", 0)
				.attr("y", function (d, i) { return i * gridSize; })
				.attr("class","geneLabel")
				.style({"text-anchor":"end","font-size":"small"})
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
				.on("click",function(d,i,event){
					// if (!$("div.kblpc-subtitle:contains('"+d.id+"')").length) {self.trigger("showFeature", {featureID: d.id, event: event})}
					// self.trigger("showFeature", {featureID: d.id, event: event})
					console.log(i)
					self.trigger("showLineChart", {row: [expression,conditions,gene_labels,i], id: self.options.id, ws: self.options.ws, heatmap: geneLabels, event: event})
					if ($(this).css("font-weight") == 400) $(this).css({"font-weight":900,"font-size":"medium"})
					else $(this).css({"font-weight":400,"font-size":"small"})
				})						
			
			var conditionLabels = svg.selectAll(".conditionLabel")
				.data(conditions)
				.enter().append("text")
				.text(function(d) {
					if(d.length > 10)
						return d.substring(0,10)+'...';
					else
						return d;                       
                    })
				.attr("x", function(d, i) { return i * gridSize; })
				.attr("y", -5)
				.style("text-anchor", "start")
				.attr("transform", function(d, i) { 
					return "translate(10)rotate(-45 "+(i*gridSize)+",0)" ;
				} )
				.attr("class", "conditionLabel")
				.on("mouseover", 
                                function(d) { 
                                    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker()); 
                                    self.tooltip1 = self.tooltip1.text(d);									
                                    return self.tooltip1.style("visibility", "visible"); 
                                }
                            )
                         .on("mouseout", 
                                function() { 
                                    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter()); 
                                    return self.tooltip1.style("visibility", "hidden"); 
                                }
                            )
                         .on("mousemove", 
                                function() { 
                                    return self.tooltip1.style("top", (d3.event.pageY+15) + "px").style("left", (d3.event.pageX-10)+"px");
                                }
                            )
				//.append("title").text(function(d) { return d; })
			
			  var heatMap = svg.selectAll(".squares")
				  .data(datadict)
				  .enter().append("rect")
				  .attr("y", function(d) { return (d.gene) * gridSize; })
				  .attr("x", function(d) { return (d.condition) * gridSize; })
				  .attr("rx", 0)
				  .attr("ry", 0)
				  .attr("class", "squares")
				  .attr("width", gridSize)
				  .attr("height", gridSize)
				  .style({"fill": colors[3],"stroke":"#E6E6E6","stroke-width":"2px"})
				  .on("mouseover", 
                                function(d) { 
                                    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker()); 
                                    // self.tooltip = self.tooltip.text("value: "+expression[d.gene][d.condition])
									self.tooltip1 = self.tooltip1.text("value: "+expression[d.gene][d.condition]).style("visibility","visible")
									self.tooltip2 = self.tooltip2.text("gene: " +gene_labels[d.gene]).style("visibility","visible")
									self.tooltip3 = self.tooltip3.text("condition: "+conditions[d.condition]).style("visibility","visible")
                                }
                            )
                         .on("mouseout", 
                                function() { 
                                    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter()); 
                                    self.tooltip1.style("visibility", "hidden"); 
									self.tooltip2.style("visibility", "hidden"); 
									self.tooltip3.style("visibility", "hidden"); 
                                }
                            )
                         .on("mousemove", 
                                function() { 
                                   self.tooltip1.style("top", (d3.event.pageY+15) + "px").style("left", (d3.event.pageX-10)+"px");
								   self.tooltip2.style("top", (d3.event.pageY+15+30) + "px").style("left", (d3.event.pageX-10)+"px");
								   self.tooltip3.style("top", (d3.event.pageY+15+60) + "px").style("left", (d3.event.pageX-10)+"px");
                                }
                            )
			  			  
			  heatMap.transition().duration(1000)
				  .style("fill", function(d) { return colorScale(expression[d.gene][d.condition]); });
			  
			  var legend = svg.selectAll(".legend")
				  .data(["-Inf",-2,-1,0,1,2,"Inf"], function(d) { return d; })
				  .enter().append("g")
				  .attr("class", "legend");

			  legend.append("rect")
				.attr("y", function(d, i) { return legendElementWidth * i; })
				.attr("x", -margin.left*0.8 + gridSize)
				.attr("height", legendElementWidth)
				.attr("width", gridSize / 2)
				.style("fill", function(d, i) { return colors[i]; });

			  legend.append("text")
				.attr("class", "mono")
				.text(function(d) { return d; })
				.attr("y", function(d, i) { return (legendElementWidth * i)+legendElementWidth/2; })
				.attr("x", -margin.left*0.8 + gridSize*1.5)
				.style("text-anchor","left")
				
			// self.trigger("showLineChart", {row: [expression,conditions,gene_labels,0], id: self.options.id, ws: self.options.ws, heatmap: geneLabels})
				
			return this;
		},
		getData: function() {
			return {
				type: "HeatMapCard",
				id: this.options.id,
				ws: this.options.ws,
				auth: this.options.auth,
				userId: this.options.userId,
				title: "HeatMap Card",
			};
		},
	});
})(jQuery);

