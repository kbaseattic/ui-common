(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseJgiDataImportView",
        parent: "kbaseAuthenticatedWidget",

        options: {
            ws: null,
            obj: null,
            loadingImage: "assets/img/ajax-loader.gif",
            ws_url: "https://kbase.us/services/ws"
//            ws_url:"https://dev04.berkeley.kbase.us/services/ws"
//            ws_url:"https://dev03.berkeley.kbase.us/services/ws"
        },

        ws: null, // the ws client

        $mainPanel: null,
        $errorPanel: null,
        $msgPanel: null,
        $copyDropdown: null,
        
        typereg: {'KBaseFile.SingleEndLibrary':
                       {nicetype: 'Single End Read Library',
                        app_name: 'Assembly and Annotation',
                        app: 'genome_assembly',
                        appParam: '1,read_library,'
                        },
                   'KBaseFile.PairedEndLibrary':
                       {nicetype: 'Paired End Read Library',
                        app_name: 'Assembly and Annotation',
                        app: 'genome_assembly',
                        appParam: '1,read_library,'
                        },
                   'KBaseFile.AssemblyFile':
                       {nicetype: 'Assembly File',
                        app_name: 'Assembly File to ContigSet',
                        method: 'convert_annotation_file_to_contig_set',
                        appParam: '1,input_assyfile,' //1 is ignored
                        },
//                   'KBaseFile.AnnotationFile':
//                       {nicetype: 'Annotation File',
//                        app_name: 'Annotation File to Genome',
//                        app: null
//                        },
                   'none':
                       {nicetype: null,
                        app: null
                       }
                    },

        init: function(options) {
            this._super(options);

            this.$errorPanel = $('<div>').addClass('alert alert-danger').hide();
            this.$elem.append(this.$errorPanel);
            
            this.$msgPanel = $('<div>');
            this.$elem.append(this.$msgPanel);

            this.$mainPanel = $("<div>");
            this.$elem.append(this.$mainPanel);

            // check if we are already logged in
            if (!this._attributes.auth.token) {
                this.notLoggedIn();
            } else {
                this.ws = new Workspace(this.options.ws_url, this._attributes.auth);
                this.getDataAndRender();
            }

            return this;
        },

        loggedInCallback: function(event, auth) {
            this.ws = new Workspace(this.options.ws_url, auth);
            this.getDataAndRender();
            return this;
        },
        loggedOutCallback: function(event, auth) {
            this.ws = null;
            this.notLoggedIn();
            return this;
        },

        refresh: function() {
            this.getDataAndRender();
        },

        objData: null,

        getDataAndRender: function() {
            var self = this;
            self.ws.get_object_info(
                    [{ref:self.options.ws+"/"+self.options.obj}],1,
                    function(objInfoList) {
                        if (objInfoList[0]) {
                            self.objData = {
                                    obj_id: objInfoList[0][0],
                                    name: objInfoList[0][1],
                                    type: objInfoList[0][2],
                                    save_date: objInfoList[0][3],
                                    version: objInfoList[0][4],
                                    saved_by: objInfoList[0][5],
                                    wsid: objInfoList[0][6],
                                    workspace: objInfoList[0][7],
                                    chsum: objInfoList[0][8],
                                    size: objInfoList[0][9],
                                    meta: objInfoList[0][10],
                                    };
                            console.log(self.objData);
                            self.render();
                        } else {
                            self.showError({error:{message:
                                'Could not fetch the data information for some reason.'}});
                        }
                    },
                    function(error) {
                        self.showError(error);
                    }
            );
        },


        render: function() {
            var self = this;
            if (self.objData) {
                // do things
                self.$mainPanel.empty();

                var typeName = self.objData.type.split('-')[0];
                if (typeName in self.typereg) {
                    self.renderType(self.typereg[typeName]);
                } else {
                    self.renderType(self.typereg.none);
                }
            }
        },


        renderType: function(typeInfo) {
            var self = this;
            var typeNameNice;
            if (typeInfo.nicetype != null) {
                typeNameNice = typeInfo.nicetype;
            } else {
                typeNameNice = self.objData.type;
            }
            var permref = self.objData.wsid + "/" + self.objData.obj_id + "/" +
                    self.objData.version;
            
            var $basicInfo =
                $('<div>').addClass('col-md-6')
                    .append($('<div>').append('<h3>' + self.objData.name + '</h3>'))
                    .append($('<div>').css({'color':'#555'})
                            .append('Workspace: ' +// '<a href="#/ws/objects/' +
//                                    self.objData.workspace +
//                                    '" target="_blank">' +
                                    self.objData.workspace + '</a>'))
                    .append($('<div>').css({'color':'#555'}) //todo: make this a real style somewhere
                            .append('<a href="#/spec/type/' + self.objData.type +
                                    '" target="_blank">' + typeNameNice + '</a>'))
                    .append($('<div>').css({'color':'#555'})
                            .append('Imported on ' + self.getTimeStr(self.objData.save_date)))
                    .append($('<div>').css({'color':'#555'})
                            .append('Perm Ref: ' + permref))

            var $buttonDiv =
                $('<div>').css({'margin':'10px','margin-top':'20px'});
            if (typeInfo.app != null && typeInfo.method != null) {
                self.showError({error: {message:
                        "typeInfo app and method are mutally exclusive"}});
                return;
            }
            if (typeInfo.app != null || typeInfo.method != null) {
                var param = typeInfo.app ? '&app=' : '&method=';
                var app = typeInfo.app ? typeInfo.app : typeInfo.method;
                $buttonDiv.append($('<a href="#/narrativemanager/new?copydata='
                                        + permref + param + app +
                                        '&appparam=' + typeInfo.appParam +
                                        self.objData.name +
                                        '">').addClass('btn btn-info')
                            .css({'margin':'5px'})
                            .append('Launch ' + typeInfo.app_name + ' App'));
            }
            self.addCopyDropdown($buttonDiv);

            $basicInfo.append($buttonDiv);

            var $metaInfo = $('<div>').addClass('col-md-6').css({'margin-top':'20px'});

            var $metaTbl = $('<table>').addClass("table table-striped table-bordered").css({'width':'100%'});
            var k = Object.keys(self.objData.meta).sort();
            for(var i = 0; i < k.length; i++) {
                var key = k[i];
                if (self.objData.meta.hasOwnProperty(key)) {
                    $metaTbl.append($('<tr>')
                                .append($('<th>').append(key))
                                .append($('<td>')
                                        .append(self.objData.meta[key])));
                }
            }
            $metaInfo.append($metaTbl)


            var $content = $('<div>').addClass('row')
                        .append($basicInfo)
                        .append($metaInfo);

            self.$mainPanel.append($content);
        },
        
        addCopyDropdown: function(element) {
            var self = this;
            self.ws.list_workspace_info({perm: 'w'},
                    function(workspaces) {
                        for (var i = workspaces.length - 1; i >= 0; i--) {
                            var narnnicename = workspaces[i][8]
                                    .narrative_nice_name;
                            if (narnnicename == null) {
                                workspaces.splice(i, 1);
                            }
                        }
                        self.fillCopyDropdown(element, workspaces);
                    },
                    function(error) {
                        self.showError(error);
                    }
            );
        },
        
        fillCopyDropdown: function(element, workspaces) {
            var self = this;
            var uniqueid = 'mycrazyuniqueidthatnooneshouldeveruse';
            var createfunc = function(wsinfo) {
                return function(event) {
                    self.copyData(event, wsinfo);
                };
            };
            workspaces.sort(function(a, b) {
                return a[8].narrative_nice_name
                        .localeCompare(b[8].narrative_nice_name);
                
            });
            var list = $('<ul>').addClass('dropdown-menu').attr('role', 'menu')
                .attr('aria-labelledby', uniqueid);
            if (workspaces.length > 0) {
                for (var i = 0; i < workspaces.length; i++) {
                    var narname = workspaces[i][8].narrative_nice_name;
                    if (narname != null) {
                        list.append($('<li>').attr('role', 'presentation')
                                .append($('<a>').attr('role', 'menuitem')
                                    .attr('tabindex', '-1')
                                    .append(narname + ' (' +
                                            self.getTimeStr(workspaces[i][3]) +
                                            ')')
                                    .click(createfunc(workspaces[i])) //save ws in closure
                                 )
                        );
                    }
                }
            } else {
                list.append($('<li>').attr('role', 'presentation')
                        .addClass('disabled')
                        .append($('<a>').attr('role', 'menuitem')
                            .attr('tabindex', '-1')
                            .append('You have no writeable narratives')
                         )
                );
            }
            self.$copyDropdown = $('<button>')
                    .addClass("btn btn-default dropdown-toggle")
                    .attr('type', 'button').attr('id', uniqueid)
                    .attr('data-toggle', 'dropdown')
                    .attr('aria-expanded', 'true')
                    .append('Copy to Narrative')
                    .append($('<span>').addClass('caret')
                            .css({'margin-left': '5px'}));
            
            element.append($('<div>').addClass('dropdown').css({margin: '5px'})
                .append(self.$copyDropdown)
                .append(list));
        },
        
        copyData: function(event, workspaceInfo) {
            var self = this;
            self.$copyDropdown.addClass('disabled');
            //copies are really fast, so I don't think a spinner is really needed
            self.ws.copy_object(
                    {from: {ref: self.objData.wsid + '/' + self.objData.obj_id},
                     to: {wsid: workspaceInfo[0], name: self.objData.name}
                    }, function(objInfo) {
                        self.$copyDropdown.removeClass('disabled');
                        self.successMsg('Copied object ' + self.objData.name + 
                                ' to narrative ' +
                                workspaceInfo[8].narrative_nice_name);
                    }, function(error) {
                        self.$copyDropdown.removeClass('disabled');
                        self.showError(error);
                    }
            );
        },
        
        successMsg: function(message) {
            var self = this;
            self.$msgPanel.append($('<div>')
                  .addClass('alert alert-success alert-dismissible')
                  .attr('role', 'alert')
                  .append(message)
                  .append($('<button>').addClass('close')
                          .attr('type', 'button')
                          .attr('data-dismiss', 'alert')
                          .attr('aria-label', 'Close')
                          .append($('<span>').attr('aria-hidden', 'true')
                                  .append('&times;'))
                          )
                  );
        },

        notLoggedIn: function() {
            this.$mainPanel.empty();
            this.$mainPanel.append("You must be logged in to view this data.");
        },

        showError: function(error) {
            this.$errorPanel.empty();
            this.$errorPanel.append('<strong>Error when retrieving imported JGI data.</strong><br><br>');
            this.$errorPanel.append(error.error.message);
            this.$errorPanel.append('<br>');
            this.$errorPanel.show();
        },

        // edited from: http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
        getTimeStr: function (objInfoTimeStamp) {
            var date = new Date(objInfoTimeStamp);
            var seconds = Math.floor((new Date() - date) / 1000);
            // f-ing safari, need to add extra ':' delimiter to parse the timestamp
            if (isNaN(seconds)) {
                var tokens = objInfoTimeStamp.split('+');  // this is just the date without the GMT offset
                var newTimestamp = tokens[0] + '+' + tokens[0].substr(0,2) +
                        ":" + tokens[1].substr(2,2);
                date = new Date(newTimestamp);
                seconds = Math.floor((new Date() - date) / 1000);
                if (isNaN(seconds)) {
                    // just in case that didn't work either, then parse without the timezone offset, but
                    // then just show the day and forget the fancy stuff...
                    date = new Date(tokens[0]);
                    return this.monthLookup[date.getMonth()] + " " +
                            date.getDate() + ", " + date.getFullYear();
                }
            }
            // forget about time since, just show the date.
            return this.monthLookup[date.getMonth()] + " " + date.getDate() + 
                    ", " + date.getFullYear();
        },

        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"],


    });
})( jQuery );