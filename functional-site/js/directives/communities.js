

angular.module('communities-directives', []);
angular.module('communities-directives')
.directive('metagenome', function($stateParams) {
    return {
        link: function(scope, ele, attrs) {
            scope.ws = $stateParams.ws;
            scope.name = $stateParams.name;

            $(ele).loading();
            var prom = kb.ws.get_objects([{workspace: scope.ws, name: scope.name}])
            $.when(prom).done(function(d) {
                 $(ele).rmLoading();
                 console.log(d)
                 var metagenome_id = d[0].data.metagenome_id;
                 url = "./communities/metagenome.html?metagenome="+metagenome_id;
                 $(ele).append('<a href="'+url+'" target="_blank">'+metagenome_id+'</a>')
             })
        }
    }
})
.directive('comunitiesCollection', function() {
    return {
        link: function(scope, ele, attrs) {

        }
    }
})
.directive('comunitiesProfile', function() {
    return {
        link: function(scope, ele, attrs) {
                $(ele).append('hello');
        }
    }
})

