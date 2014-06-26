/*


*/

kb_define('kbaseIrisTerminalDispatchEnv',
    [
        'kbaseIrisConfig'
    ],
    function() {

        window.kbaseIrisConfig.terminal.run_dispatch.push(
            {
                name : 'setenv',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('setenv $variable = $value'))
                            .append(' to change environment variable <b>$variable</b> to <b>$value</b>.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^setenv\s+(\S+)\s*=\s*(\S+)/),
                callback : function(args, command, $widget, $deferred) {
                    if (this.envKeys[args[0]]) {
                        this.options[args[0]] = args[1] == 'undefined'
                            ? undefined
                            : args[1];
                        $widget.setOutput($.jqElem('span').html('<b>' + args[0] + '</b> set to <b>' + args[1] + '</b>'));
                        $widget.setValue(args[1]);
                    }
                    else {
                        $widget.setError($.jqElem('span').html("Cannot set environment variable <b>" + args[0] + "</b>: Unknown"));
                    }
                    $deferred.resolve();
                    if (! $widget.isHidden()) { this.scroll() };
                    return true;
                }
            },
            {
                name : 'environment',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('environment'))
                            .append(' to list your currently set environment variables')
                    ;
                    return h;
                },
                callback : function(args, command, $widget, $deferred) {

                    var keyedVars = [];
                    $.each(
                        Object.keys(this.envKeys).sort(),
                        $.proxy( function (idx, key) {
                            keyedVars.push(
                                {
                                    variable : key,
                                    value : this.options[key] == undefined
                                        ? '<i>undefined</i>'
                                        : this.options[key]
                                }
                            );
                        }, this)
                    );

                    var data = {
                        structure : {
                            header      : ['variable', 'value'],
                            rows        : keyedVars,
                        },
                        sortable    : true,
                        hover       : false,
                    };

                    var $tbl = $.jqElem('div').kbaseTable(data);
                    $widget.setOutput($tbl.$elem);
                    $widget.setValue(keyedVars);
                    $deferred.resolve();
                    if (! $widget.isHidden()) { this.scroll() };
                    return true;
                }
            },
            {
                name : 'alias',
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('alias $new_command = $old_command'))
                            .append(' to create a new alias for an existing command.')
                    ;
                    return h;
                },
                auth : true,
                regex       : new RegExp(/^alias\s+(\S+)\s*=\s*(\S+)/),
                callback : function(args, command, $widget, $deferred) {
                    this.aliases[args[0]] = args[1];
                    $widget.setOutput($.jqElem('span').html('<b>' + args[0] + '</b> set to <b>' + args[1] + '</b>'));
                    $deferred.resolve();
                    return true;
                }
            },
            {
                name : 'variable assignment',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append('<i><b>$variable</b> = <b>value</b></i>')
                            .append(' to set a user defined variable.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^(\$\S+)\s*=\s*(\S+)/),
                    callback : function(args, command, $widget, $deferred) {
                    if (args[1] == 'undefined') {
                        delete this.variables[args[0]];
                        $widget.setOutput($.jqElem('span').html('Deleted <b>' + args[0] + '</b>'));
                    }
                    else {
                        this.variables[args[0]] = args[1];
                        $widget.setOutput($.jqElem('span').html('<b>' + args[0] + '</b> set to <b>' + args[1] + '</b>'));
                    }
                    $deferred.resolve();
                    return true;
                }
            },
            {
                name : 'variables',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('variables'))
                            .append(' to see a list of variables defined in this session.')
                    ;
                    return h;
                },

                callback : function(args, command, $widget, $deferred) {

                    var keyedVars = [];
                    $.each(
                        Object.keys(this.variables).sort(),
                        $.proxy( function (idx, key) {
                            keyedVars.push(
                                {
                                    variable : key,
                                    value : this.variables[key]
                                }
                            );
                        }, this)
                    );

                    var data = {
                        structure : {
                            header      : ['variable', 'value'],
                            rows        : keyedVars,
                        },
                        sortable    : true,
                        hover       : false,
                    };

                    var $tbl = $.jqElem('div').kbaseTable(data);
                    $widget.setOutput($tbl.$elem);
                    $widget.setValue(keyedVars);
                    $deferred.resolve();
                    if (! $widget.isHidden()) { this.scroll() };
                    return true;

                }
            }
        );

    }
);
