/*


*/

kb_define('kbaseIrisWhatsNew',
    [
        'jquery',
        'kbwidget',
    ],
    function ($) {


    $.KBWidget({

		  name: "kbaseIrisWhatsNew",

        version: "1.0.0",
        _accessors : ['history'],
        options: {
            history : [
                {
                    version : "0.0.8",
                    date : "08/06/2014",
                    notes : [
                        "The <b>view</b> command now scales an image to fit within the terminal window. Click on the image to download it full size.",
                        "Clicking the right arrow button on the file browser now no longer prepends a leading slash to the file name.",
                        "Clicking the right arrow button on the file browser now properly respects subdirectories",
                        "File Editor can now properly edit files in subdirectories.",
                        "Files can now be created via the <b>edit</b> <i>newfilename</i> command.",
                          "Added visualization widgets. Type <b>widget</b> <i>widgetname</i> <i>jsondata</i> to display. Available visualization widgets are:"
                            + " <b>barchart</b>, <b>forcednetwork</b>, <b>heatmap</b>, <b>linechart</b>, <b>piechart</b>, <b>scatterplot</b>, <b>tree</b>.",
                        "Added <b>!!</b> command to repeat last command typed.",
                        "links from tutorials will now automatically appear in a new window.",
                        "Tutorial next/back/list commands are now clickable.",
                        "Disabled spell checking in commands input.",
                        "Internal IRIS commands are explicitly listed in the commands list.",
                        "Magic workspace tokens are no longer supported.",
                        "Terminal will now resize with the window",
                        "Clicking on file names in the file browser will now open them in a new tab",
                        "Clicking on file names after an ls will now open in a new tab; added explicit download button",
                        "Fixed a bug that could cause a blank directory listing upon initial log in",
                        "Now remembers the last typed unrun command when browsing up and down through command history",
                    ]
                },
                {
                    version : "0.0.7",
                    date : "02/06/2014",
                    notes : ["Resolved an issue preventing tutorial loads"]
                },
                {
                    version : "0.0.6",
                    date : "12/13/2013",
                    notes : [
                        "Minor bug fixes.",
                        "Resolved the issue regarding downloads occasionally not working.",
                        "Resolved the layout issue that would occasionally make the chevrons on the command list slide off the screen.",
                        "Fixed redirecting STDERR, as well as appending to files."
                    ]
                },
                {
                    version : "0.0.5",
                    date : "11/18/2013",
                    notes : [
                        "Scriptability - save your commands to a file (one command per line), then run it later with <b>execute</b> <i>nameofscript</i>",
                        "Scriptability - Write a javascript program and run it later with <b>evaluate</b> <i>text of program</i> or"
                          + " <b>evaluate</b> <i>name of program file</i>. The terminal object is accessible via $terminal, the current widget"
                          + " via $widget. Run further iris commands via $terminal.invoke('....');",
                        "Multiple commands can be run at once - delimited commands with semicolons. <b>echo a </b><u>;</u><b> echo b</b>",
                        "<b>ls</b> command can now accept standard shell wildcard syntax <b>ls</b> <i>*.txt</i>, or <b>ls</b> <i>sequences.*</i>, etc.",
                        "Added <b>variables</b> command to list user defined session variables",
                        "Added <b>download</b> <i>filename</i> command to download a file from the command line",
                        "Added <b>edit</b> <i>filename</i> command to launch the file editor from the command line",
                        "Added <b>environment</b> and <b>setenv</b> <i>key=value</i> syntax to customize IRIS behavior",
                        "Added <b>end</b> command to jump to end of terminal input",
                        "Added <b>record</b> command. Save all your actions from that point on as an executable script. Save it with <b>save</b> <i>nameofscript</i>."
                          + " It can then be executed with <b>execute</b> <i>nameofscript</i>",
                        "Added new file button (<i class = 'icon-file'></i>) to file browser to add and optionally immediately edit a file",
                        "<strike>Added automatic communication with the workspace. Pass around 'files' with <b>@W#<i>workpaceid:type:objectid-instance</i></b>"
                          + " such as: <b>all_entities_Genome &gt; @W#genome_obj_in_workspace</b>, will create an object with id 'genome_obj_in_workspace"
                          + " in your current workspace. The workspace id, type, and instance number are optional (and must be : delimited, the instance is appended"
                          + " with a hyphen). If this is an ID through standard script redirects (&lt; or &gt;), you don't need to specify IO. If it's a switch"
                          + " (<b>some_script -i <i>name_of_file</i></b>) then append the io flag - @W#objid#i to read from the workspace or @W#objid#o to write to it.</strike>",
                        "Much nicer selection of variables with the right arrow key",
                        "Alphabetically sorted the groups of commands",
                        "Scrolling up while the UI is automatically scrolling down will now halt the scroll",
                        "Greatly improved performance of view command",
                        "Moved the interface to bootstrap v3.0"
                    ]
                },
                {
                    version : "0.0.4",
                    date : "09/23/2013",
                    notes : [
                        "Minor bug fixes",
                        "Files can now be downloaded",
                        "Variables can now be re-assigned",
                        "Variables are cleared from session upon logout",
                        "Error messages no longer auto clean up"
                    ]
                },
                {
                    version : "0.0.3",
                    date : "08/23/2013",
                    notes : [
                        "User defined variables - <br><b>$genome = kb|g.1994</b><br><b>all_entities_Genome | grep $genome</b>",
                        "Help for commands - click on the <b>?</b> next to the command name in the list to the left for usage info.",
                        "IRIS now supports uploading huge files (up to at least multiple gigabytes), and uploads are resumable if there's a failure.<br>"
                          + " Likewise, IRIS now supports real file downloads to get your processed information back out of the system.<br>"
                          + " If you have a stalled upload job, just mouseover it in the process list to resume it or cancel the upload.<br><br>"
                          + " Finally, you can also upload via the command line - <b>upload</b> <i>filename</i>",
                        "Enhanced file browser. Mouseover the items to interact with them."
                            + "<ul>"
                            +    "<li><i class = 'icon-plus'></i> Add a directory.</li>"
                            +    "<li><i class = 'icon-arrow-up'></i> Upload a file.</li>"
                            +    "<li><i class = 'icon-minus'></i> Delete a file or directory.</li>"
                            +    "<li><i class = 'icon-download-alt'></i> Download this file.</li>"
                            +    "<li><i class = 'icon-pencil'></i> Edit this file.</li>"
                            +    "<li><i class = 'icon-arrow-right'></i> Add this file to your terminal input.</li>"
                            + "</ul>",
                        "IRIS has a simple file editor - in the file browser, mouse over a file name and click the pencil to tweak (small) files.",
                        "Images are viewable. Type <b>view</b> <i>filename</i>",
                        "Lots of behind the scenes infrastructure improvements.",
                        "IRIS supports natural language questions. Type <b>questions</b> to bring up a list of natural language prompts.<br>"
                          + " You can also type them on the command line and hit arrow-right to attempt an auto completion. Further, you can arrow-right"
                          + " to select the next variable in the sequence.",
                        "Improved command search functionality. Just start typing into the search box under the list of commands to filter down to what you want to see.",
                        "Add comments to your output by typing <b>#</b><i>your comment here</i>",
                        "Terminate processes by mousing over the process list and clicking the cancel button.",
                    ]
                }

            ]
        },

        init: function(options) {

            this._super(options);

            this.appendUI( this.$elem );

            return this;

        },

        appendUI : function($elem) {

            if (this.options.headless) {
                return;
            }

            $elem.append( this.ulForAllReleases() );

            return $elem;

        },

        ulForAllReleases : function() {
            var $ul = $.jqElem('ul');

            $.each(
                this.history(),
                $.proxy(function (idx, release) {
                    $ul.append(this.ulForRelease(release).children());
                }, this)
            );

            return $ul;
        },

        currentRelease : function() {
            return this.history()[0];
        },

        currentVersion : function() {
            return this.currentRelease().version;
        },

        currentReleaseString : function () {
            return this.releaseString( this.currentRelease() );
        },

        releaseString : function(release) {
            return release.version + ' - ' + release.date;
        },

        ulForCurrentRelease : function() {
            return this.ulForRelease( this.currentRelease() );
        },

        ulForRelease : function(release) {
            var $ul = $.jqElem('ul');

            $ul.append(
                $.jqElem('li')
                    .append( this.releaseString( release ) )
                )
                .append( this.ulForNotes( release.notes ) );
            ;

            return $ul;
        },

        ulForCurrentNotes : function() {
            return this.ulForNotes( this.currentNotes() );
        },


        ulForNotes : function(notes) {
            var $ul = $.jqElem('ul');

            $.each(
                notes,
                function (idx, note) {
                    $ul.append($.jqElem('li').html(note));
                }
            );

            return $ul;
        },

    });

});
