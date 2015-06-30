/*


*/

define('kbaseIrisTerminal',
    [
        'jquery',
        'kbwidget',
        'kbaseButtonControls',
        'kbaseIrisTutorial',
        'kbaseIrisFileBrowser',
        'kbaseAuthenticatedWidget',
        'kbaseIrisCommands',
        'kbaseIrisGrammar',
        'kbaseIrisTerminalWidget',
        'kbaseIrisTextWidget',
        'kbaseIrisContainerWidget',
        'kbaseTable',
        'kbaseIrisConfig',

        'kbaseIrisTerminalDispatch',
    ],
    function ($) {


    $.KBWidget({

		  name: "kbaseIrisTerminal",
		parent: 'kbaseAuthenticatedWidget',

        version: "1.0.0",
        _accessors : [
            'terminalHeight',
            'client',
            'subWidgets',
            'whatsnew'
        ],
        options: {

            searchStart : 1,
            searchCount : 10,
            searchFilter : {
                literature : 'link,pid'
            },

            maxOutput : 100,
            scrollSpeed : 750,
            terminalHeight : '550px',
            promptIfUnauthenticated : false,
            autocreateFileBrowser: true,
            environment : ['maxOutput', 'scrollSpeed'],
            subWidgets : [],
            defaultFileType : 'IrisFile',

            invocationURL : window.kbaseIrisConfig.terminal.invocationURL,
            searchURL     : window.kbaseIrisConfig.terminal.searchURL,
        },

        run_dispatch : [
            {
                name : 'clear',
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('clear'))
                            .append(' to clear your terminal history.')
                    ;
                    return h;
                },
                auth : false,
                history : false,
                callback : function(args, command, $widget, $deferred) {
                    while (this.subWidgets().length) {
                        this.removeWidget(this.subWidgets()[0]);
                    }

                    this.trigger('clearIrisProcesses');
                    this.terminal.empty();
                    $deferred.resolve();

                    return true;
                }
            },
            {
                name : 'end',
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('end'))
                            .append(' to jump to the end of your terminal scroll.')
                    ;
                    return h;
                },
                auth : false,
                history : false,
                callback : function(args, command, $widget, $deferred) {
                    this.terminal.animate({scrollTop: this.terminal.prop('scrollHeight') - this.terminal.height()}, 0);
                    $deferred.resolve();
                    return true;
                }
            },
            {
                name        : 'comment',
                auth        : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('#$comment'))
                            .append(' to create a comment for later reference.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^#\s*((?:.|\n)+)/),
                callback    : function(args, command, $widget, $deferred) {
                    $widget.setIsComment(true);
                    $widget.setInput(args[0]);

                    $widget.setOutput('');
                    $widget.setError('');
                    $widget.subWidgets([]);

                    $deferred.resolve();

                    return true;
                }
            },
            {
                name : 'widget',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('widget $widgetname'))
                            .append(' to add a widget with name <b>$widgetname</b>.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^widget\s+(.*)/),
                callback : function(args, command, $widget, $deferred) {
                    var args = args[0].split(/\s+/)
                    var obj = this;

                    if (! args[0].length) {
                        $widget.setError("incorrect add widget syntax");
                        $deferred.reject();
                        return true;
                    }

                    var $widget = this.addWidget(args[0], args.length > 1);

                    if (args.length > 1) {
                        $widget.setInput(args[1]);
                    }

                    $deferred.resolve();
                    return true;
                }
            }

        ],

        create_input_link : function(text, value) {

            if (value == undefined) {
                value = text;
            }

            var $a = $.jqElem('a')
                .attr('title', text)
                .append(text)
                .on('click',
                    $.proxy(function(e) {
                        this.appendAndFocusInput(value);
                    }, this)
                );

            return $a;
        },

        appendAndFocusInput : function (value) {
            var append = value + ' ';
            if (this.input_box.val().length && ! this.input_box.val().match(/[\|;]\s*$/)) {
                append = '| ' + append;
            }
            this.appendInput(append);
            this.input_box.setCursorPosition(0);
            if (! this.selectNextInputVariable()) {
                this.input_box.focusEnd();
            }
        },

        create_run_link : function(text, value) {

            if (value == undefined) {
                value = text;
            }

            var $a = $.jqElem('a')
                .attr('title', text)
                .append(text)
                .on('click',
                    $.proxy(function(e) {
                        this.run(value);
                    }, this)
                );

            return $a;
        },

        create_ext_link : function(text, href) {

            if (href == undefined) {
                href = text;
            }

            var $a = $.jqElem('a')
                .attr('title', text)
                .attr('target', '_blank')
                .attr('href', href)
                .append(text)
            ;

            return $a;
        },

        warn_not_logged_in : function($widget) {
            $widget.setError(
                $.jqElem('span')
                    .append("You are not logged in.<br>Please click the ")
                    .append(this.create_run_link('Sign In', '((authenticate))'))
                    .append(" link in the upper right to get started.")
            );
            if (! $widget.isHidden()) { this.scroll() };
        },

        format_error : function(err) {
            var msg = undefined;

            if (typeof(err.error) == 'string' ) {
                msg = err.error + ' : ' + err.status;
            }
            else {
                msg = err.error.message;
            }

            msg.replace("\n", "<br>\n");
            return msg;
        },

        setenv : function (variable, value) {

        },

        notifyOfIrisCommands : function(requester) {

            var commands = [];

            $.each(
                this.run_dispatch,
                function (idx, val) {
                    commands.push({cmd : val.name, label : val.name})
                }
            );

            commands = commands.sort(this.sortByKey('label'));

            //XXX mild race condition. Events theoretically might show up in a different
            //order. Should refactor to fire off notes with an array
            //also of note, commands added later WILL propogate in via a note,
            //but the list will not re-sort
            $.each(
                commands,
                $.proxy(function (idx, cmd) {

                    if (requester == undefined) {
                        this.trigger(
                            'addedIrisCommand',
                            cmd
                        );
                    }
                    else {
                        requester.addIrisCommand(cmd);
                    }
                }, this)
            );

        },

        init: function(options) {

            this._super(options);

            //pull in any additional config dispatch
            $.each(
                window.kbaseIrisConfig.terminal.run_dispatch,
                $.proxy(function (idx, cmd) {
                    this.add_to_dispatch(cmd, 'silently');
                }, this)
            );

            // 99x/100 this will not do anything useful. It'll post addedIrisCommands notes, but nothing
            // is probably alive yet to receive them. When a commands element wakes up and is loaded, it'll
            // fire off an event asking for the list of commands, then update its display to reflect.
            this.notifyOfIrisCommands();

            this.whatsnew( new KBase.irisWhatsNew() );

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

            //set up available environment as environment keys.
            this.envKeys = {};
            $.each(
                this.options.environment,
                $.proxy( function (idx, key) {
                    this.envKeys[key] = 1;
                }, this)
            );


            //end embedded plugin

            if (this.client() == undefined) {
                this.client(
                    new InvocationService(
                        this.options.invocationURL,
                        this.auth()
                    )
                );
            }

            this.tutorial = new KBase.irisTutorial();

            this.commandHistory = [];
            this.commandHistoryPosition = 0;

            this.path = '.';
            this.cwd = "/";
            this.variables = {};
            this.aliases = {};
            this.live_widgets = [];

            this.appendUI( this.$elem );

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
                            invocationURL       : this.options.invocationURL,
                        }
                    )
                )
            };

            $(document).on(
                'requestIrisCommands.kbaseIris',
                $.proxy(function (e, params) {
                    this.notifyOfIrisCommands(params.requester);
                }, this)
            );

            $(document).on(
                'loggedInQuery.kbase',
                $.proxy(function (e, callback) {

                var auth = this.auth();
                    if (callback && auth != undefined && auth.unauthenticated == true) {
                        callback(auth);
                    }
                }, this)
            );

            this.selectedWidgets = [];
            this.$elem.on(
                'toggleWidgetSelection.kbaseIris',
                $.proxy(function (e, $widget) {
                    e.stopPropagation();e.preventDefault();
                    if ($widget.isSelected()) {
                        this.deselectWidget($widget);
                    }
                    else {
                        this.selectWidget($widget);
                    }
                }, this)
            );

            this.$elem.on(
                'removeWidget.kbaseIris',
                $.proxy(function (e, params) {
                    this.removeWidget(params.$widget);
                }, this)
            );

            this.$elem.on(
                'scrollTo.kbaseIris',
                $.proxy(function (e, pos) {
                    this.terminal.animate(
                        {
                            scrollTop: this.terminal.prop('offsetTop') - 85
                        },
                        0
                    );
                }, this)
            );

            this.$elem.on(
                'runWidget.kbaseIris',
                $.proxy(function (e, params) {
                    if (params.$widget.isComment()) {
                        params.command = '#' + params.command;
                    }
                    this.run(
                        params.command,
                        {
                            $widget : params.$widget
                        }
                    );
                }, this)
            );



            if (this.options.commandsElement == undefined) {
                this.options.commandsElement = $.jqElem('div');
                this.options.commandsElement.kbaseIrisCommands(
                    {
                        client      : this.client(),
                        terminal    : this,
                    }
                )
            }

            if (this.options.grammar == undefined) {
                this.options.grammar = $.jqElem('div').kbaseIrisGrammar();
            }

            var lastScrollTop = 0;
            this.terminal.on(
                'scroll',
                function (e) {

                    var st = $(this).scrollTop();
                    if (st < lastScrollTop){
                        $(this).stop(true);
                    }

                    lastScrollTop = st;
                }

            );

            //XXX always show current notes.
            //localStorage.removeItem('kbase_iris_version');
            var kbase_iris_version = localStorage.getItem('kbase_iris_version');
            if (kbase_iris_version != this.whatsnew().currentVersion()) {
                //kick to next iteration in the runloop so we scroll properly.
                setTimeout($.proxy(function() {this.run('whatsnew --recent') }, this), 0);
                localStorage.setItem('kbase_iris_version', this.whatsnew().currentVersion());
            }


            return this;

        },

        loggedInCallback : function(e, args) {

            this.client().setAuth( this.auth() );

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
                        //make sure that we always have the IrisFile type available.
                        //this.run('((kbws-addtype ' + this.options.defaultFileType + '))');
                        this.out_line();
                        this.scroll();
                        this.data('input_box').focus();

                    }, this ),
                    $.proxy( function (err) {
                        this.out_text(
                            "<i>Error on session_start:<br>" + err.error.message.replace("\n", "<br>\n") + "</i>",
                            'html'
                        );
                    }, this )
                );

                //for some reason...this doesn't seem to work. It's weird.
                this.data('input_box').focus();
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
            this.commandHistory = [];
            this.commandHistoryPosition = 0;
            this.terminal.empty();
            this.variables = {};
            this.trigger('clearIrisProcesses');
            this.input_box.focus();
        },

        logInCanceledCallback : function(e) {
            //basically the same as logging out, really.
            this.loggedOutCallback();
        },

        addFileBrowser : function ($fb) {
            this.fileBrowsers.push($fb);
        },

        download_file : function(file) {
            this.fileBrowsers[0].downloadFile(file);
        },

        view_file : function(file) {
            this.fileBrowsers[0].viewFile(file);
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
                        .attr('spellcheck', 'false')
                    )
                ;
            ;

            this._rewireIds($block, this);
            var $term = this.data('terminal');

            $elem.append($block);

            this.terminal = this.data('terminal');
            this.input_box = this.data('input_box');

            this.out_text(
                $.jqElem('span')
                    .append(
                        "Welcome to the interactive KBase terminal!<br>\n"
                        +"Please click the ")
                    .append(this.create_run_link('Sign In', '((authenticate))'))
                    .append(" button in the upper right to get started.<br>\n"
                        + "Type ")
                    .append( this.create_run_link('commands') )
                    .append(" for a list of commands.<br>\n"
                        +"For usage information about a specific command, type the command name with -h or --help after it.<br>\n"
                        +"Please visit ")
                    .append( this.create_ext_link(window.kbaseIrisConfig.tutorial.default_tutorial) )
                    .append(" or type ")
                    .append(this.create_run_link('tutorial'))
                    .append(" for an IRIS tutorial.<br>\n"
                        +"To find out what's new, type "
                    )
                    .append(this.create_run_link('whatsnew'))
                    .append(' (' + this.whatsnew().currentReleaseString() + ')' )
                    .append('<br><br>')
                    .append($.jqElem('span').css('color', 'red')
                        .append('IRIS is a legacy system and is no longer officially supported. Some of the commands in the IRIS tutorials may not work correctly. We recommend that you use the next-generation KBase user interface, the <a href = "https://narrative.kbase.us/">Narrative interface</a>.')
                    ),
                    'html'
            );

            this.out_line();

            this.input_box.on(
                'keypress',
                $.proxy(function(event) { this.keypress(event); }, this)
            );
            this.input_box.on(
                'keydown',
                $.proxy(function(event) { this.keydown(event) }, this)
            );
            this.input_box.on(
                "onchange",
                $.proxy(function(event) { this.dbg("change"); }, this)
            );

            //apparently I can't set the focus immediately and have to wait a tick in the runloop for some reason.
            setTimeout($.proxy(function() {
                this.input_box.focus();
            }, this), 0);

            $(window).bind(
                "resize",
                $.proxy(
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

        addCommandHistory : function(history) {
            if (this.commandHistory == undefined) {
                this.commandHistory = [];
            }

            this.commandHistory.push(history);
            this.saveCommandHistory();
            this.commandHistoryPosition = this.commandHistory.length;

            if (this.recording) {
                if (this.record == undefined) {
                    this.record = [];
                }
                this.record.push(history);
            }
        },

        loadCommandHistory : function() {
            this.client().get_file(
                this.sessionId(),
                "history", "/",
                $.proxy(
                    function (txt) {
                        this.commandHistory = JSON.parse(txt);
                        if (this.commandHistory == undefined) {
                            this.commandHistory = [];
                        }
                        this.commandHistoryPosition = this.commandHistory.length;
                    },
                    this
                ),
                $.proxy(function (e) {
                    this.dbg("error on history load : ");this.dbg(e);
		    }, this)
            );
        },

        resize_contents: function($container) {

            //magic number is 135 for header and footer!
            //magic number is 56 less for height of terminal box itself.

            this.data('terminal').css('height', $(window).height() - 135 - 56);

        },

        keypress: function(event) {

            if (event.which == 13) {

                this.unsubmittedCommand = undefined;

                if (event.metaKey || event.altKey || event.ctrlKey) {
                    return;
                }

                event.preventDefault();
                var cmd = this.input_box.val();

                if (cmd == 'gui') {
                    this.gui = true;
                    this.input_box.val('');
                    return;
                }
                if (cmd == 'nogui') {
                    this.gui = false;
                    this.input_box.val('');
                    return;
                }

                this.run(cmd);
                this.scroll();
                this.input_box.val('');
            }
        },

        keydown: function(event) {

            if (event.metaKey || event.altKey || event.ctrlKey) {
                return;
            }


            if (event.which == 38) {
                event.preventDefault();

                if (this.unsubmittedCommand == undefined) {
                    this.unsubmittedCommand = this.input_box.val();
                }

                if (this.commandHistoryPosition > 0) {
                    this.commandHistoryPosition--;
                }
                this.input_box.val(this.commandHistory[this.commandHistoryPosition]);
            }
            else if (event.which == 40) {
                event.preventDefault();

                if (this.unsubmittedCommand == undefined) {
                    this.unsubmittedCommand = this.input_box.val();
                }

                if (this.commandHistoryPosition < this.commandHistory.length) {
                    this.commandHistoryPosition++;
                }

                if (this.commandHistoryPosition == this.commandHistory.length && this.unsubmittedCommand != undefined) {
                    this.input_box.val(this.unsubmittedCommand);
                }
                else {
                    this.input_box.val(this.commandHistory[this.commandHistoryPosition]);
                }
            }
            else if (event.which == 39) {
                if (this.options.commandsElement) {

                    var input_box_length = this.input_box.val().length;
                    var cursorPosition = this.input_box.getCursorPosition();

                    if (cursorPosition != undefined && cursorPosition < input_box_length) {
                    var ret;
                        if (ret = this.selectNextInputVariable(event)) {
                            return;
                        }
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

            var posRegex = new RegExp('.{' + pos + ',}?(\\$\\S+)');

            if (match = this.input_box.val().match(posRegex)) {

                if (e != undefined) {
                    e.preventDefault();
                }

                var start = this.input_box.val().indexOf(match[1]);
                var end = this.input_box.val().indexOf(match[1]) + match[1].length;
                //this.input_box.focusEnd();
                if (pos < start || pos == 0) {
                    this.input_box.setSelection(
                        start,
                        end
                    );
                    this.input_box.setSelection(start, end);
                    return true;
                }
                else if (pos == start) {
                    this.input_box.setCursorPosition(pos + 1);
                }
            }
            else {
                this.input_box.setCursorPosition(pos + 1);
            }


            return false;
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
                $.proxy(
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
            this.appendWidget($widget);
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
            this.appendWidget( $text );

            $text.setText(text, type);

        },

        // Outputs an hr
        out_line: function($container) {

            if ($container == undefined) {
                $container = this.terminal;
            }

            var $hr = $('<hr>');
            $container.append($hr);
            this.scroll(0);
        },

        scroll: function(speed) {

            this.terminal.stop(true);

            if (speed == undefined) {
                speed = parseInt(this.options.scrollSpeed);
            }

            this.terminal.animate({scrollTop: this.terminal.prop('scrollHeight') - this.terminal.height()}, speed);
        },

        replaceVariables : function(command) {

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

        jobqueue : function($widget, queue, callback, throttle) {

            var ns = this.uuid();
            var job;
            var genes = [];

            var $lastWidget;

            $widget.startThinking();
            $(document).on(
                'removeIrisProcess.kbaseIris' + ns,
                $.proxy(function (e, pid) {

                    if (pid == job) {

                        if (callback != undefined) {
                            callback($lastWidget);
                        }

                        var nextJob = this.nextJobInQueue(queue);

                        if (nextJob != undefined && (throttle == undefined || throttle > 0)) {

                            var promise = this.invoke($widget, nextJob);
                            job = promise.$widget.pid();
                            $lastWidget = promise.$widget;

                            if (throttle != undefined) {
                                throttle--;
                            }

                        }
                        else {
                            $widget.stopThinking();
                            $(document).off('removeIrisProcess.kbaseIris' + ns);
                        }
                    }
                }, this)
            );

            var nextJob = this.nextJobInQueue(queue);
            if (nextJob) {
                var promise = this.invoke($widget, nextJob);
                job = promise.$widget.pid();
                $lastWidget = promise.$widget;
            }

        },

        nextJobInQueue : function(queue) {
            if ($.isArray(queue)) {
                return queue.length
                    ? queue.shift()
                    : undefined;
            }
            else {
                return queue();
            }
        },

        addWidget : function(widgetName, refuseInput) {

            var $widget = this.options.widgets[widgetName]();


            this.appendWidget( $widget );

            $widget.render();
            if (this.live_widgets.length) {
                var wIdx = this.live_widgets.length - 1;
                while (wIdx >= 0) {
                    var $last = this.live_widgets[wIdx];
                    if ( ! $last.isHidden() ) {
                        $widget.acceptInput($last, refuseInput);
                        break;
                    }
                    else {
                        wIdx--;
                    }
                }
            }

            this.live_widgets.push($widget);
            this.subWidgets().push($widget);

            return $widget;
        },

        appendWidget: function($widget) {

            var isSubWidget = false;

            $.each(
                this.subWidgets(),
                $.proxy(function (idx, $wdgt) {
                    if ($wdgt === $widget) {
                        isSubWidget = true;
                        return;
                    }
                }, this)
            );

            if (! isSubWidget) {
                this.terminal.append($widget.$elem);
                this.subWidgets().push($widget);
                $widget.$terminal = this;
            }
        },

        removeWidget : function($widget) {
            for (var idx = 0; idx < this.subWidgets().length; idx++) {
                if (this.subWidgets()[idx] === $widget) {
                    this.deselectWidget($widget);
                    this.subWidgets().splice(idx,1);
                    $widget.$elem.remove();
                    break;
                }
            }

        },

        selectWidget : function($widget) {
            this.selectedWidgets.push($widget);
            $widget.setIsSelected(true);

            var newSelection = [];

            $.each(
                this.subWidgets(),
                function (idx, $widget) {
                    if ($widget.isSelected()) {
                        newSelection.push($widget);
                    }
                }
            );

            this.selectedWidgets = newSelection;

            return $widget;

        },

        deselectWidget : function ($widget) {
            for (var idx = 0; idx < this.selectedWidgets.length; idx++) {
                if (this.selectedWidgets[idx] === $widget) {
                    this.selectedWidgets.splice(idx,1);
                    $widget.setIsSelected(false);
                    break;
                }
            };
        },

        evaluateScript : function($terminal, $widget, script, $deferred) {
            var res;
            try {

                if (script.match(/^(['"]).*\1$/)) {
                    script = eval(script);
                }

                if ($widget.output() == undefined) {
                    $widget.setOutput($.jqElem('div'));
                }

                script = script.replace(/\$terminal.invoke\(/g, '$terminal.invoke($widget,');

                res = eval(script);
                if ($widget.output() == undefined) {
                    $widget.setOutput(res);
                };
                $deferred.resolve();

                return true;
            }
            catch (e) {
                $widget.setError(e);
                $deferred.reject();

                return false;
            }

        },

        invoke : function($containerWidget, rawCmd) {
            return this.run(
                rawCmd,
                {
                    subCommand : false,
                    $containerWidget : $containerWidget,
                    viaInvoke : true
                }
            );
        },

        // Executes a command
        //run: function(rawCmd, /*$widget*/, /*subCommand*/, $containerWidget, /*viaInvoke*/) {

        add_to_dispatch : function(command, silently) {
            this.run_dispatch.push(command);

            if (! silently) {
                this.trigger(
                    'addedIrisCommand',
                    {
                        cmd   : command.name,
                        label : command.name
                    }
                );
            }
        },

        run: function (rawCmd, opts) {
            if (opts == undefined) {
                opts = {};
            }

            var historyLabel = rawCmd;
            if ($.isArray(rawCmd)) {
                historyLabel = rawCmd[1];
                rawCmd = rawCmd[0];
            }

            var $widget             = opts.$widget || $.jqElem('div').kbaseIrisTerminalWidget();
            var $containerWidget    = opts.$containerWidget;

            var $deferred = $.Deferred();
            var $promise = $deferred.promise();
            $promise['$widget'] = $widget;


            var tokens = this.options.grammar.tokenize(rawCmd);

            // no tokens? No command. Bail out.
            if (tokens.length == 0) {
                $deferred.resolve();
                return $promise;
            }

            // okay. We've tokenized the command. If the first element is an array, then it's a set of commands
            // which are semicolon/newline delimited. We need to monitor the deferred object and jump to the
            // next token when it comes up.
            if ($.isArray(tokens[0])) {

                if (! opts.subCommand) {
                    if (! opts.viaInvoke && ! opts.historyLess) {
                        this.addCommandHistory(rawCmd);
                    }

                    var $scriptWidget = $.jqElem('div').kbaseIrisTerminalWidget();

                    if ($containerWidget) {
                        $containerWidget.appendWidget($scriptWidget);
                        $scriptWidget.setSubCommand(true, true);
                    }
                    else {
                        this.appendWidget($scriptWidget);
                    }

                    $scriptWidget.setCwd(this.cwd);
                    $scriptWidget.setInput(historyLabel);
                    $scriptWidget.setOutput($.jqElem('div'));
                    opts.subCommand = true;
                    $containerWidget = $scriptWidget;
                }

                rawCmd = this.options.grammar.detokenize(tokens.shift());
                $deferred.done(
                    $.proxy(function(res) {
                        //$widget.remove();
                        this.run(
                            this.options.grammar.detokenize(tokens),
                            {
                                subCommand : true,
                                $containerWidget : $containerWidget,
                                viaInvoke : opts.viaInvoke
                            }
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

            var isHidden = false;
            if ( m = command.match(/^\(\(([^]+)\)\)$/) ) {
                isHidden = true;
                command = m[1];
                command = command.replace(/^\s+/, '');
                command = command.replace(/\s+$/, '');
            }

            var workspaceTokens = [];

            //XXX - magic workspace tokens no longer work. :-(
            /*
            //okay. The very very first thing we want to do is check for a magic workspace token.
            if (wstokens = command.match(/((?:<|>>?)\s*)?@W#([^\-#\s]+)(?:-(?:\d+))?(#[io])?/g)) {
            //if (wstokens = command.match(/@W#([^#]+)#([io])/g)) {

                var cmdCopy = command;
                var validTokens = true;

                $.each(
                    wstokens,
                    $.proxy(function (idx, wstoken_string) {

                        var workspaceToken = {
                            type : this.options.defaultFileType
                        };

                        if (m = wstoken_string.match(/((?:<|>>?)\s*)?@W#([^\-#\s]+)(?:-(\d+))?#?([io])?/)) {
                        //if (m = wstoken_string.match(/@W#([^#]+)#([io])/)) {


                            var id;
                            var io = '';

                            if (m[1] != undefined && m[1].match(/([<>])/)) {
                                var str = m.shift();  //toss out the string;
                                io  = m.shift();  //the io redirection;
                                m.unshift(str);          //toss the string back on
                            }
                            else {
                                var str = m.shift();     //toss out the string;
                                m.shift();               //toss out the io redirection;
                                m.unshift(str);          //toss the string back on
                            }

                            id = m[1];
                            workspaceToken.io = m[3];
                            workspaceToken.instance = m[2];


                            if (io.match(/</)) {
                                workspaceToken.io = 'i';
                            }
                            else if (io.match(/>/)) {
                                workspaceToken.io = 'o';
                            }

                            id = id.split(':');
                            if (id.length == 3) {
                                workspaceToken.workspace    = id[0];
                                workspaceToken.type         = id[1];
                                workspaceToken.id           = id[2];

                                if (id[1] == '') {
                                    workspaceToken.type = this.options.defaultFileType;
                                }
                            }
                            else if (id.length == 2) {
                                workspaceToken.type         = id[0];
                                workspaceToken.id           = id[1];
                            }
                            else if (id.length == 1) {
                                workspaceToken.id           = id[0];
                            }


                            if (workspaceToken.io == undefined) {
                                validTokens = false;
//                                return;
                            }

                            workspaceTokens.push(workspaceToken);

                            cmdCopy = cmdCopy.replace(wstoken_string, io + workspaceToken.id);

                        }
                    }, this)
                );

                if (! validTokens) {

                    $widget.setInput(rawCmd);
                    this.addCommandHistory(rawCmd);
                    $widget.setError("Error - invalid format for workspace token - " + m[0]);

                    if ($containerWidget) {
                        $containerWidget.appendWidget($widget);
                    }
                    else {
                        this.appendWidget($widget);
                    }

                    $deferred.reject();
                    return $promise;
                }

                var newCommands = [];

                $.each(
                    workspaceTokens,
                    function (idx, token) {
                        if (token.io == 'i') {
                            var workspaceId = '';
                            var instance = '';
                            if (token.workspace != undefined) {
                                workspaceId = ' -w ' + token.workspace + ' ';
                            }
                            if (token.instance != undefined) {
                                instance = ' -i ' + token.instance + ' ';
                            }
                            newCommands.push(
                                '((ws-get -e ' + token.type + ' ' + token.id + workspaceId + instance + ' > ' + token.id + '))'
                            )
                        }
                    }
                );

                newCommands.push(cmdCopy);

                $.each(
                    workspaceTokens,
                    function (idx, token) {
                        if (token.io == 'o') {
                            var workspaceId = '';
                            if (token.workspace != undefined) {
                                workspaceId = ' -w ' + token.workspace + ' ';
                            }
                            newCommands.push(
                                '((ws-load -e ' + token.type + ' ' + token.id + ' ' + token.id + ' -s ' + workspaceId + '));(( rm ' + token.id + '))'
                            )
                        }
                        else if (token.io == 'i') {
                            newCommands.push(
                                '(( rm ' + token.id + '))'
                            )
                        }
                    }
                );

                this.addCommandHistory(command);

                $deferred.resolve();
                this.run(
                    [newCommands.join(';'), rawCmd],
                    {
                        $widget : $widget,
                        subCommand : opts.subCommand,
                        $containerWidget : $containerWidget,
                        viaInvoke : opts.viaInvoke,
                        historyLess : true,
                    }
                );

                return $promise;

            }
            else {
                //this.dbg("no magic workspace token");
            }
            */


            $widget.setCwd(this.cwd);
            $widget.setInput(command);
            $widget.setSubCommand(opts.subCommand);
            $widget.setIsHidden(isHidden);

            if ($containerWidget) {
                $containerWidget.appendWidget($widget);
            }
            else {
                this.appendWidget($widget);
            }

            this.dbg("Run (" + command + ')[' + isHidden + ']');

            var redispatching = false;

            do {

                redispatching = false;
                var dispatched = false;
                $.each(
                    this.run_dispatch,
                    $.proxy(function (idx, dispatch) {
                        if (dispatched) {
                            return;
                        }

                        var m = [];
                        var use_callback = false;

                        //first thing first. See if we're looking for help. If so, display it.
                        var help_regex = dispatch.help_regex;
                        if (help_regex == undefined) {
                            help_regex = dispatch.help_regex = new RegExp('^\\s*' + dispatch.name + '\\s+(-h|--help)\\s*$');
                        }

                        if (m = command.match(help_regex)) {

                            var helpValue = dispatch.help || $.jqElem('span').html('help is not available for <i>' + dispatch.name + '</i>');

                            if (typeof helpValue == 'function') {
                                helpValue = helpValue.apply(this);
                            }

                            $widget.setOutput(helpValue);
                            dispatched = true;
                        }

                        else if (dispatch.regex) {
                            if (m = command.match(dispatch.regex) ) {
                                m.shift();  //toss out the full match. we don't use it.
                                use_callback = true;
                            }
                        }
                        else if (dispatch.name == command) {
                            use_callback = true;
                        }

                        if (use_callback) {

                            if (dispatch.auth == true && ! this.sessionId()) {
                                this.warn_not_logged_in($widget);
                                dispatched = true;
                            }
                            else {

                                if (
                                       ! opts.subCommand
                                    && this.commandHistory != undefined
                                    && ! opts.viaInvoke
                                    && ! $widget.isHidden()
                                    && (dispatch.history == undefined || dispatch.history == true)) {
                                    this.addCommandHistory(command);
                                }

                                dispatched = dispatch.callback.call(this, m, command, $widget, $deferred, $promise, opts);
                            }
                        }
                    }, this)
                );

                if (typeof(dispatched) == 'boolean' && dispatched == true) {
                    return $promise;
                }
                else if (typeof(dispatched) == 'string') {
                    //okay. We've been given a new command to dispatch. Hop all the way back up and do it again.
                    command = dispatched;
                    redispatching = true;
                }
                else {
                    // if we couldn't find anything in the dispatch table, then we need to run a pipeline.
                    // first, we parse the command through the grammar and see if we can find anything. If so, use that.
                    // if not, hand it off to run_pipeline.
                    if (! this.sessionId()) {
                        this.warn_not_logged_in($widget);
                        $deferred.resolve();
                        return $promise;
                    }

                    // XXX! Duplicated up above on 1471. re-factor out! BUT NOTE - the conditionals there are slightly different
                    // since that also checks to see if the dispatch is refusing to be added to history
                    if (! opts.subCommand && this.commandHistory != undefined && ! opts.viaInvoke && ! $widget.isHidden()) {
                        this.addCommandHistory(command);
                    }

                    var parsed = this.options.grammar.evaluate(command);

                    if (parsed != undefined) {
                        if (! parsed.fail && parsed.execute) {
                            command = parsed.execute;

                            if (parsed.explain) {
                                $widget.setOutput(parsed.execute);
                                $deferred.resolve();
                                return true;
                            }

                        }
                        else if (parsed.parsed.length && parsed.fail) {
                            $widget.setError(parsed.error);
                            $deferred.reject();
                            return true;
                        }
                    }

                    var pid = this.uuid();
                    $widget.setPid(pid);

                    var $pe = $.jqElem('div').text(command);
                    $pe.kbaseButtonControls(
                        {
                            onMouseover : true,
                            context : this,
                            controls : [
                                {
                                    'icon' : 'fa fa-ban',
                                    //'tooltip' : 'Cancel',
                                    callback : function(e, $term) {
                                        $widget.promise().xhr.abort();
                                        $widget.$elem.remove();
                                    }
                                },
                            ]

                        }
                    );

                    if (! $widget.isHidden()) {
                        this.trigger(
                            'updateIrisProcess',
                            {
                                pid : pid,
                                content : $pe
                            }
                        );
                    }

                    var promise = this.client().run_pipeline(
                        this.sessionId(),
                        command,
                        [],
                        this.options.maxOutput,
                        this.cwd,
                        $.proxy(
                            function (runout) {

                                if (runout) {

                                    var output = runout[0];
                                    var error  = runout[1];

                                    this.refreshFileBrowser();

                                    if (output.length > 0 && output[0].indexOf("\t") >= 0) {

                                        var data = {
                                            structure : {
                                                header      : [],
                                                rows        : [],
                                            },
                                            sortable    : false,
                                            hover       : false,
                                            resizable   : true,
                                        };

                                        $.each(
                                            output,
                                            function (idx, rowStr) {
                                                var row = [];
                                                data.structure.rows.push(row);
                                                $.each(
                                                    rowStr.split(/\t/),
                                                    function (idx, val) {
                                                        row.push(val);
                                                    }
                                                )
                                            }
                                        );

                                        var $tbl = $.jqElem('div').kbaseTable(data);
                                        $widget.setOutput($tbl.$elem);

                                        $widget.setValue(output);
                                    }
                                    else {
                                        $widget.setOutput(output.join(''));
                                        $widget.setValue(output);
                                    }

                                    if (error.length) {

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
                                if (! $widget.isHidden()) { this.scroll() };

                                this.trigger( 'removeIrisProcess', pid );
                            },
                            this
                        ),
                        $.proxy( function(res) { this.trigger( 'removeIrisProcess', pid ); }, this)
                    );

                    $widget.promise(promise);
                    this.live_widgets.push($widget);

                    return true;


                }
            } while (redispatching);


        }


    });

});
