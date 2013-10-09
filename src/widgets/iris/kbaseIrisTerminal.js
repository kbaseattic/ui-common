/*


*/

(function( $, undefined ) {


    $.KBWidget({

		  name: "kbaseIrisTerminal",
		parent: 'kbaseAuthenticatedWidget',

        version: "1.0.0",
        _accessors : ['terminalHeight', 'client'],
        options: {
            invocationURL : 'http://localhost:5000',
            searchURL : 'https://kbase.us/services/search-api/search/$category/$keyword?start=$start&count=$count&format=json',
            searchStart : 1,
            searchCount : 10,
            searchFilter : {
                literature : 'link,pid'
            },
//            invocationURL : 'http://bio-data-1.mcs.anl.gov/services/invocation',
            maxOutput : 100,
            scrollSpeed : 750,
            terminalHeight : '450px',
            promptIfUnauthenticated : 1,
            autocreateFileBrowser: true,
        },

        init: function(options) {

            this._super(options);

            //for lack of a better place to put it, the plugin to set cursor position
            $.fn.setCursorPosition = function(position){
                if(this.length == 0) return this;
                return $(this).setSelection(position, position);
            }

            $.fn.setSelection = function(selectionStart, selectionEnd) {
                if(this.length == 0) return this;
                input = this[0];
                if (input.createTextRange) {
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', selectionEnd);
                    range.moveStart('character', selectionStart);
                    range.select();
                } else if (input.setSelectionRange) {
                    input.focus();
                    input.setSelectionRange(selectionStart, selectionEnd);
                }

                return this;
            }

            $.fn.focusEnd = function(){
                this.setCursorPosition(this.val().length);
                        return this;
            }

            $.fn.getCursorPosition = function() {
                if(this.length == 0) return this;
                input = this[0];

                return input.selectionEnd;
            }

            //end embedded plugin

            if (this.client() == undefined) {
                this.client(
                    new InvocationService(
                        this.options.invocationURL,
                        undefined,
                        $.proxy(function() {
                            var toke = this.auth()
                                ? this.auth().token
                                : undefined;
                                return toke;
                        }, this)
                    )
                );
            }

            this.tutorial = $.jqElem('div').kbaseIrisTutorial();

            this.commandHistory = [];
            this.commandHistoryPosition = 0;

            this.path = '.';
            this.cwd = "/";
            this.variables = {};
            this.aliases = {};

            this.appendUI( $( this.$elem ) );

            this.fileBrowsers = [];
            if (this.options.fileBrowser) {
                this.addFileBrowser(this.options.fileBrowser);
            }
            else if (this.options.autocreateFileBrowser) {

                this.addFileBrowser(
                    $.jqElem('div').kbaseIrisFileBrowser (
                        {
                            client              : this.client(),
                            externalControls    : false,
                        }
                    )
                )
            };

            $(document).on(
                'loggedInQuery.kbase',
                $.proxy(function (e, callback) {

                var auth = this.auth();
                    if (callback && auth != undefined && auth.unauthenticated == true) {
                        callback(auth);
                    }
                }, this)
            );

            return this;

        },

        loggedInCallback : function(e, args) {


            if (args.success) {
                this.client().start_session(
                    args.user_id,
                    $.proxy( function (newsid) {
                        this.loadCommandHistory();
                        if (args.token) {
                            this.out_text("Authenticated as " + args.name);
                        }
                        else {
                            this.out_text("Unauthenticated logged in as " + args.kbase_sessionid);
                        }
                        this.out_line();
                        this.scroll();
                    }, this ),
                    $.proxy( function (err) {
                        this.out_text(
                            "<i>Error on session_start:<br>" + err.error.message.replace("\n", "<br>\n") + "</i>",
                            'html'
                        );
                    }, this )
                );

                this.input_box.focus();
            }
        },

        loggedInQueryCallback : function(args) {
            this.loggedInCallback(undefined,args);
            if (! args.success && this.options.promptIfUnauthenticated) {
                this.trigger('promptForLogin');
            }
        },

        loggedOutCallback : function(e) {
            this.cwd = '/';
            this.commandHistory = undefined;
            this.terminal.empty();
            this.variables = {};
            this.trigger('clearIrisProcesses');
        },

        addFileBrowser : function ($fb) {
            this.fileBrowsers.push($fb);
        },

        open_file : function(file) {
            this.fileBrowsers[0].openFile(file);
        },

        refreshFileBrowser : function() {
            for (var idx = 0; idx < this.fileBrowsers.length; idx++) {
                this.fileBrowsers[idx].refreshDirectory(this.cwd);
            }
        },

        appendInput : function(text, spacer) {
            if (this.input_box) {
                var space = spacer == undefined ? ' ' : '';

                if (this.input_box.val().length == 0) {
                    space = '';
                };

                this.input_box.val(this.input_box.val() + space + text);
                this.input_box.focusEnd();
            }
        },

        appendUI : function($elem) {

            var $block = $('<div></div>')
                .append(
                    $('<div></div>')
                        .attr('id', 'terminal')
                        .css('height' , this.options.terminalHeight)
                        .css('overflow', 'auto')
                        .css('padding' , '5px')
                        .css('font-family' , 'monospace')
                )
                .append(
                    $('<textarea></textarea>')
                        .attr('id', 'input_box')
                        .attr('style', 'width : 95%;')
                        .attr('height', '3')
                    )
                .append(
                    $('<div></div>')
                        .attr('id', 'file-uploader')
                    )
                .append(
                    $('<div></div>')
                        .attr('id', 'panel')
                        .css('display', 'none')
                    );
            ;

            this._rewireIds($block, this);

            $elem.append($block);

            this.terminal = this.data('terminal');
            this.input_box = this.data('input_box');

            this.out_text("Welcome to the interactive KBase terminal!<br>\n"
                    +"Please click the 'Sign in' button in the upper right to get started.<br>\n"
                    +"Type <b>commands</b> for a list of commands.<br>\n"
                    +"For usage information about a specific command, type the command name with -h or --help after it.<br>\n"
                    +"Please visit <a href = 'http://kbase.us/for-users/tutorials/navigating-iris/' target = '_blank'>http://kbase.us/for-users/tutorials/navigating-iris/</a> or type <b>tutorial</b> for an Iris tutorial.<br>\n"
                    +"To find out what's new, type <b>whatsnew</b><br>\n",

                    'html'
            );

            this.out_line();

            this.input_box.on(
                'keypress',
                jQuery.proxy(function(event) { this.keypress(event); }, this)
            );
            this.input_box.on(
                'keydown',
                jQuery.proxy(function(event) { this.keydown(event) }, this)
            );
            this.input_box.on(
                "onchange",
                jQuery.proxy(function(event) { this.dbg("change"); }, this)
            );


            this.data('input_box').focus();

            $(window).bind(
                "resize",
                jQuery.proxy(
                    function(event) { this.resize_contents(this.terminal) },
                    this
                )
            );

            this.resize_contents(this.terminal);


        },

        saveCommandHistory : function() {
            this.client().put_file(
                this.sessionId(),
                "history",
                JSON.stringify(this.commandHistory),
                "/",
                function() {},
                function() {}
            );
        },

        loadCommandHistory : function() {
            this.client().get_file(
                this.sessionId(),
                "history", "/",
                jQuery.proxy(
                    function (txt) {
                        this.commandHistory = JSON.parse(txt);
                        if (this.commandHistory == undefined) {
                            this.commandHistory = [];
                        }
                        this.commandHistoryPosition = this.commandHistory.length;
                    },
                    this
                ),
                jQuery.proxy(function (e) {
                    this.dbg("error on history load : ");this.dbg(e);
		    }, this)
            );
        },

        resize_contents: function($container) {
            //	var newx = window.getSize().y - document.id(footer).getSize().y - 35;
            //	container.style.height = newx;
        },

        keypress: function(event) {

            if (event.which == 13) {

                if (event.metaKey || event.altKey || event.ctrlKey) {
                    return;
                }

                event.preventDefault();
                var cmd = this.input_box.val();

                this.run(cmd);
                this.scroll();
                this.input_box.val('');
            }
        },

        keydown: function(event) {

            if (event.which == 38) {
                event.preventDefault();
                if (this.commandHistoryPosition > 0) {
                    this.commandHistoryPosition--;
                }
                this.input_box.val(this.commandHistory[this.commandHistoryPosition]);
            }
            else if (event.which == 40) {
                event.preventDefault();
                if (this.commandHistoryPosition < this.commandHistory.length) {
                    this.commandHistoryPosition++;
                }
                this.input_box.val(this.commandHistory[this.commandHistoryPosition]);
            }
            else if (event.which == 39) {
                if (this.options.commandsElement) {

                    var input_box_length = this.input_box.val().length;
                    var cursorPosition = this.input_box.getCursorPosition();

                    if (cursorPosition != undefined && cursorPosition < input_box_length) {
                        this.selectNextInputVariable(event);
                        return;
                    }

                    event.preventDefault();

                    var toComplete = this.input_box.val().match(/([^\s]+)\s*$/);

                    if (toComplete.length) {
                        toComplete = toComplete[1];

                        var ret = this.options.grammar.evaluate(
                            this.input_box.val()
                        );

                        if (ret != undefined && ret['next'] && ret['next'].length) {

                            var nextRegex = new RegExp('^' + toComplete);

                            var newNext = [];
                            for (var idx = 0; idx < ret['next'].length; idx++) {
                                var n = ret['next'][idx];

                                if (n.match(nextRegex)) {
                                    newNext.push(n);
                                }
                            }
                            if (newNext.length || ret.parsed.length == 0) {
                                ret['next'] = newNext;
                                if (ret['next'].length == 1) {
                                    var toCompleteRegex = new RegExp('\s*' + toComplete + '\s*$');
                                    this.input_box.val(this.input_box.val().replace(toCompleteRegex, ''));
                                }
                            }

                            //this.input_box.val(ret['parsed'] + ' ');

                            if (ret['next'].length == 1) {
                                var pad = ' ';
                                if (this.input_box.val().match(/\s+$/)) {
                                    pad = '';
                                }
                                this.appendInput(pad + ret['next'][0] + ' ', 0);

                                this.selectNextInputVariable();
                                return;
                            }
                            else if (ret['next'].length){

                                var shouldComplete = true;
                                var regex = new RegExp(toComplete + '\\s*$');
                                for (prop in ret.next) {
                                    if (! prop.match(regex)) {
                                        shouldComplete = false;
                                    }
                                }

                                this.displayCompletions(ret['next'], toComplete);//shouldComplete ? toComplete : '', false);
                                return;
                            }
                        }

                        var completions = this.options.commandsElement.kbaseIrisCommands('completeCommand', toComplete);
                        if (completions.length == 1) {
                            var completion = completions[0][0].replace(new RegExp('^' + toComplete), '');
                            this.appendInput(completion + ' ', 0);
                        }
                        else if (completions.length) {
                            this.displayCompletions(completions, toComplete);
                        }

                    }

                }
            }

        },

        selectNextInputVariable : function(e) {
            var match;

            var pos = this.input_box.getCursorPosition();

            if (match = this.input_box.val().match(/(\$\S+)/)) {
                if (e != undefined) {
                    e.preventDefault();
                }

                var start = this.input_box.val().indexOf(match[1]);
                var end = this.input_box.val().indexOf(match[1]) + match[1].length;
                //this.input_box.focusEnd();
                this.input_box.setSelection(
                    start,
                    end
                );
                this.input_box.setSelection(start, end);
            }
        },

        search_json_to_table : function(json, filter) {

            var $div = $.jqElem('div');

            var filterRegex = new RegExp('.');
            if (filter) {
                filterRegex = new RegExp(filter.replace(/,/g,'|'));
            };

            $.each(
                json,
                $.proxy(function(idx, record) {
                    var $tbl = $.jqElem('table')
                        .css('border', '1px solid black')
                        .css('margin-bottom', '2px');
                        var keys = Object.keys(record).sort();
                    for (var idx = 0; idx < keys.length; idx++) {
                        var prop = keys[idx];
                        if (prop.match(filterRegex)) {
                            $tbl
                                .append(
                                    $('<tr></tr>')
                                        .css('text-align', 'left')
                                        .append(
                                            $('<th></th>').append(prop)
                                        )
                                        .append(
                                            $('<td></td>').append(record[prop])
                                        )
                                )
                        }
                    }
                    $div.append($tbl);
                }, this)
            );

            return $div;

        },

        displayCompletions : function(completions, toComplete) {

            var prefix = this.options.commandsElement.kbaseIrisCommands('commonCommandPrefix', completions);

            if (prefix != undefined && prefix.length) {
                this.input_box.val(
                    this.input_box.val().replace(new RegExp(toComplete + '\s*$'), prefix)
                );
            }
            else {
                prefix = toComplete;
            }

            var $tbl = $.jqElem('table')
                .attr('border', 1)
                .css('margin-top', '10px')
                .append(
                    $.jqElem('tr')
                        .append(
                            $.jqElem('th')
                                .text('Suggested commands')
                        )
                    );
            jQuery.each(
                completions,
                jQuery.proxy(
                    function (idx, val) {

                        var label = $.isArray(val)
                            ? val[0]
                            : val;

                        $tbl.append(
                            $.jqElem('tr')
                                .append(
                                    $.jqElem('td')
                                        .append(
                                            $.jqElem('a')
                                                .attr('href', '#')
                                                .text(label)
                                                .on('click',
                                                    $.proxy(function (evt) {
                                                        evt.preventDefault();
                                                        this.input_box.val(
                                                            this.input_box.val().replace(new RegExp(prefix + '\s*$'), '')
                                                        );
                                                        this.appendInput(label + ' ');
                                                    }, this)
                                                )
                                        )
                                    )
                            );
                    },
                    this
                )
            );
            var $widget = $.jqElem('div').kbaseIrisTerminalWidget();
            this.terminal.append($widget.$elem);
            $widget.setOutput($tbl);
            $widget.setValue(
                {
                    completions : completions,
                    prefix : prefix
                }
            );
            this.scroll();

        },

        out_text: function(text, type) {

            var $text = $.jqElem('div').kbaseIrisTextWidget();
            this.terminal.append( $text.$elem );

            $text.setText(text, type);

        },

        // Outputs an hr
        out_line: function(text) {
            var $hr = $('<hr>');
            this.terminal.append($hr);
            this.scroll(0);
        },

        scroll: function(speed) {
            if (speed == undefined) {
                speed = this.options.scrollSpeed;
            }

            this.terminal.animate({scrollTop: this.terminal.prop('scrollHeight') - this.terminal.height()}, speed);
        },

        replaceVariables : function(command) {
console.log("RV");console.log(command);
            command = command.replace(/^ +/, '');
            command = command.replace(/ +$/, '');

            var exception = command + command; //something that cannot possibly be a match
            var m;
            if (m = command.match(/^\s*(\$\S+)/)) {
                exception = m[1];
            }

            if (m = command.match(/^(\$\S+)\s*=\s*(\S+)/)) {
                delete this.variables[m[1]];
            }

            for (variable in this.variables) {
                if (variable.match(exception)) {
                    continue;
                }
                var escapedVar = variable.replace(/\$/, '\\$');
                var varRegex = new RegExp(escapedVar, 'g');
                command = command.replace(varRegex, this.variables[variable]);
            }
            return command;
        },

        // Executes a command
        run: function(rawCmd, $widget, subCommand) {

            if ($widget == undefined) {
                $widget = $.jqElem('div').kbaseIrisTerminalWidget();
            }

            var $deferred = $.Deferred();

            var tokens = this.options.grammar.tokenize(rawCmd);

            // no tokens? No command. Bail out.
            if (tokens.length == 0) {
                return;
            }

            // okay. We've tokenized the command. If the first element is an array, then it's a set of commands
            // which are semicolon/newline delimited. We need to monitor the deferred object and jump to the
            // next token when it comes up.
            if ($.isArray(tokens[0])) {

                if (! subCommand) {
                    this.commandHistory.push(rawCmd);
                    this.saveCommandHistory();
                    this.commandHistoryPosition = this.commandHistory.length;
                    var $scriptWidget = $.jqElem('div').kbaseIrisTerminalWidget();
                    this.terminal.append($scriptWidget.$elem);
                    $scriptWidget.setCwd(this.cwd);
                    $scriptWidget.setInput(rawCmd);
                    subCommand = true;
                }

                rawCmd = this.options.grammar.detokenize(tokens.shift());
                $deferred.done(
                    $.proxy(function(res) {
                        this.run(
                            this.options.grammar.detokenize(tokens),
                            undefined,
                            true
                        );
                    }, this)
                );
            }
            //otherwise, we just soldier on. Replace the variables in the raw command. We're off to the races.
            //detokenize the tokens back into a command
            else {
                rawCmd = this.options.grammar.detokenize(tokens);
            }

            //now replaceVariables on the rawCmd and away we go.
            var command = this.replaceVariables(rawCmd);

            $widget.setCwd(this.cwd);
            $widget.setInput(command);
            $widget.setSubCommand(subCommand);
            this.terminal.append($widget.$elem);

            this.dbg("Run (" + command + ')');

console.log("OFF WE GO");

console.log("COMMAND " + command);
console.log(this.options.grammar.tokenize(command));
console.log("(" + this.options.grammar.detokenize(this.options.grammar.tokenize(command)) + ")");

            if (command == 'help') {
                $widget.setOutput(
                    $.jqElem('span').html(
                        'There is an introductory Iris tutorial available <a target="_blank" href="http://kbase.us/developer-zone/tutorials/iris/introduction-to-the-kbase-iris-interface/">on the KBase tutorials website</a>.'
                    )
                );
                $deferred.resolve();
                return;
            }

            this.out_line();

            var m;

            if (m = command.match(/^log[io]n\s*(.*)/)) {
                var args = m[1].split(/\s+/);

                this.dbg(args.length);
                if (! args[0].match(/^\w/)) {
                    $widget.setError('Invalid login syntax');
                    $deferred.reject();
                    return;
                }
                sid = args[0];

                //old login code. copy and pasted into iris.html.
                this.client().start_session(
                    sid,
                    jQuery.proxy(
                        function (newsid) {
                            var auth = {'kbase_sessionid' : sid, success : true, unauthenticated : true};

                            this.terminal.empty();
                            this.trigger('logout', false);
                            this.trigger('loggedOut');
                            this.trigger('loggedIn', auth );

                            // XXX not quite accurate...because the resolve needs to fire AFTER the loggedIn.
                            $deferred.resolve();

                        },
                        this
                    ),
                    jQuery.proxy(
                        function (err) {
                            $widget.setError(
                                "Error on session_start:<br>" + err.error.message.replace("\n", "<br>\n"),
                                "html"
                            );
                            $deferred.reject();
                        },
                        this
                    )
                );
                this.scroll();
                return;
            }

            if (m = command.match(/^authenticate\s*(.*)/)) {
                var args = m[1].split(/\s+/)
                if (args.length != 1) {
                    $widget.setError("Invalid login syntax.");
                    return;
                }
                sid = args[0];

                this.trigger('loggedOut');
                this.trigger('promptForLogin', {user_id : sid});

                //XXX no promise resolution here.

                return;
            }

            if (m = command.match(/^unauthenticate/)) {

                this.trigger('logout');
                this.scroll();

                $deferred.resolve();

                return;
            }

            if (m = command.match(/^logout/)) {

                this.trigger('logout', false);
                this.trigger('loggedOut', false);
                this.scroll();

                $deferred.resolve();

                return;
            }

            if (m = command.match(/^whatsnew/)) {
                $.ajax(
                    {
                        async : true,
                        dataType: "text",
                        url: "whatsnew.html",
                        crossDomain : true,
                        success: $.proxy(function (data, status, xhr) {
                            $widget.setOutput($.jqElem('div').html(data));
                            $deferred.resolve();
                            this.scroll();
                        }, this),
                        error : $.proxy(function(xhr, textStatus, errorThrown) {
                            $widget.setOutput($.jqElem('div').html(xhr.responseText));
                            $deferred.reject();
                            this.scroll();
                        }, this),
                        type: 'GET',
                    }
                );
                return;
            }

            if (command == "next") {
                this.tutorial.goToNextPage();
                command = "show_tutorial";
            }

            if (command == "back") {
                this.tutorial.goToPrevPage();
                command = "show_tutorial";
            }

            if (command == "tutorial") {
                this.tutorial.currentPage = 0;
                command = "show_tutorial";
            }

            if (command == 'tutorial list') {
                var list = this.tutorial.list();

                if (list.length == 0) {
                    $widget.setError(
                        "Could not load tutorials.<br>\n"
                        + "Type <i>tutorial list</i> to see available tutorials.",
                        'html'
                    );
                    $deferred.reject();
                    return;
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
                                    this.input_box.focus();
                                }, this))
                            .append('<br>')
                        );

                    }, this)
                );

                $deferred.resolve();

                this.scroll();
                return;
            }

            if (command == 'show_tutorial') {
                var $page = this.tutorial.contentForCurrentPage();
                $widget.setValue($page);

                if ($page == undefined) {
                    $widget.setError("Could not load tutorial");
                    return;
                }

                $page = $page.clone();

                var headerCSS = { 'text-align' : 'left', 'font-size' : '100%' };
                $page.find('h1').css( headerCSS );
                $page.find('h2').css( headerCSS );
                if (this.tutorial.currentPage > 0) {
                    $page.append("<br>Type <i>back</i> to move to the previous step in the tutorial.");
                }
                if (this.tutorial.currentPage < this.tutorial.pages.length - 1) {
                    $page.append("<br>Type <i>next</i> to move to the next step in the tutorial.");
                }
                $page.append("<br>Type <i>tutorial list</i> to see available tutorials.");

                $widget.setOutput($page);
                $deferred.resolve();
                this.scroll();

                return;
            }

            if (command == 'commands') {

                this.client().valid_commands(
                    jQuery.proxy(
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
                            this.scroll();

                        },
                       this
                    )
                );
                return;
            }

            if (m = command.match(/^questions\s*(\S+)?/)) {

                var questions = this.options.grammar.allQuestions(m[1]);

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
                                            jQuery.proxy(
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
                this.scroll();

                return;
            }

            if (command == 'clear') {
                this.terminal.empty();
                $deferred.resolve();
                return;
            }

            if (! this.sessionId()) {
                $widget.setError("You are not logged in.");
                this.scroll();
                $deferred.resolve();
                return;
            }
console.log("HISTORY FOR " + command + "?");
            if (! subCommand) {
            console.log("ADDS SC");
                this.commandHistory.push(command);
                this.saveCommandHistory();
                this.commandHistoryPosition = this.commandHistory.length;
            }

            if (command == 'history') {

                var data = {
                    structure : {
                        header      : [],
                        rows        : [],
                    },
                    sortable    : true,
                };

                jQuery.each(
                    this.commandHistory,
                    jQuery.proxy(
                        function (idx, val) {
                            data.structure.rows.push(
                                [
                                    idx,
                                    {
                                        value : $.jqElem('a')
                                            .attr('href', '#')
                                            .text(val)
                                            .bind('click',
                                                jQuery.proxy(
                                                    function (evt) {
                                                        evt.preventDefault();
                                                        this.appendInput(val + ' ');
                                                    },
                                                    this
                                                )
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
                return;
            }
            else if (m = command.match(/^!(\d+)/)) {
                command = this.commandHistory[m[1]];
            }


            if (m = command.match(/^cd\s*(.*)/)) {
                var args = m[1].split(/\s+/)
                if (args.length != 1) {
                    $widget.setError("Invalid cd syntax.");
                    $deferred.reject();
                    return;
                }
                dir = args[0];

                this.client().change_directory(
                    this.sessionId(),
                    this.cwd,
                    dir,
                        jQuery.proxy(
                            function (path) {
                                this.cwd = path;
                                $deferred.resolve();
                            },
                            this
                        ),
                    jQuery.proxy(
                        function (err) {
                            var m = err.error.message.replace("/\n", "<br>\n");
                            $widget.setError("Error received:<br>" + err.error.code + "<br>" + m, 'html');
                            $deferred.reject();
                        },
                        this
                    )
                );
                return;
            }

            if (m = command.match(/^(\$\S+)\s*=\s*(\S+)/)) {
                this.variables[m[1]] = m[2];
                $widget.setOutput(m[1] + ' set to ' + m[2]);
                $deferred.resolve();
                return;
            }

            if (m = command.match(/^alias\s+(\S+)\s*=\s*(\S+)/)) {
                this.aliases[m[1]] = m[2];
                $widget.setOutput(m[1] + ' set to ' + m[2]);
                $deferred.resolve();
                return;
            }

            if (m = command.match(/^upload\s*(\S+)?$/)) {
                var file = m[1];
                if (this.fileBrowsers.length) {
                    var $fb = this.fileBrowsers[0];
                    if (file) {
                        $fb.data('override_filename', file);
                    }
                    $fb.data('active_directory', this.cwd);
                    $fb.uploadFile();
                    //XXX NOT QUITE ACCURATE...NEEDS TO WAIT FOR UPLOADFILE TO FINISH
                    $deferred.resolve();
                }
                return;
            }

            if (m = command.match(/^#\s*(.+)/)) {
                //$widget.$elem.remove();
                $widget.setInput('');
                $widget.setOutput($.jqElem('i').text(m[1]));
                $widget.setValue(m[1]);
                $deferred.resolve();
                return;
            }

            if (m = command.match(/^view\s+(\S+)$/)) {
                var file = m[1];

                this.client().get_file(
                    this.sessionId(),
                    file,
                    this.cwd
                )
                .done($.proxy(function(res) {
                    if (file.match(/\.(jpg|gif|png)$/)) {
                        var $img = $.jqElem('img')
                            .attr('src', 'data:image/jpeg;base64,' + btoa(res));
                        $widget.setOutput($img);
                    }
                    else {
                        $widget.setOutput(res);
                    }
                    this.scroll();
                    $deferred.resolve();
                }, this))
                .fail($.proxy(function(res) {
                    $widget.setError('No such file');
                    $deferred.reject();
                }, this));

                return;


            }

            if (m = command.match(/^search\s+(\S+)\s+(\S+)(?:\s*(\S+)\s+(\S+)(?:\s*(\S+))?)?/)) {

                var parsed = this.options.grammar.evaluate(command);

                var searchVars = {};
                //'kbase.us/services/search-api/search/$category/$keyword?start=$start&count=$count&format=json',

                var searchURL = this.options.searchURL;

                searchVars.$category = m[1];
                searchVars.$keyword = m[2];
                searchVars.$start = m[3] || this.options.searchStart;
                searchVars.$count = m[4] || this.options.searchCount;
                var filter = m[5] || this.options.searchFilter[searchVars.$category];

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

                                this.scroll();
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

                return;
            }

            if (m = command.match(/^cp\s*(.*)/)) {
                var args = m[1].split(/\s+/)
                if (args.length != 2) {
                    $widget.setError("Invalid cp syntax.");
                    $deferred.reject();
                    return;
                }
                from = args[0];
                to   = args[1];
                this.client().copy(
                    this.sessionId(),
                    this.cwd,
                    from,
                    to,
                    $.proxy(
                        function () {
                            this.refreshFileBrowser();
                            $deferred.resolve();
                        },this
                    ),
                    jQuery.proxy(
                        function (err) {
                            var m = err.error.message.replace("\n", "<br>\n");
                            $widget.setError("Error received:<br>" + err.error.code + "<br>" + m, 'html');
                            $deferred.reject();
                        },
                        this
                    )
                );
                return;
            }
            if (m = command.match(/^mv\s*(.*)/)) {
                var args = m[1].split(/\s+/)
                if (args.length != 2) {
                    $widget.setError("Invalid mv syntax.");
                    $deferred.reject();
                    return;
                }

                from = args[0];
                to   = args[1];
                this.client().rename_file(
                    this.sessionId(),
                    this.cwd,
                    from,
                    to,
                    $.proxy(
                        function () {
                            this.refreshFileBrowser();
                            $deferred.resolve();
                        },this
                    ),
                    jQuery.proxy(
                        function (err) {
                            var m = err.error.message.replace("\n", "<br>\n");
                            $widget.setError("Error received:<br>" + err.error.code + "<br>" + m, 'html');
                            $deferred.reject();
                        },
                        this
                    ));
                return;
            }

            if (m = command.match(/^mkdir\s*(.*)/)) {
                var args = m[1].split(/\s+/)
                if (args[0].length < 1){
                    $widget.setError("Invalid mkdir syntax.");
                    $deferred.reject();
                    return;
                }
                $.each(
                    args,
                    $.proxy(function (idx, dir) {
                        this.client().make_directory(
                            this.sessionId(),
                            this.cwd,
                            dir,
                            $.proxy(
                                function () {
                                    this.refreshFileBrowser();
                                    $deferred.resolve();
                                },this
                            ),
                            jQuery.proxy(
                                function (err) {
                                    var m = err.error.message.replace("\n", "<br>\n");
                                    $widget.setError("Error received:<br>" + err.error.code + "<br>" + m, 'html');
                                    $deferred.reject();
                                },
                                this
                            )
                        );
                    }, this)
                )
                return;
            }

            if (m = command.match(/^rmdir\s*(.*)/)) {
                var args = m[1].split(/\s+/)
                if (args[0].length < 1) {
                    $widget.setError("Invalid rmdir syntax.");
                    $deferred.reject();
                    return;
                }
                $.each(
                    args,
                    $.proxy( function(idx, dir) {
                        this.client().remove_directory(
                            this.sessionId(),
                            this.cwd,
                            dir,
                            $.proxy(
                                function () {
                                    this.refreshFileBrowser();
                                    $deferred.resolve();
                                },this
                            ),
                            jQuery.proxy(
                                function (err) {
                                    var m = err.error.message.replace("\n", "<br>\n");
                                    $widget.setError("Error received:<br>" + err.error.code + "<br>" + m, 'html');
                                    $deferred.reject();
                                },
                                this
                            )
                        );
                    }, this)
                );
                return;
            }

            if (m = command.match(/^rm\s+(.*)/)) {
                var args = m[1].split(/\s+/);
                if (args[0].length < 1) {
                    $widget.setError("Invalid rm syntax.");
                    $deferred.reject();
                    return;
                }
                $.each(
                    args,
                    $.proxy(function (idx, file) {
                        this.client().remove_files(
                            this.sessionId(),
                            this.cwd,
                            file,
                            $.proxy(
                                function () {
                                    this.refreshFileBrowser();
                                    $deferred.resolve();
                                },this
                            ),
                            jQuery.proxy(
                                function (err) {
                                    var m = err.error.message.replace("\n", "<br>\n");
                                    $widget.setError("Error received:<br>" + err.error.code + "<br>" + m, 'html');
                                    $deferred.reject();
                                },
                                this
                            )
                        );
                    }, this)
                );
                return;
            }

            if (m = command.match(/^execute\s+(.*)/)) {
                var args = m[1].split(/\s+/);
                if (args[0].length < 1) {
                    $widget.setError("Invalid rm syntax.");
                    $deferred.reject();
                    return;
                }
                this.client().get_file(
                    this.sessionId(),
                    args[0], this.cwd,
                    jQuery.proxy(
                        function (script) {
                            console.log("EXECUTING " + script);
                            $deferred.resolve();
                            this.run(script, undefined, true);
                        },
                        this
                    ),
                    jQuery.proxy(function (e) {
                        $widget.setError("No such script");
                        $deferred.reject();
                    }, this)
                );
                return;
            }

            if (d = command.match(/^ls\s*(.*)/)) {
                var args = d[1].split(/\s+/)
                var obj = this;
                if (args.length == 0) {
                    d = ".";
                }
                else {
                    if (args.length != 1) {
                        $widget.setError("Invalid ls syntax.");
                        $deferred.reject();
                        return;
                    }
                    else {
                        d = args[0];
                    }
                }

                this.client().list_files(
                    this.sessionId(),
                    this.cwd,
                    d,
                    jQuery.proxy(
                        function (filelist) {
                            var dirs = filelist[0];
                            var files = filelist[1];

                            var allFiles = [];

                            $.each(
                                dirs,
                                function (idx, val) {
                                    allFiles.push(
                                        {
                                            size    : '(directory)',
                                            mod_date: val.mod_date,
                                            name    : val.name,
                                            nameTD  : val.name,
                                        }
                                    );
                                }
                            );

                            $.each(
                                files,
                                $.proxy( function (idx, val) {
                                    allFiles.push(
                                        {
                                            size    : val.size,
                                            mod_date: val.mod_date,
                                            name    : val.name,
                                            nameTD  :
                                                $.jqElem('a')
                                                    .text(val.name)
                                                    //uncomment these two lines to click and open in new window
                                                    //.attr('href', url)
                                                    //.attr('target', '_blank')
                                                    //comment out this block if you don't want the clicks to pop up via the api
                                                    //*
                                                    .attr('href', '#')
                                                    .on(
                                                        'click',
                                                        jQuery.proxy(
                                                            function (e) {
                                                                e.preventDefault();e.stopPropagation();
                                                                this.open_file(val['full_path']);
                                                                return false;
                                                            },
                                                            this
                                                        )
                                                    ),
                                                    //*/,
                                            url     : this.options.invocationURL + "/download/" + val.full_path + "?session_id=" + this.sessionId()
                                        }
                                    );

                                }, this)
                            );

                            var data = {
                                structure : {
                                    header      : [],
                                    rows        : [],
                                },
                                sortable    : true,
                                bordered    : false
                            };

                            $.each(
                                allFiles.sort(this.sortByKey('name', 'insensitively')),
                                $.proxy( function (idx, val) {
                                    data.structure.rows.push(
                                        [
                                            val.size,
                                            val.mod_date,
                                            { value : val.nameTD }
                                        ]
                                    );
                                }, this)
                            );

                            var $tbl = $.jqElem('div').kbaseTable(data);

                            $widget.setOutput($tbl.$elem);
                            $widget.setValue(filelist);
                            $deferred.resolve();
                            this.scroll();
                         },
                         this
                     ),
                     function (err)
                     {
                         var m = err.error.message.replace("\n", "<br>\n");
                         $widget.setError("Error received:<br>" + err.error.code + "<br>" + m, 'html')
                         $deferred.reject();
                     }
                    );
                return;
            }

            var parsed = this.options.grammar.evaluate(command);

            if (parsed != undefined) {
                if (! parsed.fail && parsed.execute) {
                    command = parsed.execute;

                    if (parsed.explain) {
                        $widget.setOutput(parsed.execute);
                        $deferred.resolve();
                        return;
                    }

                }
                else if (parsed.parsed.length && parsed.fail) {
                    $widget.setError(parsed.error);
                    $deferred.reject();
                    return;
                }
            }

            //command = command.replace(/\\\n/g, " ");
            //command = command.replace(/\n/g, " ");

            var pid = this.uuid();

            var $pe = $.jqElem('div').text(command);
            $pe.kbaseButtonControls(
                {
                    onMouseover : true,
                    context : this,
                    controls : [
                        {
                            'icon' : 'icon-ban-circle',
                            //'tooltip' : 'Cancel',
                            callback : function(e, $term) {
                                $widget.promise().xhr.abort();
                                $widget.$elem.remove();
                            }
                        },
                    ]

                }
            );

            this.trigger(
                'updateIrisProcess',
                {
                    pid : pid,
                    content : $pe
                }
            );

            //var commands = command.split(/[;\r\n]/) {

            var promise = this.client().run_pipeline(
                this.sessionId(),
                command,
                [],
                this.options.maxOutput,
                this.cwd,
                jQuery.proxy(
                    function (runout) {

                        this.trigger( 'removeIrisProcess', pid );

                        if (runout) {

                            var output = runout[0];
                            var error  = runout[1];

                            this.refreshFileBrowser();

                            if (output.length > 0 && output[0].indexOf("\t") >= 0) {

                                var $tbl = $('<table></table>')
                                    //.attr('border', 1);

                                jQuery.each(
                                    output,
                                    jQuery.proxy(
                                        function (idx, val) {
                                            var parts = val.split(/\t/);
                                            var $row = $.jqElem('tr')
                                            jQuery.each(
                                                parts,
                                                jQuery.proxy(
                                                    function (idx, val) {
                                                        $row.append(
                                                            $('<td></td>')
                                                                .html(val)
                                                            );
                                                        if (idx > 0) {
                                                            $row.children().last().css('padding-left', '15px')
                                                        }
                                                        if (idx < parts.length - 1) {
                                                            $row.children().last().css('padding-right', '15px')
                                                        }
                                                    },
                                                    this
                                                )
                                            );
                                            $tbl.append($row);
                                        },
                                        this
                                    )
                                );
                                $widget.setOutput($tbl);
                                $widget.setValue(output);
                            }
                            else {
                                $widget.setOutput(output.join(''));
                                $widget.setValue(output);
                            }

                            if (error.length) {
                            console.log("ERROR HERE");
                            console.log(error);
                            console.log(runout);
                                $widget.setError(error.join(''));
                                if (output.length) {
                                    $deferred.resolve();
                                }
                                else {
                                    $deferred.reject();
                                }
                            }
                            else {
                                $widget.setError('Command Completed');
                                $deferred.resolve();
                            }
                        }
                        else {
                            $widget.setError('Error running command.');
                            $deferred.reject();
                        }
                        this.scroll();
                    },
                    this
                ),
                $.proxy( function(res) { this.trigger( 'removeIrisProcess', pid ); }, this)
            );

            $widget.promise(promise);

            return $deferred.promise();
        }


    });

}( jQuery ) );
