
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
            var container = this.$elem
            var ws = options.ws;
            var name = options.name;

            console.log('ws/name', ws, name)

            container.loading();
            var p = kb.ws.get_objects([{workspace: ws, name: name}])
            $.when(p).done(function(data){
                container.rmLoading();
                buildTable(data);
            }).fail(function(e){
                container.rmLoading();
                container.append('<div class="alert alert-danger">'+
                                e.error.message+'</div>')
            });                    

            function buildTable(data) {
                var simu = data[0].data;
                console.log(simu)

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

                var simu_table = $('<table class="table table-striped table-bordered">')
                container.append(simu_table)
                simu_table.dataTable(tableSettings);
            }

            return this;
            
        }
 

    });
})( jQuery )