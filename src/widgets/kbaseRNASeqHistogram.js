

define('kbaseRNASeqHistogram',
    [
        'jquery',
        'colorbrewer',
        'd3',
        'kbaseBarchart',
        'kbaseTable',
        'kbwidget',
        'kbaseAuthenticatedWidget',
        'kbaseTabs',
        'kbase-client-api',
    ], function( $, colorbrewer ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseRNASeqHistogram",
	    parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {

        },


        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
        ],


        setDataset : function setDataset(newDataset) {

            var bars = [];

            var i = 0;
            while (newDataset.data[0].length) {
                var xCoord = newDataset.data[0].shift();

                while (i < xCoord) {
                    bars.push(
                        {
                            bar : i++,
                            value : 0,
                            color : 'blue',
                        }
                    );
                }

                bars.push(
                    {
                        bar : xCoord,
                        value : newDataset.data[1].shift() || 0,
                        color : 'blue',
                    }
                );
            }

            this.setBarchartDataset(bars, newDataset.column_labels[0], newDataset.row_labels[0]);

            this.data('loader').hide();
            this.data('barchartElem').show();
        },

        setBarchartDataset : function setBarchartDataset(bars, xLabel, yLabel) {
            this.data('barchart').setXLabel(xLabel);
            this.data('barchart').setYLabel(yLabel);
            this.data('barchart').setDataset(bars);
        },

        init : function init(options) {
            this._super(options);

            var $hist = this;

            var ws = new Workspace(window.kbconfig.urls.workspace, {token : $hist.authToken()});

            var ws_params = {
                workspace : this.options.workspace,
                //ws_id : ws_id_key != undefined ? $pie.options[ws_id] : undefined,
                name : this.options.output
            };

            ws.get_objects([ws_params]).then(function (d) {
                $hist.setDataset(d[0].data);
            })

            this.appendUI(this.$elem);

            return this;
        },

        appendUI : function appendUI($elem) {

            $elem
                .append(
                    $.jqElem('div')
                        .attr('id', 'barchartElem')
                        .css('display', 'none')
                        .css('width', $elem.width())
                        .css('height', $elem.height() - 30)
                )
                .append(
                    $.jqElem('div')
                        .attr('id', 'loader')
                        .append('<br>&nbsp;Loading data...<br>&nbsp;please wait...')
                        .append($.jqElem('br'))
                        .append(
                            $.jqElem('div')
                                .attr('align', 'center')
                                .append($.jqElem('i').addClass('fa fa-spinner').addClass('fa fa-spin fa fa-4x'))
                        )
                )
            ;

            this._rewireIds($elem, this);

            this.data('barchart',
                this.data('barchartElem').kbaseBarchart(
                    {
                        scaleAxes   : true,

                        //xLabel      : 'PMI in some manner',
                        //xAxisRegion : 'chart',
                        //xAxisVerticalLabels : true,
                        //yLabel      : 'Meaningful data',
                        //hGrid : true,
                        //useUniqueID : true,
                    }
                )
            );

        },

    });

} );
