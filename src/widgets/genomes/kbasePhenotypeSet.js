/**
 * Just a simple example widget - makes a div with "Hello world!"
 * in a user-defined color (must be a css color - 'red' or 'yellow' or '#FF0000')
 */
(function( $, undefined ) {
    $.KBWidget({
        name: "kbasePhenotypeSet",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            color: "black",
        },

		translaterefs: function(reflist,refhash) {
			var obj_refs = []
        	for (var i in reflist) {
                obj_refs.push({ref: reflist[i]})
            }
        	var prom = kb.ws.get_object_info(obj_refs)
			$.when(prom).done(function(refinfo) {
        	    for (var i=0; i<refinfo.length; i++) {
        	    	var item = refinfo[i];
        	    	var full_type = item[2];
        	    	var module = full_type.split('.')[0];
					var type = full_type.slice(full_type.indexOf('.')+1);
					var kind = type.split('-')[0];
        	    	var label = item[7]+"/"+item[1];
        	    	switch (kind) {
						case 'FBA': 
							route = 'ws.fbas';
							break;
						case 'FBAModel': 
							route = 'ws.mv.model';
							break;
						case 'Media': 
							route = 'ws.media';
							break;
						case 'Genome': 
							route = 'ws.genome';
							break;
						case 'MetabolicMap': 
							route = 'ws.maps';
							break;
						case 'PhenotypeSet': 
							route = 'ws.phenotype';
							break; 
					}
					var url = route+"({ws:'"+item[7]+"', id:'"+item[1]+"'})";
        	    	var link = '<a ui-sref="'+url+'">'+label+'</a>'
        	    	refhash[reflist[i]] = link;
        		}
			})
			return prom;
		},

        init: function(options) {
            this._super(options);
            var self = this;
            var data = options.data
            data = $.extend(data,{})
        	var reflist = data[0].refs;
        	reflist.push(data[0].data.genome_ref);
        	var refhash = {};
        	var prom = this.translaterefs(reflist,refhash);
        	var container = this.$elem;
        	$.when(prom).done(function() {
				var tables = ['Overview', 'Phenotypes'];
				var tableIds = ['overview', 'phenotypes'];
				// build tabs
				var tabs = $('<ul id="table-tabs" class="nav nav-tabs"> \
								<li class="active" > \
								<a href="#'+tableIds[0]+'" data-toggle="tab" >'+tables[0]+'</a> \
							  </li></ul>');
				for (var i=1; i<tableIds.length; i++) {
					tabs.append('<li><a href="#'+tableIds[i]+'" data-toggle="tab">'+tables[i]+'</a></li>');
				}
				// add tabs
				container.append(tabs);
			
				var tab_pane = $('<div id="tab-content" class="tab-content">')
				// add table views (don't hide first one)
				tab_pane.append('<div class="tab-pane in active" id="'+tableIds[0]+'"> \
									<table cellpadding="0" cellspacing="0" border="0" id="'+tableIds[0]+'-table" \
									class="table table-bordered table-striped" style="width: 100%;"></table>\
								</div>');

				for (var i=1; i<tableIds.length; i++) {
					var tableDiv = $('<div class="tab-pane in" id="'+tableIds[i]+'"> ');
					var table = $('<table cellpadding="0" cellspacing="0" border="0" id="'+tableIds[i]+'-table" \
									class="table table-striped table-bordered">');
					tableDiv.append(table);
					tab_pane.append(tableDiv);
				}

				container.append(tab_pane)

				// event for showing tabs
				$('#table-tabs a').click(function (e) {
					e.preventDefault();
					$(this).tab('show');
				})
			
				// Code to displaying phenotype overview data
				var keys = [
					{key: 'wsid'},
					{key: 'ws'},
					{key: 'kbid'},
					{key: 'source'},
					{key: 'genome'},
					{key: 'type'},
					{key: 'errors'},
					{key: 'owner'},
					{key: 'date'}
				];
				var phenooverdata = {
					wsid: data[0].info[1],
					ws: data[0].info[7],
					kbid: data[0].data.id,
					source: data[0].data.source,
					genome: refhash[data[0].data.genome_ref],
					type: data[0].data.type,
					errors: data[0].data.importErrors,
					owner: data[0].creator,
					date: data[0].created,
				};
				var labels = ['Name','Workspace','KBID','Source','Genome','Type','Errors','Owner','Creation date'];
				var table = kb.ui.objTable('overview-table',phenooverdata,keys,labels);
				container.find('#overview-table').append(table.find('tbody'));
				//Code for loading the phenotype list table
				pheno = data[0].data;
				var tableSettings = {
					 "sPaginationType": "bootstrap",
					 "iDisplayLength": 10,
					 "aaData": pheno.phenotypes,
					 "aaSorting": [[ 3, "desc" ]],
					 "aoColumns": [
					   { "sTitle": "Name", 'mData': 'name'},
					   { "sTitle": "Media", 'mData': function(d) {
						 return refhash[d.media_ref];
					   }},
					   { "sTitle": "Gene KO", 'mData': function(d) {
						 return d.geneko_refs.join("<br>")
					   }},
					   { "sTitle": "Additional compounds", 'mData': function(d) {
						 return d.additionalcompound_refs.join("<br>")
					   }},
					   { "sTitle": "Growth", 'mData': 'normalizedGrowth'},
					 ],                         
					 "oLanguage": {
						 "sEmptyTable": "No objects in workspace",
						 "sSearch": "Search: "
					 },
					 //'fnDrawCallback': events
				}
				var table = $('#phenotypes-table').dataTable(tableSettings);
			})
            return this;
        }

    });
})( jQuery )