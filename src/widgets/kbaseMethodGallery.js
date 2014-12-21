kb_define('kbaseMethodGallery',
    [
        'jquery',
	    'kbwidget',
	    'kbasePopularMethods',
	    'kbaseCarousel',
	    'kbaseWalkablePath',
	    'kbaseMethodDescription',
    ],
    function ($) {

    $.KBWidget({
        name: "kbaseMethodGallery",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            color: "black",
            narrativeMethodStoreURL : "https://kbase.us/services/narrative_method_store/rpc",
        },

        init: function(options) {
            this._super(options);

            this.nms = new NarrativeMethodStore(this.options.narrativeMethodStoreURL);

            this.appendUI(this.$elem);

            return this;
        },

        appendUI : function($elem) {

            $elem.addClass('container-fluid');
            $elem.css('background-color', 'lightgray');


            var topMeth = 4;

            //this.nms.list_categories({}, function(data) {
            //    this.dbg("CATS ARE", data);
            //}  );

            this.nms.list_apps({}, function(data) {

            var topApp = data.shift();

                var $topContent = $.jqElem('div')
                    .addClass('col-sm-12')
                    .append(
                        $.jqElem('div')
                        .css('margin', '4px')
                        .css('padding', '4px')
                        .css('box-shadow', '3px 3px 1px gray')
                        .css('height', '150px')
                        .css('border', '1px solid gray')
                        .css('background-color', 'white')
                        .append(
                            $.jqElem('img')
                                .attr('src', '/root/img/labs_icon.png')
                                .attr('width', '128')
                                .attr('height', '128')
                                .addClass('pull-right')
                        )
                        .append($.jqElem('h2').append(topApp.name))
                        .append(topApp.subtitle)
                        .append('<br>')
                        .append(
                            $.jqElem('a')
                                .append('LAUNCH')
                                .on('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    $(this).trigger('methodClicked.Narrative', topApp);
                                })
                        )
                    );
                ;

                $elem.append($.jqElem('div').addClass('row').append($topContent));

                $elem.append(
                    $.jqElem('div')
                        .css('background-color', 'white')
                        .css('border', '1px solid black')
                        .css('margin', '4px')
                        .css('box-shadow', '3px 3px 1px gray')
                        .css('font-size', '200%')
                        .append(
                            $.jqElem('div')
                                .addClass('row')
                                .css('padding', '4px')

                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-1')
                                        .append('Browse')
                                )
                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-7')
                                        .append(
                                            $.jqElem('span')
                                                //.addClass('badge')
                                                //.css('line-height', 1.52857143)
                                                .append('MICROBES')
                                                .css('background-color', 'lightgray')
                                                .css('border-radius', '5px')
                                                .css('padding', '2px')
                                                .css('color', 'white')
                                                .append(
                                                    $.jqElem('i')
                                                        .addClass('fa fa-remove')
                                                        .css('margin', '2px')
                                                        .on('click', function(e) {
                                                            $(this).parent().remove();
                                                        })
                                                )
                                        )
                                )
                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-2')
                                        .css('text-align', 'right')
                                        .append('tags')
                                        .append($.jqElem('i').addClass('fa fa-angle-down'))
                                )
                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-1')
                                        .append($.jqElem('i').addClass('fa fa-search'))
                                )
                                .append(
                                    $.jqElem('div')
                                        .addClass('col-sm-1')
                                        .append('AZ')
                                )
                        )
                );

                var boxes = [];

                $.each(
                    data,
                    function (idx, meth) {

                        var $methContent = $.jqElem('div')
                            //.css('height', '80px')
                            .css('border', '1px solid gray')
                            .css('box-shadow', '3px 3px 1px gray')
                            .css('margin', '4px')
                            .css('padding', '2px')
                            .css('background-color', 'white')
                            .addClass('row')
                            .append(
                                $.jqElem('div')
                                    .addClass('pull-left')
                                    .css('height', '100px')
                                    .append(
                                        $.jqElem('img')
                                            .attr('src', '/root/img/labs_icon.png')
                                            .attr('width', '50')
                                            .attr('height', '50')
                                            .css('margin', '2px')
                                    )
                            )
                            .append(
                                $.jqElem('div')
                                    .append($.jqElem('h4').append(topApp.name))
                                    .append(topApp.subtitle)
                                    .append('<br>')
                                    .append(
                                        $.jqElem('a')
                                            .append('LAUNCH')
                                            .on('click', function(e) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                $(this).trigger('methodClicked.Narrative', topApp);
                                            })
                                    )
                            )
                        ;


                        boxes.push($methContent);

                        if (--topMeth <=0) {
                            return false;
                        }
                    }
                );

                var $row = $.jqElem('div').addClass('row');
                var boxesPerRow = Math.floor(boxes.length / 2);
                var cellIdx = 0;

                var boxWidth = Math.floor(12 / boxesPerRow);
                if (boxWidth < 1) {
                    boxWidth = 1;
                }

                var boxClass = 'col-sm-' + boxWidth;

                $elem.append($row);

                $.each(
                    boxes,
                    function(idx, box) {

                        if (++cellIdx > boxesPerRow) {
                            $row = $.jqElem('div').addClass('row');
                            $elem.append($row);
                            cellIdx = 0;
                        }

                        var $cell = $.jqElem('div')
                            .addClass(boxClass)
                            .append(box)
                        ;

                        $row.append($cell);

                    }
                );

            });

        },

        oldAppendUI : function($elem) {

            var $root =
                $.jqElem('div')
                    .addClass('container-fluid')
                    .append(
                        $.jqElem('div')
                            .addClass('row')
                            .css('margin-top', '55px')
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-4')
                                    .append(
                                        $.jqElem('div')
                                            .attr('id', 'paths')
                                    )
                            )
                            .append(
                                $.jqElem('div')
                                    .addClass('col-md-8')
                                    .append(
                                        $.jqElem('div').attr('id', 'carousel')
                                    )
                                    .append(
                                        $.jqElem('div').attr('id', 'method-details')
                                    )
                            )
                    )
            ;

            this._rewireIds($root, this);

            var $mostPopular = $.jqElem('div').kbasePopularMethods();
            this.data('method-details').append($mostPopular.$elem);

            var $methodDetails = this.data('method-details').kbaseMethodDescription(
                {mostPopular : $mostPopular, sidePanel : this.options.sidePanel}
            );

            this.data('paths').kbaseWalkablePath({ methodDetails : $methodDetails, mostPopular : $mostPopular});

            this.data('carousel').kbaseCarousel({ methodDetails : $methodDetails});

            $elem.append($root);

            return this;
        }

    });
});
