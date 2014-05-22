/*


*/

define('kbaseIrisTerminalDispatchHistory',
    [
        'kbaseIrisConfig'
    ],
    function() {

        window.kbaseIrisConfig.terminal.run_dispatch.push(
            {
                name : 'history',
                auth : true,
                history : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('history'))
                            .append('  to view history of all commands typed.')
                    ;
                    return h;
                },
                callback : function(args, command, $widget, $deferred) {
                    var data = {
                        structure : {
                            header      : [],
                            rows        : [],
                        },
                        sortable    : true,
                    };

                    jQuery.each(
                        this.commandHistory,
                        $.proxy(
                            function (idx, val) {
                                data.structure.rows.push(
                                    [
                                        idx,
                                        {
                                            value : $.jqElem('a')
                                                .attr('href', '#')
                                                .text(val)
                                                .bind('click',
                                                    $.proxy( function (evt) {
                                                        evt.preventDefault();
                                                        this.appendInput(val + ' ');
                                                    }, this)
                                                ),
                                            style : 'padding-left : 10px',
                                        }
                                    ]
                                );
                            },
                            this
                        )
                    );

                    var $tbl = $.jqElem('div').kbaseTable(data);

                    $widget.setOutput($tbl.$elem);
                    $widget.setValue(this.commandHistory);
                    $deferred.resolve();
                    return true;
                }
            },
            {
                name : 'repeat',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('! $historyNum'))
                            .append(' to repeat the command at history line <b>$historyNum</b>')
                            .append('<br>Type ')
                            .append(this.create_input_link('!!'))
                            .append(' to repeat the last command.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^!(!|\d+)/),
                callback : function(args, command, $widget, $deferred) {
                    if (args[0] == '!') {
                        this.dbg("bang bang");
                        this.dbg(this.commandHistory[this.commandHistory.length]);
                        this.dbg(this.commandHistory[this.commandHistory.length - 1]);
                        this.dbg(this.commandHistory[this.commandHistory.length - 2]);
                        return this.commandHistory[this.commandHistory.length - 2];
                    }
                    else {
                        return this.commandHistory[args[0]];
                    }
                }
            }
        );

    }
);
