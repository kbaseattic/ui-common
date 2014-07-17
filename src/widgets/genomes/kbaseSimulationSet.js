/**
 * Just a simple example widget - makes a div with "Hello world!"
 * in a user-defined color (must be a css color - 'red' or 'yellow' or '#FF0000')
 */
(function( $, undefined ) {
    $.KBWidget({
        name: "kbaseSimulationSet",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            color: "black",
        },

init: function(options) {
            this._super(options);
            var self = this;
            var data = options.data
            data = $.extend(data,{});
            console.log (data[0])
            //this.$elem.append(JSON.stringify(data))
            //console.log(data[0].data.id, data[0].info[7]);
            var simu = data[0].data;
                    
/*
                var table = $('<table class="table table-striped table-bordered">');
                
                	for (var i = 0; i < data[0].data.phenotypeSimulations.length; i++) {
                    	 var pheno_id = data[0].data.phenotypeSimulations[i].id;
                    	  var pheno_class = data[0].data.phenotypeSimulations[i].class;

                    	table.append('<tr><td>'+pheno_id+'</td>'+</tr>')
               
                	}

                this.$elem.append (table)
*/
  
                var container = this.$elem;
                var simuTable = $('<table class="table table-bordered table-striped" style="width: 100%;">');
                var tabs = container.tabs({tabs: [
                                            {name: 'Overview', active: true},
                                            {name: 'SimulationSet', content: simuTable}]
                                          })

                var keys = [
                    {key: 'wsid'},
                    {key: 'ws'},
                    {key: 'kbid'},
                    {key: 'source'},
                    {key: 'type'},
                    {key: 'errors'},
                    {key: 'owner'},
                    {key: 'date'}
                ];

                var simudata = {
                    wsid: data[0].info[1],
                    ws: data[0].info[7],
                    kbid: simu.id,
                    source: simu.phenoclass,
                    type: simu.simulatedGrowth,
                    errors: simu.simulatedGrowthFraction,
                    owner: data[0].creator,
                    date: data[0].created,
                };

                var labels = ['Name','Workspace','KBID','Type','Errors','Owner','Creation date'];
                var table = kb.ui.objTable('overview-table',simudata,keys,labels);
                tabs.tabContent('Overview').append(table)

                var tableSettings = {
					 "sPaginationType": "bootstrap",
					 "iDisplayLength": 10,
					 "aaData": simu.phenotypeSimulations,
					 "aaSorting": [[ 3, "desc" ]],
					 "aoColumns": [
					   { "sTitle": "Name", 'mData': 'id'},
					   { "sTitle": "phenoclass", 'mData': function(d) {
						 return d.phenoclass;
					   }},
					   { "sTitle": "Simulated Growth", 'mData': function(d) {
						 return d.simulatedGrowth
					   }},
					   { "sTitle": "Simulated Growth Fraction", 'mData': function(d) {
						 return d.simulatedGrowthFraction
					   }},
					  ],                         
					 
				}


				simuTable.dataTable(tableSettings);

                       

            return this;
            
        }
 

    });
})( jQuery )