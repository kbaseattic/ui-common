(function( $, undefined ) {
    $.KBWidget({
        name: "NarrativeTempCard",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            ws_id: null,
            ws_name: null,
            token: null,
            user_id: null
        },

        init: function(options) {
            this._super(options);

            var self = this;
            var $helloDiv = $("<div/>")
                            .append("Params:<br>" +
                            		"ws_id=" + options.ws_id + "<br>" +
                            		"ws_name=" + options.ws_name + "<br>" + 
                            		"token=" + options.token.substr(0, 30) + "...<br>" +
                                    "user_id=" + options.user_id)
                            .on("click", function(event) {
                                self.trigger("helloClick", 
                                    { 
                                      message: "hello!", 
                                      event: event
                                    }
                                );
                            });

            this.$elem.append($helloDiv);
            return this;
        },
        
        getData: function() {
                    return {
                        type: "NarrativeTempCard",
                        id: this.options.ws_name + "." + this.options.ws_id,
                        workspace: this.options.ws_name,
                        title: "Genome Annotation"
                    };
        }
    });
})( jQuery );
