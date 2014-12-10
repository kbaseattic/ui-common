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
        },

        init: function(options) {
            this._super(options);

            this.appendUI(this.$elem);

            return this;
        },

        appendUI : function($elem) {

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
