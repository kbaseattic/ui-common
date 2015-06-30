/*


*/

define('kbaseIrisTerminalDispatchFile',
    [
        'kbaseIrisConfig'
    ],
    function() {

        window.kbaseIrisConfig.terminal.run_dispatch.push(
            {
                name        : 'cd',
                auth        : true,
                regex       : new RegExp(/^cd\s*(.*)/),
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('cd $directoryName'))
                            .append(' to change into directory <b>$directoryName</b>.')
                            .append('<br>Type ')
                            .append(this.create_input_link('cd'))
                            .append(' to return to your home directory.')
                    ;
                    return h;
                },
                callback    : function(args, command, $widget, $deferred) {
                    args = args[0].split(/\s+/);
                    if (args.length != 1) {
                        $widget.setError("Invalid cd syntax.");
                        $deferred.reject();
                        return true;
                    }
                    else if (args[0] == '') {
                        dir = '/';
                    }
                    else if (args[0] == '~') {
                        dir = '/';
                    }
                    else {
                        dir = args[0];
                    }

                    this.client().change_directory(
                        this.sessionId(),
                        this.cwd,
                        dir,
                        $.proxy(
                            function (path) {
                                this.cwd = path;
                                $widget.setError($.jqElem('span').html("changed directory into <b>" + path + '</b>'));
                                $deferred.resolve();
                            },
                            this
                        ),
                        $.proxy(
                            function (err) {
                                var m = err.error.message.replace("/\n", "<br>\n");
                                $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                                $deferred.reject();
                            },
                            this
                        )
                    );
                    return true;
                }
            },
            {
                name        : 'cp',
                auth        : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('cp $file1 $file2'))
                            .append(' to copy the contents of <b>$file1</b> to <b>$file2</b>')
                    ;
                    return h;
                },
                regex       : new RegExp(/^cp\s*(.*)/),
                callback    : function(args, command, $widget, $deferred) {

                    args = args[0].split(/\s+/)
                    if (args.length != 2) {
                        $widget.setError("Invalid cp syntax.");
                        $deferred.reject();
                        return true;
                    }
                    var from = args[0];
                    var to   = args[1];
                    this.client().copy(
                        this.sessionId(),
                        this.cwd,
                        from,
                        to,
                        $.proxy(
                            function () {
                                this.refreshFileBrowser();
                                $widget.setError($.jqElem('span').html("Copied <b>" + from + "</b> to <b>" + to + '</b>'));
                                $deferred.resolve();
                            },this
                        ),
                        $.proxy(
                            function (err) {
                                var m = err.error.message.replace("\n", "<br>\n");
                                $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                                $deferred.reject();
                            },
                            this
                        )
                    );
                    return true;
                }
            },
            {
                name        : 'mv',
                auth        : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('mv $file1 $file2'))
                            .append(' to move the contents of <b>$file1</b> to <b>$file2</b>, and delete <b>$file1</b>')
                    ;
                    return h;
                },
                regex       : new RegExp(/^mv\s*(.*)/),
                callback    : function(args, command, $widget, $deferred) {
                    args = args[0].split(/\s+/)
                    if (args.length != 2) {
                        $widget.setError("Invalid mv syntax.");
                        $deferred.reject();
                        return true;
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
                                $widget.setError($.jqElem('span').html("Moved <b>" + from + "</b> to <b>" + to + '</b>'));
                                $deferred.resolve();
                            },this
                        ),
                        $.proxy(
                            function (err) {
                                var m = err.error.message.replace("\n", "<br>\n");
                                $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                                $deferred.reject();
                            },
                            this
                        ));
                    return true;
                }
            },
            {
                name        : 'mkdir',
                auth        : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('mkdir $directoryName'))
                            .append(' to create a new directory with name <b>directoryname</b>')
                    ;
                    return h;
                },
                regex       : new RegExp(/^mkdir\s*(.*)/),
                callback    : function(args, command, $widget, $deferred) {
                    args = args[0].split(/\s+/)
                    if (args[0].length < 1){
                        $widget.setError("Invalid mkdir syntax.");
                        $deferred.reject();
                        return true;
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
                                        $widget.setError($.jqElem('span').html("Made directory <b>" + dir + '</b>'));
                                        $deferred.resolve();
                                    },this
                                ),
                                $.proxy(
                                    function (err) {
                                        var m = err.error.message.replace("\n", "<br>\n");
                                        $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                                        $deferred.reject();
                                    },
                                    this
                                )
                            );
                        }, this)
                    )
                    return true;
                }
            },
            {
                name        : 'rmdir',
                auth        : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('rmdir $directoryName'))
                            .append(' to remove the directory with name <b>directoryname</b>')
                    ;
                    return h;
                },
                regex       : new RegExp(/^rmdir\s*(.*)/),
                callback    : function(args, command, $widget, $deferred) {
                    args = args[0].split(/\s+/)
                    if (args[0].length < 1) {
                        $widget.setError("Invalid rmdir syntax.");
                        $deferred.reject();
                        return true;
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
                                        $widget.setError($.jqElem('span').html("Removed directory <b>" + dir + '</b>'));
                                        $deferred.resolve();
                                    },this
                                ),
                                $.proxy(
                                    function (err) {
                                        var m = err.error.message.replace("\n", "<br>\n");
                                        $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                                        $deferred.reject();
                                    },
                                    this
                                )
                            );
                        }, this)
                    );
                    return true;
                }
            },
            {
                name        : 'rm',
                auth        : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('rm $fileName'))
                            .append(' to remove the file with name <b>$fileName</b>')
                    ;
                    return h;
                },
                regex       : new RegExp(/^rm\s+(.*)/),
                callback    : function(args, command, $widget, $deferred) {
                    args = args[0].split(/\s+/);
                    if (args[0].length < 1) {
                        $widget.setError("Invalid rm syntax.");
                        $deferred.reject();
                        return true;
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
                                        $widget.setError($.jqElem('span').html("Removed file <b>" + file + '</b>'));
                                        if (args.length > 1 && idx == args.length - 1) {
                                            $widget.setError($.jqElem('span').html("Removed all files."));
                                        }
                                        $deferred.resolve();
                                    },this
                                ),
                                $.proxy(
                                    function (err) {
                                        var m = err.error.message.replace("\n", "<br>\n");
                                        $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m));
                                        $deferred.reject();
                                    },
                                    this
                                )
                            );
                        }, this)
                    );
                    return true;
                }
            },
            {
                name : 'upload',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('upload'))
                            .append(' to upload a file. You will be prompted to select a file, and it will create a file of that name in your current directory.')
                            .append('<br>Type ')
                            .append(this.create_input_link('upload $fileName'))
                            .append(' to upload a file into file <b>filename</b>. You will be prompted to select a file.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^upload\s*(\S+)?$/),
                callback : function(args, command, $widget, $deferred) {
                    var file = args[0];
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
                    return true;
                }
            },
            {
                name : 'download',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('download $fileName'))
                            .append(' to download the file with name <b>filename</b>.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^download\s*(\S+)?$/),
                callback : function(args, command, $widget, $deferred) {
                    var file = args[0];
                    if (this.fileBrowsers.length) {
                        var $fb = this.fileBrowsers[0];
                        $fb.data('active_directory', this.cwd);
                        $fb.downloadFile(file);
                        $deferred.resolve();
                    }
                    return true;
                }
            },
            {
                name : 'edit',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('edit $fileName'))
                            .append(' to open the file with name <b>filename</b> in the file editor.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^edit\s*(\S+)?$/),
                callback : function(args, command, $widget, $deferred) {
                    var file = args[0];
                    if (this.fileBrowsers.length) {
                        var $fb = this.fileBrowsers[0];
                        $fb.data('active_directory', this.cwd);
                        if ($fb.editFileCallback()) {
                            $fb.editFileCallback()(file, $fb);
                        }
                        else {
                            $widget.setError("Cannot edit : no editor");
                        }

                        $deferred.resolve();
                    }
                    return true;
                }
            },
            {
                name : 'view',
                auth : true,
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('view $imageName'))
                            .append(' to view the image with name <b>$imageName</b>.')
                    ;
                    return h;
                },
                regex       : new RegExp(/^view\s+(\S+)$/),
                callback : function(args, command, $widget, $deferred) {
                    var file = args[0];

                    var $img = $.jqElem('img')
                        .attr('src', this.fileBrowsers[0].downloadUrlForFile(file))
                        .css('max-width', '90%');

                    var $link = $.jqElem('a')
                        .append($img)
                        .attr('href', this.fileBrowsers[0].downloadUrlForFile(file))
                        .css('border', '0px');

                    $widget.setOutput(
                        $link
                    );


                    setTimeout($.proxy(function() {this.scroll()}, this), 500);
                    $deferred.resolve();

                    return true;


                }
            },
            {
                name : 'ls',
                help        : function() {
                    var h =
                        $.jqElem('span')
                            .append('Type ')
                            .append(this.create_input_link('ls'))
                            .append(' to list the contents of the current directory.')
                            .append('<br>Type ')
                            .append(this.create_input_link('ls $directoryName'))
                            .append(' to list the contents of the directory <b>$directoryName</b>.')
                            .append('<br>Type ')
                            .append(this.create_input_link('ls $regex'))
                            .append(' to list only files matching the regular expression <b>$regex</b>.')
                    ;
                    return h;
                },
                auth : true,
                regex       : new RegExp(/^ls\s*(.*)/),
                callback : function(args, command, $widget, $deferred) {
                    var d;
                    var obj = this;
                    if (args.length == 0) {
                        d = ".";
                    }
                    else {
                        d = args[0];
                    }

                    //okay, add in regex support
                    var regex = undefined;
                    if (d.match(/[*+?\s.]/)) {
                        d = d.replace(/\s+/g, '|');
                        d = d.replace(/\./g, '\.');
                        d = d.replace(/([*+?])/g, '.$1');
                        regex = new RegExp('^(' + d + ')$');
                        d = '.';
                    }

                    this.client().list_files(
                        this.sessionId(),
                        this.cwd,
                        d,
                        $.proxy(
                            function (filelist) {
                                var dirs = filelist[0];
                                var files = filelist[1];

                                var allFiles = [];

                                $.each(
                                    dirs,
                                    function (idx, val) {

                                        if (regex != undefined && ! val.name.match(regex)) {
                                            return;
                                        }

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

                                        if (regex != undefined && ! val.name.match(regex)) {
                                            return;
                                        }

                                        allFiles.push(
                                            {
                                                size    : val.size,
                                                mod_date: val.mod_date,
                                                name    : val.name,
                                                dlTD  :
                                                    $.jqElem('span')
                                                        .append(
                                                            $.jqElem('button')
                                                                .attr('class', 'fa fa-download')
                                                                //uncomment these two lines to click and open in new window
                                                                //.attr('href', url)
                                                                //.attr('target', '_blank')
                                                                //comment out this block if you don't want the clicks to pop up via the api
                                                                //*
                                                                .attr('href', '#')
                                                                .on(
                                                                    'click',
                                                                    $.proxy(
                                                                        function (e) {
                                                                            e.preventDefault();e.stopPropagation();
                                                                            this.download_file(val['full_path']);
                                                                            return false;
                                                                        },
                                                                        this
                                                                    )
                                                                )
                                                        ),
                                                nameTD :
                                                    $.jqElem('span')
                                                        .append(
                                                            $.jqElem('a')
                                                                .text(val.name)
                                                                //uncomment these two lines to click and open in new window
                                                                .attr('href', this.fileBrowsers[0].viewUrlForFile(val['full_path']))
                                                                .attr('target', '_blank')
                                                                //comment out this block if you don't want the clicks to pop up via the api
                                                                //*
                                                        )
                                                        ,
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
                                                { value : val.nameTD },
                                                { value : val.dlTD }
                                            ]
                                        );
                                    }, this)
                                );

                                var $tbl = $.jqElem('div').kbaseTable(data);

                                if (data.structure.rows.length) {
                                    $widget.setOutput($tbl.$elem);
                                    $widget.setValue(filelist);
                                }
                                else {
                                    $widget.setError("no matching files found");
                                }
                                $deferred.resolve();
                                if (! $widget.isHidden()) { this.scroll() };
                             },
                             this
                         ),
                         function (err)
                         {
                             var m = err.error.message.replace("\n", "<br>\n");
                             $widget.setError($.jqElem('span').append("Error received:<br>" + err.error.code + "<br>" + m))
                             $deferred.reject();
                         }
                        );
                    return true;
                }
            }
        );

    }
);
