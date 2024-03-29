/*

    Easy widget to serve as a container with a title.

    var $box =  new kbaseBox($('#box'), {
            title : 'This is a box',
            canCollapseOnDoubleClick: true,  //boolean. Whether or not clicking the title bar collapses the box
            canCollapse: true,  //boolean. Whether or not to show the collapse button
            content: 'Moo. We are a box. Take us to China.',  //The content within the box. Any HTML string or jquery element
            //optional list of controls to populate buttons on the right end of the title bar. Give it an icon
            //and a callback function.
            controls : [
                {
                    icon : 'fa fa-search',
                    callback : function(e) {
                        console.log("clicked on search");
                    },
                    id : 'search' //optional. Keys the button to be available via $box.controls('search')
                },
                {
                    icon : 'fa fa-minus',
                    callback : function(e) {
                        console.log("clicked on delete");
                    }
                },
            ],
        }
    );

    alternatively, set it up or change it after the fact.

    $('#tabs').kbaseBox('setTitle', 'New box title');
    $('#tabs').kbaseBox('setContent', "I'm a big billy goat, so you'd better beat it, sister");
    $('#tabs').kbaseBox('setControls', newControls);  //the tabObject defined up above

*/

define (
	[
		'kbwidget',
		'bootstrap',
		'jquery',
		'kbwidget',
		'kbaseButtonControls'
	], function(
		KBWidget,
		bootstrap,
		$,
		KBWidget,
		kbaseButtonControls
	) {

    return KBWidget({

		  name: "kbaseBox",

        version: "1.0.0",
        options: {
            canCollapse : true,
            canCollapseOnDoubleClick : false,
            controls : [],
            bannerColor : 'lightgray',
            boxColor : 'lightgray',
            displayTitle : true,
        },

        init: function(options) {

            this._super(options);

            if (this.options.canCollapse) {
                this.options.controls.push(
                    {
                        icon : 'fa fa-caret-up',
                        'icon-alt' : 'fa fa-caret-down',
                        'tooltip' : {title : 'collapse / expand', placement : 'bottom'},
                        callback : $.proxy(function(e) {
                            this.data('content').slideToggle();
                        }, this)
                    }
                );
            }


            this.appendUI( $( this.$elem ) );

            return this;

        },

        setBannerColor : function(color) {
            this.data('banner').css('background-color', color);
        },

        startThinking : function() {
            this.data('thinking').css('display', 'inline');
        },

        stopThinking : function() {
            this.data('thinking').css('display', 'none');
        },

        appendUI : function ($elem) {
            var canCollapse = this.options.canCollapse;
            var canCollapseOnDoubleClick = this.options.canCollapseOnDoubleClick;
            var $div = $('<div></div>')
                .append(
                    $('<div></div>')
                        .css('text-align', 'left')
                        .css('font-size', '70%')
                        .css('color', 'gray')
                        .append(this.options.precontent)
                )
                .append(
                    $('<div></div>')
                        .css('border', '1px solid ' + this.options.boxColor)
//                        .addClass('col-sm-12')
                        .css('padding', '2px')
                        .append(
                            $('<div></div>')
                            //.addClass('progress')
                            .attr('id', 'banner')
                            .css('width', '100%')
                            .css('height', '24px')
                            .css('margin-bottom', '0px')
                            .css('box-shadow', 'none')
                            .css('background-color', this.options.bannerColor)
                            .css('border-radius', '0px')
                            .append(
                                $('<h5></h5>')
                                    .attr('id', 'banner-text')
                                    .addClass('text-left')
                                    .css('text-align', 'left')
                                    .css('text-shadow', 'none')
                                    .css('color', 'black')
                                    .css('font-size', '14px')
                                    .addClass('bar')
                                    .css('padding', '2px')
                                    .css('margin', '0px')
                                    .css('position', 'relative')
                                    .css('width', '100%')
                                    .bind('dblclick',
                                        function(e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (canCollapseOnDoubleClick) {
                                                $(this).parent().parent().children().last().collapse('toggle');
                                            }
                                        }
                                    )
                                    .append(
                                        $('<span></span>')
                                            .attr('id', 'title')
                                    )
                                    .append(
                                        $('<span></span>')
                                            .attr('id', 'thinking')
                                            .css('display', 'none')
                                            .append('&nbsp;&nbsp;')
                                            .append(
                                                $.jqElem('i')
                                                    .addClass('fa fa-spinner fa fa-spin')
                                            )
                                    )
                            )
                        )
                        .append(
                            $('<div></div>')
                                .attr('id', 'content')
//                                .addClass('col-sm-12')
                        )
                )
                .append(
                    $('<div></div>')
                        .css('text-align', 'right')
                        .css('font-size', '70%')
                        .css('color', 'gray')
                        .append(this.options.postcontent)
                )

            ;

            this._rewireIds($div, this);

            if (this.options.controls) {
                 new kbaseButtonControls(this.data('banner-text'), {
                        onMouseover : false,
                        controls : this.options.controls
                    }
                )
            }

            if (! this.options.displayTitle) {
                this.data('banner').css("display", 'none');
            }

            //this.setControls(this.options.controls);
            this.setTitle(this.options.title);
            this.setContent(this.options.content);

            $elem.append($div);

            return this;

        },

        setTitle : function (title) {
            this.data('title').empty();
            this.data('title').append(title);
        },

        setContent : function (content) {
            this.data('content').empty();
            this.data('content').append(content);
        },

        content : function() {
            return this.data('content');
        },

        controls : function (control) {
            return this.data('banner-text').kbaseButtonControls('controls', control);
        },


    });

} );
