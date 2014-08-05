/*


*/

kb_define('kbaseIrisTerminalDispatchScript',
    [
        'kbaseIrisConfig'
    ],
    function() {

        window.kbaseIrisConfig.terminal.run_dispatch.push(
            {
                name : 'record',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('record'))
                            .append(' to begin recording commands to save to a script')
                    ;
                    return h;
                },
                callback : function(args, command, $widget, $deferred) {
                    $widget.setError("recording actions");
                    this.recording = true;
                    if (! $widget.isHidden()) { this.scroll() };
                    $deferred.resolve();
                    return true;
                }
            },
            {
                name        : 'save',
                regex       : new RegExp(/^save\s*(.+)/),
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('save $filename'))
                            .append(' to save recorded actions to file <b>$filename</b>')
                    ;
                    return h;
                },
                auth        : true,
                callback    : function(args, command, $widget, $deferred) {
                args = args[0].split(/\s+/);
                if (args.length != 1) {
                    $widget.setError("Invalid save syntax. Please specify a file name.");
                    $deferred.reject();
                    return true;
                }

                if (this.record == undefined) {
                    $widget.setError("Error : Not recording. Cannot save.");
                    $deferred.reject();
                    return true;
                }

                file = args[0];

                this.client().put_file(
                    this.sessionId(),
                    file,
                    //JSON.stringify(this.record),
                    this.record.join('\n'),
                    this.cwd,
                    $.proxy(function() {
                        $widget.setOutput('Recording saved as ' + file);
                        this.recording = false;
                        this.record = undefined;
                        $deferred.resolve();
                    }, this),
                    $.proxy( function(err) {
                        $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                        $deferred.reject();
                    }, this)
                );

                return true;
                }
            },
            {
                name : 'snapshot',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('snapshot $filename'))
                            .append(' to save selected widgets to a snapshot file <b>$filename</b>')
                    ;
                    return h;
                },
                regex       : new RegExp(/^snapshot\s*(.*)/),
                callback : function(args, command, $widget, $deferred) {
                    args = args[0].split(/\s+/);
                    if (! args[0].length || args.length != 1) {
                        $widget.setError("Invalid snapshot syntax. Please specify a file name.");
                        $deferred.reject();
                        return true;
                    }
                    file = args[0];

                    if (! this.selectedWidgets.length) {
                        $widget.setError('No widgets selected for snapshot');
                        $deferred.reject();
                        return true;
                    }

                    var snappedWidgets = [];
                    $.each(
                        this.selectedWidgets,
                        function (idx, $widget) {
                            snappedWidgets.push($widget.freeze());
                        }
                    );

                    var snappedFiles = [];

                    $.each(
                        this.fileBrowsers,
                        function (idx, $fb) {
                            $.each(
                                $fb.selectedFiles(),
                                function (file, isSelected) {
                                    if (isSelected) {
                                        snappedFiles.push(file);
                                    }
                                }
                            )
                        }
                    );

                    snapshot = {
                        widgets : snappedWidgets,
                        files : snappedFiles,
                    };

                    this.client().put_file(
                        this.sessionId(),
                        file,
                        JSON.stringify(snapshot),
                        this.cwd,
                        $.proxy(function() {
                            $widget.setOutput('Snapshot saved as ' + file);
                            var selectedWidgets = this.selectedWidgets;
                            $.each(
                                selectedWidgets,
                                function (idx, $widget) {

                                    $widget.setIsSelected(false);
                                }
                            );
                            $.each(
                                this.fileBrowsers,
                                function (idx, $fb) {

                                    var selectedFiles = $fb.selectedFiles();
                                    $.each(
                                        selectedFiles,
                                        function (file, isSelected) {
                                            if (isSelected) {
                                                $fb.toggleSelection(file);
                                            }
                                        }
                                    )
                                }
                            );
                            $deferred.resolve();
                        }, this),
                        $.proxy( function(err) {
                            $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                            $deferred.reject();
                        }, this)
                    );

                    return true;

                }
            },
            {
                name : 'thaw',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('thaw $filename'))
                            .append(' to recreate a snapshotted set of widgets in <b>$filename</b>')
                    ;
                    return h;
                },
                regex       : new RegExp(/^thaw\s*(.+)/),
                callback : function(args, command, $widget, $deferred) {
                    args = args[0].split(/\s+/);
                    if (args.length != 1) {
                        $widget.setError("Invalid that syntax. Please specify a file name.");
                        $deferred.reject();
                        return true;
                    }
                    file = args[0];

                    $widget.$elem.css('background-color', '#DDDDDD');

                    this.client().get_file(
                        this.sessionId(),
                        file,
                        this.cwd,
                        $.proxy(function(res) {
                            var snapshot = JSON.parse(res);
                            $.each(
                                snapshot.widgets,
                                $.proxy(function (idx, wdgt) {
                                    //re-use the previously created widget for the thaw factory.
                                    var $thawedWidget = $widget.thaw(wdgt);
                                    $widget.appendWidget($thawedWidget);
                                }, this)
                            );

                            $deferred.resolve();
                        }, this),
                        $.proxy( function(err) {
                            $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                            $deferred.reject();
                        }, this)
                    );

                    return true;

                }
            },

            {
                name : 'search',
                auth : true,
                regex       : new RegExp(/^search\s+(\S+)\s+(\S+)(?:\s*(\S+)\s+(\S+)(?:\s*(\S+))?)?/),
                callback : function(args, command, $widget, $deferred) {

                    var parsed = this.options.grammar.evaluate(command);

                    var searchVars = {};
                    //'kbase.us/services/search-api/search/$category/$keyword?start=$start&count=$count&format=json',

                    var searchURL = this.options.searchURL;

                    searchVars.$category = args[0];
                    searchVars.$keyword = args[1];
                    searchVars.$start = args[2] || this.options.searchStart;
                    searchVars.$count = args[3] || this.options.searchCount;
                    var filter = args[4] || this.options.searchFilter[searchVars.$category];

                    for (prop in searchVars) {
                        searchURL = searchURL.replace(prop, searchVars[prop]);
                    }

                    $.support.cors = true;
                    $.ajax(
                        {
                            type            : "GET",
                            url             : searchURL,
                            dataType        : "json",
                            crossDomain     : true,
                            xhrFields       : { withCredentials: true },
                             xhrFields: {
                                withCredentials: true
                             },
                             beforeSend : function(xhr){
                                // make cross-site requests
                                xhr.withCredentials = true;
                             },
                            success         : $.proxy(
                                function (data,res,jqXHR) {
                                    var $output = $.jqElem('span');
                                    $output.append('<br>', 'html');
                                    $output.append($('<i></i>').html("Command completed."));
                                    $output.append('<br>', 'html');
                                    $output.append(
                                        $.jqElem('span')
                                            .append($.jqElem('b').html(data.found))
                                            .append(" records found.")
                                    );
                                    $output.append('<br>', 'html');
                                    $output.append(this.search_json_to_table(data.body, filter));
                                    $widget.setOutput($output);
                                    $widget.setValue({
                                        results : data.body,
                                        filter : filter
                                    });
                                    var res = this.search_json_to_table(data.body, filter);

                                    if (! $widget.isHidden()) { this.scroll() };
                                    $deferred.resolve();

                                },
                                this
                            ),
                            error: $.proxy(
                                function (jqXHR, textStatus, errorThrown) {

                                    $widget.setError(errorThrown);
                                    $deferred.reject();

                                }, this
                            ),
                       }
                    );

                    return true;
                }
            },
            {
                name : 'execute',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('execute $filename'))
                            .append(' to execute the series of IRIS commands stored in the script <b>$filename</b>')
                    ;
                    return h;
                },
                regex       : new RegExp(/^execute\s+(.*)/),
                callback : function(args, command, $widget, $deferred, opts) {
                    if (args.length != 1) {
                        $widget.setError("Invalid execute syntax.");
                        $deferred.reject();
                        return true;
                    }
                    this.client().get_file(
                        this.sessionId(),
                        args[0], this.cwd,
                        $.proxy(
                            function (script) {
                                //XXX promise resolution here is...sketchy at best.
                                //we obviously haven't finished running anything, so we shouldn't
                                //necessarily resolve, but it would be resolved by the next call through
                                //the run loop anyway. So bugger all if I know. I'll have to revisit.
                                $deferred.resolve();

                                //Sigh. Freakin' special case. This is the time that a run commmand
                                //can spawn a new run, but NOT via tokenization. So we explicitly
                                //toss the <hr> into the output, and nuke the following hr in the terminal
                                //$widget.setOutput('abc');//$.jqElem('div'));
                                //this.out_line($widget.output());
                                if ($widget.$elem.next().prop('tagName') == 'HR') {
                                    $widget.$elem.next().remove();
                                }


                                this.run(
                                    script,
                                    {
                                        subCommand : true,
                                        //$widget : $widget,
                                        $containerWidget : $widget,
                                        viaInvoke : opts.viaInvoke
                                    }
                                );
                            },
                            this
                        ),
                        $.proxy(function (e) {
                            $widget.setError("No such script");
                            $deferred.reject();
                        }, this)
                    );
                    return true;
                }
            },
            {
                name : 'evaluate',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('evaluate $filename'))
                            .append(' to execute the javascript contained within script $filename')
                    ;
                    return h;
                },
                regex       : new RegExp(/^evaluate\s+(.*)/),
                    callback : function(args, command, $widget, $deferred) {

                    var script = args[0];
                    if (script.length < 1) {
                        $widget.setError("Invalid evalute syntax.");
                        $deferred.reject();
                        return true;
                    }

                    this.client().get_file(
                        this.sessionId(),
                        script, this.cwd,
                        $.proxy(
                            function (script) {
                                this.evaluateScript(this, $widget, script, $deferred, $widget);
                            },
                            this
                        ),
                        $.proxy(function (e) {

                            //dammit. No such script. see if we can evalute it.
                            this.evaluateScript(this, $widget, script, $deferred, $widget);

                        }, this)
                    );

                    return true;
                }
            }
        );

    }
);
