

define('kbaseExpressionMatrixHeatmap',
    [
        'jquery',
        'kbwidget',
        'kbaseAuthenticatedWidget',
        'kbase-client-api',
        'kbaseHeatmap',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseExpressionMatrixHeatmap",
	    parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {
            numBins : 10,
        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
            {name: 'barchartDataset', setter: 'setBarchartDataset'},
        ],


        setDataset : function setDataset(newDataset) {
            this.data('loader').hide();
            this.data('heatElem').show();

            if (newDataset.data.values.length == 0) {
                this.$elem.empty();
                this.$elem
                    .addClass('alert alert-danger')
                    .html("Could not load object : " + newDataset.description);
            }
            else {
                //newDataset.data = newDataset.values;
                this.data('heatElem').css('height', newDataset.data.row_ids.length * 10);
                this.data('heatmap').setDataset(
                    {
                        row_ids : newDataset.data.row_ids,
                        column_ids : newDataset.data.col_ids,
                        row_labels : newDataset.data.row_ids,
                        column_labels : newDataset.data.col_ids,
                        data : newDataset.data.values,
                    }
                );
            }


        },


        init : function init(options) {

            this._super(options);

            var $self = this;

            this.appendUI(this.$elem);

            var ws = new Workspace(window.kbconfig.urls.workspace, {token : $self.authToken()});
            //var ws = new Workspace('https://ci.kbase.us/services/ws', {token : $self.authToken()});

            var ws_params = {
                workspace : this.options.workspace,
                name : this.options.expression_object
            };

            ws.get_objects([ws_params]).then(function (d) {
                $self.setDataset(d[0].data);
            }).fail(function(d) {

                $self.$elem.empty();
                $self.$elem
                    .addClass('alert alert-danger')
                    .html("Could not load object : " + d.error.message);
            })

            return this;
        },

        appendUI : function appendUI($elem) {

            var $me = this;

            var $heatElem = $.jqElem('div').css({width : 800, height : 500}).css('display', 'none')
                .attr('id', 'heatElem')
            ;


            $elem
                .append( $heatElem )
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

            //XXX - I don't want to fix this right now. Setting yPadding to 0 will keep the background of the yPadding from overlaying
            //on the chart, but it'll cut off half of the label at the bottom of the temp gauge.
            //
            //kbaseFigureObjectHeatmap has a better method for this, moving the hmElem declartion into setDataset. Easy to do,
            //I just don't want to test it ATM.

            var $heatmap =
                $heatElem.kbaseHeatmap(
                    {
                        yPadding : 0
                    }
                )
            ;


            this._rewireIds($elem, this);
            this.data('heatmap', $heatmap);

        },

    });

} );
