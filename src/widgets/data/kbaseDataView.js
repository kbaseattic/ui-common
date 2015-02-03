/**
 *
 *
 *
 * This widget simply takes on objectinfo object
 *
 */ 
(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseDataView",
        parent: "kbaseAuthenticatedWidget",

        options: {
            objref: null,
            ws_url: "https://kbase.us/services/ws",
            loadingImage: "assets/img/ajax-loader.gif"
        },

        ws: null, // the ws client
	loggedIn: false,

        $mainPanel: null,
        $errorPanel: null,
        $msgPanel: null,
        $copyDropdown: null,
	
        objData: null,
        
        init: function(options) {
            this._super(options);
	    
	    this.$errorPanel = $('<div>').addClass('alert alert-danger').hide();
            this.$elem.append(this.$errorPanel);
            
            this.$msgPanel = $('<div>');
            this.$elem.append(this.$msgPanel);

            this.$mainPanel = $("<div>");
            this.$elem.append(this.$mainPanel);
	    
	    this.showLoading();
	    
	    if (this.options.objref) {
		if (!this.auth.token) {
		    this.ws = new Workspace(this.options.ws_url);
		    this.loggedIn = false;
		} else {
		    console.log(this.auth);
		    this.ws = new Workspace(this.options.ws_url, this.auth);
		    this.loggedIn = true;
		}
		//this.getInfoAndRender();
	    } else {
		this.showError({error:{message:"No data reference provided."}});
	    }
	    
            return this;
        },

        loggedInCallback: function(event, auth) {
            this.ws = new Workspace(this.options.ws_url, auth);
	    this.refresh();
            return this;
        },
        loggedOutCallback: function(event, auth) {
            this.ws = null;
	    this.refresh();
            return this;
        },

        refresh: function() {
	    this.getInfoAndRender();
        },

	render: function() {
	    var self = this;
	    self.$mainPanel.empty();
	    this.renderDetails();
            
	},
	

        getInfoAndRender: function() {
	    var self = this;
	    if (self.ws) {
		self.showLoading();
		self.ws.get_object_info(
                    [{ref:self.options.objref}],1,
                    function(objInfoList) {
                        if (objInfoList[0]) {
			    var obj_info = objInfoList[0];
			    self.objData = {
				obj_id: obj_info[0],
				name: obj_info[1],
				type: obj_info[2],
				save_date: obj_info[3],
				version: obj_info[4],
				saved_by: obj_info[5],
				wsid: obj_info[6],
				workspace: obj_info[7],
				chsum: obj_info[8],
				size: obj_info[9],
				meta: obj_info[10],
			    };
			    self.$errorPanel.hide();
			    self.render();
			    if(self.options.title) { self.options.title.html(obj_info[0][1]); }
			    
			    self.$elem.append($('<div>').append('howdy doody'));
			    self.$elem.append(self.getVizWidgetDiv(obj_info,self.type2widget));
			    
                        } else {
                            if(self.options.title) { self.options.title.html(self.options.objref); }
                            self.showError({error:{message:'An unknown error occurred while fetching data.'}});
                        }
                    },
                    function(error) {
			console.error(error);
                        if(self.options.title) { self.options.title.html(self.options.objref); }
                        self.showError(error);
                    }
		);
	    }
	},

	
	
	// this is crazy, but for now we just hard code this - should be loaded from a config
	type2widget: {
	    'KBaseGenomes.Genome': {
		widget:'kbaseJsonView',
		options: '{"id":???id,"ws":???ws}'
	    },
	    'KBaseTrees.Tree': {
		widget:'kbaseTree',
		options: '{"treeID":???id,"workspaceID":???ws,"treeObjVer":???ver,"loadingImage":"???loadingImage"}'
	    }
	},
	
	getVizWidgetDiv: function(obj_info, type2widget) {
	    var type = obj_info[2].split('-')[0];
	    if (type2widget.hasOwnProperty(type)) {
		var config = type2widget[type];
		if (config.widget && config.options) {
		    var options = config.options;
		    options = options.replace(/\?\?\?ws/g, obj_info[6]);
		    options = options.replace(/\?\?\?wsname/g, obj_info[7]);
		    options = options.replace(/\?\?\?id/g, obj_info[0]);
		    options = options.replace(/\?\?\?objname/g, obj_info[1]);
		    options = options.replace(/\?\?\?ver/g, obj_info[4]);
		    options = options.replace(/\?\?\?type/g, type);
		    options = options.replace(/\?\?\???loadingImage/g, this.options.loadingImage);
		    
		    var optionsObj;
		    try {
			optionsObj = JSON.parse(options);
		    } catch(err) {
			console.log('loading viewer widget "'+config.widget+'" with unparsable options: ', options, err);
		    }
		    if (optionsObj) {
			console.log('loading viewer widget "'+config.widget+'" with options ',options);
			var $widgetDiv = $('<div>');
			var widget = $widgetDiv[config.widget](optionsObj);
			return $widgetDiv;
		    }
		} else {
		    console.log('Viewer config does not have properties "widget" and "options" for: ',obj_info);
		}
	    } else {
		console.log('No default viewer configured for: ',obj_info);
	    }
	    // no viewer found or there was a bad config, so don't show anything
	    return $('<div>');
	},
	
	
	
	
	

	$nardiv: null,
	
        renderDetails: function() {
            var self = this;
	    
            var permref = self.objData.wsid + "/" + self.objData.obj_id + "/" + self.objData.version;
            
	    self.$nardiv = $('<div>').css({'color':'#555'})
                            .append('Narrative: ' +// '<a href="#/ws/objects/' +
//                                    self.objData.workspace +
//                                    '" target="_blank">' +
                                    self.objData.workspace);
			    
            var $basicInfo =
                $('<div>').addClass('col-md-6')
                    .append($('<div>').append('<h3>' + self.objData.name + '</h3>'))
                    .append(self.$nardiv)
                    .append($('<div>').css({'color':'#555'}) //todo: make this a real style somewhere
                            .append('<a href="#/spec/type/' + self.objData.type +
                                    '" target="_blank">' + self.objData.type + '</a>'))
                    .append($('<div>').css({'color':'#555'})
                            .append('Last modified on ' + self.getTimeStr(self.objData.save_date)))
                    .append($('<div>').css({'color':'#555'})
                            .append('Perm Ref: ' + permref))

            var $buttonDiv =
                $('<div>').css({'margin':'10px','margin-top':'20px'});
            /*if (typeInfo.app != null && typeInfo.method != null) {
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
            }*/
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
	
	showLoading: function() {
	    this.$errorPanel.empty();
	    this.$mainPanel.empty();
	    this.$mainPanel.append('<img src="'+this.options.loadingImage+'"/> loading...')
	},
	
        showError: function(error) {
            this.$errorPanel.empty();
            this.$errorPanel.append('<strong>Error when retrieving data.</strong><br><br>');
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