

define('kbaseCummerbundPlot',
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

	    name: "kbaseCummerbundPlot",
	    parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {

        },

        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
        ],

        setDataset : function setDataset(newDataset) {

            var $plot = this;

            if (this.data('loader')) {
                this.data('loader').hide();
                this.data('plotElem').show();
                this.data('formElem').show();
            }

            if (this.data('selectbox')) {
                this.data('selectbox').empty();

                $.each(
                    newDataset,
                    function(i,v) {
                        $plot.data('selectbox')
                            .append(
                                $.jqElem('option')
                                    .attr('value', v.plot_description)
                                    .append(v.plot_title)
                            )
                    }
                );
            }

            this.setValueForKey('dataset', newDataset);

            this.displayPlot(newDataset[0].plot_title);

        },


        init : function init(options) {
            this._super(options);

            var $plot = this;

            var ws = new Workspace(window.kbconfig.urls.workspace, {token : $plot.authToken()});

            var ws_params = {
                workspace : this.options.workspace,
                name : this.options.object_name
            };

            ws.get_objects([ws_params]).then(function (d) {
                console.log("GOT DATA ", d);

                $plot.setDataset(d[0].data.cummerbundplotSet);
            })

            this.appendUI(this.$elem);

            return this;
        },

        displayPlot : function displayPlot(plot) {

            var $plot = this;

            $.each(
                this.dataset(),
                function (i,v) {
                    if (v.plot_title == plot) {
                    console.log(v.id);console.log(v);
                        $plot.data('imgElem').attr('src', window.kbconfig.urls.shock + '/node/' + v.png_handle.id + '?download_raw');
                        $plot.data('descElem').html(v.plot_description)
                    };
                }
            )
        },

        appendUI : function appendUI($elem) {

            var $plot = this;

            var $container = $.jqElem('div')
                .append(
                    $.jqElem('div')
                        .css('display', 'none')
                        .attr('id', 'formElem')
                        .append($.jqElem('span').append("Select plot:&nbsp;&nbsp;").css('float', 'left'))
                        .append(
                            $.jqElem('form')
                                .append(
                                    $.jqElem('select').attr('id', 'selectbox')
                                    .on('change', function(e) {
                                        //alert('changed! ' + this.value);
                                        //$plot.setBarchartDataset($plot.dataset().subsystems[this.value]);

                                        $plot.displayPlot($(this).val());


                                    })
                                )
                        )
                )
                .append(
                    $.jqElem('div')
                        .attr('id', 'plotElem')
                        .css('display', 'none')
                        .css('width', 800) //$elem.width())
                        .css('height', 500) //$elem.height() - 30)
                            .append(
                                $.jqElem('img')
                                    .attr('id', 'imgElem')
                                    .css({width : '798px'})
                            )
                            .append(
                                $.jqElem('div')
                                    .attr('id', 'descElem')
                                    .css({width : '798px'})
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

            this._rewireIds($container, this);


            $elem.append($container);


        },

    });

} );
