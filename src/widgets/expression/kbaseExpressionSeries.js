/**
 * Just a simple example widget to display an expression series
 * 
 */
(function( $, undefined ) {
    $.KBWidget({
        name: "kbaseExpressionSeries",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            color: "black",
        },

        init: function(options) {
            this._super(options);
            var self = this;
            var ws = options.ws;
            var name = options.name;            

            console.log('ws/name', ws, name)
            var container = this.$elem;

            container.loading();
            var p = kb.ws.get_objects([{workspace: ws, name: name}]);
            $.when(p).done(function(data){
                var reflist = data[0].refs;
		//                reflist.push(data[0].data.genome.genome_ref);

                var prom = kb.ui.translateRefs(reflist);
                $.when(prom).done(function(refhash) {
                    container.rmLoading();

                    buildTable(data, refhash)
                })
            }).fail(function(e){
                container.rmLoading();
                container.append('<div class="alert alert-danger">'+
                                e.error.message+'</div>')
            });


            function buildTable(data, refhash) {
                // setup tabs
                var pcTable = $('<table class="table table-bordered table-striped" style="width: 100%;">');

                var tabs = container.kbTabs({tabs: [
                                            {name: 'Overview', active: true},
                                            {name: 'ExpressionSeries', content: pcTable}]
                                          })

                // Code to displaying overview data
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

		var genome = Object.keys(data[0].data.genome_expression_sample_ids_map)[0];
                var phenooverdata = {
                    wsid: data[0].info[1],
                    ws: data[0].info[7],
                    kbid: data[0].data.regulome_id,
                    source: data[0].data.source,
                    genome: genome,
                    type: data[0].data.type,
                    errors: data[0].data.importErrors,
                    owner: data[0].creator,
                    date: data[0].created,
                };
                var labels = ['Name','Workspace','KBID','Source','Genome','Type','Errors','Owner','Creation date'];
                var table = kb.ui.objTable({obj: phenooverdata, keys: keys, labels: labels});
                tabs.tabContent('Overview').append(table)

                var series = data[0].data.genome_expression_sample_ids_map[genome];
		
		container.loading();
		var sample_refs = [];
		for (var i = 0; i < series.length; i++) {
		    sample_refs.push({ref: series[i]});
		}
		var p = kb.ws.get_objects(sample_refs);
		$.when(p).done(function(sample_data){
			container.rmLoading();
			// create a table from the sample names
			var tableSettings = {
			    "sPaginationType": "full_numbers",
			    "iDisplayLength": 10,
			    "aaData": sample_data,
			    "aaSorting": [[ 0, "asc" ]],
			    "aoColumns": [
			       { "sTitle": "Gene Expression Samples", 'mData': function (d) { return d.data.id}},
					  ],                         
			    "oLanguage": {
				"sEmptyTable": "No objects in workspace",
				"sSearch": "Search: "
			    }
			}
			var table = pcTable.dataTable(tableSettings);
		    }).fail(function(e){
			    container.rmLoading();
			    container.append('<div class="alert alert-danger">'+
					     e.error.message+'</div>')
				});
	    }
    

            return this;
        }
    });
})( jQuery )