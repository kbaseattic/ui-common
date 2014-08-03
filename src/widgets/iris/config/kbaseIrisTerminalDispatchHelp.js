/*


*/

kb_define('kbaseIrisTerminalDispatchHelp',
    [
        'kbaseIrisConfig'
    ],
    function() {

        window.kbaseIrisConfig.terminal.run_dispatch.push(
            {
                name        : 'help',
                auth        : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('help'))
                            .append(' receive system help.')
                    ;
                    return h;
                },
                callback    : function (args, command, $widget, $deferred) {
                    $widget.setOutput(
                        $.jqElem('span')
                            .append('There is an introductory Iris tutorial available at ')
                            .append(this.create_ext_link(window.kbaseIrisConfig.tutorial.default_tutorial))
                    );
                    $deferred.resolve();
                    return true;
                }
            },
            {
                name        : 'whatsnew',
                auth        : false,
                regex       : new RegExp(/whatsnew(\s+--recent)?/),
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('whatsnew'))
                            .append(' to view the release change log.')
                            .append('<br>Type ')
                            .append(this.create_input_link('whatsnew --recent'))
                            .append(' to view the changes from the most recent release.')
                    ;
                    return h;
                },
                history : false,
                callback    : function (args, command, $widget, $deferred) {


                    if (args[0]) {
                    this.dbg("RECENT NOTES");
                    this.dbg(this);
                        $widget.setOutput(this.whatsnew().ulForCurrentRelease());
                    }
                    else {
                        $widget.setOutput(this.whatsnew().ulForAllReleases());
                    };

                    if (! $widget.isHidden()) { this.scroll() };

                    return true;

                }
            },
            {
                name : 'commands',
                auth : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('commands'))
                            .append('  to view available invocation commands')
                    ;
                    return h;
                },
                history : false,
                callback : function(args, command, $widget, $deferred) {

                    this.client().valid_commands(
                        $.proxy(
                            function (cmds) {

                                var data = {
                                    structure : {
                                        header      : [],
                                        rows        : [],
                                    },
                                    sortable    : true,
                                    hover       : false,
                                };

                                jQuery.each(
                                    cmds,
                                    function (idx, group) {
                                        data.structure.rows.push( [ { value : group.title, colspan : 2, style : 'font-weight : bold; text-align : center' } ] );

                                        for (var ri = 0; ri < group.items.length; ri += 2) {
                                            data.structure.rows.push(
                                                [
                                                    group.items[ri].cmd,
                                                    group.items[ri + 1] != undefined
                                                        ? group.items[ri + 1].cmd
                                                        : ''
                                                ]
                                            );
                                        }
                                    }
                                );

                                var $tbl = $.jqElem('div').kbaseTable(data);

                                $widget.setOutput($tbl.$elem);
                                $widget.setValue(cmds);
                                $deferred.resolve();
                                this.dbg("IS HIDDEN : " + $widget.isHidden());
                                if (! $widget.isHidden()) { this.dbg("SCROLL IT");this.scroll() };

                            },
                           this
                        )
                    );
                    return true;
                }
            },
            {
                name        : 'questions',
                regex       : new RegExp(/^questions\s*(\S+)?/),
                history : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('questions'))
                            .append('  to view available English language questions')
                    ;
                    return h;
                },
                auth        : false,
                callback    : function (args, command, $widget, $deferred) {

                    var questions = this.options.grammar.allQuestions(args[0]);

                    var data = {
                        structure : {
                            header      : [],
                            rows        : [],
                        },
                        sortable    : true,
                    };

                    $.each(
                        questions,
                        $.proxy( function (idx, question) {
                            data.structure.rows.push(
                                [
                                    {
                                        value :
                                            $.jqElem('a')
                                            .attr('href', '#')
                                            .text(question)
                                            .bind('click',
                                                $.proxy(
                                                    function (evt) {
                                                        evt.preventDefault();
                                                        this.input_box.val(question);
                                                        this.selectNextInputVariable();
                                                    },
                                                    this
                                                )
                                            )
                                    }
                                ]
                            );

                        }, this)
                    );

                    var $tbl = $.jqElem('div').kbaseTable(data);

                    $widget.setOutput($tbl.$elem);
                    $widget.setValue(questions);
                    $deferred.resolve();
                    if (! $widget.isHidden()) { this.scroll() };

                    return true;
                }
            }
        );

    }
);
