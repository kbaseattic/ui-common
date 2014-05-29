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
            startingPosition : 'final',
            strokeWidth : 1,

            strokeColor : 'white',
            highlightColor : 'black',
            sliceOffset : 25,

            bgColor : 'rgba(0,0,0,0)',

            xOffset : 0,
            yOffset : 0,

            outsideLabels : true,
            labels : true,
            autoEndAngle : true,
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

        startingPosition : function(d, idx) {

            if (this.initialized) {

                if (idx < this.lastPieData.length - 1) {
                console.log("START NOT AT END");
                    return {startAngle : this.lastPieData[idx + 1].startAngle, endAngle : this.lastPieData[idx + 1].startAngle};
                }
                else {
                console.log("START AT END");
                    return {startAngle : this.options.endAngle, endAngle: this.options.endAngle};
                }
            }

            //the first line animates the wedges in place, the second animates from the top, the third draws them rendered
            else if (this.options.startingPosition == 'slice') {
                return {startAngle : d.startAngle, endAngle : d.startAngle};
            }
            else if (this.options.startingPosition == 'top') {
                return {startAngle : this.options.startAngle, endAngle : this.options.startAngle};
            }
            else if (this.options.startingPosition == 'final') {
                return {startAngle : d.startAngle, endAngle : d.endAngle};
            }

        },

        midAngle : function(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        },

        renderChart : function() {

            if (this.dataset() == undefined) {
                return;
            }

            var startingOpacity = 0;
            if (this.options.startingPosition == 'final') {
                startingOpacity = 1;
            }

            var bounds = this.chartBounds();
            var $pie  = this;

            if (this.options.autoEndAngle) {
                var percent = 0;
                $.each(
                    $pie.dataset(),
                    function (idx, val) {
                        percent += val.value;
                        console.log("SUM " + val.value);
                    }
                );
                console.log("PERCENT : " + percent);
                if (percent > 1) {
                    percent = 1;
                }
                this.options.endAngle = percent * 2 * Math.PI;
                console.log("EA " + this.options.endAngle);
            }

            //if (this.pieLayout == undefined) {
                this.pieLayout = d3.layout.pie()
                    .sort(null)
                    .startAngle(this.options.startAngle)
                    .endAngle(this.options.endAngle)
                    .value(function (d, idx) { return d.value ;});
            //}

            var pieData = this.pieLayout($pie.dataset());
            console.log("PIE DATA");console.log(pieData);
            console.log(this.options.startAngle + ' -> ' + this.options.endAngle);

            var radius = this.options.outerRadius;
            if (radius <= 0) {
                var diameter = bounds.size.width < bounds.size.height
                    ? bounds.size.width
                    : bounds.size.height;

                radius = diameter / 2 + radius;
                if (radius < 0) {
                    radius = diameter / 2;
                }
            }

            var innerRadius = this.options.innerRadius;
            if (innerRadius < 0) {
                innerRadius = radius + this.options.innerRadius;
            }

            if (innerRadius < 0) {
                innerRadius = 0;
            }

            var arcMaker = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius);

            var textArcMaker = d3.svg.arc()
                .innerRadius(innerRadius + (radius - innerRadius) * 8 / 10)
                .outerRadius(innerRadius + (radius - innerRadius) * 8 / 10);

            var smallArcMaker = d3.svg.arc()
                .innerRadius(innerRadius + (radius - innerRadius) / 2)
                .outerRadius(innerRadius + (radius - innerRadius) / 2);

            if (! $pie.options.outsideLabels) {
                textArcMaker = arcMaker;
            }

            var funkyTown = function() {

                //this.attr('fill', function (d, idx) { return d.data.color });
                /*this.attr('transform',
                    function (d) {
                        var pos = arcMaker.centroid(d);
                        console.log(pos);
                        return "translate(" + pos + ")";
                    }
                );*/

                if (this.attrTween) {
                    this
                        //*
                        .attrTween('fill',
                            function (d, idx) {
                            console.log("ATTR TWEEN FOR " + d.data.label);
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
                                            id : gradID,
                                            r : radius
                                        }
                                    ) + ')';

                                return function(t) { return gradient};
                            }
                       )//*/
                        .attrTween("d", function(d, idx) {

                            //this._current = this._current || d;//{startAngle : this.options.startAngle, endAngle : this.options.startAngle};
                            //this._current = this._current || {startAngle : d.startAngle, endAngle : d.startAngle};
//$pie.lastPieData = pieData;
                            if (this._current == undefined) {
                            console.log('a');
                                this._current = $pie.startingPosition(d, idx);
                                console.log("STARTING AT " + d.data.label);console.log(this._current);
                                console.log('o');
                                console.log(this._current);
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

            var labelTown = function( opacity ) {

                if (opacity == undefined) {
                    opacity = 1;
                }

                this
                    .attr("text-anchor", "middle")
                ;

                if (this.attrTween) {

                    this
                        .text(function(d) {
                            return d.data.label;
                        })
                        .attrTween('fill-opacity', function (d, idx) {
                            if (this._currentOpacity == undefined) {
                                this._currentOpacity = $pie.initialized ? 0 : startingOpacity;
                            }
                            var interpolate = d3.interpolate(this._currentOpacity, opacity);
                            this._currentOpacity = interpolate(0);
                            var $me = this;
                            return function (t) {
                                return $me._currentOpacity = interpolate(t);
                            }
                        })
                        .attrTween("transform", function(d, idx) {
                            //this._current=  this._current || d;
                            if (this._current == undefined) {
                            console.log('b');
                                this._current = $pie.startingPosition(d, idx);
                            }

                            var endPoint = d;
                            if (opacity == 0) {
                                endPoint = {startAngle : d.startAngle, endAngle : d.startAngle};
                                if (idx > 0) {
                                    if (idx > pieData.length) {
                                        idx = pieData.length;
                                    }
                                    endPoint = {startAngle : pieData[idx - 1].endAngle, endAngle : pieData[idx - 1].endAngle};
                                }
                            }

                            var interpolate = d3.interpolate(this._current, endPoint);

                            this._current = interpolate(0);

                            return function(t) {
                                var d2 = interpolate(t);
                                var pos = textArcMaker.centroid(d2);
                                if ($pie.options.outsideLabels) {
                                    pos[0] = 1.1 * radius * ($pie.midAngle(d2) < Math.PI ? 1 : -1);
                                }
                                return "translate("+ pos +")";
                            };

                        })
                        .styleTween("text-anchor", function(d){
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function(t) {
                                var d2 = interpolate(t);
                                return $pie.midAngle(d2) < Math.PI ? "start":"end";
                            };
                        });
                    }


                return this;
            }

            //there is no mouse action on a pie chart for now.
            var sliceAction = function() {

                this.on('mouseover', function(d) {

                    var sliceMover = d3.svg.arc()
                        .innerRadius(0)
                        .outerRadius($pie.options.sliceOffset);

                    var pos = sliceMover.centroid(d);

                    d3.select(this)
                        //.attr('stroke-width', $pie.options.strokeWidth * 2)
                        //.attr('stroke', $pie.options.highlightColor)
                        .attr('transform', 'translate(' + pos + ')')
                    ;

                })
                .on('mouseout', function(d) {
                    d3.select(this)
                        //.attr('stroke-width', $pie.options.strokeWidth)
                        //.attr('stroke', $pie.options.strokeColor)
                        .attr('transform', '')
                    ;

                })
                return this;
            };

            var labelAction = function() { return this };

            var pie = this.data('D3svg').select('.chart').selectAll('.pie').data([0]);
            pie.enter().append('g')
                .attr('class', 'pie')
                .attr('transform',
                    'translate('
                        + (bounds.size.width / 2 - radius + radius + this.options.xOffset)
                        + ','
                        + (bounds.size.height / 2 - radius + radius + this.options.yOffset)
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
                        .attr('stroke', $pie.options.strokeColor)
                        .attr('stroke-width', $pie.options.strokeWidth)
                        .attr('stroke-linejoin', 'bevel')
                        //.call(funkyTown);
            ;

            var transitionTime = this.initialized
                ? this.options.transitionTime
                : 0;

            transitionTime = this.options.transitionTime;

            slices
                .call(sliceAction)
                .transition().duration(transitionTime)
                .call(funkyTown)
                .call($pie.endall, function() {
                    $pie.initialized = true;
                    $pie.lastPieData = pieData;
                });



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

            if (this.options.labels) {
                var labelG = this.data('D3svg').select('.chart').selectAll('.labelG').data([0]);
                labelG.enter().append('g')
                    .attr('class', 'labelG')
                    .attr('transform',
                        'translate('
                            + (bounds.size.width / 2 - radius + radius + this.options.xOffset)
                            + ','
                            + (bounds.size.height / 2 - radius + radius + this.options.yOffset)
                            + ')'
                    );

                var labels = labelG.selectAll('.label').data(pieData, this.uniqueness());

                labels
                    .enter()
                        .append('text')
                            .attr('class', 'label')
                            .call(function() { labelTown.call(this, 1) } )
                ;

                labels
                        .call(labelAction)
                        .transition()
                        .duration(transitionTime)
                        .call(function() { labelTown.call(this, 1) } )
                ;

                labels
                    .exit()
                        .transition()
                        .duration(transitionTime)
                        .call(function() { labelTown.call(this, 0) } )
                        .each('end', function() { this.remove() } );

                if (this.options.outsideLabels) {
                    var lineTown = function(opacity) {

                        if (opacity == undefined) {
                            opacity = 1;
                        }

                        if (this.attrTween) {
                            this
                                .attrTween('stroke-opacity', function (d, idx) {
                                    if (this._currentOpacity == undefined) {
                                        this._currentOpacity = $pie.initialized ? 0 : startingOpacity;
                                    }
                                    var interpolate = d3.interpolate(this._currentOpacity, opacity);
                                    this._currentOpacity = interpolate(0);
                                    var $me = this;
                                    return function (t) {
                                        return $me._currentOpacity = interpolate(t);
                                    }
                                })
                                .attrTween("points", function(d, idx){
                                        console.log('c - ' + opacity);
                                    this._current = this._current || $pie.startingPosition(d, idx);
                                    if (opacity == 0) {
                                        console.log(this._current);
                                        console.log(d);
                                    }

                                    var endPoint = d;
                                    if (opacity == 0) {
                                        if (idx > 0) {
                                            if (idx > pieData.length) {
                                                idx = pieData.length;
                                            }
                                            endPoint = {startAngle : pieData[idx - 1].endAngle, endAngle : pieData[idx - 1].endAngle};
                                        }
                                        console.log("NEW END POINT!");
                                    }

                                    var interpolate = d3.interpolate(this._current, endPoint);

                                    this._current = interpolate(0);
                                    return function(t) {
                                        var d2 = interpolate(t);
                                        var textAnchor = textArcMaker.centroid(d2);
                                        if ($pie.options.outsideLabels) {
                                            textAnchor[0] = radius * 1.05 * ($pie.midAngle(d2) < Math.PI ? 1 : -1);
                                        }
                                        return [smallArcMaker.centroid(d2), textArcMaker.centroid(d2), textAnchor];
                                    };
                                });
                        }
                        return this;
                    };

                    var lines = labelG.selectAll('polyline').data(pieData, this.uniqueness());

                    lines
                        .enter()
                            .append('polyline')
                                .attr('stroke', 'black')
                                .attr('stroke-width', 1)
                                .attr('fill', 'rgba(0,0,0,0)')
                    ;

                    lines
                            .transition()
                            .duration(transitionTime)
                            .call(function() { lineTown.call(this, 1) } )
                    ;

                    lines
                        .exit()
                            .transition()
                            .duration(transitionTime)
                            .call(function() { lineTown.call(this, 0) } )
                            .each('end', function() { this.remove() } )
                    ;
                }       //end if outsideLabels
            }           //end if labels

        },

        renderXAxis : function() {},
        renderYAxis : function() {},


    });

} );
