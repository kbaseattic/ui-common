(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecModuleCard", 
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
                            .append("Module")
                            .on("click", function(event) {
                                self.trigger("showSpecElement", 
                                    { 
                                	  kind: "type",
                                      id: "TestType", 
                                      event: event
                                    }
                                )
                            });

            this.$elem.append($helloDiv);
            return this;
        }
    });
})( jQuery );
