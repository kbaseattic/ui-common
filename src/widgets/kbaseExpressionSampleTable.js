

define('kbaseExpressionSampleTable',
    [
        'jquery',
        'kbwidget',
        'kbaseAuthenticatedWidget',
        'kbaseTabs',
        'kbaseBarchart',
        'kbase-client-api',
        'kbaseTable',
        'jquery-dataTables',
    ], function( $, colorbrewer ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseExpressionSampleTable",
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

            var rows = [];
            var barData = [];

            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;

            var exprKeys = Object.keys(newDataset.expression_levels).sort();

            $.each(
                exprKeys,
                function (i,k) {

                    var val = newDataset.expression_levels[k];

                    rows.push( [k, val] );

                    if (val < min) {
                        min = val;
                    }
                    if (val > max) {
                        max = val;
                    }
                    barData.push(val);

                    /*var bin = Math.floor(newDataset.expression_levels[k]);

                    if (barData[bin] == undefined) {
                        barData[bin] = 0;
                    }
                    barData[bin]++;*/

                }
            );

            this.setBarchartDataset(barData);
            this.renderHistogram(this.options.numBins);

            var $dt = this.data('tableElem').dataTable({
                aoColumns : [
                    { title : 'Gene ID'},
                    { title : 'Feature Value'}
                ]
            });
            $dt.fnAddData(rows);


            this.data('loader').hide();
            this.data('containerElem').show();

        },

        renderHistogram : function renderHistogram(bins) {

            var barData = d3.layout.histogram().bins(bins)( this.barchartDataset() );

            var bars = [];
            var sigDigits = 1000;
            $.each(
                barData,
                function (i,bin) {
                    var range = Math.round(bin.x * sigDigits) / sigDigits + ' to ' + (Math.round((bin.x + bin.dx) * sigDigits) / sigDigits);

                    bars.push(
                        {
                            bar : range,
                            value : bin.y,
                            color : 'blue',
                            tooltip : bin.y + ' in range<br>' + range,
                        }
                    );
                }
            );

            this.data('barchart').setDataset(bars);

        },

        init : function init(options) {
            this._super(options);

            var $self = this;

            var ws = new Workspace(window.kbconfig.urls.workspace, {token : $self.authToken()});
            //var ws = new Workspace('https://ci.kbase.us/services/ws', {token : $self.authToken()});

            var ws_params = {
                workspace : this.options.workspace,
                wsid : this.options.wsid,
                name : this.options.output
            };

            ws.get_objects([ws_params]).then(function (d) {
                $self.setDataset(d[0].data);
            }).fail(function(d) {

                $self.$elem.empty();
                $self.$elem
                    .addClass('alert alert-danger')
                    .html("Could not load object : " + d.error.message);
            })

            this.appendUI(this.$elem);

            return this;
        },

        appendUI : function appendUI($elem) {

            var $me = this;

            var $tableElem = $.jqElem('table')
                .css('width', '95%')
                    .append(
                        $.jqElem('thead')
                            .append(
                                $.jqElem('tr')
                                    .append($.jqElem('th').append('Gene ID'))
                                    .append($.jqElem('th').append('Feature Value'))
                            )
                    )
            ;

            var $barElem = $.jqElem('div').css({width : 800, height : 500});

            var $barContainer = $.jqElem('div')
                .append(
                    $.jqElem('input')
                        .attr('type', 'range')
                        .attr('min', 0)
                        .attr('max', 100)
                        .attr('value', $me.options.numBins)
                        .attr('step', 1)
                        .css('width', '800px')
                        .on('input', function(e) {
                            $me.data('numBins').text($(this).val());
                        })
                        .on('change', function(e) {
                            $me.data('numBins').text($(this).val());
                            $me.renderHistogram(parseInt($(this).val()));
                        })
                )
                .append(
                    $.jqElem('span')
                        .attr('id', 'numBins')
                        .text($me.options.numBins)
                )
                .append(' bins<br>')
                .append($barElem)
            ;


            var $containerElem = $.jqElem('div').attr('id', 'containerElem').css('display', 'none');

            var $container = $containerElem.kbaseTabs(
                {
                    tabs : [
                        {
                            tab : 'Overview',
                            content : $tableElem
                        },
                        {
                            tab : 'Histogram',
                            content : $barContainer
                        }
                    ]
                }
            )

            $container.$elem.find('[data-tab=Histogram]').on('click', function(e) {
                $barchart.renderXAxis();
                setTimeout(function() {$me.renderHistogram($me.options.numBins) }, 300);
            });

            $elem
                .append( $containerElem )
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

            var $barchart =
                $barElem.kbaseBarchart(
                    {
                        scaleAxes   : true,
                        xPadding : 60,
                        yPadding : 120,

                        xLabelRegion : 'yPadding',
                        yLabelRegion : 'xPadding',

                        xLabelOffset : 45,
                        yLabelOffset : -10,

                        yLabel : 'Number of Genes',
                        xLabel : 'Gene Expression Level (FPKM)',
                        xAxisVerticalLabels : true

                    }
                )
            ;

            $barchart.superRenderXAxis = $barchart.renderXAxis;
            $barchart.renderXAxis = function() {
                $barchart.superRenderXAxis();

                $barchart.D3svg()
                    .selectAll('.xAxis .tick text')
                    .attr('fill', 'blue')
                    .on('mouseover', function(L, i) {
                        $.each(
                            $barchart.dataset(),
                            function (i, d) {
                                if (d.bar == L) {
                                    $barchart.showToolTip({ label : d.tooltip })
                                }
                            }
                        );

                    })
                    .on('mouseout', function(d) {
                        $barchart.hideToolTip();
                    })
            };

            this._rewireIds($elem, this);
            this.data('tableElem', $tableElem);
            this.data('barElem',   $barElem);
            this.data('container', $container);
            this.data('barchart', $barchart);

        },

    });

} );
