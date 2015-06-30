define('kbaseMethodDescription',
    [
        'jquery',
    	'kbwidget',
    	'narrativeMethodStore',
    	'kbaseAccordion',
    	'kbaseLineSerieschart',
    	'kbaseCarousel',
    ],
    function ($) {

    $.KBWidget({
        name: "kbaseMethodDescription",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            color: "black",
            narrativeMethodStoreURL : "https://kbase.us/services/narrative_method_store/rpc",
            method_id : 'align_protein_sequences_generic',
        },

        init: function(options) {
            this._super(options);

            this.nms = new NarrativeMethodStore(this.options.narrativeMethodStoreURL);

            this.details_from_id(this.options.method_id);

            this.$elem.append('Loading description ... ').append($.jqElem('i').addClass('fa fa-spin fa-spinner'));

            return this;
        },

        details_from_id : function(id) {
            var $details = this;

            this.nms.get_method_full_info({ids : [id]}, function (meth) {
                meth = meth[0];

                $details.nms.get_method_spec({ids : [id]}, function (spec) {
                    $details.details(meth, spec);
                });

            });
        },



        details : function (meth, spec) {

//            m = {id : m};

            var $details = this;





            var $res =
                $.jqElem('div');

            var $gal = $.jqElem('div');


            if (meth.screenshots == undefined || meth.screenshots.length == 0) {
                meth.screenshots = [];
            }

            $.each(
                meth.screenshots,
                function (idx, ss) {

                    if (ss.thumb == undefined || ! ss.thumb.match(/^http/)) {
                        ss.thumb = 'https://kbase.us/services/narrative_method_store' + (ss.thumb || ss.url);
                    }

                    if (! ss.url.match(/^http/)) {
                        ss.url = 'https://kbase.us/services/narrative_method_store' + ss.url;
                    }



                    $gal
                        .append(
                            $.jqElem('img')
                                .attr('src', ss.thumb)
                                .css({width : '128px', height : '128px', margin : '2px'})
                                .on('click', function(e) {
                                    window.open( ss.url);
                                    return;
                                })
                        )

                }
            );


            $res
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-8')
                                    .append($.jqElem('h1').append(meth.name))
                            )
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-2')
                                    .append(
                                        $.jqElem('a')
                                            .append('LAUNCH')
                                            .on('click', function(e) {
                                                if ($details.options.gallery) {
                                                    $details.options.gallery.launchMethod(spec[0].info.id);
                                                }
                                            })
                                    )
                            )
                    )
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-12')
                                    .append($.jqElem('h2').append(meth.subtitle))
                            )
                    )
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-4')
                                    .css({'font-weight' : 'bold'})
                                    .append('Version')
                            )
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-8')
                                    .append(meth.ver)
                            )
                    )
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-4')
                                    .css({'font-weight' : 'bold'})
                                    .append('Help or questions? Contact:')
                            )
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-8')
                                    .append(meth.contact)
                            )
                    )
                    .append($.jqElem('hr'))
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-12')
                                    .append($.jqElem('h4').append('Technical Details'))
                            )
                    )
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-12')
                                    .append(meth.technical_description)
                            )
                    )
                    .append($.jqElem('hr'))
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-12')
                                    .append($.jqElem('h4').append('Technical Parameter Details'))
                            )
                    )

            ;

            var $specField = $.jqElem('ul').css('list-style-type', 'none');

            $.each(
                spec[0].parameters,
                function (idx, param) {
                    var $li = $specField.append($.jqElem('li').append('Parameter ' + (idx + 1)));
                    $li.append(
                        $.jqElem('ul')
                            .css('list-style-type', 'none')
                                .append(
                                    $.jqElem('li')
                                        .append(
                                            $.jqElem('b').append(param.ui_name)
                                        )
                                        .append(
                                            $.jqElem('ul')
                                                .css('list-style-type', 'none')
                                                .append($.jqElem('li').append(param.short_hint))
                                                .append($.jqElem('li').append(param.long_hint))
                                        )
                                )
                    );

                    $specField.append($li);


                }
            );

            $res.append($specField);

            var $stats = $.jqElem('div');

            stats = $details.options.mostPopular
                ? $details.options.mostPopular.stats()
                : [];


            var method_stats = stats.by_method
                ? stats.by_method[meth.id]
                : undefined;

            if (method_stats) {
                $stats = $.jqElem('div')
                    .append(stats.by_method[meth.id].total_count + ' total calls');

                var $linechart = $.jqElem('div')
                    .css({width : '500px', height : '300px'});

                var lineData = [];
                var labels = [];
                var idx = 0;
                $.each(
                    stats.by_method[meth.id].accesses_by_month,
                    function (month, accesses) {
                        lineData.push({x : idx++, xLabel : month, y : accesses});
                        labels.push(month);
                    }
                );

                var $lsc = $.jqElem('div').kbaseLineSerieschart();

                lineData = lineData.sort($lsc.sortByKey('xLabel'));
                labels = labels.sort();

                $linechart.kbaseLineSerieschart(
                    {
                        scaleAxes       : true,

                        xLabel      : 'Month',
                        yLabel      : 'Usage',

                        labels : labels,

                        dataset : [
                            {
                                color : 'blue',
                                values : lineData,
                            },

                        ],

                    }
                );

                $stats.append($linechart);

            }

            var elements = [
                    {
                        title : 'Usage info',
                        body : $res,
                        open : true,
                    },
                ]
            ;

            if ($gal.children().length) {
                elements.unshift(
                    {
                        title : 'Screenshots',
                        body : $gal,
                        open : true,
                    }
                );
            }

            if ($stats.children().length) {
                elements.unshift(
                    {
                        title : 'Usage stats',
                        body : $stats,
                        open : true,
                    }
                );
            }



            var $methAccordion = $.jqElem('div').kbaseAccordion(
                {
                    fontMultiplier : 3,
                    elements : elements
                }
            );

            $details.$elem.empty();

            $details.$elem
                .append(
                    $.jqElem('div').addClass('col-md-12')
                        .append(
                            $.jqElem('a')
                                .append($.jqElem('i').addClass('fa fa-chevron-left')
                                .on('click', function(e) {
                                    if ($details.options.gallery) {
                                        $details.options.gallery.reset();
                                    }
                                })
                            )
                        )
                )
            ;
            $details.$elem.append($methAccordion.$elem);
    }

    });
});
