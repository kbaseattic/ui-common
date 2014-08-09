(function( $, undefined ) {

$.KBWidget({
    name: "kbaseCpd",
    version: "1.0.0",
    options: {
    },
    init: function(options) {
        this._super(options);
        var self = this;
        var id = options.id;
        var container = this.$elem;

        container.loading()
        var prom = kb.req('fba', 'get_compounds',
                    {compounds: [id]});
        $.when(prom).done(function(data){
            container.rmLoading();
            cpd_tab(data[0]);
        }).fail(function(e){
            container.rmLoading();
            container.append('<div class="alert alert-danger">'+
                            e.error.message+'</div>')
        });
  
        function cpd_tab(cpd, id) {
            var panel = $('<div>')

            var name = cpd['name'];
            panel.append('<h4>'+name+'</h4>');

            var img_url = 'http://bioseed.mcs.anl.gov/~chenry/jpeg/'+cpd.id+'.jpeg';
            panel.append('<div class="pull-left text-center">\
                                <img src="'+img_url+'" width=300 ><br>\
                                <div class="cpd-id" data-cpd="'+cpd.id+'">'+name+'</div>\
                            </div>');

            var plus = $('<div class="pull-left text-center">+</div>');
            plus.css('margin', '30px 0 0 0');


            var table = $('<table class="table table-striped table-bordered">');
            for (var key in cpd) {
                if (key == 'id') continue;
                if (key == 'aliases') {
                    var value = cpd[key].join('<br>')
                } else {
                    var value = cpd[key];
                }
                table.append('<tr><td>'+key+'</td><td>'+value+'</td></tr>');
            }
            panel.append(table);

            container.append(panel);
        }

        function get_cpds(equation) {
            var cpds = {}
            var sides = equation.split('=');
            cpds.left = sides[0].match(/cpd\d*/g);
            cpds.right = sides[1].match(/cpd\d*/g);

            return cpds;
        }

        //this._rewireIds(this.$elem, this);
        return this;
    }  //end init
})
}( jQuery ) );
