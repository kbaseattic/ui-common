/*

                    var dataset = [];

                    var points = 200;

                    var randomColor = function() {
                        var colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'orange', 'black'];
                        return colors[Math.floor(Math.random() * colors.length)];
                    }

                    var randomShape = function() {
                    //return 'circle';
                        var shapes = ['circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'square', 'triangle-up', 'triangle-down', 'diamond', 'cross'];
                        return shapes[Math.floor(Math.random() * shapes.length)];
                    }

                    for (var idx = 0; idx < points; idx++) {
                        dataset.push(
                            {
                                x : Math.random() * 500,
                                y : Math.random() * 500,
                                weight : Math.random() * 225,
                                color : randomColor(),
                                label : 'Data point ' + idx,
                                shape : randomShape(),
                            }
                        );
                    }

                    var $scatter = $('#scatterplot').css({width : '800px', height : '500px'}).kbaseScatterplot(
                        {
                            scaleAxes   : true,

                            //xLabel      : 'Some useful experiment',
                            //yLabel      : 'Meaningful data',

                            dataset : dataset,

                        }
                    );

*/

define('kbaseScatterplot',
    [
        'jquery',
        'd3',
        'kbaseVisWidget',
        'RGBColor',
        'geometry_rectangle',
        'geometry_point',
        'geometry_size',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseScatterplot",
	  parent: "kbaseVisWidget",

        version: "1.0.0",
        options: {
            overColor : 'yellow',
        },

        _accessors : [

        ],

        defaultXDomain : function() {

            if (this.dataset() == undefined) {
                return [0,0];
            }

            var min = 0.9 * d3.min(this.dataset().map( function(d) {return d.x}));
            if (min > 0) {
                min = 0;
            }

            return [
                min,
                1.1 * d3.max(this.dataset().map( function(d) {return d.x}))
            ];
        },

        defaultYDomain : function() {

            if (this.dataset() == undefined) {
                return [0,0];
            }

            var min = 0.9 * d3.min(this.dataset().map( function(d) {return d.y}));
            if (min > 0) {
                min = 0;
            }

            return [
                min,
                1.1 * d3.max(this.dataset().map( function(d) {return d.y}))
            ];
        },

        renderChart : function() {

            if (this.dataset() == undefined) {
                return;
            }

            var bounds = this.chartBounds();
            var $scatter = this;

            var funkyTown = function() {
                this
                    .attr('cx',
                        function (d) {
                            return $scatter.xScale()(d.x)
                        }
                    )
                    .attr('cy',
                        function (d) {
                            return $scatter.yScale()(d.y)
                        }
                    )
                    .attr('r',
                        function (d) {
                            return d.weight
                        }
                    )
                    //.attr('y', function (d) { return $scatter.yScale()(d.y) })
                    .attr('fill',
                        function(d) {
                            return d.color;
                        }
                    )
            };

            var mouseAction = function() {

                this.on('mouseover', function(d) {

                    if ($scatter.options.overColor) {
                        d3.select(this)
                            .attr('stroke', $scatter.options.overColor)
                            .attr('stroke-width', 3);
                    }

                    var label = d.label
                        ? d.label
                        : d.weight + ' at (' + d.x + ',' + d.y + ')';

                    if (label != undefined) {
                        $scatter.showToolTip(
                            {
                                label : label,
                            }
                        );
                    }
                })
                .on('mouseout', function(d) {
                    if ($scatter.options.overColor) {
                        d3.select(this)
                            .transition()
                            .attr('stroke', 'none');
                    }

                    $scatter.data('D3svg').select('.yPadding').selectAll('g g text')
                        .attr("fill",
                            function(r,ri){
                               return 'black';
                            }
                    );
                    $scatter.hideToolTip();

                });
                return this;
            };

            var chart = this.data('D3svg').select('.chart').selectAll('.point');
            chart
                .data(this.dataset())
                .enter()
                    .append('path')
                    .attr('class', 'point')
                    .attr("transform", function(d) { return "translate(" + $scatter.xScale()(d.x) + "," + $scatter.yScale()(d.y) + ")"; })
                    .attr('d', function (d) { return d3.svg.symbol().type(d.shape).size(d.weight)() } )
                    .call(funkyTown)
                    .call(mouseAction)
            ;
            chart.data(this.dataset())
                .exit().remove();

            chart
                .data(this.dataset())
                    .call(mouseAction)
                    .transition()
                    .duration(500)
                        .call(funkyTown)
            ;



        },

        setYScaleRange : function(range, yScale) {
            return this._super(range.reverse(), yScale);
        },


    });

} );
