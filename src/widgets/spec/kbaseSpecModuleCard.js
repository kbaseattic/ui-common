(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecModuleCard", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            id: null,
            name: null,
            width: 600
        },

        init: function(options) {
            this._super(options);
            var self = this;
            var container = this.$elem;
            self.$elem.append('<p class="muted loader-table"><img src="assets/img/ajax-loader.gif"> loading...</p>');

            var kbws = new Workspace('http://localhost:9999/');
            var moduleName = this.options.id;
            var moduleVer = null;
            if (moduleName.indexOf('-') >= 0) {
            	moduleVer = moduleName.substring(moduleName.indexOf('-') + 1);
            	moduleName = moduleName.substring(0, moduleName.indexOf('-'));
            }
        	self.options.name = moduleName;
        	var pref = (new Date()).getTime();
        	
        	// build tabs
        	var tabNames = ['Overview', 'Spec-file', 'Types', 'Functions', 'Included modules', 'Versions'];
        	var tabIds = ['overview', 'spec', 'types', 'funcs', 'includes', 'versions'];
        	var tabs = $('<ul id="'+pref+'table-tabs" class="nav nav-tabs"/>');
            tabs.append('<li class="active"><a href="#'+pref+tabIds[0]+'" data-toggle="tab" >'+tabNames[0]+'</a></li>');
        	for (var i=1; i<tabIds.length; i++) {
            	tabs.append('<li><a href="#'+pref+tabIds[i]+'" data-toggle="tab">'+tabNames[i]+'</a></li>');
        	}
        	container.append(tabs);

        	// tab panel
        	var tab_pane = $('<div id="'+pref+'tab-content" class="tab-content">');
        	tab_pane.append('<div class="tab-pane in active" id="'+pref+tabIds[0]+'"/>');
        	for (var i=1; i<tabIds.length; i++) {
            	var tableDiv = $('<div class="tab-pane in" id="'+pref+tabIds[i]+'"> ');
            	tab_pane.append(tableDiv);
        	}
        	container.append(tab_pane);
        
        	// event for showing tabs
        	$('#'+pref+'table-tabs a').click(function (e) {
        		e.preventDefault();
        		$(this).tab('show');
        	});

            var wsAJAX = kbws.get_module_info({mod: moduleName, ver:moduleVer});
            $.when(wsAJAX).done(function(data){
            	$('.loader-table').remove();

            	////////////////////////////// Overview Tab //////////////////////////////
            	$('#'+pref+'overview').append('<table class="table table-striped table-bordered" \
                        style="margin-left: auto; margin-right: auto;" id="'+pref+'overview-table"/>');
            	var overviewLabels = ['Name', 'Owners', 'Version', 'Upload time'];
            	var overviewData = [moduleName, data.owners, data.ver, new Date(data.ver)];
                var overviewTable = $('#'+pref+'overview-table');
                for (var i=0; i<overviewData.length; i++) {
                	overviewTable.append('<tr><td>'+overviewLabels[i]+'</td> \
                                  <td>'+overviewData[i]+'</td></tr>');
                }
            	overviewTable.append('<tr><td>Description</td><td><textarea style="width:100%;" cols="2" rows="5" readonly>'+data.description+'</textarea></td></tr>');

            	////////////////////////////// Spec-file Tab //////////////////////////////
            	$('#'+pref+'spec').append('<textarea style="width:100%;" cols="2" rows="20" readonly>' + data.spec + "</textarea>");

            	////////////////////////////// Types Tab //////////////////////////////
            	$('#'+pref+'types').append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'types-table" \
                		class="table table-bordered table-striped" style="width: 100%;"/>');
            	var typesData = [];
            	for (var typeId in data.types) {
            		var typeName = typeId.substring(typeId.indexOf('.') + 1, typeId.indexOf('-'));
            		var typeVer = typeId.substring(typeId.indexOf('-') + 1);
            		typesData[typesData.length] = {name: '<a class="types-click" data-typeid="'+typeId+'">'+typeName+'</a>', ver: typeVer};
            	}
                var typesSettings = {
                        "fnDrawCallback": typesEvents,
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 10,
                        "aoColumns": [{sTitle: "Type name", mData: "name"}, {sTitle: "Type version", mData: "ver"}],
                        "aaData": [],
                        "oLanguage": {
                            "sSearch": "Search type:",
                            "sEmptyTable": "No types registered."
                        }
                    };
                var typesTable = $('#'+pref+'types-table').dataTable(typesSettings);
                typesTable.fnAddData(typesData);
            	function typesEvents() {
                    $('.types-click').unbind('click');
                    $('.types-click').click(function() {
                        var typeId = $(this).data('typeid');
                        self.trigger('showSpecElement', 
                        		{
                        			kind: "type", 
                        			id : typeId,
                        			event: event
                        		});
                    });
                }

            	////////////////////////////// Functions Tab //////////////////////////////
            	$('#'+pref+'funcs').append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'funcs-table" \
        				class="table table-bordered table-striped" style="width: 100%;"/>');
            	var funcsData = [];
            	for (var i in data.functions) {
            		var funcId = data.functions[i];
            		var funcName = funcId.substring(funcId.indexOf('.') + 1, funcId.indexOf('-'));
            		var funcVer = funcId.substring(funcId.indexOf('-') + 1);
            		funcsData[funcsData.length] = {name: '<a class="funcs-click" data-funcid="'+funcId+'">'+funcName+'</a>', ver: funcVer};
            	}
                var funcsSettings = {
                        "fnDrawCallback": funcsEvents,
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 10,
                        "aoColumns": [{sTitle: "Function name", mData: "name"}, {sTitle: "Function version", mData: "ver"}],
                        "aaData": [],
                        "oLanguage": {
                            "sSearch": "Search function:",
                            "sEmptyTable": "No functions registered."
                        }
                    };
                var funcsTable = $('#'+pref+'funcs-table').dataTable(funcsSettings);
                funcsTable.fnAddData(funcsData);
            	function funcsEvents() {
                    $('.funcs-click').unbind('click');
                    $('.funcs-click').click(function() {
                        var funcId = $(this).data('funcid');
                        self.trigger('showSpecElement', 
                        		{
                        			kind: "function", 
                        			id : funcId,
                        			event: event
                        		});
                    });
                }

            });

            
            return this;
        },
        
        getData: function() {
            return {
                type: "KBaseSpecModuleCard",
                id: this.options.name,
                workspace: '',
                title: "Spec-document Module"
            };
        }
    });
})( jQuery );
