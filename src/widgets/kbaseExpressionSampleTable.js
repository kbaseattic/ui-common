

define('kbaseExpressionSampleTable',
    [
        'jquery',
        'kbwidget',
        'kbaseAuthenticatedWidget',
        'kbase-client-api',
        'kbaseTable',
        'dataTables',
    ], function( $, colorbrewer ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseExpressionSampleTable",
	    parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {

        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
        ],


        setDataset : function setDataset(newDataset) {

            var rows = [];

            $.each(
                Object.keys(newDataset.expression_levels).sort(),
                function (i,k) {
                    rows.push([k,newDataset.expression_levels[k]]);
                }
            );

            var $dt = this.data('tableElem').DataTable({
                aoColumns : [
                    { title : 'Gene ID'},
                    { title : 'Feature Value'}
                ]
            });
            $dt.fnAddData(rows);

            /*this.data('tableElem').kbaseTable(
                {
                    sortable : true,
                    striped : true,
                    navControls : true,
                    maxVisibleRowIndex : 10,
                    structure : {
                        header : [{value : 'gene_id', label : 'Gene ID'}, {value : 'feature_value', label : 'Feature Value'} ],
                        rows : rows,
                    }
                }
            );*/

            this.data('loader').hide();
            this.data('tableElem').show();

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

            $elem
                .append(
                    $.jqElem('table')
                        .attr('id', 'tableElem')
                        .addClass('display')
                        .css('display', 'none')
                            .append(
                                $.jqElem('thead')
                                    .append(
                                        $.jqElem('tr')
                                            .append($.jqElem('th').append('Gene ID'))
                                            .append($.jqElem('th').append('Feature Value'))
                                    )
                            )

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

        },

    });

} );
