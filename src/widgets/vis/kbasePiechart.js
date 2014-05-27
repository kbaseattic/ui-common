/*

*/

define('kbasePiechart',
    [
        'jquery',
        'd3',
        'kbaseVisWidget',
        'RGBColor',
        'geometry_rectangle',
        'geometry_point',
        'geometry_size',
    ], function( $ ) {

    $.KBWidget({

	    name: "kbasePiechart",
	  parent: "kbaseVisWidget",

        version: "1.0.0",
        options: {
            overColor : 'blue',
            innerRadius : 0,
            outerRadius : 0,
        },

        _accessors : [

        ],

        renderChart : function() {

            if (this.dataset() == undefined) {
                return;
            }

            var bounds = this.chartBounds();
            var $pie  = this;

            var pieScale = d3.scale.linear()
                .domain([0,1])
                .range([0,360]);

if (this.pieLayout == undefined) {
    this.pieLayout = d3.layout.pie().sort(null).value(function (d, idx) { return pieScale(d.value) });
}

var pieData = this.pieLayout($pie.dataset());


            var radius = this.options.outerRadius;
            if (radius == 0) {
                var diameter = bounds.size.width < bounds.size.height
                    ? bounds.size.width
                    : bounds.size.height;
                var radius = diameter / 2;
            }

            var arcMaker = d3.svg.arc()
                .innerRadius(this.options.innerRadius)
                .outerRadius(radius);

            var funkyTown = function() {

                this
                    .attr('fill',   function (d) {return d.data.color } );
                if (this.attrTween) {
                    this
                        .attrTween("d", function(d, idx) {

                            //this._current = this._current || d;//{startAngle : 0, endAngle : 0};
                            //this._current = this._current || {startAngle : d.startAngle, endAngle : d.startAngle};
//$pie.lastPieData = pieData;
                            if (this._current == undefined) {
                                if ($pie.initialized) {

                                    if (idx < $pie.lastPieData.length) {
                                        this._current = {startAngle : $pie.lastPieData[idx + 1].startAngle, endAngle : $pie.lastPieData[idx + 1].startAngle};
                                    }
                                    else {
                                        this._current = {startAngle : 2 * Math.PI, endAngle: 2 * Math.PI};
                                    }
                                }
                                else {
                                    //the first line animates the wedges in place, the second animates from the top, the third draws them rendered
                                    //this._current = {startAngle : d.startAngle, endAngle : d.startAngle};
                                    //this._current = {startAngle : 0, endAngle : 0};
                                    this._current = {startAngle : d.startAngle, endAngle : d.endAngle};
                                }
                            }

                            //if (idx > 0) {
                            //    this._current = { startAngle : pieData[idx - 1].startAngle, endAngle : pieData[idx - 1].endAngle};
                            //}
                            var interpolate = d3.interpolate(this._current, d);

                            this._current = interpolate(0);
                            return function(t) {
                                return arcMaker(interpolate(t));
                            };
                        })
                    ;
                }

                return this;

            };

            var labelTown = function() {

                this
                    .attr("text-anchor", "middle");

                if (this.attrTween) {

                    this
                        .text(function(d) {
                            return d.data.label;
                        })
                        .attrTween('fill-opacity', function (d, idx) {
                            if (this._currentOpacity == undefined) {
                                this._currentOpacity = $pie.initialized ? 0 : 100;
                            }
                            var interpolate = d3.interpolate(this._currentOpacity, 100);
                            this._currentOpacity = interpolate(0);
                            return interpolate;
                        })
                        .attrTween("transform", function(d, idx) {
                            //this._current=  this._current || d;
                            if (this._current == undefined) {
                                if ($pie.initialized) {

                                    if (idx < $pie.lastPieData.length) {
                                        this._current = {startAngle : $pie.lastPieData[idx + 1].startAngle, endAngle : $pie.lastPieData[idx + 1].startAngle};
                                    }
                                    else {
                                        this._current = {startAngle : 2 * Math.PI, endAngle: 2 * Math.PI};
                                    }
                                }
                                else {
                                    this._current = d;//{startAngle : d.startAngle, endAngle : d.startAngle};
                                }
                            }
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function(t) {
                                var d2 = interpolate(t);
                                var pos = arcMaker.centroid(d2);
                                return "translate("+ pos +")";
                            };

                            return "translate(" + arcMaker.centroid(d) + ")";
                        })
                    }


                return this;
            }

            //there is no mouse action on a pie chart for now.
            var mouseAction = function() { return this };

            var pie = this.data('D3svg').select('.chart').selectAll('.pie').data([0]);
            pie.enter().append('g')
                .attr('class', 'pie')
                .attr('transform',
                    'translate('
                        + (bounds.size.width / 2 - radius + radius)
                        + ','
                        + (bounds.size.height / 2 - radius + radius)
                        + ')'
                );
                $.each(
                    pieData,
                    function (idx, val) {
                        val.id = val.data.id;
                    }
                );

            var slices = pie.selectAll('.slice').data(pieData, this.uniqueness());

            slices
                .enter()
                    .append('path')
//                        .attr('fill',   function (d) {return d.data.color } )
                        .attr('class', 'slice')
                        .call(funkyTown);
            ;

	slices
		//.transition().duration(this.options.transitionTime)
//		.data(pieData)
.call(mouseAction)
		.transition().duration(this.options.transitionTime)
		.call(funkyTown)
		.call($pie.endall, function() {
		    $pie.initialized = true;
		    $pie.lastPieData = pieData;
		});

           /* slices
                    .call(mouseAction)
                    .transition()
                    .duration(500)
                    .call(funkyTown)
            ;*/


            slices
                .exit()
                    //.remove();
                    .transition()
                    .duration(this.options.transitionTime)
                    .attrTween("d", function(d, idx) {

                            var endPoint = {startAngle : d.startAngle, endAngle : d.startAngle};
                            if (idx > 0) {
                                endPoint = {startAngle : pieData[idx - 1].endAngle, endAngle : pieData[idx - 1].endAngle};
                            }

                            var interpolate = d3.interpolate(this._current, endPoint);

                            this._current = interpolate(0);
                            return function(t) {
                                return arcMaker(interpolate(t));
                            };
                        })
                    .each('end', function() { this.remove() } )
                    ;

            var labels = pie.selectAll('.label').data(pieData, this.uniqueness());

            labels
                .enter()
                    .append('text')
                        .attr('class', 'label')
                        .call(labelTown)
            ;

            labels
                    .call(mouseAction)
                    .transition()
                    .duration(this.options.transitionTime)
                    .call(labelTown)
            ;

            labels
                .exit()
                    .remove();

        },

        renderXAxis : function() {},
        renderYAxis : function() {},


    });

} );
