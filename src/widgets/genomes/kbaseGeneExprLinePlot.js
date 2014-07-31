(function ($, undefined) {
    $.KBWidget({
        name: "KBaseGeneExprLinePlot",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            title: "Gene expression line plot",
            featureID: null,
	    workspaceID: null,
            row: null,
            isInCard: false,
	    kbCache: null,
            width: 600,
            height: 600
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
		//options.featureID = 'kb|g.3899.CDS.56284';
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
	self.$elem.append($("<div id='linechart'>"));
	
	//self.values = self.values.slice(0,300)
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
	
	console.log(self.gene_label)
	
	self.gene_label = self.gene_label.replace(/\|/g,"_")
	self.gene_label = self.gene_label.replace(/\./g,"_");
	
	console.log(self.gene_label)
            self.tooltip = d3.select("body").append("div").classed("kbcb-tooltip", true);

            var merged = self.values;
            var count = 1;
            //var colorbank = ["#003399", "#33CC33", "#FF9900", "#FF0000", "#6600FF", "#00FFFF", "#993333", "#000000", "#00CC99", "#0000FF", "#999966"];
            //var colorScale = d3.scale.quantile().domain([0, self.gene_label.length - 1]).range(colorbank);
            console.log(self.options.height)
            var m = [80, 80, 80, 80]; // margins
            var w = self.options.width - m[1] - m[3];//self.conditions.length * 100 - m[1] - m[3]; // width
            var h = 300 - m[0] - m[2]; // height
            var graph = d3.select("#linechart").append("svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

            var formatAsLabels = function (d, i) {
		if(self.conditions[i] != null) {
		//console.log(i);
		//console.log(self.conditions[i]);
		//console.log(self.values[i]);
                    //if (self.conditions[i].length > 10) return self.conditions[i].substring(0, 10) + "...";
                    //else
		    return self.conditions[i];
		}
                }
		
		//console.log(self.values)
            var x = d3.scale.linear().domain([0, self.values.length - 1]).range([0, w]);
            
	    
	    if(self.conditions.length < 200) {
		var xAxis = d3.svg.axis().scale(x).ticks(self.conditions.length).tickFormat(formatAsLabels);
		
		graph.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + h + ")").call(xAxis).selectAll("g.x.axis > g.tick > text").style("text-anchor", "end")
		.attr("dx", "-.9em")
		.attr("dy", ".17em")
		.attr("transform", function(d) {
		    return "rotate(-80)" 
		    }).on("mouseover", function (i) {
		    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker());
		    self.tooltip = self.tooltip.text(self.conditions[i]);
		    return self.tooltip.style("visibility", "visible");
		}).on("mouseout", function () {
		    d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter());
		    return self.tooltip.style("visibility", "hidden");
		}).on("mousemove", function () {
		    return self.tooltip.style("top", (d3.event.pageY + 15) + "px").style("left", (d3.event.pageX - 10) + "px");
		})
	    }
	    
	    
            // .append("title")
            // .text(function(i) {return conditions[i]})
            self.$elem.find("g.axis > path").css({
                "display": "none"
            })
            self.$elem.find("g.axis > line").css({
                "stroke": "lightgrey"
            })
            self.$elem.find("g.x.axis > .minor").css({
                "stroke-opacity": 1
            })
            self.$elem.find(".axis").css({
                "shape-rendering": "crispEdges"
            })
            self.$elem.find(".y.axis > .tick.major > line, .y.axis > path").css({
                "fill": "none",
                "stroke": "#000"
            })

            function yAxisMaker(values) {
		console.log(h)
                var y = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range([h, 0]);
		console.log(d3.min(values))
                var yAxisLeft = d3.svg.axis().scale(y).orient("left");

                graph.append("svg:g").attr("class", "y axis").attr("transform", "translate(0,0)").call(yAxisLeft);

                return y;

            }

            function lineDrawer(values, conditions, gene_label, x, y, drawCircle) {

                var datadict = [];
		console.log(values)
                for (i = 0; i < values.length; i++) {
                    datadict.push({
                        "value": values[i],
                        "condition": conditions[i],
                        "gene_label": gene_label
                    })
                }
		var scaled = []
                var line = d3.svg.line().defined(function (d) {
                    return d.value != null
                }).x(function (d, i) {
                    return x(i);
                }).y(function (d) {
			scaled.push(y(d.value))
			console.log(y(d.value))
                    return y(d.value);
                })
		console.log(scaled)
                var linePath = graph.selectAll("#_" + gene_label).data(datadict).enter().append("svg:path").attr("d", line(datadict)).attr("id", "_" + gene_label).style({
                    "stroke-width": 1,
                    "stroke": "steelblue",
                    "fill": "none"
                }).on("mouseover", function (d) {
                    d3.select(this).style("stroke", d3.rgb(d3.select(this).style("stroke")).darker());
                    self.tooltip = self.tooltip.text(d.gene_label);
                    return self.tooltip.style("visibility", "visible");
                }).on("mouseout", function () {
                    d3.select(this).style("stroke", d3.rgb(d3.select(this).style("stroke")).brighter());
                    return self.tooltip.style("visibility", "hidden");
                }).on("mousemove", function () {
                    return self.tooltip.style("top", (d3.event.pageY + 15) + "px").style("left", (d3.event.pageX - 10) + "px");
                })
                // .append("title")
                // .text(function(d) {return d.gene_label})
                if (drawCircle) {
                    var circle = [];
                    for (var i = 0; i < datadict.length; i++) {
                        circle[i] = graph.append("svg:circle").attr("cx", x(i)).attr("cy", y(datadict[i].value)).attr("r", 5).attr("fill", datadict[i].value != null ? "steelblue" : "red").attr("id", "_" + datadict[i].gene_label).on("mouseover", function () {
                            d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).darker());
                            self.tooltip = self.tooltip.text(datadict[i].gene_label);
                            return self.tooltip.style("visibility", "visible");
                        }).on("mouseout", function () {
                            d3.select(this).style("fill", d3.rgb(d3.select(this).style("fill")).brighter());
                            return self.tooltip.style("visibility", "hidden");
                        }).on("mousemove", function () {
                            return self.tooltip.style("top", (d3.event.pageY + 15) + "px").style("left", (d3.event.pageX - 10) + "px");
                        })
                        // .append("title")
                        // .text(datadict[i].gene_label)
                    }
                }
            }

            y = yAxisMaker(merged);
	    console.log(d3.min(self.values))
            lineDrawer(self.values, self.conditions, self.gene_label, x, y, false);

		}
            return this;
        },
        getData: function () {
            return {
                type: "LineChartCard",
                row: this.options.row,
                featureID: this.options.featureID,
		workspaceID: this.options.workspaceId,
                auth: this.options.auth,
                userId: this.options.userId,
                title: "Gene expression line plot",
            };
        },
    });
})(jQuery);