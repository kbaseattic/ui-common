var DataTable = ["DataTable", [{"bicluster_id":"kb|bicluster.4314","num_genes":173,"num_conditions":75,"condition_ids":["29","30","37","38","42","44"],"condition_labels":["In-frame deletion mutant for ORF SO3389_WT_stationary anoxic_vs._WT_aerobic mid-log","In-frame deletion mutant for ORF SO3389_WT_aerobic biofilm_vs._WT_aerobic mid-log (planktonic)","In-frame deletion mutant for ORF SO3389_Mutant_stationary anoxic (102 h)_vs._Mutant_mid-log anoxic","In-frame deletion mutant for ORF SO3389_WT_stationary anoxic_vs._WT_10 h into anoxic","Salt:NaCl_0.6_120_vs._0_120","BU0_A_BU0_A_null_vs._mean gene expression in 207 S.oneidensis experiments (M3d v4 Build 2)_null"],"gene_ids":["kb|g.371.peg.362","kb|g.371.peg.180","kb|g.371.peg.1427","kb|g.371.peg.1854","kb|g.371.peg.1241"],"gene_labels":["199208","199336","199412","199413","199414"],"exp_mean":1.2781754203886797,"score":0.9944320883479909,"miss_frxn":-1.0,"data":[[0.847005,0.729055,-1.4168,-1.52138,-1.64155,-1.16694],[0.817856,1.10411,-2.86187,-2.81284,-1.40497,-1.4577],[0.825148,0.807097,-3.23414,-6.40135,-1.5801,-2.97321],[0.856129,0.865829,-1.16332,-0.509081,-1.93448,-2.32617],[0.856129,0.865829,-1.16332,-0.509081,-1.93448,-2.32617]]}]]
	
var datatable = DataTable[1][0]

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
	.style("text-anchor", "end")
	.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
	// .on("click",function(d,i,event){
		// if (event == 0) {self.trigger("showFeature", {featureID: d.id, event: event})}
		// self.trigger("showLineChart", {row: [expression[i],conditions,gene_labels[i]], event: event})
	// })
	
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
	.attr("class", "conditionLabel mono axis axis-condition-up")
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