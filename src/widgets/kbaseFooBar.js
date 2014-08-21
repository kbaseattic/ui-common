/**
 * @author Roman Sutormin <rsutormin@lbl.gov>
 */
(function($, undefined) {
    $.KBWidget({
        name: 'kbaseFooBar',
        parent: 'kbaseAuthenticatedWidget',
        version: '0.0.1',
        options: {
            fooBarID: null,
            workspaceID: null,
            isInCard: false,
            width: 600,
            height: 400
        },
        
        token: null,

        init: function(options) {
            this._super(options);
            this.render();
            return this;
        },

        render: function() {
            var self = this;
            self.$elem.empty();
            if (this.token) {
            	self.$elem.append("id: " + this.options.fooBarID + "<br>ws: " + this.options.workspaceID);
            } else {
            	self.$elem.append("You are not logged in!");
            }
        },

        renderError: function(error) {
            errString = "Sorry, an unknown error occurred";
            if (typeof error === "string")
                errString = error;
            else if (error.error && error.error.message)
                errString = error.error.message;
            
            var $errorDiv = $("<div>")
                            .addClass("alert alert-danger")
                            .append("<b>Error:</b>")
                            .append("<br>" + errString);
            this.$elem.empty();
            this.$elem.append($errorDiv);
        },

        getData: function() {
            return {
                type: 'FooBar',
                id: this.options.fooBarID,
                workspace: this.options.workspaceID,
                title: 'Foo bar'
            };
        },

        loggedInCallback: function(event, auth) {
        	if (this.token == null) {
        		this.token = auth.token;
        		this.render();
        	}
            return this;
        },

        loggedOutCallback: function(event, auth) {
        	this.token = null;
            this.render();
            return this;
        },
        
        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
                function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
        }
    });
})( jQuery );