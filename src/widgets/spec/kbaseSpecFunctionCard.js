(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecFunctionCard", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            id: null,
            width: 200
        },

        init: function(options) {
            this._super(options);
            var self = this;
            var $helloDiv = $("<div/>")
                            .append("Function")
                            .on("click", function(event) {
                                self.trigger("showSpecElement", 
                                    { 
                                	  kind: "storage",
                                      id: "0", 
                                      event: event
                                    }
                                )
                            });

            this.$elem.append($helloDiv);
            return this;
        }
    });
})( jQuery );
