

define('kbaseRNASeqAnalysis',
    [
        'jquery',
        'kbaseTable',
        'kbwidget',
        'kbaseAuthenticatedWidget',
        'kbase-client-api',
    ], function( $ ) {

    'use strict';

    $.KBWidget({

	    name: "kbaseRNASeqAnalysis",
	    parent : "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {

        },


        _accessors : [
            {name: 'dataset', setter: 'setDataset'},
            'workspace',
        ],


        /*setDataset : function setDataset(newDataset) {

                var $table = $tableElem.kbaseTable(
                    {
                        structure : {
                            keys : keys,
                            rows : overViewValues
                        }

                    }
                );

            this.data('loader').hide();
            this.data('tableElem').show();

            this.setValueForKey('dataset', newDataset);

        },

        setBarchartDataset : function setBarchartDataset(bars, xLabel, yLabel) {

        },*/

        init : function init(options) {

            this._super(options);

            this.setDataset(this.options.SetupRNASeqAnalysis);

            var $rna = this;

            this.appendUI(this.$elem);

            var ws = new Workspace(window.kbconfig.urls.workspace, {token : this.authToken()});

            $.when(
                ws.get_objects([{ ref : this.options.SetupRNASeqAnalysis.annotation_id}]),
                ws.get_objects([{ ref : this.options.SetupRNASeqAnalysis.genome_id}])
            ).then(function (annotation, genome) {
                $rna.dataset().genome_annotation = annotation[0].data.handle.file_name;
                $rna.dataset().genome_name = genome[0].data.scientific_name;

                $rna.updateUI();
            })
            .fail(function(d) {

                $rna.$elem.empty();
                $rna.$elem
                    .addClass('alert alert-danger')
                    .html("Could not load object : " + d.error.message);
            })

            return this;
        },

        updateUI : function updateUI() {
            this.data('tableElem').kbaseTable(
                {
                    structure : {
                        keys : ['Experiment name', 'Title', 'Experiment Description', 'Experiment design', 'Platform', 'Library type',
                            'Genome name', 'Genome annotation', 'Number of samples', 'Number of replicates', 'Tissue', 'Condition',
                            'Domain', 'Source'],
                        rows : {
                            'Experiment name' : this.dataset().experiment_id,
                            'Title' : this.dataset().title,
                            'Experiment Description' : this.dataset().experiment_desc,
                            'Experiment design' : this.dataset().experiment_design,
                            'Platform' : this.dataset().platform,
                            'Library type' : this.dataset().Library_type,
                            'Genome name' : this.dataset().genome_name,
                            'Genome annotation' : this.dataset().genome_annotation,
                            'Number of samples' : this.dataset().num_samples,
                            'Number of replicates' : this.dataset().num_replicates,
                            'Tissue' : this.dataset().tissue ? this.dataset().tissue.join(', ') : '',
                            'Condition' : this.dataset().condition ? this.dataset().condition.join(', ') : '',
                            'Domain' : this.dataset().domain,
                            'Source' : this.dataset().source
                        },
                    }
                }
            );

               this.data('loader').hide();
            this.data('tableElem').show();
        },

        appendUI : function appendUI($elem) {

            $elem
                .append(
                    $.jqElem('div')
                        .attr('id', 'tableElem')
                        .attr('display', 'none')
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
