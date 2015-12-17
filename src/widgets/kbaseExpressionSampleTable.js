

define('kbaseExpressionSampleTable',
    [
        'jquery',
        'kbwidget',
        'kbaseAuthenticatedWidget',
        'kbase-client-api',
        'kbaseTable',
    ], function( $, colorbrewer ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseExpressionSampleTable",
	    parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {

        },

        authToken : function() {
            return "un=thomasoniii|tokenid=9dd17a66-8c78-11e5-942b-22000ab4b42b|expiry=1479224537|client_id=thomasoniii|token_type=Bearer|SigningSubject=https://nexus.api.globusonline.org/goauth/keys/5c2ed44a-8a30-11e5-b9f9-22000aef184d|sig=520590a675d6e9579b0dd4739fff40ea71ffd5e7e5bd950f691535a1bd19a2fef131ea94b88862fb430c8b7c73bb3f741eeb6bd02c74d4f74068db7f51e2f2b7664b43758ad23486264821bab3c7985614ee6f24b1a0428453e978551d0424902a2d9bc604483c85e4d2cbcd02a868e9d010aee3a75de2df7c9f8f1453453282";
        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
        ],


        setDataset : function setDataset(newDataset) {

            var rows = [];

            $.each(
                Object.keys(newDataset.expression_levels).sort(),
                function (i,k) {
                    rows.push({gene_id : k, feature_value : newDataset.expression_levels[k]});
                }
            );

            this.data('tableElem').kbaseTable(
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
            );

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
                    $.jqElem('div')
                        .attr('id', 'tableElem')
                        .css('display', 'none')
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
