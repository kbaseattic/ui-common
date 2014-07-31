(function ($, undefined) {
    $.KBWidget({
        name: "KBaseGeneExprLinePlot",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            title: "Gene expression line plot",
            featureID: null,
            row: null,
            isInCard: false,
            width: 2000,
            height: 800
        },

        expressionServiceUrl: "http://kbase.us/services/expression",

        init: function (options) {
            this._super(options);

	console.log("options.id "+options.id);

            //console.log(options);
            //if (this.options.row === null) {
            //throw an error
            //	return;
            //}
	    
	    var self = this;
            this.index = [];
		this.values = [];
             this.conditions = [];
             this.gene_label = [];
	    
            if (this.options.row == null || this.options.row.length == 1) {
		//console.log("input is null");s
		
                //my $client = Bio::KBase::KBaseExpression::KBaseExpressionClient->new("http://kbase.us/services/expression/"); 
                this.expressionClient = new KBaseExpression(this.expressionServiceUrl, {
                    'token': this.options.auth,
                    'user_id': this.options.userId
                });
				console.log("input is null");
				options.featureID = 'kb|g.3899.CDS.56284';
                //get_expression_data_by_samples_and_features([], ['kb|g.3899.CDS.56284''], 'Log2 level intensities');
		
                this.expressionClient.get_expression_data_by_samples_and_features([], [options.featureID], 'Log2 level intensities', function(data) {
			
			if (data != null) {				
				//console.log(data);	
				var count =1;
				for (var k in data) {
					// use hasOwnProperty to filter out keys from the Object.prototype
					if (data.hasOwnProperty(k)) {
						var cur = data[k];						
						for (var z in cur) {
							if (cur.hasOwnProperty(z)) {
								//console.log('key is: ' + k + ', value is: ' + data[k] + '\t key is: ' + z + ', value is: ' + cur[z]);
								if(cur[z] != null && k != null) {
								self.values[self.values.length] = cur[z];
								self.conditions[self.conditions.length] = k;
								self.index[self.index.length] = count;
								count++;
								}
								else {
									console.log("undefined "+count+"\t"+cur[z]+"\t"+k);
								}
							}
						}
					}					
				    }
				//self.options.row = data;
				//self.index = self.options.row[3];
				//self.values = self.options.row[0];
				//self.conditions = self.options.row[1];
				//console.log("options.featureID "+options.featureID);
				self.gene_label = options.featureID;//self.options.id;
				//console.log("self.gene_label "+self.gene_label);
				//console.log("self.values "+self.values);
				//console.log("self.conditions "+self.conditions);
				self.render();
			}			
		});
											     
            } else {
                this.index = this.options.row[3];
                this.values = this.options.row[0];
                this.conditions = this.options.row[1];
                this.gene_label = this.options.featureID;		
            }
	    	    
		return this;
        },

        render: function (options) {
	
            console.log("here");

            var self = this;

        if(self.values != null) {
			$lineChartDiv = $("<div id='linechart'>")
			self.$elem.append($lineChartDiv);
			
			// self.values = self.values.slice(0,300)
			var values_unsorted = self.values;
			var conditions_unsorted = self.conditions;
			self.values.sort(function(a,b){return a - b})
			
			var index = [];
			for (i = 0; i < values_unsorted.length; i++) {
				var curind = self.values.indexOf(values_unsorted[i]);
				index[index.length] = curind;
			}
			
			for (i = 0; i <conditions_unsorted.length; i++) {
				self.conditions[index[i]] = conditions_unsorted[i];
			}
			
			self.gene_label = self.gene_label.replace(/\|/g,"_")
			self.gene_label = self.gene_label.replace(/\./g,"_");
			
            self.tooltip = d3.select("body").append("div").classed("kbcb-tooltip", true);

            var count = 1;

            console.log(self.options.height)
            var m = [80, 80, 80, 80]; // margins
            var w = self.options.width - m[1] - m[3];//self.conditions.length * 100 - m[1] - m[3]; // width
            var h = 300 - m[0] - m[2]; // height
            var graph = d3.select($lineChartDiv.get(0)).append("svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

            var x = d3.scale.linear().domain([0, self.values.length - 1]).range([0, w]);

            var y = d3.scale.linear().domain([Math.min.apply(Math,self.values), d3.max(self.values)]).range([h, 0]);
			
            var yAxisLeft = d3.svg.axis().scale(y).orient("left");				
            graph.append("svg:g").attr("class", "y axis").attr("transform", "translate(-25,0)").call(yAxisLeft);
			
            // self.$elem.find("g.axis > path").css({
                // "display": "none"
            // })
            // self.$elem.find("g.axis > line").css({
                // "stroke": "lightgrey"
            // })
            // self.$elem.find("g.x.axis > .minor").css({
                // "stroke-opacity": .5
            // })
            // self.$elem.find(".axis").css({
                // "shape-rendering": "crispEdges"
            // })
            // self.$elem.find(".y.axis > .tick.major > line, .y.axis > path").css({
                // "fill": "none",
                // "stroke": "#000"
            // })

			var datadict = [];
			for (i = 0; i < self.values.length; i++) {
				datadict.push({
					"value": self.values[i],
					"condition": self.conditions[i],
					"gene_label": self.gene_label
				})
			}
									
			var line = d3.svg.line()
			.defined(function (d) {return d.value != null})
			.x(function (d, i) {return x(i)})
			.y(function (d) {return y(d.value)})
			
			var linePath = graph.selectAll("#_" + self.gene_label).data(datadict).enter().append("path").attr("d", line(datadict)).attr("id", "_" + self.gene_label).style({
				"stroke-width": 1,
				"stroke": "steelblue",
				"fill": "none"
			}).on("mouseover", function (d) {
				d3.select(this).style("stroke", d3.rgb(d3.select(this).style("stroke")).darker());
				self.tooltip = self.tooltip.text(d.condition);
				return self.tooltip.style("visibility", "visible");
			}).on("mouseout", function () {
				d3.select(this).style("stroke", d3.rgb(d3.select(this).style("stroke")).brighter());
				return self.tooltip.style("visibility", "hidden");
			}).on("mousemove", function () {
				return self.tooltip.style("top", (d3.event.pageY + 15) + "px").style("left", (d3.event.pageX - 10) + "px");
			})

			// if (drawCircle) {
				// var circle = [];
				// for (var i = 0; i < datadict.length; i++) {
					// circle[i] = graph.append("svg:circle").attr("cx", x(i)).attr("cy", y(datadict[i].value)).attr("r", 3).attr("fill", datadict[i].value != null ? "steelblue" : "white").attr("id", "_" + datadict[i].gene_label).on("mouseover", function () {
						// d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker());
						// self.tooltip = self.tooltip.text(datadict[i].gene_label);
						// return self.tooltip.style("visibility", "visible");
					// }).on("mouseout", function () {
						// d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter());
						// return self.tooltip.style("visibility", "hidden");
					// }).on("mousemove", function () {
						// return self.tooltip.style("top", (d3.event.pageY + 15) + "px").style("left", (d3.event.pageX - 10) + "px");
					// })
				// }
			// }
			drawTicks = true
			if (drawTicks) {
				var ticks = graph.selectAll(".selectionTicks")
					.data(datadict)
					.enter().append("rect")
					.attr("x", function(d,i) {return x(i)})
					.attr("y", function(d) {return y(d.value)-10})
					.attr("height", 20)
					.attr("width",2)
					.attr("fill", function(d) {return d.value != null ? "steelblue" : "white"})
					.attr("id", function(d) {return "_" + d.gene_label})                        
					.on("mouseover", function (d) {
						d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker());
						self.tooltip = self.tooltip.text(d.condition);
						return self.tooltip.style("visibility", "visible");
					}).on("mouseout", function () {
						d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter());
						return self.tooltip.style("visibility", "hidden");
					}).on("mousemove", function () {
						return self.tooltip.style("top", (d3.event.pageY + 15) + "px").style("left", (d3.event.pageX - 10) + "px");
					})
			}


		}
            return this;
        },
        getData: function () {
            return {
                type: "LineChartCard",
                row: this.options.row,
                featureID: this.options.featureID,
                auth: this.options.auth,
                userId: this.options.userId,
                title: "Gene expression line plot",
            };
        },
    });
})(jQuery);
