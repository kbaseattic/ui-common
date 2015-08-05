/*

*/

define(
    [
        'jquery',
        'd3',
        'kb.widget.vis.barchart',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseHistogram",
	  parent: "kbaseBarchart",

        version: "1.0.0",
        options: {
            scaleAxes : true,
            height : '500px',
            xPadding : 80,

            yPadding : 40,
        },

        _accessors : [
            'minBin',
            'maxBin',
        ],

        setDataset : function(newDataset) {
            if (! $.isArray(newDataset.data)) {
                newDataset = newDataset.data;
            }

            var transformed = [];

            var i = 0;
            for (i = 0; i < newDataset.data[0].length - 1; i++) {
                var row = newDataset.data[0][i];
                var col = newDataset.data[1][i];

                var next = i < newDataset.data[0].length - 1
                    ? ' to ' + newDataset.data[0][i + 1]
                    : ' and up';

                var label = 'Bin ' + row + next;

                transformed.push(
                    {
                        bar     : label,
                        value   : col,
                        color   : 'white',
                        stroke  : 'black',
                        strokeWidth : 1,
                    }
                );

            }

            this.setYLabel(newDataset.column_labels[0]);
            this.setXLabel(newDataset.row_labels[0]);
            this.minBin(newDataset.data[0][0]);
            this.maxBin(newDataset.data[0][newDataset.data[0].length - 1]);

            this._super(transformed);
        },

        renderXAxis : function() {

            if (this.xScale() == undefined || this.xScale().domain == undefined) {
                return;
            }

            var xAxisScale = d3.scale.linear()
                .domain([this.minBin(), this.maxBin()])
                .range([0, this.chartBounds().size.width])
            ;

            var xAxis =
                d3.svg.axis()
                    .scale(xAxisScale)
                    .orient('bottom')
                    .ticks(10)
            ;


            var gxAxis = this.D3svg().select('.yPadding').select('.xAxis');

            if (gxAxis[0][0] == undefined) {
                gxAxis = this.D3svg().select('.yPadding')
                    .append('g')
                        .attr('class', 'xAxis axis')
                        //.attr("transform", "translate(0," + this.yGutterBounds().size.height + ")")
            }

            var $hm = this;

            gxAxis
                .transition()
                .duration(0)
                .call(xAxis)
            ;


        },

        renderXLabel : function() {
            var yGutterBounds = this.yGutterBounds();

            var xLabeldataset = [this.xLabel()];

            var xLabel = this.D3svg().select( this.region('yPadding') ).selectAll('.xLabel');
            xLabel
                .data(xLabeldataset)
                    .text( this.xLabel() )
                .enter()
                    .append('text')
                        .attr('class', 'xLabel')
                        .attr('x', yGutterBounds.size.width / 2)
                        .attr('y', 25 + yGutterBounds.size.height / 2 + 3)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '11px')
                        .attr('font-family', 'sans-serif')
                        .attr('fill', 'black')
                        .text(this.xLabel());
            ;

        },

        renderYLabel : function() {

            var xGutterBounds = this.xGutterBounds();

            var yLabeldataset = [this.yLabel()];

            var xLabel = this.D3svg().select( this.region('xPadding') ).selectAll('.yLabel');
            xLabel
                .data(yLabeldataset)
                    .text( this.yLabel() )
                .enter()
                    .append('text')
                        .attr('class', 'yLabel')
                        .attr('x', xGutterBounds.size.width / 2)
                        .attr('y', 10 + xGutterBounds.size.height / 2 + 3)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '11px')
                        .attr('font-family', 'sans-serif')
                        .attr('fill', 'black')
                        .attr('transform', 'rotate(270,'
                            + (xGutterBounds.size.width / 2 - 7)
                            + ','
                            + xGutterBounds.size.height / 2
                            + ')')
                        .text(this.yLabel());
            ;

        },




    });

} );
