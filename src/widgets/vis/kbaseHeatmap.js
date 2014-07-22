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
            yPadding    : 20,

            xPadding    : 150,
            xGutter     : 80,
            overColor   : '#999900',
            hmBGColor     : 'lightgray',
            colors : ["#0000ff",'#000000', "#ff0000"],

            //clickCallback : function(d, $hm) {
            //    $hm.debug(d);
            //},

            rx : 2,
            ry : 2,

        },

        _accessors : [
            'spectrum',
        ],

        init : function(options) {
            this._super(options);

            this.options.gradientID = this.linearGradient( { colors : this.options.colors });

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

            //return this.dataset().map(function(d) { return d.x });
            //var i = 0;
            //return this.dataset().data[0].map(function(d) { return i++});
            return this.dataset().column_labels;
        },

        defaultYDomain : function() {

            if (this.dataset() == undefined) {
                return [0,0];
            }

            //return this.dataset().map(function(d) { return d.y });
            //var i = 0;
            //return this.dataset().data.map(function(d) { return i++});
            return this.dataset().row_labels;
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

            xAxis.tickFormat(function(d) {
                if (d.length > 15) {
                    return d.substring(0,15) + '...';
                }
                return d;
            });

            var gxAxis = this.D3svg().select('.yGutter').select('.xAxis');

            if (gxAxis[0][0] == undefined) {
                gxAxis = this.D3svg().select('.yGutter')
                    .append('g')
                        .attr('class', 'xAxis axis')
                        .attr("transform", "translate(0," + this.yGutterBounds().size.height + ")")
            }

            var $hm = this;

            var ma = function() {
                this.on('mouseover', function(d) {

                    var xSi = 0;
                    var roundedXScale = d3.scale.linear()
                        .domain($hm.xScale().range())
                        .range($hm.xScale().domain().map(function(d) { return xSi++}))
                    ;

                    var xIdx = Math.floor(roundedXScale(d3.mouse(this)[0]));

                    var xScaleInvert = d3.scale.ordinal()
                        .domain(roundedXScale.range())
                        .range($hm.xScale().domain())
                    ;

                    var xLabels = d3.scale.ordinal()
                        .domain(roundedXScale.range())
                        .range($hm.dataset().column_labels);

                    var xm = xScaleInvert(xIdx);


                    $hm.D3svg().select('.yGutter').selectAll('g g text')
                        .attr("fill",
                            function(r,ri){
                                var xId = xm;

                                if ($hm.options.useIDMapping) {
                                    xId = $hm.xIDMap()[xId];
                                }
                                if (r == xId) {
                                    var xLabel = xLabels(xIdx);
                                    if (xLabel != xm) {
                                        $hm.showToolTip(
                                            {
                                                label : xLabel,
                                            }
                                        );
                                    }
                                    return $hm.options.overColor;
                                }
                            }
                    );

                    }
                )
                .on('mouseout', function(d) {
                        $hm.D3svg().select('.yGutter').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                   return 'black';
                                }
                        );
                        $hm.hideToolTip();
                    }
                )
                ;
                return this;
            };

            gxAxis
                .call(ma)
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
                        var width = d3.select(this).node().getComputedTextLength();

                        return "rotate(-45,0,0) translate(" + (width / 2 + 5) + ",5)";// translate(2,3)";
                    })
            ;

            gxAxis.selectAll('text').each(function(d,i) {
                d3.select(this).attr('data-id', $hm.dataset().column_ids[i]);
                d3.select(this)
                    .on('mouseover', function(d) {
                        d3.select(this).attr('fill', $hm.options.overColor);
                        var d3this = d3.select(this);
                        if (d3this.text() != $hm.dataset().column_labels[i]) {
                            $hm.showToolTip(
                                {
                                    label : $hm.dataset().column_labels[i]
                                }
                            );
                        }
                    })
                    .on('mouseout', function(d) {
                        d3.select(this).attr('fill', 'black');
                        $hm.hideToolTip();
                    })
            });


        },

        renderXLabel : function() {
            var yGutterBounds = this.yGutterBounds();

            var xLabeldataset = [this.xLabel()];

            var xLabel = this.D3svg().select('.yPadding').selectAll('.xLabel');
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

        renderYLabel : function() {
            var xGutterBounds = this.xGutterBounds();

            var yLabel = this.D3svg().select( this.region('xGutter') ).selectAll('.yLabel').data([0]);

            yLabel.enter()
                .append('rect')
                    .attr('x', 5)
                    .attr('y', 0)
                    .attr('width',  xGutterBounds.size.width / 3)
                    .attr('height', xGutterBounds.size.height)
                    .attr('fill', 'url(#' + this.options.gradientID + ')')
            ;

            var colorScale = this.colorScale();

            var domain = [ colorScale.domain()[colorScale.domain().length - 1], colorScale.domain()[0] ];

            var tempScale =
                d3.scale.linear()
                    .domain( domain )
                    .range( [0, xGutterBounds.size.height] )
                    .nice();

            var tempAxis =
                d3.svg.axis()
                    .scale(tempScale)
                    .orient('right');

            var gtempAxis = this.D3svg().select( this.region('xGutter') ).select('.tempAxis');

            var $hm = this;

            if (gtempAxis[0][0] == undefined) {
                gtempAxis = this.D3svg().select( this.region('xGutter') )
                    .append('g')
                        .attr('class', 'tempAxis axis')
                        .attr("transform", "translate(" + (xGutterBounds.size.width / 3 + 6) + ",0)")
            }

            tempAxis.tickFormat(function(d) {
                if (d.length > 23) {
                    return d.substring(0,20) + '...';
                }
                return d;
            });

            gtempAxis.transition().call(tempAxis);


        },

        renderYAxis : function() {

            if (this.yScale() == undefined) {
                return;
            }
            var yAxis =
                d3.svg.axis()
                    .scale(this.yScale())
                    .orient('left');

            var gyAxis = this.D3svg().select( this.region('xPadding') ).select('.yAxis');

            var $hm = this;

            if (gyAxis[0][0] == undefined) {
                gyAxis = this.D3svg().select( this.region('xPadding') )
                    .append('g')
                        .attr('class', 'yAxis axis')
                        .attr("transform", "translate(" + this.xPaddingBounds().size.width + ",0)")
            }

            yAxis.tickFormat(function(d) {
                if (d.length > 23) {
                    return d.substring(0,20) + '...';
                }
                return d;
            });

            gyAxis.transition().call(yAxis);

            gyAxis.selectAll('text').each(function(d,i) {
                d3.select(this).attr('data-id', $hm.dataset().row_ids[i]);
                d3.select(this)
                    .on('mouseover', function(d) {
                        d3.select(this).attr('fill', $hm.options.overColor);
                        var d3this = d3.select(this);
                        if (d3this.text() != $hm.dataset().row_labels[i]) {
                            $hm.showToolTip(
                                {
                                    label : $hm.dataset().row_labels[i]
                                }
                            );
                        }
                    })
                    .on('mouseout', function(d) {
                        d3.select(this).attr('fill', 'black');
                        $hm.hideToolTip();
                    })
            });


        },

        colorScale : function() {

            var colorScale = this.options.colorScale;

            if (colorScale == undefined) {

                var max = this.options.maxValue;
                var min = this.options.minValue;
                if (max == undefined || min == undefined) {
                    max = 0;
                    min = 0;
                    for (var i = 0; i < this.dataset().data.length; i++) {
                        var row = this.dataset().data[i];
                        for (var j = 0; j < row.length; j++) {
                            if (row[j] > max) {
                                max = row[j];
                            }
                            if (row[j] < min) {
                                min = row[j];
                            }
                        }
                    }
                }

                var domain = d3.range(min, max, Math.floor((max - min) / this.options.colors.length));
                domain[0] = min;
                domain[domain.length - 1] = max;

                colorScale = d3.scale.linear()
                    .domain(domain)
                    .range(this.options.colors);
            }

            return colorScale;
        },

        renderChart : function() {

            var $hm = this;
            var bounds = this.chartBounds();

            if (this.dataset() == undefined) {
                return;
            }


        var yIdScale = this.yScale().copy();
        yIdScale.domain(this.dataset().row_ids);

        var xIdScale = this.xScale().copy();
        xIdScale.domain(this.dataset().column_ids);

        var funkyTown = function() {
            this
                .attr('x',
                    function (d) {
                        var xId = d.x;
                        if ($hm.options.useIDMapping) {
                            xId = $hm.xIDMap()[xId];
                        }

                        var scaled = xIdScale(xId) + 1;
                        return scaled;//$hm.xScale()(xId) + 1
                    }
                )
                .attr('y',
                    function (d) {
                        var yId = d.y;
                        if ($hm.options.useIDMapping) {
                            yId = $hm.yIDMap()[yId];
                        }

                        var scaled = yIdScale(yId) + 1;
                        return scaled;//$hm.yScale()(yId) + 1
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

                        /*var colorScale = d3.scale.linear()
                            .domain([0,1])
                            .range(['white', d.color]);

                        return colorScale(d.value);*/

                        return d.color;
                    }
                )
                ;
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

                        $hm.D3svg().select('.yGutter').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                    var xId = d.x;
                                    if ($hm.options.useIDMapping) {
                                        xId = $hm.xIDMap()[xId];
                                    }

                                    if (d3.select(this).attr('data-id') == xId) {
                                        return $hm.options.overColor;
                                    }
                                }
                        );

                        $hm.D3svg().select('.xPadding').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                    var yId = d.y;
                                    if ($hm.options.useIDMapping) {
                                        yId = $hm.yIDMap()[yId];
                                    }
                                    if (d3.select(this).attr('data-id') == yId) {
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
                                label : d.label || 'Value for: ' + d.row + ' - ' + d.column + '<br>is ' + d.value,
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

                        $hm.D3svg().select('.yGutter').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                   return 'black';
                                }
                        );

                        $hm.D3svg().select('.xPadding').selectAll('g g text')
                            .attr("fill",
                                function(r,ri){
                                   return 'black';
                                }
                        );

                        $hm.hideToolTip();

                    }
                })
                .on('click', function(d) {
                    if ($hm.options.clickCallback) {
                        $hm.options.clickCallback(d, $hm);
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


            var oldStyleDataset = [];

            var colorScale = this.colorScale();

            for (var i = 0; i < this.dataset().data.length; i++) {
                var row = this.dataset().data[i];
                for (var j = 0; j < row.length; j++) {
                    oldStyleDataset.push(
                        {
                            x : this.dataset().column_ids[j],
                            y : this.dataset().row_ids[i],
                            column : this.dataset().column_labels[j],
                            row : this.dataset().row_labels[i],
                            value : row[j],//valScale(row[j]),
                            color : colorScale(row[j]),
                        }
                    );
                }
            }


            var chart = this.D3svg().select( this.region('chart') ).selectAll('.cell').data(oldStyleDataset);
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
                .data(oldStyleDataset)
                .exit()
                    .remove();


        },


    });

} );
