(function( $, undefined ) {

$.KBWidget({
    name: "kbaseModelTabs",    
    version: "1.0.0",
    options: {
    },

    getData: function() {
        return {
            id: this.options.id,
            type: "Model",
            workspace: this.options.ws,
            title: this.options.title
        };
    },

    init: function(options) {
        this._super(options);
        var self = this;        
        var models = options.id;
        var ws = options.ws;
        var name = options.name;
        var data = options.modelsData;
        var token = options.token;

        var container = this.$elem;

        var tables = ['Reactions', 'Compounds', 'Compartment', 'Biomass', 'Gapfill', 'Gapgen'];

        /*var rxnTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">');

        var tabs = container.kbTabs({tabs: [{name: 'Reactions', content: rxnTable, active: true},
                                           {name: 'Compounds', content: cpdTable},
                                          {name: 'Compartment', content: compartTable},
                                           {name: 'Biomass', content: biomassTable},
                                           {name: 'Gapfill', content: gfTable},
                                           {name: 'Gapgen', content: ggTable}
                                  ]});*/

        container.append(ws+' '+name);

        //this._rewireIds(this.$elem, this);
        return this;
    }  //end init
})
}( jQuery ) );
