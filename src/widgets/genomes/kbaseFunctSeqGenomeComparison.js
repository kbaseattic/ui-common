/**
 * Just a simple example widget to display phenotypedata
 * 
 */
(function( $, undefined ) {
    return KBWidget({
        name: "kbaseFunctGenomeComparison",
        
        version: "1.0.0",

        init: function(options) {
            this._super(options);
            var self = this;
            var ws = options.ws;
            var name = options.name;            


            var container = this.$elem;


            container.append('coming soon');
          

            return this;
        }
    });
})( jQuery )