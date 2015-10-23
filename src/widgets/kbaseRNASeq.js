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

define('kbaseRNASeq',
    [
        'jquery',
        'd3',
        'kbaseBarchart',
        'kbaseTable',
        'kbwidget',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseRNASeq",

        version: "1.0.0",
        options: {

        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
        ],

        setDataset : function setDataset(newDataset) {

            if (this.data('table')) {
                this.data('table').hide();
            }
        },



        init : function init(options) {
            this._super(options);

            this.appendUI(this.$elem);

            return this
        },

        appendUI : function appendUI($elem) {

            var $rnaseq = this;

            var $container = $.jqElem('div')
                .append(
                    $.jqElem('div')
                        .append(
                            $.jqElem('a')
                                .append('Show/Hide Selected features')
                                .on('click', function(e) {
                                    $rnaseq.data('table').toggle()
                                })
                            )
                )
                .append(
                    $.jqElem('div')
                        .attr('id', 'table')
                        .css('display', 'none')
                        .append('Table goes here!')
                )
                .append(
                    $.jqElem('div')
                        .attr('id', 'barchart')
                )
            ;

            this._rewireIds($container, this);

            /*this.data('barchart',
                this.data('barchartElem').kbaseBarchart(
                    {
                        scaleAxes   : true,

                        xLabel      : 'PMI in some manner',
                        xAxisRegion : 'chart',
                        //yLabel      : 'Meaningful data',
                        //hGrid : true,
                    }
                )
            );*/


            $elem.append($container);

        },

    });

} );
