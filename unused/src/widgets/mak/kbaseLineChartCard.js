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
			
			$lineChartDiv = $("<div id='linechart_"+this.options.id+"' style='overflow:auto;height:450px;resize:vertical'>")
			this.$elem.append($lineChartDiv);
			
			var index = this.options.row[3],
				values = this.options.row[0],
				conditions = this.options.row[1],
				gene_label = this.options.row[2]
			
			$.each(gene_label, function(i,d) {
				var temp = gene_label[i].indexOf(' ')
				gene_label[i] = gene_label[i].substring(temp+1)
			})
				
			var chartWidth = 1500
			if (conditions.length <= 10) chartWidth = 1000
			var m = [80, 80, 140, 120]; // margins
		
			var w = chartWidth - m[1] - m[3]; // width			
			var h = 400 - m[0] - m[2]; // height

			var graph = d3.select($lineChartDiv.get(0))
				.append("svg")
				.attr("width", w + m[1] + m[3])
				.attr("height", h + m[0] + m[2])
				.append("svg:g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
			
			return this.render(this, graph, index, values, conditions, gene_label, w, h, m);
		},
		
		lineDrawer: function(values,conditions,gene_label,x,y,color_ind,drawCircle,graph,colorScale) {
			
			self = this;
						
			var datadict = []
			var temp = gene_label.indexOf(' ')
			gene_label = gene_label.substring(temp+1)
			
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
				
			var linePath = graph.selectAll("#_"+gene_label.replace(/\./g,'').replace(/\|/,''))
				.data(datadict)
				.enter()
				.append("svg:path")
				.attr("d", line(datadict))
				.attr("id","_"+gene_label.replace(/\./g,'').replace(/\|/,''))
				.style({"stroke-width":3,"stroke":colorScale(color_ind),"fill":"none"})
				.on("mouseover", 
							function(d) { 
								d3.select(this).style("stroke", d3.rgb(d3.select(this).style("stroke")).darker()); 
								var tooltipText = d.gene_label
								if (conditions.length > 100 || conditions.length == 1) tooltipText += ", condition: "+d.condition
								self.tooltip = self.tooltip.text(tooltipText);
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
			self.allLines.push(linePath)
			
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
						var tooltipText = d.gene_label
						if (conditions.length > 100 || conditions.length == 1) tooltipText += ", condition: "+d.condition
						self.tooltip = self.tooltip.text(tooltipText);
						return self.tooltip.style("visibility", "visible");
					}).on("mouseout", function () {
						d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter());
						return self.tooltip.style("visibility", "hidden");
					}).on("mousemove", function () {
						return self.tooltip.style("top", (d3.event.pageY + 15) + "px").style("left", (d3.event.pageX - 10) + "px");
					})		
				self.allCircles.push(circles)
			}
		},

		yAxisMaker: function(values,graph,h) {
		
			self = this;
			var formatAsLabels = function(d) {				
				d = d.toString()
				if(d.length > 12) return d.substring(0,12)+"...";
				else return d;				
			}
			
			if (values.length==0) values = [5,-5]
			else values = [].concat.apply([],values)
			//console.log(values)
			var y = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([h, 0]);
			var yAxisLeft = d3.svg.axis().scale(y).orient("left").tickFormat(formatAsLabels);

			graph.append("svg:g")
				  .attr("class", "y axis")
				  .attr("transform", "translate(-25,0)")
				  .call(yAxisLeft)			
				.selectAll("g.y.axis > g.tick > text")
				.on("mouseover", 
						function(d,i) { 
							d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker()); 
							self.tooltip = self.tooltip.text(d);
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
			
			return y
			
		},
		
		xAxisMaker: function(values,conditions,graph,w,h) {

			var formatAsLabels = function(d,i) {
				if (i < conditions.length) {
					if(conditions[i].length > 15) return conditions[i].substring(0,15)+"...";
					else return conditions[i];
				}
			}
			
			var x = d3.scale.linear().domain([0, values[0].length-1]).range([0, w]);
			var xAxis = d3.svg.axis().scale(x).ticks(conditions.length).tickFormat(formatAsLabels)
			
			if (conditions.length <= 100) {
				graph.append("svg:g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + h + ")")
					.call(xAxis)
					.selectAll("g.x.axis > g.tick > text")
					.attr("transform", function(d) {
						return "rotate(-80)translate(-30,0)" 
					})
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
			}
			
			return x
			
		},
	
		render: function(self, graph, index, values, conditions, gene_label, w, h, m) {
			
			self.tooltip = d3.select("body")
                             .append("div")
                             .classed("kbcb-tooltip", true);
				// All three above variables are passed from the JSON object
	
			var merged = [values[index]]
			var colorCount = 0
			var count = 1
			var colorbank = ["#003399","#33CC33","#FF9900","#FF0000","#6600FF","#00FFFF","#993333","#000000","#00CC99","#0000FF","#999966"]
			var colorScale = d3.scale.quantile()
              .domain([0,9])
              .range(colorbank);
			  
			self.allLines = []
			self.allCircles = []
			
			var mean = JSON.parse(JSON.stringify(values[index]))
			
			$("body").on("click", ".geneLabel"+self.options.count, function() {
				
				var i = $(this).index()
				colorCount++
				if (colorCount == 10) colorCount = 0
								
				if (graph.selectAll("#_"+gene_label[i].replace(/\./g,'').replace(/\|/,'')).empty()) {					
					merged.push(values[i])
					count++
					self.$elem.find("g.y.axis").remove()
					self.y = self.yAxisMaker(merged,graph,h)
					self.lineDrawer(values[i],conditions,gene_label[i],x,self.y,colorCount,true,graph,colorScale)
					// if (count == 1) {
						// mean = JSON.parse(JSON.stringify(values[i]))
					// }
					// else {
						for (m=0;m<mean.length;m++) {
							mean[m] = mean[m]*(count-1)
							mean[m] += JSON.parse(JSON.stringify(values[i][m]))
							mean[m] = mean[m]/count
						}
					// }
				}
				else {
					count--
					graph.selectAll("#_"+gene_label[i].replace(/\./g,'').replace(/\|/,'')).remove()
					var temp = merged.indexOf(values[i])
					merged.splice(temp,1)
					
					self.$elem.find("g.y.axis").remove()
					self.y = self.yAxisMaker(merged,graph,h)
					
					for (m=0;m<mean.length;m++) {
						mean[m] = mean[m]*(count+1)
						mean[m] -= JSON.parse(JSON.stringify(values[i][m]))
						if (count>0) mean[m] = mean[m]/count
					}
				}
				if (!graph.selectAll("#_mean").empty()) {graph.selectAll("#_mean").remove()}
				if (count > 1) {
					self.lineDrawer(mean,conditions,"mean",x,self.y,10,false,graph,colorScale)
					graph.selectAll("#_mean").style("stroke-dasharray",(3,3))
				}
				$.each(self.allLines,function(i,linePath) {
					var datadict = linePath.data()
					
					var line = d3.svg.line()
						.defined(function(d) {return d.value!=null})
						.x(function(d,i) { 
							return x(i); 
						})
						.y(function(d) { 
							return self.y(d.value); 
						})
					
					linePath.attr("d", line(datadict))
				})
				$.each(self.allCircles,function(i,circles) {
					circles.attr("cy", function(d) {return self.y(d.value)})
				})
		
			})
			
			x = self.xAxisMaker(values,conditions,graph,w,h)
			
			self.$elem.find("g.axis > path").css({"display":"none"})
			self.$elem.find("g.axis > line").css({"stroke":"lightgrey"})
			self.$elem.find("g.x.axis > .minor").css({"stroke-opacity":.5})
			self.$elem.find(".axis").css({"shape-rendering":"crispEdges"})
			self.$elem.find(".y.axis > .tick.major > line, .y.axis > path").css({"fill":"none","stroke":"#000"})
			
			self.y = self.yAxisMaker(merged,graph,h)
			self.lineDrawer(values[index],conditions,gene_label[index],x,self.y,colorCount,true,graph,colorScale)
				
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