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
            autoEndAngle : false,
            colorScale : d3.scale.category20(),
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
                    return {startAngle : this.lastPieData[idx + 1].startAngle, endAngle : this.lastPieData[idx + 1].startAngle};
                }
                else {
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
            var ret =  (d.startAngle + (d.endAngle - d.startAngle)/2);
            //console.log("MA1 " + ret + ' for ' + d.data.label);
            return ret;
        },

        midPosition : function(d) {
        var m1 = (this.midAngle(d)) ;//- this.options.startAngle);
            var midAngle = m1 % (2 * Math.PI);
//console.log("MA : " + midAngle + ' for ' + d.data.label);
//console.log(m1);
//console.log(this.options.startAngle);
//console.log(2 * Math.PI);
            var ret =
                0 < midAngle && midAngle < Math.PI
                    ? 1
                    : -1;
                    //console.log("RET : " + ret);
                    return ret;
        },

        setDataset : function(newDataset) {
            $.each(
                newDataset,
                function (idx, val) {

                if (typeof val == 'number') {
                    newDataset[idx] = {value : val};
                }
                }
            );

            this._super(newDataset);
        },

        renderChart : function() {

            if (this.dataset() == undefined) {
                return;
            }

            if (this.dataset().length == 0) {
                this.initialized = false;
                this.lastPieData = undefined;
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
                    }
                );

                if (percent > 1) {
                    percent = 1;
                }
                this.options.endAngle = percent * 2 * Math.PI;

            }

            //if (this.pieLayout == undefined) {
                this.pieLayout = d3.layout.pie()
                    .sort(null)
                    .startAngle(this.options.startAngle)
                    .endAngle(this.options.endAngle)
                    .value(function (d, idx) { return d.value ;});
            //}

            var pieData = this.pieLayout($pie.dataset());

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

                                if (d.data.color == undefined) {
                                    d.data.color = $pie.options.colorScale(idx);
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

                                this._current = $pie.startingPosition(d, idx);
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
                                this._current = $pie.startingPosition(d, idx);
                            }

                            var endPoint = d;
                            if (opacity == 0) {
                                endPoint = {startAngle : d.startAngle, endAngle : d.startAngle};
                                if (idx > 0 && pieData.length) {
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
                                //console.log(d.data.label + " IS AT " + $pie.midPosition(d2) + ' via ' + $pie.midAngle(d2));
                                    pos[0] = radius * 1.05 * $pie.midPosition(d2);
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
                                if ($pie.options.outsideLabels) {
                                    return $pie.midPosition(d2) > 0 ? "start" : "end";
                                }
                                else {
                                    return 'middle';
                                }
                            };
                        });
                    }


                return this;
            }

            var drag = d3.behavior.drag();

                drag.on('dragstart', function(d) {
                    //d.__dragX = 0;
                    //d.__dragY = 0;
                    this.__delta = 0;
                })
                .on('drag', function(d) {

                    //d.__dragX += d3.event.dx;
                    //d.__dragY += d3.event.dy;

                    this.__delta +=  $pie.midPosition(d) * d3.event.dy;// + d3.event.dx;// - d3.event.dx;

                    var dragThrottle = 20;

                    if (this.__delta > dragThrottle || this.__delta < -1 * dragThrottle) {
                        var distance = this.__delta;

                        var currentStartAngle = $pie.options.startAngle;
                        var proposedStartAngle = currentStartAngle + Math.PI * (distance / 2) / radius;

                        $pie.options.startAngle = proposedStartAngle;
                        $pie.options.endAngle = $pie.options.startAngle + 2 * Math.PI;
                        $pie.renderChart();
                        this.__delta = 0;

                    }

                })
                .on('dragend', function(d) {
                    //delete d.__dragX;
                    delete this.__delta;
                })
                ;

            //there is no mouse action on a pie chart for now.
            var sliceAction = function() {



                /*this.on('click', function(d) {

                    if (this.clicked) {

                        var sliceMover = d3.svg.arc()
                            .innerRadius(0)
                            .outerRadius($pie.options.sliceOffset);

                        var pos = sliceMover.centroid(d);

                        d3.select(this)
                            //.attr('stroke-width', $pie.options.strokeWidth * 2)
                            //.attr('stroke', $pie.options.highlightColor)
                            .attr('transform', 'translate(' + pos + ')')
                        ;
                    }
                    else {
                        d3.select(this)
                            //.attr('stroke-width', $pie.options.strokeWidth)
                            //.attr('stroke', $pie.options.strokeColor)
                            .attr('transform', '')
                        ;
                    }

                    this.clicked = ! this.clicked;

                })*/
                /*.on('mouseout', function(d) {
                    d3.select(this)
                        //.attr('stroke-width', $pie.options.strokeWidth)
                        //.attr('stroke', $pie.options.strokeColor)
                        .attr('transform', '')
                    ;

                })*/
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
                        .attr('fill', function (d, idx) {
                            if (d.data.color == undefined) {
                                d.data.color = $pie.options.colorScale(idx);
                            }
                            return d.data.color
                        } )
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
                .call(drag)
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
                            if (idx > 0 && pieData.length && idx <= pieData.length) {
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
                                    this._current = this._current || $pie.startingPosition(d, idx);

                                    var endPoint = d;
                                    if (opacity == 0) {
                                        endPoint = {startAngle : d.startAngle, endAngle : d.startAngle};
                                        if (idx > 0 && pieData.length) {
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
                                        var textAnchor = textArcMaker.centroid(d2);
                                        if ($pie.options.outsideLabels) {
                                            textAnchor[0] = radius * 1.05 * $pie.midPosition(d2);
                                        }
                                        return [smallArcMaker.centroid(d2), textArcMaker.centroid(d2), textAnchor];
                                    };
                                });
                        }
                        return this;
                    };

                    var lines = labelG
                        .selectAll('polyline')
                        .data(
                            pieData
                                .filter( function(d) { return d.data.label != undefined && d.data.label.length } )
                            ,
                            this.uniqueness()
                        );

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
