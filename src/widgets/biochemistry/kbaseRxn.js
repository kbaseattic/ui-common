(function( $, undefined ) {

$.KBWidget({
    name: "kbaseRxn",
    version: "1.0.0",
    options: {
    },
    init: function(options) {
        this._super(options);
        var self = this;
        var id = options.id;
       
        var container = this.$elem;

        container.loading();
        var prom = kb.req('fba', 'get_reactions',
                    {reactions: [id]});
        $.when(prom).done(function(data){
            container.rmLoading();
            loadTable(data);
        }).fail(function(e){
            container.rmLoading();
            container.append('<div class="alert alert-danger">'+
                            e.error.message+'</div>')
        });

        function loadTable(data) {
            var rxns = [];
            for (var i in data) {
                if (data[i] == null) {
                    container.append('<div class="alert alert-danger">'
                        +ids[i]+' not found</div>')
                    continue;
                }
                rxns.push(data[i].id);
            }

            rxn_tabs(data[0]);
        }
   

        function rxn_tabs(rxn, id) {
            var cpds = get_cpds(rxn['equation']);

            var panel = $('<div>');

            panel.append('<h4>'+rxn['name']+'</h4>');

            for (var i =0; i < cpds.left.length; i++) {
                var cpd = cpds.left[i];
                var img_url = 'http://bioseed.mcs.anl.gov/~chenry/jpeg/'+cpd+'.jpeg';
                panel.append('<div class="pull-left text-center">\
                                    <img src="'+img_url+'" width=150 ><br>\
                                    <div class="cpd-id" data-cpd="'+cpd+'">'+cpd+'</div>\
                                </div>');

                var plus = $('<div class="pull-left text-center">+</div>');
                plus.css('margin', '30px 0 0 0');

                if (i < cpds.left.length-1) {
                    panel.append(plus);
                }
            }

            var direction = $('<div class="pull-left text-center">'+'<=>'+'</div>');
            direction.css('margin', '25px 0 0 0');
            panel.append(direction);

            for (var i =0; i < cpds.right.length; i++) {
                var cpd = cpds.right[i];
                var img_url = 'http://bioseed.mcs.anl.gov/~chenry/jpeg/'+cpd+'.jpeg';
                panel.append('<div class="pull-left text-center">\
                                    <img src="'+img_url+'" data-cpd="'+cpd+'" width=150 ><br>\
                                    <div class="cpd-id" data-cpd="'+cpd+'">'+cpd+'</div>\
                                </div>');

                var plus = $('<div class="pull-left text-center">+</div>');
                plus.css('margin', '25px 0 0 0');

                if (i < cpds.right.length-1) {
                    panel.append(plus);
                }
            }

            var table = $('<table class="table table-striped table-bordered">');
            for (var key in rxn) {
                if (key == 'id') continue;
                if (key == 'aliases') {
                    var value = rxn[key].join('<br>')
                } else {
                    var value = rxn[key];
                }
                table.append('<tr><td>'+key+'</td><td>'+value+'</td></tr>');
            }
            panel.append(table);


            var cpd_ids = cpds.left.concat(cpds.right);
            var prom = kb.fba.get_compounds({compounds: cpd_ids});
            $.when(prom).done(function(d){
                var map = {};
                for (var i in d) {
                    map [d[i].id ] = d[i].name;
                }

                $('.cpd-id').each(function() {
                    $(this).html(map[$(this).data('cpd')])
                })
            });

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
