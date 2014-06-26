/*


*/

kb_define('kbaseIrisTerminalDispatchTutorial',
    [
        'kbaseIrisConfig'
    ],
    function() {

        window.kbaseIrisConfig.terminal.run_dispatch.push(
            {
                name        : 'next',
                auth        : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('next'))
                            .append(' to go to the next page of your current tutorial')
                    ;
                    return h;
                },
                history : false,
                callback    : function (args, command, $widget, $deferred) {
                    if (this.tutorial._currentPage == this.tutorial.lastPage() ) {
                        $widget.setError("You are already at the last page.");
                        return true;
                    }
                    this.tutorial.goToNextPage();
                    return "show_tutorial";
                }
            },
            {
                name        : 'back',
                auth        : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('back'))
                            .append(' to go to the previous page of your current tutorial')
                    ;
                    return h;
                },
                history : false,
                callback    : function (args, command, $widget, $deferred) {

                    if (this.tutorial._currentPage == 0 ) {
                        $widget.setError("You are already at the first page.");
                        return true;
                    }

                    this.tutorial.goToPrevPage();
                    return "show_tutorial";
                }
            },
            {
                name        : 'tutorial',
                auth        : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('start'))
                            .append(' to go to the start of your current tutorial')
                    ;
                    return h;
                },
                history : false,
                callback    : function (args, command, $widget, $deferred) {
                    this.tutorial._currentPage = 0;
                    return "show_tutorial";
                }
            },
            {
                name : 'tutorial list',
                auth : false,
                history : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('tutorial list'))
                            .append(' to see a list of available tutorials')
                    ;
                    return h;
                },
                callback : function(args, command, $widget, $deferred) {

                    var list = this.tutorial.list();

                    if (list.length == 0) {
                        $widget.setError(
                            $.jqElem('span')
                                .append("Could not load tutorials.<br>\n")
                                .append(this.tutorial.list_text(this))
                        );
                        $deferred.reject();
                        return true;
                    }

                    var $output = $widget.data('output');
                    $output.empty();


                    $.each(
                        list,
                        $.proxy( function (idx, val) {
                            $output.append(
                                $('<a></a>')
                                    .attr('href', '#')
                                    .append(val.title)
                                    .bind('click', $.proxy( function (e) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        $widget.setError($.jqElem('span').append('Set tutorial to <b>' + val.title + '</b><br>'));
                                        this.tutorial.retrieveTutorial(val.url);
                                        if (! $widget.isHidden()) { this.scroll() };
                                        this.input_box.focus();
                                    }, this))
                                .append('<br>')
                            );

                        }, this)
                    );

                    $deferred.resolve();

                    if (! $widget.isHidden()) { this.scroll() };
                    return true;
                }
            },
            {
                name : 'show_tutorial',
                auth : false,
                history : false,
                callback : function(args, command, $widget, $deferred) {
                    var $page = this.tutorial.contentForCurrentPage(this);
                    $widget.setValue($page);

                    if ($page == undefined) {
                        $widget.setError("Could not load tutorial");
                        $deferred.reject();
                        return true;
                    }

                    $page = $page.clone(true);

                    var headerCSS = { 'text-align' : 'left', 'font-size' : '100%' };
                    $page.find('h1').css( headerCSS );
                    $page.find('h2').css( headerCSS );
                    if (this.tutorial._currentPage > 0) {
                        $page.append(this.tutorial.back_text(this));
                    }
                    if (this.tutorial._currentPage < this.tutorial.pages.length - 1) {
                        $page.append(this.tutorial.next_text(this));
                    }

                    $page.append(
                        this.tutorial.list_text(this)
                    );


                    $widget.setOutput($page);
                    $deferred.resolve();
                    if (! $widget.isHidden()) { this.scroll() };

                    return true;
                }
            }

        );

    }
);
