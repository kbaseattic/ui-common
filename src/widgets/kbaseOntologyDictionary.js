
define([
    'jquery',
    '../colorbrewer/colorbrewer', // TODO: new dependency
    'kb/service/client/workspace',
    'datatables_bootstrap',
    'kb/widget/legacy/authenticatedWidget',
    'kb/widget/legacy/kbaseTable'
], function ($, colorbrewer, Workspace) {
    'use strict';

    $.KBWidget({
        name: "kbaseOntologyDictionary",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        options: {
            //object_name: 'gene_ontology', //'plant_ontology', 'ncbi_taxon_ontology', 'gene_ontology'
            //workspace_name: 'KBaseOntology'
        },
        extractLink: function (text) {
            if (text === undefined) {
                return text;
            }
            var mappings = {
                "(EC:([\\w.-]+))": "<a target = '_blank' href = 'http://enzyme.expasy.org/EC/$2'>$1</a>",
                "(PMID:([\\w.-]+))": "<a target = '_blank' href = 'http://www.ncbi.nlm.nih.gov/pubmed/$2'>$1</a>",
                "(GOC:([\\w.-]+))": "<a target = '_blank' href = 'http://www.geneontology.org/doc/GO.curator_dbxrefs'>$1</a>",
                "(Wikipedia:([\\w.-]+))": "<a target = '_blank' href = 'https://en.wikipedia.org/wiki/$2'>$1</a>",
                "(Reactome:([\\w.-]+))": "<a target = '_blank' href = 'http://www.reactome.org/content/query?q=$2'>$1</a>",
                "(KEGG:([\\w.-]+))": "<a target = '_blank' href = 'http://www.genome.jp/dbget-bin/www_bget?rn:$2'>$1</a>",
                "(RHEA:([\\w.-]+))": "<a target = '_blank' href = 'http://www.rhea-db.org/reaction?id=$2'>$1</a>",
                "(MetaCyc:([\\w.-]+))": "<a target = '_blank' href = 'http://biocyc.org/META/NEW-IMAGE?type=NIL&object=$2'>$1</a>",
                "(UM-BBD_reactionID:([\\w.-]+))": "<a target = '_blank' href = 'http://eawag-bbd.ethz.ch/servlets/pageservlet?ptype=r&reacID=$2'>$1</a>",
                "(UM-BBD_enzymeID:([\\w.-]+))": "<a target = '_blank' href = 'http://eawag-bbd.ethz.ch/servlets/pageservlet?ptype=ep&enzymeID=$2'>$1</a>",
                "(UM-BBD_pathwayID:([\\w.-]+))": "<a target = '_blank' href = 'http://eawag-bbd.ethz.ch/$2/$2_map.html'>$1</a>",
                "(RESID:([\\w.-]+))": "<a target = '_blank' href = 'http://pir.georgetown.edu/cgi-bin/resid?id=$2'>$1</a>",
                "(PO_GIT:([\\w.-]+))": "<a target = '_blank' href = 'https://github.com/Planteome/plant-ontology/issues/$2'>$1</a>",
                "(TO_GIT:([\\w.-]+))": "<a target = '_blank' href = 'https://github.com/Planteome/plant-trait-ontology/issues/$2'>$1</a>",
                "(GC_ID:([\\w.-]+))": "<a target = '_blank' href = 'http://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi#SG$2'>$1</a>"
            };

            for (var map in mappings) {
                var regex = new RegExp(map, 'g');
                text = text.replace(regex, mappings[map]);
            }

            return text;
        },
        init: function init(options) {
            this._super(options);

            this.colors = colorbrewer.Set2[8];
            this.colorMap = {};
            this.termCache = {};

            var $self = this;

            $self.ws = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });

            var dictionary_params = {
                wsid: this.options.workspaceId,
                objid: this.options.objectId,
                //workspace: this.options.workspace_name,
                //name: this.options.object_name,
                included: [
                    '/format_version', '/data_version', '/date', '/saved_by', '/auto_generated_by', '/subsetdef', '/synonymtypedef', '/default_namespace',
                    '/treat_xrefs_as_differentia', '/treat_xrefs_as_is_a', '/ontology',
                    '/term_hash/*/id',
                    '/term_hash/*/name',
                    '/term_hash/*/namespace',
//                '/term_hash/*/def',
//                '/term_hash/*/synonym',
//                '/term_hash/*/xref',
//                '/term_hash/*/namespace',
//                '/term_hash/*/relationship',
                '/typedef_hash/',
                ]
            };

            //$self.ws.get_objects([dictionary_params]).then(function(data) {
            $self.ws.get_object_subset([dictionary_params])
                .then(function (data) {
                    var data = data[0].data;

                    $self.dataset = data;

                    var $metaElem = $self.data('metaElem');

                    $metaElem.empty();

                    var $metaTable = $.jqElem('div').kbaseTable(
                        {
                            allowNullRows: false,
                            structure: {
                                keys: [
                                    {value: 'format-version', label: 'Format version'},
                                    {value: 'data-version', label: 'Data version'},
                                    {value: 'date'},
                                    {value: 'saved-by', label: 'Saved By'},
                                    {value: 'auto-generated-by', label: 'Auto Generated By'},
                                    {value: 'subsetdef'},
                                    {value: 'synonymtypedef'},
                                    {value: 'default-namespace', label: 'Default Namespace'},
                                    {value: 'treat-xrefs-as-genus-differentia', label: 'Treat XREFs as genus differentia'},
                                    {value: 'treat-xrefs-as-is_a', label: 'Treat XREFs as "is a"'},
                                    {value: 'ontology', label: 'ontology'}
                                ],
                                rows: {
                                    'format-version': data.format_version,
                                    'data-version': data.data_version,
                                    'date': data.date,
                                    'saved-by': data.saved_by,
                                    'auto-generated-by': data.auto_generated_by,
                                    'subsetdef': $.isArray(data.subsetdef) ? data.subsetdef.join('<br>') : data.subsetdef,
                                    'synonymtypedef': $.isArray(data.synonymtypedef) ? data.synonymtypedef.join('<br>') : data.synonymtypedef,
                                    'default-namespace': data.default_namespace,
                                    'treat-xrefs-as-genus-differentials': $.isArray(data.treat_xrefs_as_differentia) ? data.treat_xrefs_as_differentia.join('<br>') : data.treat_xrefs_as_differentia,
                                    'treat-xrefs-as-is_a': $.isArray(data.treat_xrefs_as_is_a) ? data.treat_xrefs_as_is_a.join('<br>') : data.treat_xrefs_as_is_a,
                                    'ontology': data.ontology
                                }
                            }
                        }
                    );

                    $metaElem.append($metaTable.$elem);

                    var $typeDefElem = $self.data('typeDefElem');
                    var typedef_data = [];
                    $.each(
                        data.typedef_hash || {},
                        function (k, v) {

                            var $subtable = $.jqElem('div').kbaseTable(
                                {
                                    structure: {
                                        keys: Object.keys(v).sort().map(function (v) {
                                            return {value: v, label: v, style: 'width : 200px'};
                                        }),
                                        rows: v
                                    },
                                    striped: false
                                }
                            );

                            typedef_data.push(
                                [
                                    v.name || '',
                                    $subtable.$elem.html()
                                ]
                                );

                        }
                    );


                    var $tt = $typeDefElem.DataTable({
                        columns: [
                            {title: 'TypeDef', 'class': 'ontology-top'},
                            {title: 'Info'}
                        ]
                    });

                    $tt.rows.add(typedef_data).draw();

                    var table_data = [];

                    $.each(
                        data.term_hash,
                        function (k, v) {

                            table_data.push(
                                [
                                    v,
                                    //[v.name, $.isArray(v.synonym) ? v.synonym.join('<br>') : v.synonym, v.def].join('<br>')
                                    v.name,
                                    //[v.name, v.id, v.def, v.synonym, v.xref, v.namespace, v.relationship].join(',')
                                    [v.id, v.name, v.namespace].join(',')
                                ]
                                );
                        }
                    );

                    var $dt = $self.data('tableElem').DataTable({
                        columns: [
                            {title: 'Term ID', 'class': 'ontology-top'},
                            {title: 'Term name'},
                            {title: 'Search field', 'visible': false}
                        ],
                        createdRow: function (row, data, index) {

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

                    $self.data('colorMapElem').append('Ontology namespace key: ');

                    $.each(
                        $self.colorMap,
                        function (k, v) {
                            $self.data('colorMapElem').append(
                                $.jqElem('span')
                                .css('padding-left', '25px')
                                .css('color', v)
                                .append(k)
                                );

                        }
                    );

                    var m;

                    if (m = location.href.match(/term_id=([^&]+)/)) {
                      $self.appendTerm(m[1]);
                    }


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
        termLink: function (term, withName) {
            var $self = this;
            return $.jqElem('a')
                .append(term.id + (withName ? ' [' + term.name + ']' : ''))
                .on('click', function (e) {
                    e.preventDefault();
                    $self.appendTerm(term.id);
                });
        },
        getTerm: function (term_id) {
            return this.dataset.term_hash[term_id];
        },
        parseISA: function (isa) {

            var ids = [];

            $.each(
                isa,
                function (i, v) {
                    var parts = v.split(/\s*!\s*/);
                    ids.push(parts[0]);
                }
            );

            return ids;
        },
        getLineage: function (term_id, recursive, circular_breaker) {

            var $self = this;

            if (circular_breaker === undefined) {
                circular_breaker = {};
            }

            if (circular_breaker[term_id]) {
                return undefined;
            }

            circular_breaker[term_id] = 1;

            var term = this.getTerm(term_id);

            var parents = {};
            if (term.is_a) {
                $.each(
                    this.parseISA(term.is_a),
                    function (i, v) {
                        parents[v] = undefined;
                    }
                );
            } else {
                return undefined;
            }

            $.each(
                parents,
                function (k, v) {
                    parents[k] = $self.getLineage(k, true, circular_breaker);
                }
            );

            if (!recursive) {
                //$self.reverseLineage(parents);
            }

            return parents;

        },
        buildLineageElem: function (lineage) {

            if (!lineage) {
                return '';
            }

            var $self = this;

            var $ul = $.jqElem('ul')
                .css('padding-left', '10px')
                .css('list-style-position', 'inside')
                //.css('list-style-type', 'none')
                ;

            var ret = {root: $ul, parent: $ul};

            $.each(lineage, function (k, v) {
                //if ($li.html().length) {
                //  $li.append(',')
                //}

                var $li = $.jqElem('li');
                $ul.append($li);

                var term = $self.getTerm(k);

                $li.append($self.termLink(term));
                $li.append(' ');
                $li.append(
                    $.jqElem('span')
                    .css('color', $self.colorMap[term.namespace])
                    .append(term.name)
                    );

                if (v !== undefined) {
                    ret = $self.buildLineageElem(v);
                    ret.parent.append($ul);
                    ret.parent = $ul;
                }
            });

            return ret;

        },
        lineageAsNodes: function (parent, lineage, nodes, edges, cache, depth) {
            var $self = this;
            if (nodes === undefined) {
                nodes = [];
            }
            if (edges === undefined) {
                edges = [];
            }
            if (cache === undefined) {
                cache = {};
            }

            if (depth === undefined) {
                depth = 0;
            }

            if (cache[parent] === undefined) {
                nodes.push({node: parent, tag: parent, color: $self.colorMap[$self.getTerm(parent).namespace]});
                cache[parent] = nodes.length - 1;
            }
            $.each(lineage, function (k, v) {
                if (cache[k] === undefined) {
                    nodes.push({name: k, tag: k, color: $self.colorMap[$self.getTerm(k).namespace]});
                    cache[k] = nodes.length - 1;
                }

                edges.push({source: cache[parent], target: cache[k], charge: -100 * depth});
                if (v !== undefined) {
                    $self.lineageAsNodes(k, v, nodes, edges, cache, depth + 1);
                }
            });
            return {nodes: nodes, edges: edges};
        },
        appendTerm: function (term_id) {
            var $self = this;

            var $termElem = $self.data('termElem');
            $termElem.empty();
            $self.data('termContainerElem').show();
            $self.data('metaContainerElem').find('.panel-heading').find('i').removeClass('fa-rotate-90');
            $self.data('metaContainerElem').find('.panel-body').collapse('hide');
            $self.data('containerElem').find('.panel-heading').find('i').removeClass('fa-rotate-90');
            $self.data('containerElem').find('.panel-body').collapse('hide');
            $self.data('typeDefContainerElem').find('.panel-heading').find('i').removeClass('fa-rotate-90');
            $self.data('typeDefContainerElem').find('.panel-body').collapse('hide');

            if ($self.termCache[term_id] === undefined) {

                $termElem.append($self.data('loaderElem'));
                $self.data('loaderElem').show();

                var dictionary_params = {
                    wsid: this.options.workspaceId,
                    objid: this.options.objectId,
                    included: [
                        '/term_hash/' + term_id + '/*'
                        //'/term_hash/'
                    ]
                };

                $self.ws.get_object_subset([dictionary_params])
                    .then(function (data) {
                        var term = data[0].data.term_hash[term_id];

                        $self.termCache[term_id] = term;

                        $self.data('loaderElem').hide();
                        $termElem.empty();

                        $self.reallyAppendTerm(term);

                    })
                    .catch(function (d) {
                        console.error(d);
                        var message;
                        if (d.message) {
                            message = d.message;
                        } else if (d.error) {
                            message = d.error.message;
                        }
                        $self.$elem.empty();
                        $self.$elem
                            .addClass('alert alert-danger')
                            .html("Could not load object : " + message);
                    });

            } else {
                $self.reallyAppendTerm($self.termCache[term_id]);
            }
        },
        reallyAppendTerm: function (term) {
            var $self = this;

            var $termElem = $self.data('termElem');

            var lineage = $self.getLineage(term.id);

            var $lineageElem;
            var $force;

            if ($lineageElem = $self.buildLineageElem(lineage)) {
                $lineageElem.root.css('padding-left', '0px');

                var dataset = $self.lineageAsNodes(term.id, lineage);
                dataset.nodes[0].stroke = 'yellow';

                $force = $.jqElem('div').css({width: '500px', height: '500px'}).kbaseForcedNetwork(
                    {
                        linkDistance: 150,
                        dataset: dataset
                    }
                );
            }

            var $closureElem = undefined;
            if (term.relationship_closure !== undefined) {
                $closureElem = $.jqElem('ul').css('style', 'float : left');

                /*  var closure_data = [];
                 var term_headers = [];

                 $.each(
                 Object.keys(term.relationship_closure).sort(),
                 function (i, k) {

                 closure_headers.push({'title' : k});

                 var v = term.relationship_closure[k];

                 $.each(
                 v,
                 function (i, elem) {

                 }
                 )

                 table_data.push(
                 [
                 v,
                 //[v.name, $.isArray(v.synonym) ? v.synonym.join('<br>') : v.synonym, v.def].join('<br>')
                 v.name,
                 [v.name, v.id, v.def, v.synonym, v.xref, v.namespace, v.relationship].join(',')
                 ]
                 )
                 }
                 );

                 var $dt = $self.data('tableElem').DataTable({
                 columns : [
                 { title : 'Term ID', 'class' : 'ontology-top'},
                 { title : 'Term name'},
                 { title : 'Search field', 'visible' : false }
                 ],
                 createdRow : function(row, data, index) {

                 var $linkCell = $('td', row).eq(0);
                 $linkCell.empty();

                 $linkCell.append( $self.termLink(data[0]) )

                 var $nameCell = $('td', row).eq(1);

                 var color = $self.colorMap[data[0].namespace];
                 if (color === undefined) {
                 color = $self.colorMap[data[0].namespace] = $self.colors.shift();
                 }

                 $nameCell.css('color', color)

                 }
                 });*/


                for (var type in term.relationship_closure) {
                    $closureElem
                        .append(
                            $.jqElem('li')
                            .append(type + ' relationships')
                            )
                        ;

                    var $subUL = $.jqElem('ul');
                    $closureElem.append($subUL);

                    $.each(
                        term.relationship_closure[type],
                        function (i, elem) {

                            var term = $self.getTerm(elem[0]);

                            $subUL.append(
                                $.jqElem('li')
                                .append(elem[1] + ' away - ')
                                .append($self.termLink(term))
                                .append(' - ')
                                .append(
                                    $.jqElem('span')
                                    .css('color', $self.colorMap[term.namespace])
                                    .append(term.name)
                                    )
                                );
                        });

                }
            }

            var $relationship = $.jqElem('div');

            if (term.relationship !== undefined) {
                $.each(
                    term.relationship,
                    function (i, rel) {
                        var parts = rel.split(/ ! /);
                        $self.extractLink(parts[0]);
                        $relationship
                            .append(parts[0])
                            .append(' ! ')
                            .append(parts[1])
                            .append('<br>');

                    }
                );
            }

            var $table = $.jqElem('div').kbaseTable(
                {
                    allowNullRows: false,
                    structure: {
                        keys: [{value: 'id', label: 'ID'}, 'name', 'def', 'namespace', 'synonym', 'comment', {value: 'is_a', label: 'Is A'}, 'relationship', 'xref'],
                        rows: {
                            id: term.id,
                            name: term.name,
                            def: $self.extractLink($.isArray(term.def) ? term.def.join('<br>') : term.def),
                            namespace: term.namespace,
                            synonym: $.isArray(term.synonym) ? term.synonym.join('<br>') : term.synonym,
                            comment: term.comment,
                            is_a: $closureElem ? $.jqElem('div').append($closureElem) : undefined, //$lineageElem.root, // or $force.$elem
                            relationship: term.relationship ? $relationship : undefined,
                            xref: $self.extractLink($.isArray(term.xref) ? term.xref.join('<br>') : term.xref)
                        }
                    }
                }
            );

            $termElem.append($table.$elem);

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

            var $metaContainerElem = $self.createContainerElem('Ontology Dictionary', [$metaElem]);

            $self.data('metaContainerElem', $metaContainerElem);
            $globalContainer.append($metaContainerElem);

            var $tableElem = $.jqElem('table')
                .addClass('display')
                ;

            $self.data('tableElem', $tableElem);
            var $colorMapElem = $self.data('colorMapElem', $.jqElem('div'));

            var $containerElem = $self.createContainerElem('Term Dictionary', [$tableElem, $colorMapElem]);

            $self.data('containerElem', $containerElem);
            $globalContainer.append($containerElem);

            var $termElem = $self.data('termElem', $.jqElem('div'));

            var $termContainerElem = $self.createContainerElem('Term', [$termElem], 'none');

            $self.data('termContainerElem', $termContainerElem);
            $globalContainer.append($termContainerElem);

            var $typeDefElem = $self.data('typeDefElem', $.jqElem('table').addClass('display'));

            var $typeDefContainerElem = $self.createContainerElem('Type Definitions', [$typeDefElem]);

            $self.data('typeDefContainerElem', $typeDefContainerElem);
            $globalContainer.append($typeDefContainerElem);

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
