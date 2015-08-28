/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['jquery', 'jquery-svg-graph'], function ($) {
    'use strict';
    function log10(val) {
        if (val == 0) {
            return 0;
        }
        return Math.log(val) / Math.LN10;
    }
    var extension = Object.create({}, {
        /* Retrieve the display title for this chart type.
         @return  the title */
        title: {
            value: function () {
                return 'deviation chart';
            }
        },
        /* Retrieve a description of this chart type.
         @return  its description */
        description: {
            value: function () {
                return 'Compare sets of values as vertical bars with deviations in grouped categories.';
            }
        },
        /* Retrieve a list of the options that may be set for this chart type.
         @return  options list */
        options: {
            value: function () {
                return [
                    'barWidth (number) - the width of each bar',
                    'barGap (number) - the gap between sets of bars'
                ];
            }
        },
        /* Actually draw the graph in this type's style.
         @param  graph  (object) the SVGGraph object */
        drawGraph: {
            value: function (graph) {
                graph._drawChartBackground(true);
                var barWidth = graph._chartOptions.barWidth || 20,
                    barGap = graph._chartOptions.barGap || 10,
                    numSer = graph._series.length,
                    numVal = (numSer ? (graph._series[0])._values.length : 0),
                    dims = graph._getDims(),
                    xScale = dims[graph.W] / ((numSer * barWidth + barGap) * numVal + barGap),
                    yScale = dims[graph.H] / (graph.yAxis._scale.max - graph.yAxis._scale.min);
                this._chart = graph._wrapper.group(graph._chartCont, {class_: 'chart'});
                var i;
                for (i = 0; i < numSer; i += 1) {
                    this._drawSeries(graph, i, numSer, barWidth, barGap, dims, xScale, yScale);
                }
                graph._drawTitle();
                graph._drawAxes(true);
                this._drawXAxis(graph, numSer, numVal, barWidth, barGap, dims, xScale);
                graph._drawLegend();
            }
        },
        /* Plot an individual series. */
        _drawSeries: {
            value: function (graph, cur, numSer, barWidth, barGap, dims, xScale, yScale, type) {
                var series = graph._series[cur],
                    g;
                if (typeof (series._fill) === 'object') {
                    g = graph._wrapper.group(this._chart,
                        $.extend({
                            class_: 'series' + cur,
                            stroke: series._stroke,
                            strokeWidth: series._strokeWidth
                        }, series._settings || {}));
                } else {
                    g = graph._wrapper.group(this._chart,
                        $.extend({
                            class_: 'series' + cur, fill: series._fill,
                            stroke: series._stroke,
                            strokeWidth: series._strokeWidth
                        }, series._settings || {}));
                }
                var i, xoffset, data, yshift;
                for (i = 0; i < series._values.length; i += 1) {
                    xoffset = dims[graph.X] + xScale * (barGap + i * (numSer * barWidth + barGap) + (cur * barWidth));
                    data = series._values[i];

                    if (graph.yAxis._scale.type === 'log') {
                        data.upper = log10(data.upper);
                        data.median = log10(data.median);
                        data.max = log10(data.max);
                        data.lower = log10(data.lower);
                        data.min = log10(data.min);
                    }

                    yshift = dims[graph.Y];
                    // median - upper
                    graph._wrapper.rect(
                        g, xoffset + 1,
                        Math.ceil((graph.yAxis._scale.max - data.upper) * yScale + yshift),
                        barWidth - 2, (data.upper - data.median) * yScale,
                        0, 0,
                        {stroke: 'black', strokeWidth: 1, fill: series._fill[i]}
                    );

                    // median - lower
                    graph._wrapper.rect(
                        g, xoffset + 1,
                        (graph.yAxis._scale.max - data.median) * yScale + yshift,
                        barWidth - 2,
                        (data.median - data.lower) * yScale,
                        0, 0,
                        {stroke: 'black', strokeWidth: 1, fill: series._fill[i]}
                    );

                    // max - upper
                    var mu = graph._wrapper.line(
                        g, xoffset + 1 + barWidth / 6,
                        (graph.yAxis._scale.max - data.max) * yScale + 1 + yshift,
                        xoffset + 1 + barWidth - 2 - barWidth / 6,
                        (graph.yAxis._scale.max - data.max) * yScale + 1 + yshift,
                        {stroke: 'black', strokeWidth: 1}
                    );
                    graph._wrapper.line(
                        g, xoffset + barWidth / 2,
                        (graph.yAxis._scale.max - data.max) * yScale + 1 + yshift,
                        xoffset + barWidth / 2,
                        (graph.yAxis._scale.max - data.upper) * yScale + 1 + yshift,
                        {stroke: 'black', strokeWidth: 1, strokeDashArray: "2,2"}
                    );


                    // lower - min
                    graph._wrapper.line(
                        g, xoffset + 1 + barWidth / 6,
                        (graph.yAxis._scale.max - data.min) * yScale - 1 + yshift,
                        xoffset + 1 + barWidth - 2 - barWidth / 6,
                        (graph.yAxis._scale.max - data.min) * yScale - 1 + yshift,
                        {stroke: 'black', strokeWidth: 1}
                    );
                    graph._wrapper.line(
                        g, xoffset + barWidth / 2,
                        (graph.yAxis._scale.max - data.lower) * yScale - 1 + yshift,
                        xoffset + barWidth / 2,
                        (graph.yAxis._scale.max - data.min) * yScale - 1 + yshift,
                        {stroke: 'black', strokeWidth: 1, strokeDashArray: "2,2"}
                    );
                }
            }
        },
        /* Draw the x-axis and its ticks. */
        _drawXAxis: {
            value: function (graph, numSer, numVal, barWidth, barGap, dims, xScale) {
                var axis = graph.xAxis;
                if (axis._title) {
                    graph._wrapper.text(
                        graph._chartCont,
                        dims[graph.X] + dims[graph.W] / 2,
                        parseInt(graph._chartCont.attributes[3].value, 10), //dims[graph.Y] + dims[graph.H] + axis._titleOffset,
                        axis._title,
                        $.extend({textAnchor: 'middle'}, axis._titleFormat || {})
                        );
                }
                var gl = graph._wrapper.group(graph._chartCont, $.extend({class_: 'xAxis'}, axis._lineFormat));
                var labelTextAnchor = axis.labelRotation ? "end" : "middle";
                var gt = graph._wrapper.group(graph._chartCont, $.extend({class_: 'xAxisLabels',
                    textAnchor: labelTextAnchor}, axis._labelFormat));
                graph._wrapper.line(gl, dims[graph.X], dims[graph.Y] + dims[graph.H],
                    dims[graph.X] + dims[graph.W], dims[graph.Y] + dims[graph.H]);
                if (axis._ticks.major) {
                    var offsets = graph._getTickOffsets(axis, true);
                    for (var i = 0; i < numSer; i++) {
                        var x = dims[graph.X] + (xScale * barGap) + (barWidth / 2) + (i * (barWidth * xScale));
                        graph._wrapper.line(
                            gl, x,
                            dims[graph.Y] + dims[graph.H] + offsets[0] * axis._ticks.size,
                            x,
                            dims[graph.Y] + dims[graph.H] + offsets[1] * axis._ticks.size
                            );
                    }
                    for (var i = 0; i < numSer; i++) {
                        var x = dims[graph.X] + (xScale * barGap) + (barWidth / 2) + (i * (barWidth * xScale));
                        var xlabel;
                        if (axis.labelRotation) {
                            xlabel = {
                                textAnchor: "end",
                                transform: "rotate(" + axis.labelRotation + ", " + x + ", " + (dims[graph.Y] + dims[graph.H] + 2 * axis._ticks.size) + ")"
                            };
                        } else {
                            xlabel = {
                                textAnchor: "end",
                                transform: "rotate(-50, " + x + ", " + (dims[graph.Y] + dims[graph.H] + 2 * axis._ticks.size) + ")"
                            };
                        }
                        graph._wrapper.text(
                            gt, x,
                            dims[graph.Y] + dims[graph.H] + 2 * axis._ticks.size,
                            (axis._labels ? axis._labels[i] : graph._series[i]._name), xlabel
                            );
                    }
                }
            }
        }
    });

    $.svg.graphing.addChartType('deviation', Object.create(extension));
});