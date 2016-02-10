

define('kbaseFigureObjectHeatmap',
    [
        'jquery',
        'kbwidget',
        'kbaseAuthenticatedWidget',
        'kbase-client-api',
        'kbaseHeatmap',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseFigureObjectHeatmap",
	    parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {
            numBins : 10,
            magicHeight : 10,
        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
            {name: 'barchartDataset', setter: 'setBarchartDataset'},
        ],

        transpose : function transpose(arr,arrLen) {
          for (var i = 0; i < arrLen; i++) {
            for (var j = 0; j <i; j++) {
              //swap element[i,j] and element[j,i]
              var temp = arr[i][j];
              arr[i][j] = arr[j][i];
              arr[j][i] = temp;
            }
          }
        },

        setDataset : function setDataset(newDataset, groupInfo) {

            var $self = this;

            this.data('loader').hide();

            if (newDataset.data.length == 0) {
                this.$elem.empty();
                this.$elem
                    .addClass('alert alert-danger')
                    .html("Empty heatmap");
            }
            else {

                var $heatElem = $.jqElem('div').css({width : 800, height : newDataset.column_labels.length * this.options.magicHeight});

                var $heatmap =
                    $heatElem.kbaseHeatmap(
                        {
                            //colors : ['#0000FF', '#FFFFFF', '#FFFF00'],
                            xPadding : 170,
                        }
                    )
                ;
                this.data('heatmap', $heatmap);
                this.data('heatElem', $heatElem);

                this.$elem.append($heatElem);

                var invertedData = [];
                for (var i = 0; i < newDataset.column_labels.length; i++) {
                    invertedData[i] = [];
                    for (var j = 0; j < newDataset.row_labels.length; j++) {
                        invertedData[i][j] = newDataset.data[j][i];
                    }
                }

                this.data('heatmap').setDataset(
                    {
                        row_ids : newDataset.column_labels,
                        column_ids : newDataset.row_labels,
                        row_labels : newDataset.column_labels,
                        column_labels : newDataset.row_labels,
                        data : invertedData,//newDataset.data,
                    }
                );


                //okay now do some extra BS to add in grouping.

                var chartBounds = $heatmap.chartBounds();

//groupInfo.ygtick_labels = ['zero', 'alpha', 'bravo', 'charlie'];
//groupInfo.ygroup = [20,100,100,80];

                var total_groups = groupInfo.ygroup.reduce(function(p,v) { return p + v} );

                var groups = $heatmap.D3svg().select( $heatmap.region('xPadding') ).selectAll('.groupBox').data(groupInfo.ygtick_labels);

                var groupsEnter = groups.enter().append('g');

                groupsEnter
                    .append('rect')
                        .attr('x', 0)
                        .attr('y',
                            function(d,i) {

                                var prior = 0;

                                for (var j = 0; j < i; j++) {
                                    prior += groupInfo.ygroup[j];
                                }
                                return chartBounds.size.height * (prior / total_groups);
                            }
                        )
                        .attr('width', $heatmap.xPaddingBounds().size.width)
                        .attr('height',
                            function (d, i) {
                                return chartBounds.size.height * (groupInfo.ygroup[i] / total_groups);
                            }
                        )
                        .attr('stroke', 'black')
                        .attr('fill', 'none')
                        .attr('stroke-width', '.5px')
                ;
                groupsEnter
                    .append('text')
                        .attr('x', 0)
                        .attr('y', 0)
                        .text(function (d,i) { this.idx = i; return d })
                ;

                //gotta transform it after it's been inserted. Fun.
                groups.selectAll('text')
                        .attr('transform',
                            function(d) {

                                var width = d3.select(this).node().getComputedTextLength();

                                var offset = -2 - width;

                                if (this.idx > 0) {
                                    var prior = 0;
                                    for (var i = 0; i < this.idx; i++) {
                                        prior += groupInfo.ygroup[i];
                                    }
                                    offset -= chartBounds.size.height * (prior / total_groups);
                                }

                                return 'rotate(270) translate(' + offset + ',12)'
                            }
                        )

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

                ws.get_objects([{ref : d[0].data.data_ref}]).then(function(b) {

                    $self.setDataset(b[0].data, d[0].data);

                });
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


            $elem
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

        },

    });

} );
