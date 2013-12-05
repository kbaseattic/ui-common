(function( $, undefined ) {
    $.KBWidget({
        name: "NarrativeTempCard",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            ws_id: null,
            ws_name: null,
            token: null,
            user_id: null,
            width: 600
        },

        init: function(options) {
            this._super(options);
            var wsUrl = 'http://140.221.84.170:7058/';
            var self = this;
            var container = this.$elem;
            container.append('<p class="muted loader-table"><img src="assets/img/ajax-loader.gif"> loading...</p>');

            var kbws = new Workspace(wsUrl);
            kbws.get_objects([{workspace: options.ws_name, objid: options.ws_id}], function(data) {
            	$('.loader-table').remove();
            	var type = data[0].info[2];
                if (type.indexOf('-') >= 0) {
                	type = type.substring(0, type.indexOf('-'));
                }
                if (!(type === 'KBGA.Genome')) {
                    container.append('<p>[Error] Object is of type "' + type + '" but expected type is "KBGA.Genome"</p>');
                    return;
                }
            	var gnm = data[0].data;  // [id, scientific_name, domain, genetic_code, source, source_id, features, gc, taxonomy, size]
            	var pref = (new Date()).getTime();
            	
            	var tabNames = ['Overview', 'Contigs', 'Genes'];
            	var tabIds = ['overview', 'contigs', 'genes'];
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

            	////////////////////////////// Overview Tab //////////////////////////////
            	$('#'+pref+'overview').append('<table class="table table-striped table-bordered" \
                        style="margin-left: auto; margin-right: auto;" id="'+pref+'overview-table"/>');
            	var overviewLabels = ['Id', 'Name', 'Domain', 'Genetic code', 'Source', "Source id", "GC", "Taxonomy", "Size"];
            	var overviewData = [gnm.id, gnm.scientific_name, gnm.domain, gnm.genetic_code, gnm.source, gnm.source_id, gnm.gc, gnm.taxonomy, gnm.size];
                var overviewTable = $('#'+pref+'overview-table');
                for (var i=0; i<overviewData.length; i++) {
                	if (overviewLabels[i] === 'Taxonomy') {
                    	overviewTable.append('<tr><td>' + overviewLabels[i] + '</td> \
                    			<td><textarea style="width:100%;" cols="2" rows="5" readonly>'+overviewData[i]+'</textarea></td></tr>');
                	} else {
                		overviewTable.append('<tr><td>'+overviewLabels[i]+'</td> \
                				<td>'+overviewData[i]+'</td></tr>');
                	}
                }

            	////////////////////////////// Genes Tab //////////////////////////////
            	$('#'+pref+'genes').append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'genes-table" \
                		class="table table-bordered table-striped" style="width: 100%;"/>');
            	var genesData = [];
            	for (var genePos in gnm.features) {
            		var gene = gnm.features[genePos];
            		var geneId = gene.id;
        			var geneContig = '-';
        			var geneStart = null;
        			var geneDir = null;
        			var geneLen = null;
            		if (gene.location && gene.location.length > 0) {
            			geneContig = gene.location[0][0];
            			geneStart = gene.location[0][1];
            			geneDir = gene.location[0][2];
            			geneLen = gene.location[0][3];
            		}
            		var geneType = gene.type;
            		var geneFunc = gene['function'];
            		genesData[genesData.length] = {id: '<a class="'+pref+'genes-click" data-geneid="'+geneId+'">'+geneId+'</a>', contig: geneContig};
            	}
                var genesSettings = {
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 10,
                        "aoColumns": [
                                      {sTitle: "Gene ID", mData: "id"}, 
                                      {sTitle: "Contig", mData: "contig"}
                                     ],
                        "aaData": [],
                        "oLanguage": {
                            "sSearch": "Search gene:",
                            "sEmptyTable": "No genes found."
                        }
                    };
                var genesTable = $('#'+pref+'genes-table').dataTable(genesSettings);
                genesTable.fnAddData(genesData);
                $('.'+pref+'genes-click').click(function() {
                    var geneId = $(this).data('geneid');
                    alert('Gene ID: ' + geneId);
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
                        type: "NarrativeTempCard",
                        id: this.options.ws_name + "." + this.options.ws_id,
                        workspace: this.options.ws_name,
                        title: "Temp Widget"
                    };
        }
    });
})( jQuery );
