(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecTypeCard", 
        parent: "kbaseAuthenticatedWidget", 
        version: "1.0.0",
        timer: null,
        
        options: {
            id: "",
            name: "",
            width: 800,
            height: 600,
            token: null
        },

        init: function(options) {
            this._super(options);
            if (!this.options.token)
            	this.options.token = this.authToken();
            var self = this;
        	var pref = generateSpecPrefix();
        	var container = self.$elem;
            container.append('<p class="muted loader-table"><img src="assets/img/ajax-loader.gif"> loading...</p>');

            var kbws = new Workspace(newWorkspaceServiceUrlForSpec, {token: self.options.token});
            var typeName = this.options.id;
            var typeVer = null;
            if (typeName.indexOf('-') >= 0) {
            	typeVer = typeName.substring(typeName.indexOf('-') + 1);
            	typeName = typeName.substring(0, typeName.indexOf('-'));
            }
        	self.options.name = typeName;
        	
            kbws.get_type_info(this.options.id, function(data) {
            	$('.loader-table').remove();

            	// build tabs
            	var tabNames = ['Overview', 'Spec-file', 'Functions', 'Using Types', 'Sub-types', 'Versions'];
            	var tabIds = ['overview', 'spec', 'funcs', 'types', 'subs', 'vers'];
            	var tabs = $('<ul id="'+pref+'table-tabs" class="nav nav-tabs"/>');
                tabs.append('<li class="active"><a href="#'+pref+tabIds[0]+'" data-toggle="tab" >'+tabNames[0]+'</a></li>');
            	for (var i=1; i<tabIds.length; i++) {
            		if (tabIds[i] == 'funcs')
            			continue;
                	tabs.append('<li><a href="#'+pref+tabIds[i]+'" data-toggle="tab">'+tabNames[i]+'</a></li>');
            	}
            	container.append(tabs);

            	// tab panel
            	var tab_pane = $('<div id="'+pref+'tab-content" class="tab-content"/>');
            	tab_pane.append('<div class="tab-pane in active" id="'+pref+tabIds[0]+'"/>');
            	for (var i=1; i<tabIds.length; i++) {
            		if (tabIds[i] == 'funcs')
            			continue;
                	var tableDiv = $('<div class="tab-pane in" id="'+pref+tabIds[i]+'"/>');
                	tab_pane.append(tableDiv);
            	}
            	container.append(tab_pane);
            
            	// event for showing tabs
            	$('#'+pref+'table-tabs a').click(function (e) {
            		e.preventDefault();
            		$(this).tab('show');
            	});

            	////////////////////////////// Overview Tab //////////////////////////////
            	$('#'+pref+'overview').append('<table class="table table-striped table-bordered" \
                        style="margin-left: auto; margin-right: auto;" id="'+pref+'overview-table"/>');
            	typeVer = data.type_def;
            	typeVer = typeVer.substring(typeVer.indexOf('-') + 1);
                var overviewTable = $('#'+pref+'overview-table');
                overviewTable.append('<tr><td>Name</td><td>'+typeName+'</td></tr>');
                overviewTable.append('<tr><td>Version</td><td>'+typeVer+'</td></tr>');
                var moduleName = typeName.substring(0, typeName.indexOf('.'));
                var moduleLinks = [];
                for (var i in data.module_vers) {
                	var moduleVer = data.module_vers[i];
                	var moduleId = moduleName + '-' + moduleVer;
                	moduleLinks[moduleLinks.length] = '<a onclick="specClicks[\''+pref+'modver-click\'](this,event); return false;" data-moduleid="'+moduleId+'">'+moduleVer+'</a>';
                }
                overviewTable.append('<tr><td>Module version(s)</td><td>'+moduleLinks+'</td></tr>');
            	overviewTable.append('<tr><td>Description</td><td><textarea style="width:100%;" cols="2" rows="15" readonly>'+data.description+'</textarea></td></tr>');
            	specClicks[pref+'modver-click'] = (function(elem, e) {
                    var moduleId = $(elem).data('moduleid');
                    self.trigger('showSpecElement', 
                    		{
                    			kind: "module", 
                    			id : moduleId,
                    			token: self.options.token,
                    			event: e
                    		});
                });
            	/*var openEditorBtn = $('<button class="btn btn-primary">Open in editor</button>');
            	$('#'+pref+'overview').append(openEditorBtn);
            	openEditorBtn.click(function (e) {
            		self.trigger('showKidlEditor', 
                    		{ mod: typeName.substring(0, typeName.indexOf('.')),
            				  type: typeName.substring(typeName.indexOf('.') + 1),
                    		  event: e
                    		});
            	});*/
            	
            	////////////////////////////// Spec-file Tab //////////////////////////////
                var specText = $('<div/>').text(data.spec_def).html();
                specText = replaceMarkedTypeLinksInSpec(moduleName, specText, pref+'links-click');
            	$('#'+pref+'spec').append(
            			'<div id="'+pref+'specdiv" style="width:100%; overflow-y: auto; height: 300px;"><pre class="prettyprint lang-spec">' + specText + "</pre></div>"
            	);
            	specClicks[pref+'links-click'] = (function(elem, e) {
                    var aTypeId = $(elem).data('typeid');
                    self.trigger('showSpecElement', 
                    		{
                    			kind: "type", 
                    			id : aTypeId,
                    			token: self.options.token,
                    			event: e
                    		});
                });
            	prettyPrint();
            	var timeLst = function(event) {
            		var h1 = container.is(":hidden");
            		if (h1) {
            			clearInterval(self.timer);
            			return;
            		}
            		var elem = $('#'+pref+'specdiv');
            		var h2 = elem.is(":hidden");
            		if (h2)
            			return;
            		var diff = container.height() - elem.height() - 41;
            		if (Math.abs(diff) > 10)
            			elem.height(container.height() - 41);
                };
            	self.timer = setInterval(timeLst, 1000);

            	////////////////////////////// Functions Tab //////////////////////////////
            	$('#'+pref+'funcs').append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'funcs-table" \
        				class="table table-bordered table-striped" style="width: 100%;"/>');
            	var funcsData = [];
            	for (var i in data.using_func_defs) {
            		var funcId = data.using_func_defs[i];
            		var funcName = funcId.substring(0, funcId.indexOf('-'));
            		var funcVer = funcId.substring(funcId.indexOf('-') + 1);
            		funcsData.push({name: '<a onclick="specClicks[\''+pref+'funcs-click\'](this,event); return false;" data-funcid="'+funcId+'">'+funcName+'</a>', ver: funcVer});
            	}
                var funcsSettings = {
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 10,
                        "aoColumns": [{sTitle: "Function name", mData: "name"}, {sTitle: "Function version", mData: "ver"}],
                        "aaData": funcsData,
                        "oLanguage": {
                            "sSearch": "Search function:",
                            "sEmptyTable": "No functions use this type."
                        }
                    };
                var funcsTable = $('#'+pref+'funcs-table').dataTable(funcsSettings);
                specClicks[pref+'funcs-click'] = (function(elem, e) {
                    var funcId = $(elem).data('funcid');
                    self.trigger('showSpecElement', 
                    		{
                    			kind: "function", 
                    			id : funcId,
                    			token: self.options.token,
                    			event: e
                    		});
                });

            	////////////////////////////// Using Types Tab //////////////////////////////
            	$('#'+pref+'types').append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'types-table" \
                		class="table table-bordered table-striped" style="width: 100%;"/>');
            	var typesData = [];
            	for (var i in data.using_type_defs) {
            		var aTypeId = data.using_type_defs[i];
            		var aTypeName = aTypeId.substring(0, aTypeId.indexOf('-'));
            		var aTypeVer = aTypeId.substring(aTypeId.indexOf('-') + 1);
            		typesData.push({name: '<a onclick="specClicks[\''+pref+'types-click\'](this,event); return false;" data-typeid="'+aTypeId+'">'+aTypeName+'</a>', ver: aTypeVer});
            	}
                var typesSettings = {
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 10,
                        "aoColumns": [{sTitle: "Type name", mData: "name"}, {sTitle: "Type version", mData: "ver"}],
                        "aaData": typesData,
                        "oLanguage": {
                            "sSearch": "Search type:",
                            "sEmptyTable": "No types use this type."
                        }
                    };
                var typesTable = $('#'+pref+'types-table').dataTable(typesSettings);
                specClicks[pref+'types-click'] = (function(elem, e) {
                    var aTypeId = $(elem).data('typeid');
                    self.trigger('showSpecElement', 
                    		{
                    			kind: "type", 
                    			id : aTypeId,
                    			token: self.options.token,
                    			event: e
                    		});
                });
            	
            	////////////////////////////// Sub-types Tab //////////////////////////////
            	$('#'+pref+'subs').append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'subs-table" \
                		class="table table-bordered table-striped" style="width: 100%;"/>');
            	var subsData = [];
            	for (var i in data.used_type_defs) {
            		var aTypeId = data.used_type_defs[i];
            		var aTypeName = aTypeId.substring(0, aTypeId.indexOf('-'));
            		var aTypeVer = aTypeId.substring(aTypeId.indexOf('-') + 1);
            		subsData.push({name: '<a onclick="specClicks[\''+pref+'subs-click\'](this,event); return false;" data-typeid="'+aTypeId+'">'+aTypeName+'</a>', ver: aTypeVer});
            	}
                var subsSettings = {
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 10,
                        "aoColumns": [{sTitle: "Type name", mData: "name"}, {sTitle: "Type version", mData: "ver"}],
                        "aaData": subsData,
                        "oLanguage": {
                            "sSearch": "Search type:",
                            "sEmptyTable": "No types used by this type."
                        }
                    };
                var subsTable = $('#'+pref+'subs-table').dataTable(subsSettings);
                specClicks[pref+'subs-click'] = (function(elem, e) {
                    var aTypeId = $(elem).data('typeid');
                    self.trigger('showSpecElement', 
                    		{
                    			kind: "type", 
                    			id : aTypeId,
                    			token: self.options.token,
                    			event: e
                    		});
                });
            	
            	////////////////////////////// Versions Tab //////////////////////////////
            	$('#'+pref+'vers').append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'vers-table" \
                		class="table table-bordered table-striped" style="width: 100%;"/>');
            	var versData = [];
            	for (var i in data.type_vers) {
            		var aTypeId = data.type_vers[i];
                	var aTypeVer = aTypeId.substring(aTypeId.indexOf('-') + 1);
                	var link = null;
                	if (typeVer === aTypeVer) {
                		link = aTypeId;
                	} else {
                		link = '<a onclick="specClicks[\''+pref+'vers-click\'](this,event); return false;" data-typeid="'+aTypeId+'">'+aTypeId+'</a>';
                	}
            		versData.push({name: link});
            	}
                var versSettings = {
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 10,
                        "aoColumns": [{sTitle: "Type version", mData: "name"}],
                        "aaData": versData,
                        "oLanguage": {
                            "sSearch": "Search version:",
                            "sEmptyTable": "No versions registered."
                        }
                    };
                var versTable = $('#'+pref+'vers-table').dataTable(versSettings);
                specClicks[pref+'vers-click'] = (function(elem, e) {
                    var aTypeId = $(elem).data('typeid');
                    self.trigger('showSpecElement', 
                    		{
                    			kind: "type", 
                    			id : aTypeId,
                    			token: self.options.token,
                    			event: e
                    		});
                });

            }, function(data) {
            	$('.loader-table').remove();
                container.append('<p>[Error] ' + data.error.message + '</p>');
                return;
            });
            
            return this;
        },
        
        getData: function() {
            return {
                type: "KBaseSpecTypeCard",
                id: this.options.id,
                workspace: "specification",
                title: "Data Type Specification"
            };
        }
    });
})( jQuery );
