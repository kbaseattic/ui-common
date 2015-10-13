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

define('kbasePMIBarchart',
    [
        'jquery',
        'd3',
        'kbaseBarchart',
        'kbwidget',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbasePMIBarchart",

        version: "1.0.0",
        options: {

        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
        ],

        setDataset : function setDataset(newDataset) {

            var colorScale = d3.scale.category20();

            if (this.data('selectbox')) {
                this.data('selectbox').empty();

                var keys = Object.keys(newDataset.subsystems).sort();

                for (var f = 0; f < keys.length; f++) {
                    var func = keys[f];
                    this.data('selectbox')
                        .append(
                            $.jqElem('option')
                                .attr('value', func)
                                .append(func)
                        )

                    for (var bar = 0; bar < newDataset.subsystems[func].length; bar++) {
                        newDataset.subsystems[func][bar].color = colorScale(f);
                    }
                }
            }

            this.setValueForKey('dataset', newDataset);

            if (this.data('barchart')) {
                this.setBarchartDataset(newDataset.subsystems[keys[0]]);
            }
        },

        setBarchartDataset : function setBarchartDataset(newDataset) {
            this.data('barchart').setDataset(newDataset);

            this.data('barchart').options.xAxisTransform = this.data('barchart').yScale()(0);
            this.data('barchart').renderXAxis();
        },

        init : function init(options) {
            this._super(options);

            this.appendUI(this.$elem);

            return this
        },

        appendUI : function appendUI($elem) {

            var $pmi = this;

            var $container = $.jqElem('div')
                .append(
                    $.jqElem('div')
                        .append(
                            $.jqElem('form')
                                .append(
                                    $.jqElem('select').attr('id', 'selectbox')
                                    .on('change', function(e) {
                                        //alert('changed! ' + this.value);
                                        $pmi.setBarchartDataset($pmi.dataset().subsystems[this.value]);

                                    })
                                )
                        )
                )
                .append(
                    $.jqElem('div')
                        .attr('id', 'barchartElem')
                        .css('width', $elem.width())
                        .css('height', $elem.height() - 30)
                )
            ;

            this._rewireIds($container, this);

            this.data('barchart',
                this.data('barchartElem').kbaseBarchart(
                    {
                        scaleAxes   : true,

                        xLabel      : 'PMI in some manner',
                        xAxisRegion : 'chart',
                        //yLabel      : 'Meaningful data',
                        //hGrid : true,
                    }
                )
            );

            var $barchart = this.data('barchart');
            $barchart.superYDomain = $barchart.defaultYDomain;
            $barchart.defaultYDomain = function() {
                var domain = $barchart.superYDomain();

                var max = Math.max(Math.abs(domain[0]), Math.abs(domain[1]))

                return [-max, max]

            }

//            this.data('barchart').options.xAxisTransform = this.data('barchart').yScale()(0);
//            this.data('barchart').renderXAxis();
this.data('barchart').initialized = false;
            this.setDataset(this.dataset());

            $elem.append($container);

        },

    });

} );
