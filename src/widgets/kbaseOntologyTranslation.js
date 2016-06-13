
define([
    'jquery',
    '../colorbrewer/colorbrewer', // new dep
    'kb/service/client/workspace',
    'datatables_bootstrap',
    'kb/widget/legacy/authenticatedWidget',
    'kb/widget/legacy/kbaseTable'
], function ($, colorbrewer, Workspace) {
    'use strict';

    $.KBWidget({
        name: "kbaseOntologyTranslation",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        options: {
            //object_name: 'interpro2go',
            //workspace_name: 'KBaseOntology'
        },
        init: function init(options) {
            this._super(options);

            this.wsKey = this.options.wsNameOrId.match(/^\d+/)
              ? 'wsid'
              : 'workspace'
            ;

            this.objKey = this.options.objNameOrId.match(/^\d+/)
              ? 'objid'
              : 'name'
            ;

            this.colors = colorbrewer.Set2[8];
            this.colorMap = {};

            var $self = this;

            var ws = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });

            var dictionary_params = { };
            dictionary_params[this.wsKey] = this.options.wsNameOrId;
            dictionary_params[this.objKey] = this.options.objNameOrId;

            ws.get_objects([dictionary_params])
                .then(function (data) {
                    data = data[0].data;

                    var $metaElem = $self.data('metaElem');

                    $metaElem.empty();

                    var comments = {};

                    var $commentsTable;
                    data.comment.split(/\n/).forEach(
                        function (v, i) {
                            var tmp = v.split(/:/);
                            if (tmp.length > 2) {
                                var tail = tmp.slice(1, tmp.length).join(':');
                                tmp = [tmp[0], tail];
                            }
                            if (tmp.length === 2) {
                                comments[tmp[0]] = tmp[1];
                            }
                        }
                    );

                    if (Object.keys(comments).length) {

                        if (comments['external resource']) {
                            comments['external resource'] = $.jqElem('a')
                                .attr('href', comments['external resource'])
                                .attr('target', '_blank')
                                .append(comments['external resource']);
                        }

                        $commentsTable = $.jqElem('div').kbaseTable(
                            {
                                allowNullRows: false,
                                structure:
                                    {
                                        keys: Object.keys(comments).sort(),
                                        rows: comments
                                    }
                            }
                        );
                    }

                    var $metaTable = $.jqElem('div').kbaseTable(
                        {
                            allowNullRows: false,
                            structure: {
                                keys: [
                                    {value: 'ontology1', label: 'Ontology 1'},
                                    {value: 'ontology2', label: 'Ontology 2'},
                                    {value: 'comment', label: 'Comment'}
                                ],
                                rows: {
                                    'ontology1': data.ontology1,
                                    'ontology2': data.ontology2,
                                    'comment': $commentsTable ? $commentsTable.$elem : data.comment
                                }
                            }
                        }
                    );

                    $metaElem.append($metaTable.$elem);

                    var table_data = [];

                    $.each(
                        Object.keys(data.translation).sort(),
                        function (i, k) {
                            var v = data.translation[k];
                            $.each(
                                v.equiv_terms,
                                function (j, e) {
                                    table_data.push(
                                        [
                                            k,
                                            e.equiv_name,
                                            e.equiv_term
                                        ]
                                        );
                                }
                            );
                        }
                    );

                    var $dt = $self.data('tableElem').DataTable({
                        columns: [
                            {title: 'Term ID', 'class': 'ontology-top'},
                            {title: 'Eqivalent Name'},
                            {title: 'Eqivalent Term'}
                        ],
                        XXXcreatedRow: function (row, data, index) {

                            var $linkCell = $('td', row).eq(0);
                            $linkCell.empty();

                            $linkCell.append($self.termLink(data[0]));

                            var $nameCell = $('td', row).eq(1);

                            var color = $self.colorMap[data[0].namespace];
                            if (color === undefined) {
                                color = $self.colorMap[data[0].namespace] = $self.colors.shift();
                            }

                            $nameCell.css('color', color);

                        }
                    });

                    $dt.rows.add(table_data).draw();


                    $self.data('loaderElem').hide();
                    $self.data('globalContainerElem').show();

                })
                .catch(function (d) {

                    $self.$elem.empty();
                    $self.$elem
                        .addClass('alert alert-danger')
                        .html("Could not load object : " + d.error.message);
                });

            this.appendUI(this.$elem);

            return this;
        },
        appendUI: function appendUI($elem) {

            $elem
                .css({
                    'width': '95%',
                    'padding-left': '10px'
                })
                ;

            $elem.append($.jqElem('style').text('.ontology-top { vertical-align : top }'));

            var $self = this;

            var $loaderElem = $.jqElem('div')
                .append('<br>&nbsp;Loading data...<br>&nbsp;please wait...<br>&nbsp;Data parsing may take upwards of 30 seconds, during which time this page may be unresponsive.')
                .append($.jqElem('br'))
                .append(
                    $.jqElem('div')
                    .attr('align', 'center')
                    .append($.jqElem('i').addClass('fa fa-spinner').addClass('fa fa-spin fa fa-4x'))
                    )
                ;

            $self.data('loaderElem', $loaderElem);
            $elem.append($loaderElem);

            var $globalContainer = $self.data('globalContainerElem', $.jqElem('div').css('display', 'none'));
            $elem.append($globalContainer);

            var $metaElem = $self.data('metaElem', $.jqElem('div'));

            var $metaContainerElem = $self.createContainerElem('Translation Information', [$metaElem]);

            $self.data('metaContainerElem', $metaContainerElem);
            $globalContainer.append($metaContainerElem);

            var $tableElem = $.jqElem('table')
                .addClass('display')
                ;

            $self.data('tableElem', $tableElem);
            var $colorMapElem = $self.data('colorMapElem', $.jqElem('div'));

            var $containerElem = $self.createContainerElem('Translation Dictionary', [$tableElem]);

            $self.data('containerElem', $containerElem);
            $globalContainer.append($containerElem);


            return $elem;

        },
        createContainerElem: function (name, content, display) {

            var $panelBody = $.jqElem('div')
                .addClass('panel-body collapse in');

            $.each(
                content,
                function (i, v) {
                    $panelBody.append(v);
                }
            );

            var $containerElem = $.jqElem('div')
                .addClass('panel panel-default')
                .css('display', display)
                .append(
                    $.jqElem('div')
                    .addClass('panel-heading')
                    .on('click', function (e) {
                        $(this).next().collapse('toggle');
                        $(this).find('i').toggleClass('fa-rotate-90');

                    })
                    .append(
                        $.jqElem('div')
                        .addClass('panel-title')
                        .append(
                            $.jqElem('i')
                            .addClass('fa fa-chevron-right fa-rotate-90')
                            .css('color', 'lightgray')
                            )
                        .append('&nbsp; ' + name)
                        )
                    )
                .append(
                    $panelBody
                    )
                ;

            return $containerElem;
        }
    });

});
