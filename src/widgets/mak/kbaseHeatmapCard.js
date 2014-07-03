(function($, undefined) {
	$.KBWidget({
		name: "KBaseHeatMapCard",
		parent: "kbaseWidget",
		version: "1.0.0",
		options: {
			title: "HeatMap Card",
			isInCard: false,
			width: 600,
			height: 600
		},
		
		init: function(options) {
			this._super(options);

			if (this.options.bicluster === null) {
				//throw an error
				return;
			}				
            return this.render();
		},
		render: function(options) {

            var self = this;			
			self.$elem.append($("<div id='heatmap'>"))

			var datatable = self.options.bicluster[1][0]

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
			for (var y = 0; y < datatable.gene_ids.length; y+=1) {
				gene_labels_ids.push({
					"label": datatable.gene_labels[y],
					"id": datatable.gene_ids[y]
				});
			}
			
			var gene_labels = datatable.gene_labels,
				gene_ids = datatable.gene_ids,
				conditions = datatable.condition_labels,
				expression = datatable.data;
				
			var margin = { top: 100, right: 0, bottom: 100, left: 200 },
			  width = conditions.length*100 - margin.left - margin.right,
			  height = gene_labels.length*100 - margin.top - margin.bottom,
			  gridSize = Math.floor(height / 15),
			  legendElementWidth = gridSize*2,
			  colors = ["#0000ff","#0066ff","#3399ff","#ffffff","#ff9966","#ff6600","#ff0000"]
			
			var colorScale = function(d) {
				if (d > 2.5) return colors[6]
				if (d > 1.5 && d <= 2.5) return colors[5]
				if (d > 0.5 && d <= 1.5) return colors[4]
				if (d > -0.5 && d <= 0.5) return colors[3]
				if (d <= 0.5 && d > -1.5) return colors[2]
				if (d <= 1.5 && d > -2.5) return colors[1]
				if (d <= -2.5) return colors[0]
			};

			var svg = d3.select("#heatmap").append("svg")
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
				.style("text-anchor", "end")
				.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
				.on("click",function(d,i,event){
					if (!$("div.kblpc-subtitle:contains('"+d.id+"')").length) {self.trigger("showFeature", {featureID: d.id, event: event})}
					// self.trigger("showFeature", {featureID: d.id, event: event})
					self.trigger("showLineChart", {row: [expression,conditions,gene_labels,i], heatmap: geneLabels, event: event})
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
				.append("title").text(function(d) { return d; })
						
			  var heatMap = svg.selectAll(".gene")
				  .data(datadict)
				  .enter().append("rect")
				  .attr("y", function(d) { return (d.gene) * gridSize; })
				  .attr("x", function(d) { return (d.condition) * gridSize; })
				  .attr("rx", 4)
				  .attr("ry", 4)
				  .attr("class", "gene bordered")
				  .attr("width", gridSize)
				  .attr("height", gridSize)
				  .style("fill", colors[3])
				  // .on("mouseover", function(d) {
						// this.showToolTip(
							// {
								// label: "value: "+d.expression+"\ncondition: "+d.cond_label+"\ngene: "+d.gen_label,
							// }
						// )
				  // })
			  
			  heatMap.append("title").text(function(d) { return "value: "+expression[d.gene][d.condition]+"\ncondition: "+conditions[d.condition]+"\ngene: "+gene_labels[d.gene]; });
			  
			  heatMap.transition().duration(1000)
				  .style("fill", function(d) { return colorScale(expression[d.gene][d.condition]); });
			  
			  var legend = svg.selectAll(".legend")
				  .data(["-Inf",-2,-1,0,1,2,"Inf"], function(d) { return d; })
				  .enter().append("g")
				  .attr("class", "legend");

			  legend.append("rect")
				.attr("x", function(d, i) { return legendElementWidth * i; })
				.attr("y", (datatable.data.length+1)*gridSize)
				.attr("width", legendElementWidth)
				.attr("height", gridSize / 2)
				.style("fill", function(d, i) { return colors[i]; });

			  legend.append("text")
				.attr("class", "mono")
				.text(function(d) { return d; })
				.attr("x", function(d, i) { return (legendElementWidth * i)+legendElementWidth/2; })
				.attr("y", (datatable.data.length+1)*gridSize)
				.style("text-anchor","middle")
				
			return this;
		},
		getData: function() {
			return {
				type: "HeatMapCard",
				id: this.options.id,
				workspace: this.options.ws,
				auth: this.options.auth,
				userId: this.options.userId,
				title: "HeatMap Card",
			};
		},
	});
})(jQuery);

