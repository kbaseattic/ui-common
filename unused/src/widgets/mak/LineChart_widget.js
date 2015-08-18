			var datatable = {"values":[[0.847005,0.729055,null,-1.4168,-1.52138,-1.64155,null,-1.16694],[0.856129,null,0.865829,-1.16332,null,-0.509081,-1.93448,-2.32617]],"conditions":["In-frame deletion mutant for ORF SO3389_WT_stationary anoxic_vs._WT_aerobic mid-log","In-frame deletion mutant for ORF SO3389_WT_aerobic biofilm_vs._WT_aerobic mid-log (planktonic)","made up condition label 1","In-frame deletion mutant for ORF SO3389_Mutant_stationary anoxic (102 h)_vs._Mutant_mid-log anoxic","In-frame deletion mutant for ORF SO3389_WT_stationary anoxic_vs._WT_10 h into anoxic","Salt:NaCl_0.6_120_vs._0_120","made up condition label 2","BU0_A_BU0_A_null_vs._mean gene expression in 207 S.oneidensis experiments (M3d v4 Build 2)_null"],"genes":["199208","199412"]}
				
				// All three above variables are passed from the JSON object
				
			var datadict = []
			var allValues = []
			
			for (x=0;x<datatable.values.length;x++) {
				datadict.push([])
				for (y=0;y<datatable.values[x].length;y++) {
					datadict[x].push({
						"value": datatable.values[x][y],
						"condition": datatable.conditions[y],
						"gene": datatable.genes[x]
					})
					allValues.push(datatable.values[x][y])
				}
			}
		
			var colorbank = ["#003399","#33CC33","#FF9900","#FF0000","#6600FF","#00FFFF","#993333","#000000","#00CC99","#0000FF"]
			
			var m = [80, 80, 80, 80]; // margins
			var w = 1000 - m[1] - m[3]; // width
			var h = 400 - m[0] - m[2]; // height
			
			var graph = d3.select("#linechart")
				.append("svg")
				.attr("width", w + m[1] + m[3])
				.attr("height", h + m[0] + m[2])
				.append("svg:g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
			
			var x = d3.scale.linear().domain([0, datatable.values[0].length-1]).range([0, w]);
			var y = d3.scale.linear().domain([d3.min(allValues), d3.max(allValues)]).range([h, 0]);
			
			var formatAsLabels = function(d,i) {
					if(datatable.conditions[i]!=null) {
						if(datatable.conditions[i].length > 10) return datatable.conditions[i].substring(0,10)+"...";
						else return datatable.conditions[i];
					}
				}

			var xAxis = d3.svg.axis().scale(x).ticks(datatable.values[0].length).tickFormat(formatAsLabels)
					
			graph.append("svg:g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + h + ")")
				.attr("font","Arial")
				.call(xAxis)
				.attr("font-family","Arial")
				.selectAll("g.x.axis > g.tick > text")
				.append("title")
				.text(function(i) {return datatable.conditions[i]})

			var yAxisLeft = d3.svg.axis().scale(y).orient("left");
				
			graph.append("svg:g")
				  .attr("class", "y axis")
				  .attr("transform", "translate(-25,0)")
				  .call(yAxisLeft);
			
			function lineChartMaker(row,datatable,datadict) {
		
				var line = d3.svg.line()
					.defined(function(d) {return d.value!=null})
					.x(function(d,i) { 
						return x(i); 
					})
					.y(function(d) { 
						return y(d.value); 
					})
				
				graph.append("svg:path")
					.attr("d", line(datadict[row]))
					.attr("id", "_"+datatable.genes[row])
					.style("stroke-width",3)
					.style("stroke",colorbank[row])
					.selectAll("line")
					.data(datadict[row])
					.enter()
					.append("title")
					.text(function(d) {return d.gene})
								
				var circle = [];
				for (i = 0; i < datadict[row].length; i++) {
					circle[i] = graph.append("svg:circle")
						.attr("id","_"+datatable.genes[row])
						.attr("cx",x(i))
						.attr("cy",y(datadict[row][i].value))
						.attr("r",5)
						.attr("fill",datadict[row][i].value!=null?colorbank[row]:"white")
						.append("title")
						.text(datadict[row][i].gene)
				}
				
				var removeClass = "#_"+datatable.genes[row]
				d3.selectAll(removeClass)
					.on("click",function() {d3.selectAll(removeClass).remove()})
			}
			
			for (row=0;row<datatable.values.length;row++) {
				lineChartMaker(row,datatable,datadict)
			}
			
			d3.select("svg").selectAll(".selections")
				.data(datatable.genes)
				.enter()
				.append("text")
				.attr("class","selections")
				.attr("x",w+m[1])
				.attr("y",function(d,i) {return i*20+100})
				.text(function (d) {return d})
				.on("click",function(d){
					if (d3.select("#_"+d).empty()) lineChartMaker(datatable.genes.indexOf(d),datatable,datadict)
				})
			
			
					