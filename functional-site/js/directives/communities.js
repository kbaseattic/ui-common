

angular.module('communities-directives', []);
angular.module('communities-directives')
.directive('metagenome', function($stateParams) {
    return {
        link: function(scope, ele, attrs) {

            // fetch data to get metagenome id
            $(ele).loading();
            var prom = kb.ws.get_objects([{workspace: scope.ws, name: scope.id}])
            $.when(prom).done(function(d) {
                var metagenome_id = d[0].data.metagenome_id;
                

                // use metagenome id to fetch metadata on obj
                var url = 'http://api.metagenomics.anl.gov/metagenome/'+metagenome_id+'?verbosity=mixs';
                $.get(url, function(data) {
                    $(ele).rmLoading();

                    var keys = [{key: 'PI_firstname'},
                                {key: 'status'},
                                {key: 'sequence_type'},
                                {key: 'collection_date'},
                                {key: 'feature'},
                                {key: 'PI_lastname'},
                                {key: 'latitude'},
                                {key: 'biome'},
                                {key: 'id', format: function(d) {
                                    return '<a href="'+kb.metagenome_url+d.id+'" target="_blank">'+d.id+'</a>';
                                }},
                                {key: 'project_name'},
                                {key: 'project_id'},
                                {key: 'env_package_type'},
                                {key: 'country'},
                                {key: 'longitude'},
                                {key: 'location'},
                                {key: 'name'},
                                {key: 'seq_method'},
                                {key: 'created'},
                                {key: 'material'}];

                    var table = kb.ui.objTable({keys: keys,
                                                obj: data,
                                                keysAsLabels: true,
                                                bold: true});
                    $(ele).append(table);
                })
            })
        }
    }
})
.directive('communitiesCollection', function() {
    return {
        link: function(scope, ele, attrs) {
            $(ele).loading();

            var prom = kb.ws.get_objects([{workspace: scope.ws, name: scope.id}])
            $.when(prom).done(function(d) {
                $(ele).rmLoading();       
                var data = d[0].data;

                scope.name = data.name;
                scope.created = data.created;
                scope.members = data.members;
                scope.$apply();
            })
        }
    }
})
.directive('communitiesProfile', function() {
    return {
        link: function(scope, ele, attrs) {

            $(ele).loading();

            var prom = kb.ws.get_objects([{workspace: scope.ws, name: scope.id}])
            $.when(prom).done(function(d) {
                $(ele).rmLoading();

                var data = JSON.parse(d[0].data.data);
                buildTable(data);
            })

            function buildTable(data) {
                console.log(data.rows)
                var tableSettings = {
                    "sPaginationType": "bootstrap",
                    "iDisplayLength": 10,
                    "aaData": data.rows,
                    //"fnDrawCallback": events,
                    "aoColumns": [
                      { "sTitle": 'Data', 'mData': function(d){
                        return d.id;
                      }},
                  ],
                }
                var table = $('<table class="table table-bordered table-striped" style="width: 100%;">');
                $(ele).append(table);
                table.dataTable(tableSettings)
            }
        }
    }
})

