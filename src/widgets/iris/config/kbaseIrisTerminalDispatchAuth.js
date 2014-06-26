/*


*/

kb_define('kbaseIrisTerminalDispatchAuth',
    [
        'kbaseIrisConfig'
    ],
    function() {

        window.kbaseIrisConfig.terminal.run_dispatch.push(
            {
                name        : 'login',
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('login $username'))
                            .append(' to create an unauthenticated session with user <b>$username</b>.')
                    ;
                    return h;
                },
                auth        : false,
                regex       : new RegExp(/^log[io]n\s+(.+)$/),
                callback    : function (args, command, $widget, $deferred) {

                    args = args[0].split(/\s+/);
                    if (args.length != 1) {
                        $widget.setError(
                            $.jqElem('span')
                                .append("Invalid login syntax, should be : ")
                                .append(this.create_input_link("login $username"))
                        );
                        $deferred.reject();
                        return;
                    }

                    this.client().start_session(
                        args[0],
                        $.proxy(
                            function (newsid) {
                                var auth = {'kbase_sessionid' : newsid, success : true, unauthenticated : true};

                                if (this.sessionId()) {
                                    this.terminal.empty();
                                    this.trigger('logout', false);
                                    this.trigger('loggedOut');
                                }
                                this.trigger('loggedIn', auth );

                                // XXX not quite accurate...because the resolve needs to fire AFTER the loggedIn.
                                $deferred.resolve();

                            },
                            this
                        ),
                        $.proxy(
                            function (err) {
                                $widget.setError(
                                    $.jqElem('span').append("Error on session_start:<br>" + this.format_error(err))
                                );
                                $deferred.reject();
                            },
                            this
                        )
                    );

                    return true;

                }
            },
            {
                name        : 'authenticate',
                auth        : false,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('authenticate $username'))
                            .append(' to create an authenticated session with user <b>$username</b>.')
                            .append('<br>Type ')
                            .append(this.create_input_link('authenticate'))
                            .append(' to create an authenticated session and specify the user in the dialog box.')
                    ;
                    return h;
                },

                regex       : new RegExp(/^authenticate\s*(.*)$/),
                callback    : function (args, command, $widget, $deferred) {

                    if (args.length == 0) {
                        args = [''];
                    }

                    args = args[0].split(/\s+/);
                    if (args.length > 1) {
                        $widget.setError(
                            $.jqElem('span')
                                .append("Invalid authenticate syntax, should be : ")
                                .append(this.create_input_link("authenticate $username"))
                        );
                        $deferred.reject();
                        return;
                    }

                    if (this.sessionId()) {this.trigger('loggedOut');}
                    this.trigger('promptForLogin', {user_id : args[0]});

                    //XXX no promise resolution here, so we will not return the promise.
                    //this is the ONLY exception

                    return true;
                }
            },
            {
                name        : 'unauthenticate',
                auth        : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('unauthenticate'))
                            .append(' to log out of your current session.')
                    ;
                    return h;
                },
                history : false,
                callback    : function (args, command, $widget, $deferred) {
                    this.trigger('logout');
                    $deferred.resolve();
                    return true;
                }
            },
            {
                name        : 'logout',
                auth        : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('logout'))
                            .append(' to log out of your current session.')
                    ;
                    return h;
                },
                history : false,
                callback    : function (args, command, $widget, $deferred) {
                    this.trigger('logout', false);
                    this.trigger('loggedOut', false);
                    $deferred.resolve();
                    return true;
                }
            }
        );

    }
);
