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
        
        typereg: {'KBaseFile.SingleEndLibrary':
                       {nicetype: 'Single End Read Library',
                        app: 'Assembly'
                        },
                   'KBaseFile.PairedEndLibrary':
                       {nicetype: 'Paired End Read Library',
                        app: 'Assembly'
                        },
                   'KBaseFile.AssemblyFile':
                       {nicetype: 'Assembly File',
                        app: 'Assembly File to ContigSet'
                        },
                   'KBaseFile.AnnotationFile':
                       {nicetype: 'Annotation File',
                        app: 'Annotation File to Genome'
                        },
                   'none':
                       {nicetype: null,
                        app: null
                       }
                    },

        init: function(options) {
            this._super(options);

            this.$errorPanel = $('<div>').addClass('alert alert-danger').hide();
            this.$elem.append(this.$errorPanel);

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

            var $basicInfo =
                $('<div>').addClass('col-md-6')
                    .append($('<div>').append('<h3>' + self.objData.name + '</h3>'))
                    .append($('<div>').css({'color':'#555'})
                            .append('Workspace: ' + self.objData.workspace))
                    .append($('<div>').css({'color':'#555'}) //todo: make this a real style somewhere
                            .append('<a href="#/spec/type/' + self.objData.type +
                                    '" target="_blank">' + typeNameNice + '</a>'))
                    .append($('<div>').css({'color':'#555'})
                            .append('Imported on ' + self.getTimeStr(self.objData.save_date)))
                    .append($('<div>').css({'color':'#555'})
                            .append('Perm Ref: ' + self.objData.wsid + "/"
                                    + self.objData.obj_id + "/" + self.objData.version))

            var $buttonDiv =
                $('<div>').css({'margin':'10px','margin-top':'20px'});
            if (typeInfo.app != null) {
                $buttonDiv.append($('<a href="">').addClass('btn btn-info')
                            .css({'margin':'5px'})
                            .append('Launch ' + typeInfo.app + ' App'));
            }
            $buttonDiv.append($('<a href="">').addClass('btn btn-info')
                .css({'margin':'5px'}).append('Copy to Narrative'));

            $basicInfo.append($buttonDiv);

            var $metaInfo = $('<div>').addClass('col-md-6').css({'margin-top':'20px'});

            var $metaTbl = $('<table>').addClass("table table-striped table-bordered").css({'width':'100%'});
            for(var key in self.objData.meta) {
                if (self.objData.meta.hasOwnProperty(key)) {
                    $metaTbl.append(
                            $('<tr>')
                            .append($('<th>').append(key))
                            .append($('<td>').append(self.objData.meta[key])));
                }
            }
            $metaInfo.append($metaTbl)


            var $content =
                $('<div>').append(
                        $('<div>').addClass('row')
                        .append($basicInfo)
                        .append($metaInfo));

            self.$mainPanel.append($content);
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