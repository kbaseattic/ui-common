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

			self.$elem.append($("<div id='linechart' style='position:absolute;top:0px;left:0; float:left;'/>"));

			var values = self.options.row[0],
				conditions = self.options.row[1],
				gene_label = self.options.row[2]
				// All three above variables are passed from the JSON object
				
			var datadict = []

			for (y=0;y<values.length;y++) {
				datadict.push({
					"value": values[y],
					"condition": conditions[y],
					"gene_label": gene_label
				})
			}

			var m = [80, 80, 80, 80]; // margins
			var w = 600 - m[1] - m[3]; // width
			var h = 400 - m[0] - m[2]; // height
					
			// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location) 
			// X scale will fit all values from data[] within pixels 0-w
			var x = d3.scale.linear().domain([0, values.length-1]).range([0, w]);
			
			// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
			
			var y = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([h, 0]);
			// automatically determining max range can work something like this
			// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
			
			// create a line function that can convert data[] into x and y points
			var line = d3.svg.line()
				// assign the X function to plot our line as we wish
				.x(function(d,i) { 
					// verbose logging to show what's actually being done
					// return the X coordinate where we want to plot this datapoint
					return x(i); 
				})
				.y(function(d) { 
					// verbose logging to show what's actually being done
					// return the Y coordinate where we want to plot this datapoint
					return y(d.value); 
				})
			 
				// Add an SVG element with the desired dimensions and margin.
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
			// create xAxis
			// var xAxis = d3.svg.axis().scale(x).ticks(conditions.length);
			var xAxis = d3.svg.axis().scale(x).ticks(conditions.length).tickFormat(formatAsLabels)
			
			graph.append("svg:g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + h + ")")
				.call(xAxis)
				.selectAll("g.x.axis > g.tick.major > text")
				.append("title")
				.text(function(i) {return conditions[i]})
				
			// graph.select(".xaxis")select("text")
				// .data(conditions)
				// .enter()
				// .append("title")
				// .text(function(d) {return d})
			 
			// create left yAxis
			var yAxisLeft = d3.svg.axis().scale(y).orient("left");
			// Add the y-axis to the left
			graph.append("svg:g")
				  .attr("class", "y axis")
				  .attr("transform", "translate(-25,0)")
				  .call(yAxisLeft);
						
			// Add the line by appending an svg:path element with the data line we created above
			// do this AFTER the axes above so that the line is above the tick-lines
			
			graph.append("svg:path")
				.attr("d", line(datadict))
				.style("stroke-width",3)
				.selectAll("line")
				.data(datadict)
				.enter()
				.append("title")
				.text(function(d) {return d.gene_label})
				
			return this;
		},
		getData: function() {
			return {
				type: "LineChartCard",
				id: this.options.id,
				workspace: this.options.ws,
				auth: this.options.auth,
				userId: this.options.userId,
				title: "LineChart Card",
			};
		},
	});
})(jQuery);