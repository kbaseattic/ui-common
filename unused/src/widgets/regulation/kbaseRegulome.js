/**
 * Just a simple example widget to display regulomes
 * 
 */
(function( $, undefined ) {
    $.KBWidget({
        name: "kbaseRegulome",
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
                reflist.push(data[0].data.genome.genome_ref);

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
                                            {name: 'Regulome', content: pcTable}]
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
                var phenooverdata = {
                    wsid: data[0].info[1],
                    ws: data[0].info[7],
                    kbid: data[0].data.regulome_id,
                    source: data[0].data.source,
                    genome: refhash[data[0].data.genome.genome_ref].link,
                    type: data[0].data.type,
                    errors: data[0].data.importErrors,
                    owner: data[0].creator,
                    date: data[0].created,
                };
                var labels = ['Name','Workspace','KBID','Source','Genome','Type','Errors','Owner','Creation date'];
                var table = kb.ui.objTable({obj: phenooverdata, keys: keys, labels: labels});
                tabs.tabContent('Overview').append(table)

		    // reformat the data into one row per TF/TG pair
                var regulome = data[0].data;
		var rdata = [];

		for (var i=0; i < regulome.regulons.length; i++) {
		    var pair = regulome.regulons[i];
		    for (var j=0; j < pair.tfs.length; j++) {
			var operons = pair.operons;
			for (var k=0; k < operons.length; k++) {
			    for (var l=0; l < operons[k].genes.length; l++) {
				rdata.push([pair.tfs[j].locus_tag,pair.tfs[j].name,operons[k].genes[l].locus_tag,operons[k].genes[l].name]);
			    }
			}
		    }
		}
		console.log(rdata);

		// create a table from the reformatted promconstraint data
                var tableSettings = {
                     "sPaginationType": "full_numbers",
                     "iDisplayLength": 10,
                     "aaData": rdata,
                     "aaSorting": [[ 0, "asc" ]],
                     "aoColumns": [
		       { "sTitle": "Transcription Factor Locus", 'mData': function (d) { return d[0]}},
		       { "sTitle": "Transcription Factor Name", 'mData': function (d) { return d[1]}},
		       { "sTitle": "Target Gene Locus", 'mData': function (d) { return d[2]}},
		       { "sTitle": "Target Gene Name", 'mData': function (d) { return d[3]}},
                     ],                         
                     "oLanguage": {
                         "sEmptyTable": "No objects in workspace",
                         "sSearch": "Search: "
                     }
                }
                var table = pcTable.dataTable(tableSettings);

	    }
    

            return this;
        }
    });
})( jQuery )