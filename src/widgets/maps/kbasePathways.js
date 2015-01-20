(function( $, undefined ) {

$.KBWidget({
    name: "kbasePathways",     
    version: "1.0.0",
    options: {
    },
    
    init: function(options) {
        var map_ws = 'nconrad:paths';;
        var container = this.$elem;

        var model_ws = options.model_ws;
        var model_name = options.model_name;
        var fba_ws = options.fba_ws;
        var fba_name = options.fba_name;

        // add tabs
        var selectionTable = $('<table cellpadding="0" cellspacing="0" border="0" \
            class="table table-bordered table-striped">');
        var tabs = container.kbTabs({tabs: [
                                        {name: 'Selection', content: selectionTable, active: true} 
                                    ]});


        this.load_map_list = function() {
            // load table for maps
            container.loading();
            var p = kb.ws.list_objects({workspaces: [map_ws], includeMetadata: 1})
            $.when(p).done(function(d){
                container.rmLoading();


                var tableSettings = {
                    "aaData": d,
                    "fnDrawCallback": events,
                    "aaSorting": [[ 1, "asc" ]],
                    "aoColumns": [
                        { sTitle: 'Name', mData: function(d) {
                            return '<a class="pathway-link" data-map_id="'+d[1]+'">'+d[10].name+'</a>';
                        }}, 
                        { sTitle: 'Map ID', mData: 1},
                        { sTitle: 'Rxn Count', sWidth: '10%', mData: function(d){
                            if ('reaction_ids' in d[10]){
                                return d[10].reaction_ids.split(',').length;
                            } else {
                                return 'N/A';
                            }
                        }},
                        { sTitle: 'Cpd Count', sWidth: '10%', mData: function(d) {
                            if ('compound_ids' in d[10]) {
                                return d[10].compound_ids.split(',').length;
                            } else {
                                return 'N/A';
                            }
                        }} , 
                        { sTitle: "Source","sWidth": "10%", mData: function(d) {
                            return "KEGG";
                        }},
                    ],                         
                    "oLanguage": {
                        "sEmptyTable": "No objects in workspace",
                        "sSearch": "Search:"
                    }
                }


                var table = selectionTable.dataTable(tableSettings);  

            }).fail(function(e){
                container.prepend('<div class="alert alert-danger">'+
                            e.error.message+'</div>')
            });
        }

        this.load_map_list();



        function events() {
            // event for clicking on pathway link
            container.find('.pathway-link').unbind('click')
            container.find('.pathway-link').click(function() {
                var map_id = $(this).data('map_id');
                var name = $(this).text();
                var exists;

                var container = $('<div id="path-'+map_id+'">');
                container.loading();
                tabs.addTab({name: name, removable: true, content: container});
                load_map(map_id, container);
                tabs.showTab(name);
            });

            // tooltip for hover on pathway name
            container.find('.pathway-link')
                     .tooltip({title: 'Open path tab', 
                               placement: 'right', delay: {show: 1000}});
        } // end events

        function load_map(map, container) {                       
            container.kbasePathway({model_ws: model_ws,
                                    model_name: model_name,
                                    fba_ws: fba_ws,
                                    fba_name: fba_name,                                    
                                    map_ws: map_ws,
                                    map_name: map,
                                    editable: (options.editable ? true : false),
                                })
        }

        return this;

    }  //end init

})
}( jQuery ) );



