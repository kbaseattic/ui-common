/*

*/

define('kbaseIrisTutorial',
    [
        'jquery',
        'kbwidget',
        'kbaseIrisConfig',
    ],
    function ($) {



    $.KBWidget({

		  name: "kbaseIrisTutorial",

        version: "1.0.0",
        options: {
            config_url          : window.kbaseIrisConfig.tutorial.config_url,
            default_tutorial    : window.kbaseIrisConfig.tutorial.default_tutorial,
        },

        format_tutorial_url : function (doc_format_string, repo, filespec) {
            var url = doc_format_string;
            url = url.replace(/\$repo/, repo);
            url = url.replace(/\$filespec/, filespec);

            return url;
        },

        list : function() {
            var output = [];
            for (key in this.repos) {

                for (var idx = 0; idx < this.repos[key].length; idx++) {
                    var tutorial = this.repos[key][idx];

                    var url = this.format_tutorial_url(
                        this.doc_format_string,
                        key,
                        tutorial.file
                    );

                    output.push(
                        {
                            title : tutorial.title,
                            url : url,
                        }
                    );
                }
            }

            return output; //output.sort(this.sortByKey('title', 'insensitively'));
        },

        init : function (options) {
            this._super(options);

            this.pages = [];
            this._currentPage = -1;

            $.getJSON(
                this.options.config_url,
                $.proxy(function(data) {

                    this.repos = data.repos;
                    this.doc_format_string = data.doc_format_string;
                    if (this.options.default_tutorial == undefined) {
                        this.options.default_tutorial = data.default;
                    }

                    if (this.options.default_tutorial) {
                        this.retrieveTutorial(this.options.default_tutorial);
                    }

                }, this)
            );


            return this;
        },

        retrieveTutorial : function(url) {

            this.pages = [];

            var token = undefined;

            $.ajax(
                {
    		        async : true,
            		dataType: "text",
            		url: url,
            		crossDomain : true,
            		beforeSend: function (xhr) {
		                if (token) {
                			xhr.setRequestHeader('Authorization', token);
		                }
            		},
            		success: $.proxy(function (data, status, xhr) {

            		    var $resp = $.jqElem('div').append(data);

            		    $.each(
            		        $resp.children(),
            		        $.proxy( function(idx, page) {
            		            $(page).find('.example').remove();
                                this.pages.push($(page));
            		        }, this)
            		    );

            		    this.renderAsHTML();
		            }, this),
            		error: $.proxy(function(xhr, textStatus, errorThrown) {
            		    this.dbg(xhr);
                        throw xhr;
		            }, this),
                    type: 'GET',
    	        }
    	    );

        },

        renderAsHTML : function() {
            this.$elem.empty();
            $.each(
                this.pages,
                $.proxy(function (idx, page) {
                    this.$elem.append(page);
                }, this)
            );
        },

        lastPage : function() {
            return this.pages.length - 1;
        },

        currentPage : function() {
            page = this._currentPage;
            if (this._currentPage < 0) {
                page = 0;
            }
            return this.pages[page];
        },

        goToPrevPage : function () {
            var page = this._currentPage - 1;
            if (page < 0) {
                page = 0;
            }
            this._currentPage = page;
            return page;
        },

        goToNextPage : function () {
            var page = this._currentPage + 1;
            if (page >= this.pages.length) {
                page = this.pages.length - 1;
            }
            this._currentPage = page;
            return page;
        },

        contentForPage : function(idx, $term) {
            if (this.pages.length == 0) {
                return undefined;
            }
            else {
                var content = this.pages[this._currentPage];
                content.find('a').attr('target', '_blank');

                //some magic can only happen if we've been given a terminal object.
                if ($term != undefined) {
                    content.find('a[data-input-link]').on(
                        'click',
                        function(e){
                            $term.appendAndFocusInput($(this).text());
                        }
                    );
                }

                return content;
            }
        },

        contentForCurrentPage : function ($term) {
            return this.contentForPage(this._currentPage, $term);
        },

        list_text : function (handler) {
            return this.command_text('tutorial list', 'tutorial list', 'to see available tutorials.', handler);
        },

        next_text : function (handler) {
            return this.command_text('next', 'next', 'to move to the next step in the tutorial.', handler);
        },

        back_text : function (handler) {
            return this.command_text('back', 'back', 'to move to the previous step in the tutorial.', handler);
        },

        command_text : function (link, command, blurb, handler) {

            if (handler == undefined) {
                throw "Cannot create command_text w/o handler";
            }

            return $.jqElem('span')
                .append("<br>")
                .append("Type ")
                .append(
                    $.jqElem('i')
                        .append(
                            $.jqElem('a')
                                .append(link)
                                .on('click',
                                    $.proxy(function(e) {
                                        handler.run(command);
                                    }, handler)
                                )
                        )
                    )
                .append(' ' + blurb)
        },

    });

});
