/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['jquery', 'jquery-svg-graph'], function ($) {
    'use strict';

    var extension = Object.create({}, {
        /* Retrieve the display title for this chart type.
         @return  the title */
        title: {
            value: function () {
                return 'Stacked area chart';
            }
        },
        /* Retrieve a description of this chart type.
         @return  its description */
        description: {
            value: function () {
                return 'Compare sets of values as areas showing ' +
                    'relative contributions to the whole for each category.';
            }
        },
        /* Retrieve a list of the options that may be set for this chart type.
         @return  options list */
        options: {
            value: function () {
                return [];
            }
        },
        /* Actually draw the graph in this type's style.
         @param  graph  (object) the SVGGraph object */
        drawGraph: {
            value: function (graph) {
                var bg = graph._drawChartBackground(true, true),
                    dims = graph._getDims();
                if (graph._gridlines[0] && graph.xAxis._ticks.major) {
                    graph._drawGridlines(bg, graph._getPercentageAxis(), true, dims, graph._gridlines[0]);
                }
                var numSer = graph._series.length,
                    numVal = (numSer ? (graph._series[0])._values.length : 0),
                    xScale = dims[graph.W] / numVal,
                    yScale = dims[graph.H];
                this._chart = graph._wrapper.group(graph._chartCont, {class_: 'chart'});
                this._drawAreas(graph, numSer, numVal, dims, xScale, yScale);
                graph._drawTitle();
                graph._wrapper.text(
                    graph._chartCont, 0, 0, $.svg.graphing.region.percentageText,
                    $.extend({
                        textAnchor: 'middle',
                        transform: 'translate(' +
                            (dims[graph.X] - graph.yAxis._titleOffset) + ',' +
                            (dims[graph.Y] + dims[graph.H] / 2) + ') rotate(-90)'
                    }, graph.yAxis._titleFormat || {})
                    );
                var pAxis = $.extend({}, graph._getPercentageAxis());
                $.extend(pAxis._labelFormat, graph.yAxis._labelFormat || {});
                graph._drawAxis(pAxis, 'yAxis', dims[graph.X], dims[graph.Y],
                    dims[graph.X], dims[graph.Y] + dims[graph.H]);
                this._drawXAxis(graph, numVal, dims, xScale);
                graph._drawLegend();
            }
        },
        /* Plot all of the areas. */
        _drawAreas: {
            value: function (graph, numSer, numVal, dims, xScale, yScale) {
                var totals = graph._getTotals(),
                    accum = [],
                    max = 0, i;

                totals.forEach(function (total) {
                    if (totals > max) {
                        max = totals;
                    }
                });

                for (i = 0; i < numVal; i += 1) {
                    accum[i] = 0;
                }

                var paths = [], s, series;
                for (s = 0; s < numSer; s += 1) {
                    paths[s] = "";
                    var series = graph._series[s];
                    for (i = 0; i < series._values.length; i += 1) {
                        accum[i] += series._values[i];
                        paths[s] += (i === 0) ? "M" : "L";
                        var yVal = (dims[graph.Y] + yScale * (totals[i] - accum[i]) / totals[i]);
                        if (!graph.normalizeStackedArea) {
                            yVal = dims[graph.Y] + yScale - (yScale / max * (accum[i] - series._values[i]));
                        }
                        paths[s] += (dims[graph.X] + xScale * i) + "," + yVal;
                        if (i === series._values.length - 1) {
                            paths[s] += "L" + (dims[graph.X] + xScale * (i + 1)) + "," + yVal;
                        }
                    }

                    if (s === 0 && graph.normalizeStackedArea) {
                        paths[s] += "L" + (dims[graph.X] + xScale * series._values.length) + "," + (dims[graph.Y] + dims[graph.H]) + "L" + dims[graph.X] + "," + (dims[graph.Y] + dims[graph.H]);
                    } else {
                        for (i = series._values.length - 1; i > -1; i--) {
                            var yVal = (dims[graph.Y] + yScale * (totals[i] - accum[i] + series._values[i]) / totals[i]);
                            if (!graph.normalizeStackedArea) {
                                yVal = dims[graph.Y] + yScale - (yScale / max * accum[i]);
                            }
                            if (i === series._values.length - 1) {
                                paths[s] += "L" + (dims[graph.X] + xScale * (i + 1)) + "," + yVal;
                            }
                            paths[s] += "L" + (dims[graph.X] + xScale * i) + "," + yVal;
                        }
                    }
                }
                for (i = 0; i < paths.length; i++) {
                    var series = graph._series[i];
                    graph._wrapper.path(this._chart, paths[i], {fill: series._fill, stroke: series._stroke, strokeWidth: series._strokeWidth});
                }
            }
        },
        /* Draw the x-axis and its ticks. */
        _drawXAxis: {
            value: function (graph, numVal, dims, xScale) {
                var axis = graph.xAxis;
                if (axis._title) {
                    graph._wrapper.text(graph._chartCont, dims[graph.X] + dims[graph.W] / 2,
                        dims[graph.Y] + dims[graph.H] + axis._titleOffset,
                        axis._title, $.extend({textAnchor: 'middle'}, axis._titleFormat || {}));
                }
                var gl = graph._wrapper.group(graph._chartCont, $.extend({class_: 'xAxis'}, axis._lineFormat));
                var gt = graph._wrapper.group(graph._chartCont, $.extend({class_: 'xAxisLabels',
                    textAnchor: 'middle'}, axis._labelFormat));
                graph._wrapper.line(gl, dims[graph.X], dims[graph.Y] + dims[graph.H],
                    dims[graph.X] + dims[graph.W], dims[graph.Y] + dims[graph.H]);

                if (axis._ticks.major) {
                    var offsets = graph._getTickOffsets(axis, true);
                    for (var i = 1; i < numVal; i++) {
                        if (i % axis._ticks.major > 0) {
                            continue;
                        }
                        var x = dims[graph.X] + xScale * i;
                        graph._wrapper.line(gl, x, dims[graph.Y] + dims[graph.H] + offsets[0] * axis._ticks.size,
                            x, dims[graph.Y] + dims[graph.H] + offsets[1] * axis._ticks.size);
                    }
                    for (var i = 0; i < numVal; i++) {
                        if (i % axis._ticks.major > 0) {
                            continue;
                        }
                        var x = dims[graph.X] + xScale * (i + 0.5);
                        graph._wrapper.text(gt, x, dims[graph.Y] + dims[graph.H] + 2 * axis._ticks.size,
                            (axis._labels ? axis._labels[i] : '' + i));
                    }
                }
            }
        }
    });

    $.svg.graphing.addChartType('stackedArea', Object.create(extension));
});