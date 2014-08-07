(function($, undefined) {
	$.KBWidget({
		name: "KBaseLineChartCard",
		parent: "kbaseWidget",
		version: "1.0.0",
		options: {
			title: "LineChart Card",
			isInCard: true,
			width: 600,
			height: 600
		},
		
		init: function(options) {
			this._super(options);

			if (this.options.row === null) {
				//throw an error
				return;
			}				
            return this.render(self);
		},
		
		lineDrawer: function(values,conditions,gene_label,x,y,color_ind,drawCircle,graph,colorScale) {
			
			self = this;
			
			var datadict = []

			for (i=0;i<values.length;i++) {
				datadict.push({
					"value": values[i],
					"condition": conditions[i],
					"gene_label": gene_label
				})
			}
			var line = d3.svg.line()
				.defined(function(d) {return d.value!=null})
				.x(function(d,i) { 
					return x(i); 
				})
				.y(function(d) { 
					return y(d.value); 
				})
				
			var linePath = graph.selectAll("#_"+gene_label)
				.data(datadict)
				.enter()
				.append("svg:path")
				.attr("d", line(datadict))
				.attr("id","_"+gene_label)
				.style({"stroke-width":3,"stroke":colorScale(color_ind),"fill":"none"})
				.on("mouseover", 
							function(d) { 
								d3.select(this).style("stroke", d3.rgb(d3.select(this).style("stroke")).darker()); 
								self.tooltip = self.tooltip.text(d.gene_label);
								return self.tooltip.style("visibility", "visible"); 
							}
						)
					 .on("mouseout", 
							function() { 
								d3.select(this).style("stroke", d3.rgb(d3.select(this).style("stroke")).brighter()); 
								return self.tooltip.style("visibility", "hidden"); 
							}
						)
					 .on("mousemove", 
							function() { 
								return self.tooltip.style("top", (d3.event.pageY+15) + "px").style("left", (d3.event.pageX-10)+"px");
							}
						)
			
			if (drawCircle) {
				var circles = graph.selectAll(".selectionCircles")
					.data(datadict)
					.enter().append("circle")
					.attr("cx", function(d,i) {return x(i)})
					.attr("cy", function(d) {return y(d.value)})
					.attr("r",5)					
					.attr("fill", function(d) {return d.value != null ? colorScale(color_ind) : "white"})
					.attr("id", function(d) {return "_" + d.gene_label})                        
					.on("mouseover", function (d) {
						d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker());
						self.tooltip = self.tooltip.text(d.gene_label);
						return self.tooltip.style("visibility", "visible");
					}).on("mouseout", function () {
						d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter());
						return self.tooltip.style("visibility", "hidden");
					}).on("mousemove", function () {
						return self.tooltip.style("top", (d3.event.pageY + 15) + "px").style("left", (d3.event.pageX - 10) + "px");
					})								
			}
		},
		
		yAxisMaker: function(values,graph,h) {
			var y = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([h, 0]);
			var yAxisLeft = d3.svg.axis().scale(y).orient("left");

			graph.append("svg:g")
				  .attr("class", "y axis")
				  .attr("transform", "translate(-25,0)")
				  .call(yAxisLeft);
			
			return y
			
		},
	
		render: function(self) {

			$lineChartDiv = $("<div id='linechart' style='overflow:auto;height:450px;resize:vertical'>")
			self.$elem.append($lineChartDiv);
			
			self.tooltip = d3.select("body")
                             .append("div")
                             .classed("kbcb-tooltip", true);
			
			var index = self.options.row[3]
			var values = self.options.row[0],
				conditions = self.options.row[1],
				gene_label = self.options.row[2]
				// All three above variables are passed from the JSON object

			var merged = [].concat.apply([],values)
			var count = 1
			var colorbank = ["#003399","#33CC33","#FF9900","#FF0000","#6600FF","#00FFFF","#993333","#000000","#00CC99","#0000FF","#999966"]
			var colorScale = d3.scale.quantile()
              .domain([0,9])
              .range(colorbank);
			
			var mean = JSON.parse(JSON.stringify(values[index]))
			var heatmap = self.options.heatmap
			heatmap.on("click",function(d,i) {
				if ($(this).css("font-weight") == 400) $(this).css({"font-weight":900,"font-size":"medium"})
				else $(this).css({"font-weight":400,"font-size":"small"})
				if (graph.selectAll("#_"+gene_label[i]).empty() && count<=10) {
					count++
					self.lineDrawer(values[i],conditions,gene_label[i],x,y,(count-1),true,graph,colorScale)
					for (m=0;m<mean.length;m++) {
						mean[m] = mean[m]*(count-1)
						mean[m] += JSON.parse(JSON.stringify(values[i][m]))
						mean[m] = mean[m]/count
					}
				}
				else {
					count--
					graph.selectAll("#_"+gene_label[i]).remove()
					for (m=0;m<mean.length;m++) {
						mean[m] = mean[m]*(count+1)
						mean[m] -= JSON.parse(JSON.stringify(values[i][m]))
						if (count>0) mean[m] = mean[m]/count
					}
				}
				if (!graph.selectAll("#_mean").empty()) {graph.selectAll("#_mean").remove()}
				if (count > 1) {
					self.lineDrawer(mean,conditions,"mean",x,y,10,false,graph,colorScale)
					graph.selectAll("#_mean").style("stroke-dasharray",(3,3))
				}
			})
			
			var m = [80, 80, 80, 80]; // margins
			var w = conditions.length*150 - m[1] - m[3]; // width
			var h = 400 - m[0] - m[2]; // height

			var graph = d3.select($lineChartDiv.get(0))
				.append("svg")
				.attr("width", w + m[1] + m[3])
				.attr("height", h + m[0] + m[2])
				.append("svg:g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
			
			var formatAsLabels = function(d,i) {
				if (i < conditions.length) {
					if(conditions[i].length > 10) return conditions[i].substring(0,10)+"...";
					else return conditions[i];
				}
			}
			
			var x = d3.scale.linear().domain([0, values[0].length-1]).range([0, w]);
			var xAxis = d3.svg.axis().scale(x).ticks(conditions.length).tickFormat(formatAsLabels)
			
			graph.append("svg:g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + h + ")")
				.call(xAxis)
				.selectAll("g.x.axis > g.tick > text")
				.on("mouseover", 
                                function(d,i) { 
                                    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker()); 
                                    self.tooltip = self.tooltip.text(conditions[i]);
                                    return self.tooltip.style("visibility", "visible"); 
                                }
                            )
                         .on("mouseout", 
                                function() { 
                                    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter()); 
                                    return self.tooltip.style("visibility", "hidden"); 
                                }
                            )
                         .on("mousemove", 
                                function() { 
                                    return self.tooltip.style("top", (d3.event.pageY+15) + "px").style("left", (d3.event.pageX-10)+"px");
                                }
                            )
			
			self.$elem.find("g.axis > path").css({"display":"none"})
			self.$elem.find("g.axis > line").css({"stroke":"lightgrey"})
			self.$elem.find("g.x.axis > .minor").css({"stroke-opacity":.5})
			self.$elem.find(".axis").css({"shape-rendering":"crispEdges"})
			self.$elem.find(".y.axis > .tick.major > line, .y.axis > path").css({"fill":"none","stroke":"#000"})
			
			y = self.yAxisMaker(merged,graph,h)
			self.lineDrawer(values[index],conditions,gene_label[index],x,y,0,true,graph,colorScale)

				
			return this;
		},
		getData: function() {
			return {
				type: "LineChartCard",
				row: this.options.row,
				id: this.options.id,
				workspace: this.options.workspace,
				auth: this.options.auth,
				userId: this.options.userId,
				title: "LineChart Card",
			};
		},
	});
})(jQuery);