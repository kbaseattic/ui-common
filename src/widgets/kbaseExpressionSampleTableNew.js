

define('kbaseExpressionSampleTableNew',
    [
        'jquery',
        'kbwidget',
        'kbaseAuthenticatedWidget',
        'kbaseTabs',
        'kbaseHistogram',
        'kbase-client-api',
        'kbaseTable',
        'jquery-dataTables',
        'kbaseReportView',
    ], function( $, colorbrewer ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseExpressionSampleTableNew",
	    parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {
            numBins : 50,
            minCutoff : 0.001,
        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
            //{name: 'barchartDataset', setter: 'setBarchartDataset'},
        ],

        getState : function() {
            return this.data('histogram').getState();
        },

        loadState : function(state) {
            this.data('histogram').loadState(state);
            this.data('histogram').renderHistogram();
        },


        setDataset : function setDataset(newDataset) {

            var rows = [];
            var barData = [];

            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;

            var exprKeys = [];
            if (newDataset.expression_levels != undefined) {
              exprKeys = Object.keys(newDataset.expression_levels).sort();

              $.each(
                  exprKeys,
                  function (i,k) {

                      var val = Math.round(newDataset.expression_levels[k] * 1000) / 1000;

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

              //this.setBarchartDataset(barData);
              this.data('histogram').setDataset(barData);
              //this.renderHistogram(this.options.numBins);

              var $dt = this.data('$dt');
              if ($dt == undefined) {
                $dt = this.data('tableElem').dataTable({
                    aoColumns : [
                        { title : 'Gene ID'},
                        { title : 'Feature Value : log2(FPKM + 1)'}
                    ]
                });

                this.data('$dt', $dt);
              }

              $dt.fnAddData(rows);
              this.data('loader').hide();
              this.data('containerElem').show();
            }
            else {
              this.loadExpression(newDataset.sample_expression_ids[0]);
              this.data('loader').hide();
                this.$elem.append($.jqElem('div')
                    .addClass('alert alert-danger')
                    .html("No expression levels available")
                )
            }


        },

        loadExpression : function(ref) {
          var $sam = this;
          this.data('containerElem').hide();
          this.data('loader').show();
          var ws = new Workspace(window.kbconfig.urls.workspace, {token : $sam.authToken()});

          var ws_params = {
              ref : ref
          };

          ws.get_objects([ws_params]).then(function (d) {
              $sam.setDataset(d[0].data);
          })
          .fail(function(d) {

              $sam.$elem.empty();
              $sam.$elem
                  .addClass('alert alert-danger')
                  .html("Could not load object : " + d.error.message);
          })
        },

        init : function init(options) {

          this._super(options);

          if (this.options.report_name != undefined) {

            var $div = $.jqElem('div');
            this.$elem.append($div);

            $div.kbaseReportView( this.options);
            return this;
          }



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

                var thing = d[0].data;
                if (thing.sample_expression_ids) {
                  $self.options.output = thing;

                  var promises = [];
                  $.each(
                    $self.options.output.sample_expression_ids,
                    function (i,v) {
                      promises.push(
                        ws.get_object_info([{ref : v}])
                      );
                    }
                  );

                  $.when.apply($, promises).then(function () {

                      var args = arguments;
                      $self.options.output.sample_expression_names = [];
                      $.each(
                        arguments,
                        function (i, v) {
                          $self.options.output.sample_expression_names.push(v[0][1]);
                        }
                      );

                      $self.appendUI($self.$elem);

                      if ($self.options.output.sample_expression_ids.length) {
                        $self.loadExpression($self.options.output.sample_expression_ids[0]);
                      }

                  });



                }
                else {
                  $self.appendUI($self.$elem);
                  $self.setDataset(d[0].data);
                }
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

            if (this.options.output.sample_expression_ids) {

              var $selector = $.jqElem('select').css('width', '500px')
                .on('change', function(e) {
                  $me.loadExpression( $selector.val() );
                }
              );

              $.each(
                this.options.output.sample_expression_ids,
                function (i,v) {
                  $selector.append(
                    $.jqElem('option')
                      .attr('value', v)
                      .append($me.options.output.sample_expression_names[i])
                  )
                }
              );

              this.$elem
                .append("<br>Please select expression level: ")
                .append($selector)
                .append("<br><br>");
            }

            var $tableElem = $.jqElem('table')
                .css('width', '95%')
                    .append(
                        $.jqElem('thead')
                            .append(
                                $.jqElem('tr')
                                    .append($.jqElem('th').append('Gene ID'))
                                    .append($.jqElem('th').append('Feature Value : log2(FPKM + 1)'))
                            )
                    )
            ;

            var $histElem = $.jqElem('div').css({width : 800, height : 500});

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
                            content : $histElem
                        }
                    ]
                }
            )

            $container.$elem.find('[data-tab=Histogram]').on('click', function(e) {
                $histogram.renderXAxis();
                setTimeout(function() {$histogram.renderHistogram() }, 300);
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

            this._rewireIds($elem, this);

            var $histogram =
                $histElem.kbaseHistogram(
                    {
                        scaleAxes   : true,
                        xPadding : 60,
                        yPadding : 120,

                        xLabelRegion : 'yPadding',
                        yLabelRegion : 'xPadding',

                        xLabelOffset : 45,
                        yLabelOffset : -10,

                        yLabel : 'Number of Genes',
                        xLabel : 'Gene Expression Level log2(FPKM + 1)',
                        xAxisVerticalLabels : true,
                        useUniqueID : true,

                    }
                )
            ;

            this.data('tableElem', $tableElem);
            this.data('histElem',   $histElem);
            this.data('container', $container);
            this.data('histogram', $histogram);

        },

    });

} );
