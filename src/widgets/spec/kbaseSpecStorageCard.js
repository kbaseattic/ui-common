(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecStorageCard", 
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
                            .append("Storage")
                            .on("click", function(event) {
                                self.trigger("showSpecElement", 
                                    { 
                                	  kind: "module",
                                      id: "TestModule", 
                                      event: event
                                    }
                                )
                            });

            this.$elem.append($helloDiv);
            return this;
        }
    });
})( jQuery );
