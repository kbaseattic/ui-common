(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecTypeCard", 
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
                            .append("Type")
                            .on("click", function(event) {
                                self.trigger("showSpecElement", 
                                    { 
                                	  kind: "function",
                                      id: "TestFunction", 
                                      event: event
                                    }
                                )
                            });

            this.$elem.append($helloDiv);
            return this;
        }
    });
})( jQuery );
