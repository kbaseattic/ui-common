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
            pieWedges : ['mapped_reads', 'unmapped_reads'],
            overviewItems : ['total_reads', 'mapped_reads', 'properly_paired', 'multiple_alignments', 'singletons', 'alignment_rate']
        },

        label_for_key : function(key) {
            var label = key.replace(/_/g, ' ');
                label = label.replace(/^([a-z])/, function up (l) { return       l.toUpperCase()});
                label = label.replace(/ ([a-z])/, function up (l) { return ' ' + l.toUpperCase()});

            return label;
        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
        ],

        setDataset : function setDataset(newDataset) {

            this.setValueForKey('dataset', newDataset);

            if (this.data('container')) {

                this.data('container').removeTab('Overview');
                this.data('container').removeTab('Pie chart');

                var $tableElem = $.jqElem('div');

                var keys = [];
                for (var i = 0; i < this.options.overviewItems.length; i++) {
                    var key = this.options.overviewItems[i];
                    keys.push( { value : key, label : this.label_for_key(key) } );
                }

                var $table = $tableElem.kbaseTable(
                    {
                        structure : {
                            keys : keys,
                            rows : newDataset
                        }

                    }
                );

                this.data('container').addTab(
                    {
                        tab : 'Overview',
                        content : $tableElem
                    }
                );


                var $pieElem = $.jqElem('div').css({width : this.$elem.width(), height : this.$elem.height() * .9});

                var pieData = [];
                for (var i = 0; i < this.options.pieWedges.length; i++) {
                    var wedge = this.options.pieWedges[i];
                    pieData.push(
                        {
                            value   : newDataset[wedge],
                            label   : this.label_for_key(wedge),
                            tooltip : this.label_for_key(wedge) + ' : ' + newDataset[wedge]
                        }
                    );
                }

                var $pie = $pieElem.kbasePiechart(
                    {
                        scaleAxes   : true,
                        useUniqueID : false,
                        gradient : true,
                        outsideLabels : true,

                        dataset : pieData,

                    }
                );

                this.data('container').addTab(
                    {
                        tab : 'Pie chart',
                        content : $pieElem
                    }
                );

                this.data('container').showTab('Overview');

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
                            tab : 'Overview',
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
