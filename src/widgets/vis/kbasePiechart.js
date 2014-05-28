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
            startAngle : 0,
            endAngle : 2 * Math.PI,
            gradient : true,
        },

        _accessors : [

        ],

        init : function(options) {
            this._super(options);

            this.uniqueID = $.proxy( function(d) {
                if (d.data == undefined) {
                    d.data = {};
                }
                var ret = d.data.id || (d.data.id = this.ticker() );
                return ret;
            }, this);

            return this;
        },

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
    this.pieLayout = d3.layout.pie()
        .sort(null)
        .startAngle(this.options.startAngle)
        .endAngle(this.options.endAngle)
        .value(function (d, idx) { return pieScale(d.value) });
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

                //this.attr('fill', function (d, idx) { return d.data.color });

                if (this.attrTween) {
                    this
                        //*
                        .attrTween('fill',
                            function (d, idx) {
                                var uniqueFunc = $pie.uniqueness();

                                var currentID = uniqueFunc == undefined
                                    ? undefined
                                    : uniqueFunc(d);

                                var gradID = d.data.gradID;
                                if (gradID == undefined) {

                                    var newGradID;
                                    if ($pie.lastPieData != undefined && idx < $pie.lastPieData.length) {


                                        //no id? we're using indexes. Easy.
                                        if (currentID == undefined) {
                                            newGradID = $pie.lastPieData[idx].data.gradID;
                                        }
                                        //id? Shit. Iterate and look up by the id
                                        else {
                                            $.each(
                                                $pie.lastPieData,
                                                function (idx, val) {
                                                    var lastID = uniqueFunc(val);
                                                    if (lastID == currentID) {
                                                        newGradID = val.data.gradID;
                                                        return;
                                                    }
                                                }
                                            );
                                        }

                                    }

                                    if (newGradID == undefined) {
                                        newGradID = $pie.uuid();
                                    }

                                    gradID = d.data.gradID = newGradID;
                                }

                                var gradient = 'url(#'
                                    + $pie.radialGradient(
                                        {
                                            startColor : d.data.color,
                                            stopColor : $pie.options.gradient ? $pie.options.radialGradientStopColor : d.data.color,
                                            id : gradID
                                        }
                                    ) + ')';

                                return function(t) { return gradient};
                            }
                       )//*/
                        .attrTween("d", function(d, idx) {

                            //this._current = this._current || d;//{startAngle : 0, endAngle : 0};
                            //this._current = this._current || {startAngle : d.startAngle, endAngle : d.startAngle};
//$pie.lastPieData = pieData;
                            if (this._current == undefined) {
                                if ($pie.initialized) {

                                    if (idx < $pie.lastPieData.length - 1) {
                                        this._current = {startAngle : $pie.lastPieData[idx + 1].startAngle, endAngle : $pie.lastPieData[idx + 1].startAngle};
                                    }
                                    else {
                                        this._current = {startAngle : $pie.options.endAngle, endAngle: $pie.options.endAngle};
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
                                this._currentOpacity = $pie.initialized ? 0 : 1;
                            }
                            var interpolate = d3.interpolate(this._currentOpacity, 1);
                            this._currentOpacity = interpolate(0);
                            var $me = this;
                            return function (t) {
                                return $me._currentOpacity = interpolate(t);
                            }
                        })
                        .attrTween("transform", function(d, idx) {
                            //this._current=  this._current || d;
                            if (this._current == undefined) {
                                if ($pie.initialized) {

                                    if (idx < $pie.lastPieData.length - 1) {
                                        this._current = {startAngle : $pie.lastPieData[idx + 1].startAngle, endAngle : $pie.lastPieData[idx + 1].startAngle};
                                    }
                                    else {
                                        this._current = {startAngle : $pie.options.endAngle, endAngle: $pie.options.endAngle};
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
                        if (val.data.id != undefined) {
                            val.id = val.data.id;
                        }
                    }
                );

            var slices = pie.selectAll('.slice').data(pieData, this.uniqueness());

            slices
                .enter()
                    .append('path')
                        .attr('class', 'slice')
                        .attr('fill', function (d) { return d.data.color } )
                        //.call(funkyTown);
            ;

    var transitionTime = this.initialized
        ? this.options.transitionTime
        : 0;

	slices
		//.transition().duration(this.options.transitionTime)
//		.data(pieData)
.call(mouseAction)
		.transition().duration(transitionTime)
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
                    .duration(transitionTime)
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

            var labelG = this.data('D3svg').select('.chart').selectAll('.labelG').data([0]);
            labelG.enter().append('g')
                .attr('class', 'labelG')
                .attr('transform',
                    'translate('
                        + (bounds.size.width / 2 - radius + radius)
                        + ','
                        + (bounds.size.height / 2 - radius + radius)
                        + ')'
                );

            var labels = labelG.selectAll('.label').data(pieData, this.uniqueness());

            labels
                .enter()
                    .append('text')
                        .attr('class', 'label')
                        .call(labelTown)
            ;

            labels
                    .call(mouseAction)
                    .transition()
                    .duration(transitionTime)
                    .call(labelTown)
            ;

            labels
                .exit()
                    .transition()
                    .duration(transitionTime)
                    .attrTween('fill-opacity', function (d, idx) {
                        var interpolate = d3.interpolate(1, 0);
                        this._currentOpacity = interpolate(0);
                        return interpolate;
                    })
                    .attrTween("transform", function(d, idx) {

                            var endPoint = {startAngle : d.startAngle, endAngle : d.startAngle};
                            if (idx > 0) {
                                if (idx > pieData.length) {
                                    idx = pieData.length;
                                }
                                endPoint = {startAngle : pieData[idx - 1].endAngle, endAngle : pieData[idx - 1].endAngle};
                            }

                            var interpolate = d3.interpolate(this._current, endPoint);

                            this._current = interpolate(0);
                            return function(t) {
                                var d2 = interpolate(t);
                                var pos = arcMaker.centroid(d2);
                                return "translate("+ pos +")";
                            };
                            return function(t) {
                                return arcMaker(interpolate(t));
                            };
                        })
//                    .call(labelTown)
                    .each('end', function() { this.remove() } );
                    //.remove();

        },

        renderXAxis : function() {},
        renderYAxis : function() {},


    });

} );
