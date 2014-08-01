/*

*/

kb_define('kbaseHistogram',
    [
        'jquery',
        'd3',
        'kbaseBarchart',
    ], function( $ ) {

    $.KBWidget({

	    name: "kbaseHistogram",
	  parent: "kbaseBarchart",

        version: "1.0.0",
        options: {
            scaleAxes : true,
            height : '500px',
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



    });

} );
