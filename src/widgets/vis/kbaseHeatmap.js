/*

*/

kb_define('kbaseHeatmap',
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

	    name: "kbaseHeatmap",
	  parent: "kbaseVisWidget",

        version: "1.0.0",
        options: {
            xScaleType  : 'ordinal',
            yScaleType  : 'ordinal',
            yGutter     : 80,
            yPadding    : 50,

            xPadding    : 80,
            xGutter     : 50,
            overColor   : '#999900',
            hmBGColor     : 'lightgray',

            rx : 2,
            ry : 2,

        },

        _accessors : [
            'spectrum',
        ],

        init : function(options) {
            this._super(options);

            return this;
        },

        setSpectrum : function(newSpectrum) {
            this.spectrum(
                d3.scale.ordinal()
                    .domain(d3.range(0,1))
                    .range(newSpectrum)
            );
        },

        defaultXDomain : function() {

            if (this.dataset() == undefined) {
                return [0,0];
            }

            return this.dataset().map(function(d) { return d.x });
        },

        defaultYDomain : function() {

            if (this.dataset() == undefined) {
                return [0,0];
            }

            return this.dataset().map(function(d) { return d.y });
        },

        setXScaleRange : function(range, xScale) {
            if (xScale == undefined) {
                xScale = this.xScale();
            }
            xScale.rangeBands(range);

            return xScale;
        },

        setYScaleRange : function(range, yScale) {

            if (yScale == undefined) {
                yScale = this.yScale();
            }

            yScale.rangeBands(range);

            return yScale;
        },

        renderXAxis : function() {

            if (this.xScale() == undefined || this.xScale().domain == undefined) {
                return;
            }

            var xAxis =
                d3.svg.axis()
                    .scale(this.xScale())
                    .orient('top');

            var gxAxis = this.data('D3svg').select('.yGutter').select('.xAxis');

            if (gxAxis[0][0] == undefined) {
                gxAxis = this.data('D3svg').select('.yGutter')
                    .append('g')
                        .attr('class', 'xAxis axis')
                        .attr("transform", "translate(0," + this.yGutterBounds().size.height + ")")
            }

            var $hm = this;
            gxAxis
                .transition()
                .duration(0)
                .call(xAxis)
                .selectAll("text")
                    .attr("transform", function (d, i) {
                        var bounds = $hm.yGutterBounds();
                        //bullshit hardwired magic numbers. The xAxis is "known"(?) to position @ (0,-9)
                        //arbitrarily rotate around -12 because it looks right. I got nothin'.
                        //then we move it 5 pixels to the right, which in our rotate coordinate system is
                        //5 pixels up. Whee!
                        return "rotate(-45,0,-12) translate(25,0)";// translate(2,3)";
                    })
            ;


        },

        renderXLabel : function() {
            var yGutterBounds = this.yGutterBounds();

            var xLabeldataset = [this.xLabel()];

            var xLabel = this.data('D3svg').select('.yPadding').selectAll('.xLabel');
            xLabel
                .data(xLabeldataset)
                    .text( this.xLabel() )
                .enter()
                    .append('text')
                        .attr('class', 'xLabel')
                        .attr('x', yGutterBounds.size.width / 2)
                        .attr('y', yGutterBounds.size.height / 2 + 3)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '11px')
                        .attr('font-family', 'sans-serif')
                        .attr('fill', 'black')
                        .text(this.xLabel());
            ;

        },

        renderChart : function() {

            var $hm = this;
            var bounds = this.chartBounds();

            if (this.dataset() == undefined) {
                return;
            }


        var funkyTown = function() {
            this
                .attr('x',
                    function (d) {
                        var xId = d.x;
                        if ($hm.options.useIDMapping) {
                            xId = $hm.xIDMap()[xId];
                        }
                        return $hm.xScale()(xId) + 1
                    }
                )
                .attr('y',
                    function (d) {
                        var yId = d.y;
                        if ($hm.options.useIDMapping) {
                            yId = $hm.yIDMap()[yId];
                        }
                        return $hm.yScale()(yId) + 1
                    }
                )
                //.attr('y', function (d) { return $hm.yScale()(d.y) })
                //.attr('opacity', function (d) { return d.value })
                .attr('width', $hm.xScale().rangeBand() - 2)
                .attr('height', $hm.yScale().rangeBand() - 2)
                .attr('rx', $hm.options.rx)
                .attr('ry', $hm.options.ry)
                .attr('fill',
                    function(d) {

                        var colorScale = d3.scale.linear()
                            .domain([0,1])
                            .range(['white', d.color]);

                        return colorScale(d.value);

                        return d.color;
                    }
                );
            return this;
        }

            var mouseAction = function() {
                this.on('mouseover', function(d) {
                    if ($hm.options.overColor) {
                        d3.select(this)
                            //.attr('fill', $hm.options.overColor)
                            .attr('stroke', $hm.options.overColor)
//                            .attr('opacity', '100%')
                            .attr('stroke-width', 5);

                        $hm.data('D3svg').select('.yGutter').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                    var xId = d.x;
                                    if ($hm.options.useIDMapping) {
                                        xId = $hm.xIDMap()[xId];
                                    }
                                    if (r == xId) {
                                        return $hm.options.overColor;
                                    }
                                }
                        );

                        $hm.data('D3svg').select('.xPadding').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                    var yId = d.y;
                                    if ($hm.options.useIDMapping) {
                                        yId = $hm.yIDMap()[yId];
                                    }
                                    if (r == yId) {
                                        return $hm.options.overColor;
                                    }
                                }
                        );

                        var xId = d.x;
                        if ($hm.options.useIDMapping) {
                            xId = $hm.xIDMap()[xId];
                        }
                        var yId = d.y;
                        if ($hm.options.useIDMapping) {
                            yId = $hm.yIDMap()[yId];
                        }

                        $hm.showToolTip(
                            {
                                label : d.label || 'Value for: ' + xId + ' - ' + yId + '<br>is ' + d.value,
                            }
                        );

                    }
                })
                .on('mouseout', function(d) {
                    if ($hm.options.overColor) {
                        d3.select(this)
                            //.transition()
                            //.attr('fill', d.color)
//                            .attr('opacity', function (d) { return d.value })
                            .attr('stroke', 0);

                        $hm.data('D3svg').select('.yGutter').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                   return 'black';
                                }
                        );

                        $hm.data('D3svg').select('.xPadding').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                   return 'black';
                                }
                        );

                        $hm.hideToolTip();

                    }
                })
                return this;
            };

            var transitionTime = this.initialized
                ? this.options.transitionTime
                : 0;

            var heatmap = this.D3svg().select( this.region('chart') ).selectAll('.hmBG').data([0]);

            heatmap
                .enter()
                    .append('rect')
                        .attr('x', 0 )
                        .attr('y', 0 )
                        .attr('width',  bounds.size.width )
                        .attr('height', bounds.size.height )
                        .attr('fill', $hm.options.hmBGColor )
                        .attr('class', 'hmBG');

            var chart = this.D3svg().select( this.region('chart') ).selectAll('.cell').data(this.dataset());
            chart
                .enter()
                    .append('rect')
                    .attr('class', 'cell')
            ;
            chart
                .call(mouseAction)
                .transition()
                .duration(transitionTime)
                .call(funkyTown)
                .call($hm.endall, function() {
                    $hm.initialized = true;
                });
            ;

            chart
                .data(this.dataset())
                .exit()
                    .remove();

        },


    });

} );
