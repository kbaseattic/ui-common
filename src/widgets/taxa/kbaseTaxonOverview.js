/**
 * Shows a species description taken from Wikipedia.
 * Also includes a picture, but that'll be under a tab or something.
 */
(function( $, undefined ) {
    $.KBWidget({
        name: "KBaseTaxonOverview",
        parent: "kbaseWidget",
        version: "1.0.0",

        options: {
            taxon: null,
            wsNameOrID: null,
            kbCache: null,
            title: "Taxon Overview",
            maxNumChars: 2000,
            width: 1000,
            loadingImage: null,
            wsDisplayName: "taxonomy",
            taxonDisplayName: ""
        },

        wsUrl : "https://kbase.us/services/ws",
        ws : null,
        
        init: function(options) {
            this._super(options);
            var self = this;
            
            if (self.options.wsNameOrID) { self.options.wsDisplayName = self.options.wsNameOrID; }
            self.options.taxonDisplayName = self.options.taxon.replace(/_/g, ' ');
            
            this.$messagePane = $("<div/>")
                                .addClass("kbwidget-message-pane")
                                .addClass("kbwidget-hide-message");
            this.$elem.append(this.$messagePane);
            this.showMessage("<img src='" + this.options.loadingImage + "'/>");
            
            this.$elem.append('<table cellpadding="5" cellspacing="2" border=0 style="width:100%;">' +
                              '<tr><td style="vertical-align:top"><div id="taxondescription"></td>'+
                              '<td style="vertical-align:top"><div id="taxonimage" style="width:400px;"></td></tr><br>');
            
            // show the taxonomy information
            this.renderFromTaxonomy([options.taxon]);
            
            if (self.options.wsNameOrID) {
                
                // add nothing else..
                self.$elem.append('<br><br><br><br><center><b> related ws object search not functional yet </b></center><br><br><br><br>');
                
            } else {
                // get the ws client
                if (self.options.kbCache.ws_url) { self.wsUrl = self.options.kbCache.ws_url; }
                if (self.options.kbCache.token) { self.ws = new Workspace(self.wsUrl, {token: self.options.kbCache.token}); }
                else { self.ws = new Workspace(self.wsUrl); }
                
                //get the ws selector information
                self.$elem.append('<br><h4>Select a Workspace to view data associated with this taxon:</h4><div id="taxonmywstitle></div>');
                if (self.options.kbCache.token) {
                    self.$elem.append('<div id="taxonwsselectoruser">');
                    self.$elem.append('<br><br>');
                    self.$elem.append('<br><h4>Or select a public workspace:</h4>');
                    self.$elem.append('<div id="taxonwsselectorglobal">');
                    self.showWsSelector({excludeGlobal:1},this.$elem.find('#taxonwsselectoruser'), "#/taxon/"+self.options.taxon+"/");
                } 
                self.$elem.append('<div id="taxonwsselectorglobal">');
                self.showWsSelector({excludeGlobal:0},this.$elem.find('#taxonwsselectorglobal'), "#/taxon/"+self.options.taxon+"/");
            }
            return this;
        },

        
        showWsSelector: function(listWsParams, outputDiv, urlbase) {
            var self = this;
            
            self.ws.list_workspace_info(listWsParams,
                function(data) {
                    var wsdata = [];
                    for(var k=0; k<data.length; k++) {
                        //0: ws_id, 1: ws_name, 2: owner, 3: moddate, 4: n_object, 5: user_permission, 6: globalread,7: lockstat, 8:  metadata
                        var moddate = new Date(data[k][3]);
                        var perm = "read";
                        if (data[k][5]=="n") {
                            perm = self.permLookup[data[k][6]];
                        } else {
                            perm = self.permLookup[data[k][5]];
                        }
                        wsdata.push({
                            name: '<a href="'+urlbase + data[k][1]+'">'+data[k][1]+"</a> ("+data[k][0]+")",
                            owner: data[k][2],
                            size: data[k][4],
                            details: "last modified on "+ self.monthLookup[moddate.getMonth()]+" "+moddate.getDate()+", "+moddate.getFullYear() +
                                     "; you have "+perm+" access to this workspace"
                        })
                    }
                    
                    var sDom = 't<fip>'
                    if (wsdata.length<=5) { sDom = 'tfi'; }
            	    var tblSettings = {
            				//"sPaginationType": "full_numbers",
            				"iDisplayLength": 5,
                                        "sDom": sDom,
            				"aoColumns": [
            				              {sTitle: "WS Name (id)", mData: "name", sWidth:"150"},
            				              {sTitle: "Owner", mData: "owner"},
            				              {sTitle: "Size", mData: "size"},
            				              {sTitle: "Details", mData: "details"}
            				              ],
            				              "aaData": wsdata
            	    };
                    // probably there is a better way to do this in jquery
                    var tblid = self.uid();
                    outputDiv.append('<table cellpadding="0" cellspacing="0" border="0" id="'+tblid+'"  \
                            class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>')
                    self.$elem.find("#"+tblid).dataTable(tblSettings);
                },
                function(error) {
                    // do nothing, but log the error
                    console.error("Error when getting a list of workspaces");
                    console.error(error);
                }
                
            )
        },
        
        

        /**
         * Needs to be given in reverse order. Calling function should handle
         * what are valid names. E.g.
         * ['Escherichia coli K-12', 'Escherichia coli', 'Escherichia', 'Enterobacteriaceae', 'Enterobacteriales', 'Gammaproteobacteria', ...]
         * Start with most descriptive name, proceed on down to least descriptive (usually kingdom name, if available).
         * 
         * This will try to fetch wiki content for the first valid name in that list.
         */
        renderFromTaxonomy: function(taxonomy) {
            var self = this;
            var searchTerms = taxonomy;
            var firstTerm = taxonomy[0];

            this.dbpediaLookup(searchTerms, $.proxy(
                function(desc) {
                    // If we've found something, desc.description will exist and be non-null
                    
                    if (desc.hasOwnProperty('description') && desc.description != null) {
                        if (desc.description.length > this.options.maxNumChars) {
                            desc.description = desc.description.substr(0, this.options.maxNumChars);
                            var lastBlank = desc.description.lastIndexOf(" ");
                            desc.description = desc.description.substr(0, lastBlank) + "...";
                        }

                        /* the viz is set up like this:
                         * 1. Description Tab
                         *
                         * ['not found' header, if applicable]
                         * Showing description for <search term>
                         * ['redirect header', if applicable]
                         *
                         * Description (a fragment of the abstract from Wikipedia)
                         *
                         * <Wikipedia link>
                         *
                         * 2. Image Tab
                         * ['not found' header, if applicable, with link to Wikipedia]
                         * Image
                         */

                        var descStr = "<p style='text-align:justify;'>" + desc.description + "</p>"

                        var descHtml;
                        if (firstTerm === desc.redirectFrom) {
                            descHtml = this.redirectHeader(firstTerm, desc.redirectFrom, desc.searchTerm) + descStr + this.descFooter(desc.wikiUri);
                        }
                        else if (desc.searchTerm === firstTerm) {
                            descHtml = descStr + this.descFooter(desc.wikiUri);
                        }
                        else {
                            descHtml = this.notFoundHeader(firstTerm, desc.searchTerm, desc.redirectFrom) + descStr + this.descFooter(desc.wikiUri);
                        }

                        var imageHtml = "Unable to find an image. If you have one, you might consider <a href='" + desc.wikiUri + "' target='_new'>adding it to Wikipedia</a>.";
                        if (desc.imageUri != null) {
                            imageHtml = "<img src='" + desc.imageUri + "'";
                            if (this.options.width)
                                imageHtml += "style='max-width: 100%'";
                            imageHtml += "/>";
                        }
                    }
                    else {
                        descHtml = this.notFoundHeader(firstTerm);
                    }

                    var descId = this.uid();
                    var imageId = this.uid();
                    self.$elem.find("#taxondescription").append(descHtml);
                    self.$elem.find("#taxonimage").append(imageHtml);
                    
                    this.$elem.append('<div id="taxondescription">');
                    this.$elem.append('<div id="taxonimage" style="width:400px;">');

                    this.hideMessage();         
                }, this), 
                $.proxy(this.renderError, this)
            );
        },

        buildObjectIdentity: function(workspaceID, objectID) {
            var obj = {};
            if (/^\d+$/.exec(workspaceID))
                obj['wsid'] = workspaceID;
            else
                obj['workspace'] = workspaceID;

            // same for the id
            if (/^\d+$/.exec(objectID))
                obj['objid'] = objectID;
            else
                obj['name'] = objectID;
            return obj;
        },

        descFooter: function(wikiUri) {
            return "<p>[<a href='" + wikiUri + "'' target='_new'>more at Wikipedia</a>]</p>";
        },

        notFoundHeader: function(strainName, term, redirectFrom) {
            var underscoredName = strainName.replace(/\s+/g, "_");
            var str = "<p><b><i>" +
                      strainName + 
                      "</i> description not found. You can start a new page for this taxon on <a href='http://en.wikipedia.org/wiki/" + 
                      underscoredName + 
                      "' target='_new'>Wikipedia</a>.</b></p>";
            if (term) {
                str += "<p><b>Showing description for <i>" +
                       term +
                       "</i></b>";
                if (redirectFrom) {
                    str += "<br>redirected from <i>" + redirectFrom + "</i>";
                }
                str += "</p>";
            }
            return str;
        },

        redirectHeader: function(strainName, redirectFrom, term) {
            var underscoredName = redirectFrom.replace(/\s+/g, "_");
            var str = "<p><b>" +
                      "Showing description for <i>" + term + "</i></b>" +
                      "<br>redirected from <i>" + underscoredName + "</i>" +
                      "</p>";

            return str;
        },

        showMessage: function(message) {
            var span = $("<span/>").append(message);

            this.$messagePane.append(span);
            this.$messagePane.removeClass("kbwidget-hide-message");
        },

        hideMessage: function() {
            this.$messagePane.addClass("kbwidget-hide-message");
            this.$messagePane.empty();
        },
        
        getData: function() {
            return {
                id: this.options.taxonDisplayName,
                workspace: this.options.wsDisplayName,
                title: this.options.title
            };
        },

        renderError: function(error) {
            errString = "An unknown error occurred in fetching the taxon information.";
            if (typeof error === "string")
                errString = error;
            else if (error && error.error && error.error.message)
                errString = error.error.message;
            
            var $errorDiv = $("<div>")
                            .addClass("alert alert-danger")
                            .append("<b>Error:</b>")
                            .append("<br>" + errString);
            this.$elem.empty();
            this.$elem.append($errorDiv);
            console.error(error);
        },

        dbpediaLookup: function(termList, successCallback, errorCallback, redirectFrom) {
            if (!termList || Object.prototype.toString.call(termList) !== '[object Array]' || termList.length === 0) {
                if (errorCallback) {
                    errorCallback("No taxon name given.");
                }
            }
            var searchTerm = termList.shift();
            var usTerm = searchTerm.replace(/\s+/g, '_');

            var resourceKey    = 'http://dbpedia.org/resource/' + usTerm;
            var abstractKey    = 'http://dbpedia.org/ontology/abstract';
            var languageKey    = 'en';
            var imageKey       = 'http://xmlns.com/foaf/0.1/depiction';
            var wikiLinkKey    = 'http://xmlns.com/foaf/0.1/isPrimaryTopicOf';
            var wikipediaUri   = 'http://en.wikipedia.org/wiki';
            var redirectKey    = 'http://dbpedia.org/ontology/wikiPageRedirects';

            var requestUrl = 'http://dbpedia.org/data/' + usTerm + '.json';
            $.get(requestUrl).then($.proxy(function(data, status) {
                var processedHit = {
                    'searchTerm' : searchTerm
                };

                if (data[resourceKey]) {
                    var resource = data[resourceKey];
                    if (!resource[wikiLinkKey] || !resource[abstractKey]) {
                        if (resource[redirectKey]) {
                            var tokens = resource[redirectKey][0]['value'].split('/');
                            this.dbpediaLookup([tokens[tokens.length - 1]], successCallback, errorCallback, searchTerm);
                        }
                        else {
                            if (termList.length > 0)
                                this.dbpediaLookup(termList, successCallback, errorCallback);
                            else
                                successCallback(processedHit);
                        }
                    }
                    else {
                        if (resource[wikiLinkKey]) {
                            processedHit['wikiUri'] = resource[wikiLinkKey][0]['value'];
                        }
                        if (resource[abstractKey]) {
                            var abstracts = resource[abstractKey];
                            for (var i=0; i<abstracts.length; i++) {
                                if (abstracts[i]['lang'] === languageKey)
                                    processedHit['description'] = abstracts[i]['value'];
                            }
                        }
                        if (resource[imageKey]) {
                            processedHit['imageUri'] = resource[imageKey][0]['value'];
                        }
                        if (redirectFrom) {
                            processedHit['redirectFrom'] = redirectFrom;
                        }
                        successCallback(processedHit);
                    }
                }
                else {
                    if (termList.length > 0) {
                        this.dbpediaLookup(termList, successCallback, errorCallback);
                    } else {
                        errorCallback("Could not find information for "+searchTerm);
                    }
                }
                
                return processedHit;
            }, this),
            function(error) {
                if (errorCallback)
                    errorCallback(error);
            });
        },
        uid: function() {
            var id='';
            for(var i=0; i<32; i++)
                id += Math.floor(Math.random()*16).toString(16).toUpperCase();
            return id;
        },
        monthLookup : ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"],
        permLookup : {
            a : "administrator privileges and read/write",
            w : "read/write",
            r : "read only",
            n : "no"
        }
    })
})( jQuery );