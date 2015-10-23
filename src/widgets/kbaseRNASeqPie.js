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

define('kbaseRNASeqPie',
    [
        'jquery',
        'd3',
        'kbasePiechart',
        'kbaseTable',
        'kbwidget',
        'kbaseTabs',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseRNASeqPie",

        version: "1.0.0",
        options: {

        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
        ],

        setDataset : function setDataset(newDataset) {

            this.setValueForKey('dataset', newDataset);

            if (this.data('container')) {

                this.data('container').removeTab('Details');
                this.data('container').removeTab('Pie chart');

                var $tableElem = $.jqElem('div');

                var $table = $tableElem.kbaseTable(
                    {
                        structure : {
                            keys : [
                                {value : 'total_reads', label : 'Total reads'},
                                {value : 'mapped_reads', label : 'Mapped reads'},
                                {value : 'properly_paired', label : 'Properly paired'},
                                {value : 'multiple_alignments', label : 'Multiple alignments'},
                                {value : 'singletons', label : 'Singletons'},
                                {value : 'alignment_rate', label : 'Alignment Rate'},
                            ],
                            rows : newDataset
                        }

                    }
                );

                this.data('container').addTab(
                    {
                        tab : 'Details',
                        content : $tableElem
                    }
                );


                var $pieElem = $.jqElem('div').css({width : this.$elem.width(), height : this.$elem.height() * .9});

                var $pie = $pieElem.kbasePiechart(
                    {
                        scaleAxes   : true,
                        useUniqueID : false,
                        //transitionTime : 15000,
                        gradient : true,
                        //startingPosition : 'final',

                        //xLabel      : 'Some useful pie chart',
                        //innerRadius : -100,
                        //outerRadius : -105,
                        outsideLabels : true,

                        dataset : [
                            {
                                value : newDataset.mapped_reads,
                                color : '#FFFF00',
                                label : 'Mapped Reads'
                            },
                            {
                                value : newDataset.unmapped_reads,
                                color : '#0000FF',
                                label : 'Unmapped Reads'
                            },
                        ],

                    }
                );

                this.data('container').addTab(
                    {
                        tab : 'Pie chart',
                        content : $pieElem
                    }
                );

                this.data('container').showTab('Details');

            }
        },



        init : function init(options) {
            this._super(options);

            this.appendUI(this.$elem);

            return this
        },

        appendUI : function appendUI($elem) {

            var $rnaseq = this;

            var $containerElem = $.jqElem('div').attr('id', 'containerElem');

            var $container = $containerElem.kbaseTabs(
                {
                    tabs : [
                        {
                            tab : 'Details',
                            content : 'Loading...'
                        },
                        {
                            tab : 'Pie chart',
                            content : 'Loading...'
                        }
                    ]
                }
            )

            this._rewireIds($containerElem, this);
            this.data('container', $container);

            this.setDataset(this.dataset());

            $elem.append($containerElem);

        },

    });

} );
