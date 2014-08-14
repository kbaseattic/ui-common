

angular.module('communities-directives', []);
angular.module('communities-directives')
.directive('metagenome', function($stateParams) {
    return {
        link: function(scope, ele, attrs) {
            $(ele).loading();
            var prom = kb.ws.get_objects([{workspace: scope.ws, name: scope.id}])
            $.when(prom).done(function(d) {
                 $(ele).rmLoading();

                 var metagenome_id = d[0].data.metagenome_id;

                 $(ele).append('<a href="'+kb.metagenome_url+'" target="_blank">'+metagenome_id+'</a>')
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
                    //"sPaginationType": "full_numbers",
                    "iDisplayLength": 10,
                    "aaData": data.rows,
                    //"fnDrawCallback": events,
                    "aoColumns": [
                      { "sTitle": 'Data', 'mData': function(d){
                        return d.id;
                      }},

                  ],                         
                    "oLanguage": {
                        "sSearch": "Search: "
                    }
                }
                var table = $('<table class="table table-bordered table-striped" style="width: 100%;">');
                $(ele).append(table);
                table.dataTable(tableSettings)
            }
        }
    }
})

