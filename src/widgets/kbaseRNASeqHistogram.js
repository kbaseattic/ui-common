

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
	 //   parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {

        },

        authToken : function authToken() {
            return "un=thomasoniii|tokenid=9dd17a66-8c78-11e5-942b-22000ab4b42b|expiry=1479224537|client_id=thomasoniii|token_type=Bearer|SigningSubject=https://nexus.api.globusonline.org/goauth/keys/5c2ed44a-8a30-11e5-b9f9-22000aef184d|sig=520590a675d6e9579b0dd4739fff40ea71ffd5e7e5bd950f691535a1bd19a2fef131ea94b88862fb430c8b7c73bb3f741eeb6bd02c74d4f74068db7f51e2f2b7664b43758ad23486264821bab3c7985614ee6f24b1a0428453e978551d0424902a2d9bc604483c85e4d2cbcd02a868e9d010aee3a75de2df7c9f8f1453453282"
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

            var ws = new Workspace("https://ci.kbase.us/services/ws", {token : $hist.authToken()});

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
