(function($, undefined) {
	$.KBWidget({
		name: "KBaseLineChartCard",
		parent: "kbaseWidget",
		version: "1.0.0",
		options: {
			title: "LineChart Card",
			isInCard: false,
			width: 600,
			height: 600
		},
		
		init: function(options) {
			this._super(options);

			if (this.options.row === null) {
				//throw an error
				return;
			}				
            return this.render();
		},
		
		render: function(options) {
		
			var self = this;			

			self.$elem.append($("<div id='linechart'>"));
			
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
              .domain([0,gene_label.length-1])
              .range(colorbank);
			var heatmap = self.options.heatmap
			var mean = JSON.parse(JSON.stringify(values[index]))
			heatmap.on("click",function(d,i) {
				if (graph.selectAll("#_"+gene_label[i]).empty() && count<=10) {
					count++
					console.log(count)
					lineDrawer(values[i],conditions,gene_label[i],x,y,i,true)
					for (m=0;m<mean.length;m++) {
						mean[m] = mean[m]*(count-1)
						mean[m] += JSON.parse(JSON.stringify(values[i][m]))
						mean[m] = mean[m]/count
					}
				}
				else {
					count--
					console.log(count)
					graph.selectAll("#_"+gene_label[i]).remove()
					for (m=0;m<mean.length;m++) {
						mean[m] = mean[m]*(count+1)
						mean[m] -= JSON.parse(JSON.stringify(values[i][m]))
						if (count>0) mean[m] = mean[m]/count
					}
				}
				console.log(values)
				if (!graph.selectAll("#_mean").empty()) {graph.selectAll("#_mean").remove()}
				if (count > 1) {
					lineDrawer(mean,conditions,"mean",x,y,10,false)
					graph.selectAll("#_mean").style("stroke-dasharray",(3,3))
				}
			})

			var m = [80, 80, 80, 80]; // margins
			var w = conditions.length*100 - m[1] - m[3]; // width
			var h = 400 - m[0] - m[2]; // height

			var graph = d3.select("#linechart")
				.append("svg")
				.attr("width", w + m[1] + m[3])
				.attr("height", h + m[0] + m[2])
				.append("svg:g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
				
			var formatAsLabels = function(d,i) {
				if(conditions[i].length > 10) return conditions[i].substring(0,10)+"...";
				else return conditions[i];
			}
			
			var x = d3.scale.linear().domain([0, values[0].length-1]).range([0, w]);
			var xAxis = d3.svg.axis().scale(x).ticks(conditions.length).tickFormat(formatAsLabels)
			
			graph.append("svg:g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + h + ")")
				.call(xAxis)
				.selectAll("g.x.axis > g.tick > text")
				.on("mouseover", 
                                function(i) { 
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
				// .append("title")
				// .text(function(i) {return conditions[i]})
			
			self.$elem.find("g.axis > path").css({"display":"none"})
			self.$elem.find("g.axis > line").css({"stroke":"lightgrey"})
			self.$elem.find("g.x.axis > .minor").css({"stroke-opacity":.5})
			self.$elem.find(".axis").css({"shape-rendering":"crispEdges"})
			self.$elem.find(".y.axis > .tick.major > line, .y.axis > path").css({"fill":"none","stroke":"#000"})
			
			function yAxisMaker(values) {
			
				var y = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([h, 0]);
				var yAxisLeft = d3.svg.axis().scale(y).orient("left");

				graph.append("svg:g")
					  .attr("class", "y axis")
					  .attr("transform", "translate(-25,0)")
					  .call(yAxisLeft);
				
				return y
				
			}
						
			function lineDrawer(values,conditions,gene_label,x,y,color_ind,drawCircle) {
			
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
					// .append("title")
					// .text(function(d) {return d.gene_label})
				
				if (drawCircle) {
					var circle = [];
					for (var i = 0; i < datadict.length; i++) {
						circle[i] = graph.append("svg:circle")
							.attr("cx",x(i))
							.attr("cy",y(datadict[i].value))
							.attr("r",5)
							.attr("fill",datadict[i].value!=null?colorScale(color_ind):"white")
							.attr("id","_"+datadict[i].gene_label)
							.on("mouseover", 
                                function() { 
                                    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker()); 
                                    self.tooltip = self.tooltip.text(datadict[i].gene_label);
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
							// .append("title")
							// .text(datadict[i].gene_label)
					}
				}
			}
			
			y = yAxisMaker(merged)
			lineDrawer(values[index],conditions,gene_label[index],x,y,index,true)

				
			return this;
		},
		getData: function() {
			return {
				type: "LineChartCard",
				row: this.options.row,
				id: this.options.id,
				workspace: this.options.ws,
				auth: this.options.auth,
				userId: this.options.userId,
				title: "LineChart Card",
			};
		},
	});
})(jQuery);