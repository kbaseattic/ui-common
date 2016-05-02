
define('kbaseOntologyTranslation',
    [
        'jquery',
        'colorbrewer',
        'datatables',
        'kbaseAuthenticatedWidget',
        'kbase-client-api',
        'bootstrap',
        'kbaseTable',
        'kbaseForcedNetwork',
    ], function( $, colorbrewer) {

    'use strict';

    $.KBWidget({

	    name: "kbaseOntologyTranslation",
	    parent: "kbaseAuthenticatedWidget",

        version: "1.0.0",
        options: {
            dictionary_object    : 'interpro2go',
            dictionary_workspace : 'KBaseOntology',
            workspaceURL         : "https://ci.kbase.us/services/ws", //window.kbconfig.urls.workspace,
        },

        init : function init(options) {


          this._super(options);

          this.colors   = colorbrewer.Set2[8];
          this.colorMap = {};

          var $self = this;

          var ws = new Workspace(this.options.workspaceURL, {token : $self.authToken()});

          var dictionary_params = {
              workspace : this.options.dictionary_workspace,
              name      : this.options.dictionary_object,
          };

          ws.get_objects([dictionary_params]).then(function(data) {
            data = data[0].data;
            console.log("GOT ME DATA", data);

            var $metaElem = $self.data('metaElem');

            $metaElem.empty();

            var $metaTable = $.jqElem('div').kbaseTable(
              {
                allowNullRows : false,
                structure : {
                  keys : [
                    {value : 'ontology1',                    label : 'Ontology 1'},
                    {value : 'ontology2',                    label : 'Ontology 2'},
                    {value : 'comment',                    label : 'Comment'},
                  ],
                  rows : {
                    'ontology1' : data.ontology1,
                    'ontology2' : data.ontology2,
                    'comment' : data.comment
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
                  )
                }
              )
            }
          );

              var $dt = $self.data('tableElem').DataTable({
                  columns : [
                      { title : 'Term ID', 'class' : 'ontology-top'},
                      { title : 'Eqivalent Name'},
                      { title : 'Eqivalent Term'},
                  ],
                  XXXcreatedRow : function(row, data, index) {

                    var $linkCell = $('td', row).eq(0);
                    $linkCell.empty();

                    $linkCell.append( $self.termLink(data[0]) )

                    var $nameCell = $('td', row).eq(1);

                    var color = $self.colorMap[data[0].namespace];
                    if (color == undefined) {
                      color = $self.colorMap[data[0].namespace] = $self.colors.shift();
                    }

                    $nameCell.css('color', color)

                  }
              });

              $dt.rows.add(table_data).draw();


            $self.data('loaderElem').hide();
            $self.data('globalContainerElem').show();

          })
            .fail(function(d) {

                $self.$elem.empty();
                $self.$elem
                    .addClass('alert alert-danger')
                    .html("Could not load object : " + d.error.message);
            })



            this.appendUI(this.$elem);

            return this
        },

        appendUI : function appendUI($elem) {

            $elem
              .css({
                'width'         : '95%',
                'padding-left'  : '10px'
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


            return $elem

        },

        createContainerElem : function(name, content, display) {

          var $panelBody = $.jqElem('div')
            .addClass('panel-body collapse in')

          $.each(
            content,
            function (i, v) {
              $panelBody.append(v)
            }
          )

          var $containerElem = $.jqElem('div')
            .addClass('panel panel-default')
            .css('display', display)
            .append(
              $.jqElem('div')
                .addClass('panel-heading')
                .on('click', function(e) {
                  $(this).next().collapse('toggle')
                  $(this).find('i').toggleClass('fa-rotate-90')

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

          return $containerElem
        },


    });

} );
