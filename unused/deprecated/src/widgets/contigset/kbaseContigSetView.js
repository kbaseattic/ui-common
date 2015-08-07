/**
 * Output widget for visualization of genome annotation.
 * @author Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */

(function( $, undefined ) {
    $.KBWidget({
        name: "kbaseContigSetView",
        parent: "kbaseAuthenticatedWidget",
        version: "1.0.0",
        ws_id: null,
        ws_name: null,
        token: null,
        job_id: null,
        options: {
            ws_id: null,
            ws_name: null,
            width: 850
        },
        loadingImage: "./assets/images/ajax-loader.gif",

        init: function(options) {
            this._super(options);

            this.ws_name = options.ws_name;
            this.ws_id = options.ws_id;
            if (options.ws && options.id) {
                  this.ws_id = options.id;
                  this.ws_name = options.ws;
            }
            this.render();
            return this;
        },
        
        render: function() {
            var self = this;
        	var pref = this.uuid();

            var container = this.$elem;

            var ready = function() {
            	container.empty();
            	container.append("<div><img src=\""+self.loadingImage+"\">&nbsp;&nbsp;loading genome data...</div>");

            	var p = kb.req('ws', 'get_object_subset', [{ref: self.ws_name +"/"+ self.ws_id, included: ['contigs/[*]/id', 'contigs/[*]/length', 'id', 'name', 'source', 'source_id', 'type']}]);
            	$.when(p).done(function(data) {
            		container.empty();
            		var cs = data[0].data;
            		var tabNames = ['Overview', 'Contigs'];
            		var tabIds = ['overview', 'contigs'];

                	var tabs = $('<ul id="'+pref+'table-tabs" class="nav nav-tabs"/>');
                    tabs.append('<li class="active"><a href="#'+pref+tabIds[0]+'" data-toggle="tab" >'+tabNames[0]+'</a></li>');
                	for (var i=1; i<tabIds.length; i++)
                    	tabs.append('<li><a href="#'+pref+tabIds[i]+'" data-toggle="tab">'+tabNames[i]+'</a></li>');
                	container.append(tabs);

                	// tab panel
                	var tab_pane = $('<div id="'+pref+'tab-content" class="tab-content"/>');
                	tab_pane.append('<div class="tab-pane in active" id="'+pref+tabIds[0]+'"/>');
                	for (var i=1; i<tabIds.length; i++)
                    	tab_pane.append($('<div class="tab-pane in" id="'+pref+tabIds[i]+'"/>'));
                	container.append(tab_pane);

                	$('#'+pref+'table-tabs a').click(function (e) {
                		e.preventDefault();
                		$(this).tab('show');
                	});

            		////////////////////////////// Overview Tab //////////////////////////////
            		$('#'+pref+'overview').append('<table class="table table-striped table-bordered" \
            				style="margin-left: auto; margin-right: auto;" id="'+pref+'overview-table"/>');
            		var overviewLabels = ['KBase ID', 'Name', 'Object ID', 'Source', "Source ID", "Type"];
            		var overviewData = [cs.id, cs.name, self.ws_id, cs.source, cs.source_id, cs.type];
            		var overviewTable = $('#'+pref+'overview-table');
            		for (var i=0; i<overviewData.length; i++) {
            			overviewTable.append('<tr><td>'+overviewLabels[i]+'</td> \
            					<td>'+overviewData[i]+'</td></tr>');
            		}

            		////////////////////////////// Contigs Tab //////////////////////////////
            		$('#'+pref+'contigs').append('<table cellpadding="0" cellspacing="0" border="0" id="'+pref+'contigs-table" \
            		class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>');
            		var contigsData = [];

            		for (var pos in cs.contigs) {
            			var contig = cs.contigs[pos];
            			contigsData.push({name: contig.id, length: contig.length});
            		}
            		var contigsSettings = {
            				"sPaginationType": "full_numbers",
            				"iDisplayLength": 10,
            				"aoColumns": [
            				              {sTitle: "Contig name", mData: "name"},
            				              {sTitle: "Length", mData: "length"}
            				              ],
            				              "aaData": [],
            				              "oLanguage": {
            				            	  "sSearch": "Search contig:",
            				            	  "sEmptyTable": "No contigs found."
            				              }
            		};
            		var contigsTable = $('#'+pref+'contigs-table').dataTable(contigsSettings);
            		contigsTable.fnAddData(contigsData);

            	}).fail(function(data) {
            		container.empty();
            		container.append('<div class="alert alert-danger">'+
            				'<p>[Error] ' + data.error.message + '</p>'+'</div>');
            	});            	
            };
            ready();
            return this;
        },
        
        getData: function() {
        	return {
        		type: "NarrativeTempCard",
        		id: this.ws_id,
        		workspace: this.ws_name,
        		title: "Contig-set"
        	};
        },

        loggedInCallback: function(event, auth) {
            this.token = auth.token;
            //this.render();
            return this;
        },

        loggedOutCallback: function(event, auth) {
            this.token = null;
            //this.render();
            return this;
        },
        
        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
                function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
        }
    });
})( jQuery );
