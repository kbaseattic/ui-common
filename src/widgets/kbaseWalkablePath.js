/**
 * Just a simple example widget - makes a div with "Hello world!"
 * in a user-defined color (must be a css color - 'red' or 'yellow' or '#FF0000')
 */kb_define('kbaseWalkablePath',
    [
        'jquery',
    	'kbwidget',
    	'narrativeMethodStore',
    	'kbaseAccordion',
    ],
    function ($) {

    $.KBWidget({
        name: "kbaseWalkablePath",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            narrativeMethodStoreURL : "https://kbase.us/services/narrative_method_store/rpc",
            tree : [
                {
                    val : "I'm interested in genes",
                    children : [
                        {
                            val : 'I want to upload them',
                            details : 'upload_file'
                        }
                    ]

                },
                {
                    val : "I'm interested in communities",
                    children : [
                        {
                            val : "I want to work with metabolic models",
                            children : [
                                { val : 'Compare Metabolic Model', details : 'compare_metabolic_model'},
                                { val : 'Create Metabolic Model', details : 'create_metabolic_model'},
                                { val : 'Gapfill Metabolic Model', details : 'gapfill_metabolic_model'},
                            ]
                        },
                        {
                            val : "I want to work with abundance profiles",
                            children : [
                                { val : 'I want to add metadata', details : 'add_metadata_to_abundance_profile'},
                                { val : 'I want to view a boxplot', details : 'boxplots_from_abundance_profile'},
                                { val : "I'm interested in heatmaps",
                                    children : [
                                        {val : "I want to see an interactive heatmap", details : 'interactive_heatmap_from_abundance_profile'},
                                        {val : "I want to see a non-interactive heatmap", details : 'heatmap_from_abundance_profile'},
                                    ]
                                },
                                { val : 'I want to merge profiles', details : 'merge_abundance_profiles'},
                                { val : "I'm interested in PCoA", details : 'pcoa_from_abundance_profile'},
                                { val : "I'm interested in PICRUSt predictions", details : 'picrust_predicted_abundance_profile'},
                                { val : 'I want to rank them', details : 'rank_abundance_from_abundance_profile'},
                                { val : 'I want annotations', details : 'retrieve_annotation_abundance_profile'},
                                { val : 'I want to sub select them', details : 'sub_select_abundance_profile'},
                                { val : 'I want to see metadata', details : 'view_abundance_profile_metadata'},
                                { val : 'I want to sub profile values', details : 'view_abundance_profile_values'},
                            ]
                        },

                        //{val : "Show me everything communities related", childrenKey : 'communitiesList'},
                    ]
                },
                {
                    val : "I'm interested in microbes",
                    children : [
                        {
                            val : "I want to annotate them",
                            children : [
                                { val : 'Add KBase Annotation', details : 'add_kbase_annotation'},
                                { val : 'Annotate ContigSet', details : 'annotate_contigset'},
                                { val : 'Annotate Genome', details : 'annotate_genome'},
                            ]
                        },
                        {
                            val : "I want to build something with them",
                            children : [
                                { val : 'Build Gene Tree', details : 'build_gene_tree'},
                                { val : 'Build Genome Set From Tree', details : 'build_genome_set_from_tree'},
                                { val : 'Build Genome Set Object', details : 'build_genome_set_object'},
                            ]
                        },
                        {
                            val : "I have data to upload",
                            children : [
                                { val : 'Upload Contigs (FASTA-file)', details : 'upload_contigs_fasta_file'},
                                { val : 'Upload Genome (GBK-file)', details : 'upload_genome_gbk_file'},
                            ]
                        },
                        {val : 'I want to view a pangenome', details : 'view_pangenome'},
                        {val : 'I want to view a a proteome comparison', details : 'view_proteome_comparison'},
                        {val : 'I want to view a tree', details : 'view_tree'},
                        //{val : "Show me everything microbes related", childrenKey : 'microbesList'},
                    ]
                },
                {
                    val : "I'm interested in plants",
                    children : [
                        { val : "I want to annotate clusters", details : 'annotate_clusters_with_enriched_ontology_terms' },
                        { val : "I want to annotate networks", details : 'annotate_network_genes_with_ontology_terms' },
                        { val : "I want to construct a network", details : 'construct_co_expression_network_and_clusters' },
                        //{ val : "Show me everything plants related", childrenKey : 'plantsList'},
                    ]
                },
                {
                    val : "I want help with common tasks",
                    children : [
                        {
                            val : "I want to do something with a data file",
                            children : [
                                { val : 'Delete File', details : 'delete_file'},
                                { val : 'Download File', details : 'download_file'},
                                { val : 'Rename File', details : 'rename_file'},
                                { val : 'Upload File', details : 'upload_file'},
                                { val : 'View Files', details : 'view_files'},
                            ]
                        },
                        {
                            val : "I want to run a command",
                            details : 'execute_kbase_command'
                        },
                        {
                            val : "I'm interested in annotations",
                            children : [
                                { val : 'Add KBase Annotation', details : 'add_kbase_annotation'},
                                { val : 'Annotate Genome', details : 'annotate_genome'},
                            ]
                        },
                    ],

                },
                {
                    val : "I want to see everything",
                    bodyKey : 'everything',
                },
                {
                    val : "I want to see the most popular methods",
                    //staticDetails : 'So would we! Coming soon...',//$mostPopular,
                    staticKey : 'mostPopular',
                }
            ],
            ulStyle : {
                'list-style-type' : 'none',
                'margin' : '0px',
                'padding' : '0px'
            },
        },

        init: function(options) {
            this._super(options);

            var nms = new NarrativeMethodStore(this.options.narrativeMethodStoreURL);

            var $wp = this;

            nms.list_methods({}, function(data) {

                //messy way just to get the sortByKey method. Need to make it a class method or something.
                var $accordion = $.jqElem('div').kbaseAccordion({ elements : []});

                var categories = {};

                var categoryLists = {
                    plants : {
                        list : [],
                        $elem : $.jqElem('ul').css({'font-size' : '100%'}).css($wp.options.ulStyle)
                    },
                    microbes : {
                        list : [],
                        $elem : $.jqElem('ul').css({'font-size' : '100%'}).css($wp.options.ulStyle)
                    },
                    communities : {
                        list : [],
                        $elem : $.jqElem('ul').css({'font-size' : '100%'}).css($wp.options.ulStyle)
                    },
                };


                $.each(
                    data,
                    function (idx, val) {
                        $.each(
                            val.categories,
                            function (idx, cat) {
                                if (categories[cat] == undefined) {
                                    categories[cat] = [];
                                }
                                categories[cat].push(val);

                                if (cat.match(/microbe/i || val.name.match(/microbe/i))) {
                                    categoryLists.microbes.list.push({val : val.name, details : val.id});
                                }

                                if (cat.match(/plant/i || val.name.match(/plant/i))) {
                                    categoryLists.plants.list.push({val : val.name, details : val.id});
                                }

                                if (cat.match(/commun/i || val.name.match(/commun/i))) {
                                    categoryLists.communities.list.push({val : val.name, details : val.id});
                                }
                            }
                        );
                    }
                );

                var list = [];

                $.each(
                    categories,
                    function (cat, methods) {
                        var $ul = $.jqElem('ul').css('padding-left', '0px').css($wp.options.ulStyle);
                        $.each(
                            methods.sort($accordion.sortByKey('name')),
                            function (idx, m) {

                                var $link = $.jqElem('a')
                                    .attr('title', m.tooltip)
                                    .tooltip()
                                    .on('click', function() {
                                        if ($wp.options.methodDetails) {
                                            $wp.options.methodDetails.details(m.id)
                                        }
                                    })
                                    .append(m.name);

                                $ul.append(
                                    $.jqElem('li')
                                        .css('list-style', 'none')
                                        .append($link)
                                );
                            }
                        );

                        cat = cat.replace(/_/g, ' ');
                        cat = cat.replace(/ (\w)/g, function(l) { return l.toUpperCase()} );
                        cat = cat.charAt(0).toUpperCase() + cat.slice(1);

                        list.push( { title : cat, body : $ul} ) ;
                    }
                );

                list = list.sort($accordion.sortByKey('title'));

                var $iaccordion = $.jqElem('div').kbaseAccordion({elements : list});

                if ($wp.options.keys == undefined) {
                    $wp.options.keys = {};
                }

                $wp.options.keys['everything'] = $iaccordion.$elem;
                $wp.options.keys['plantsList'] = categoryLists.plants.list;
                $wp.options.keys['microbesList'] = categoryLists.microbes.list;
                $wp.options.keys['communitiesList'] = categoryLists.communities.list;
                $wp.options.keys['mostPopular'] = $wp.options.mostPopular.$elem;


                $wp.appendUI($wp.$elem);

            });

            return this;
        },

        appendUI : function ($elem) {

            $elem.css('overflow', 'hidden');

            this.$floater = $.jqElem('div')
                .css(
                    {
                        position : 'relative',
                        left : '0px',
                        width : '200%',
                    }
                )
            ;

            $elem.append(this.$floater);

            var $root = $.jqElem('div')
                .addClass('tile')
                .css(
                    {
                        'width': '50%',
                        'float' : 'left',
                        'padding' : '0px',
                    }
                )
            ;

            this.$floater.append($root);

            var $rootul = $.jqElem('ul').css(this.options.ulStyle);
            $root.append($rootul);


            var $wp = this;

            $.each(
                this.options.tree,
                function (idx, node) {

                    if (node.childrenKey) {
                        node.children = $wp.options.keys[node.childrenKey];
                    }

                    if (node.bodyKey) {
                        node.body = $wp.options.keys[node.bodyKey];
                    }

                    if (node.staticKey) {
                        node.staticDetails = $wp.options.keys[node.staticKey];
                    }


                    $rootul.append(


                        $.jqElem('li')//.addClass('panel').css('border', '2px solid blue')
                            .css(
                                {
                                    'margin' : '0px',
                                    'padding' : '1px'
                                }
                            )
                            .append(
                                $.jqElem('button')
                                    .addClass('btn btn-primary')
                                    .css({width : '100%', height : '100%', 'text-align' : 'left', 'line-height' : '1em', 'padding' : '6px 4px'})
                                    .on('click', function(e) {
                                        e.preventDefault();e.stopPropagation();

                                        if (node.details) {
                                            if ($wp.options.methodDetails) {
                                                $wp.options.methodDetails.details(node.details);
                                            }
                                        }
                                        else if (node.staticDetails) {
                                            if ($wp.options.methodDetails) {
                                                $wp.options.methodDetails.$elem.empty();
                                                $wp.options.methodDetails.$elem.append(node.staticDetails);
                                            }
                                        }
                                        else {
                                            $wp.magicmove(e, 'right', node);
                                        }

                                    })
                                    .append(node.val)
                                    .append($.jqElem('i')
                                        .addClass('pull-right fa')
                                        .addClass(node.details || node.staticDetails ? 'fa-search' : 'fa-arrow-right'))
                            )
                    );
                }
            );

        },

        magicmove : function(e, dir, node) {

            var $wp = this;

            var width = this.$elem.width();


            //XXX - something in the CSS in the new rev of narrative-develop is resizing the width and making it 50px wider once you click on it.
            //So we just check to see if we've compensated for it - if not, then change our offset by 50px.
            //never speak of it again.
            //
            //no idea what's really happening. This should be investigated further. It looks like the initial rendering of it is off for some reason.
            if (! this.bullshitHack) {
                this.bullshitHack = true;
                width += 50;
            }

            var delta = (dir == 'right' ? '-' : '+') + '=' + width + 'px';
            var $tile = $(e.target).parent().parent().parent();

            if (dir == 'right') {
                var $nextTile = $tile.next();
                $tile.css('float', 'left');

                if ($nextTile.get(0) == undefined) {
                    $nextTile = $.jqElem('div').addClass('tile').css('float', 'right');
                    var tiles = this.$floater.children().length;

                    var newFloaterWidth = (tiles + 1) * 100;

                    this.$floater.css('width', newFloaterWidth + '%');
                    var newTileWidth = 100 / (tiles + 1);
                    this.$floater.append($nextTile);
                    $('div.tile').css('width', newTileWidth + '%');

                }
                else {
                    $nextTile.empty();
                }

                var $backbutton = $.jqElem('button')
                                .addClass('btn btn-info')
                                .css({width : '100%', height : '100%', 'text-align' : 'left', 'line-height' : '1em'})
                                .on('click', function(e) {
                                    e.preventDefault();e.stopPropagation();
                                    $wp.magicmove(e, 'left');
                                })
                                .append(
                                    $.jqElem('i').addClass('fa fa-arrow-left')
                                )
                                .append(' ' + node.val)

                if (node.childrenKey) {
                    node.children = $wp.options.keys[node.childrenKey];
                }

                if (node.bodyKey) {
                    node.body = $wp.options.keys[node.bodyKey];
                }

                if (node.staticKey) {
                    node.staticDetails = $wp.options.keys[node.staticKey];
                }

                if (node.children) {

                    var $nextUl = $.jqElem('ul').css($wp.options.ulStyle);
                    $nextTile.append($nextUl);

                    $.each(
                        node.children,
                        function (idx, subNode) {
                            $nextUl.append(
                                $.jqElem('li')
                                    .append(
                                        $.jqElem('button')
                                            .addClass('btn btn-primary')
                                            .css({width : '100%', height : '100%', 'text-align' : 'left', 'line-height' : '1em', 'padding' : '6px 4px'})
                                            .on('click', function(e) {
                                                e.preventDefault();e.stopPropagation();
                                                if (subNode.details && $wp.options.methodDetails) {
                                                    $wp.options.methodDetails.details(subNode.details);
                                                }
                                                else if (subNode.staticDetails) {
                                                    if ($wp.options.methodDetails) {
                                                        $wp.options.methodDetails.$elem.empty();
                                                        $wp.options.methodDetails.$elem.append(subNode.staticDetails);
                                                    }
                                                }
                                                else {
                                                    $wp.magicmove(e, 'right', subNode);
                                                }

                                            })
                                            .append(subNode.val)
                                            .append($.jqElem('i')
                                                .addClass('pull-right fa')
                                                .addClass(subNode.details || subNode.staticDetails ? 'fa-search' : 'fa-arrow-right'))
                                    )
                            );
                        }
                    )

                    $nextUl.append(
                        $.jqElem('li')
                            .css('text-align', 'right')
                            .css("list-style-type", "none")
                            .append($backbutton)
                    );
                }
                else if (node.body) {
                    $nextTile
                        .append(node.body)
                        .append(
                            $.jqElem('div')
                                .css('text-align', 'right')
                                .append($backbutton)
                        );
                }
                else {
                    $nextTile.append(
                        'Nothing here. :-('
                    )
                    .append(
                        $.jqElem('div')
                            .css('text-align', 'right')
                            .append($backbutton)
                    )
                }
            }

            this.$floater.animate({left : delta});
        }

    });
});
