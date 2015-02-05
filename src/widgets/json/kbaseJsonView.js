/**
 * Output widget for visualization of JSON.
 * @author Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */
(function($, undefined) {
    $.KBWidget({
        name: 'kbaseJsonView',
        parent: 'kbaseAuthenticatedWidget',
        version: '0.0.1',
        options: {
            id: null,
            ws: null,
            workspaceURL: "https://kbase.us/services/ws/",
            loadingImage: "./assets/images/ajax-loader.gif",
            width: 1045,
            height: 600
        },
        $messagePane: null,
        token: null,

        init: function(options) {
            this._super(options);
            this.pref = this.uuid();
            this.$messagePane = $("<div/>").addClass("kbwidget-message-pane kbwidget-hide-message");
            this.$elem.append(this.$messagePane);
            this.loading(false);
            this.render();
            return this;
        },

        render: function() {
            var self = this;
        	var p = kb.req('ws', 'get_objects', [{ref: this.options.ws + '/' + this.options.id}]);
        	$.when(p).done(function(data) {
        		console.log(data);
        		self.loading(true);
        		var panel = $('<div>');// style="overflow: auto; position: absolute; zoom: 1; left: 0px; top: 30px; right: 0px; bottom: 0px; border: 1px solid rgb(204, 204, 204);">');
        		self.$elem.append(panel);
        		panel.append('<h3>Metadata and Basic Info</h3><br>');
        		var c1 = $('<div id="metadata">');
        		panel.append(c1);
        		c1.JSONView(JSON.stringify(data[0].info));
			
        		panel.append('<h3>Provenance</h3><br>');
			var c3 = $('<div id="provenance">');
        		panel.append(c3);
        		c3.JSONView(JSON.stringify(data[0].provenance));
			
			// from http://stackoverflow.com/questions/1248302/javascript-object-size
			function roughSizeOfObject( object ) {
				var objectList = [];
				var stack = [ object ];
				var bytes = 0;
				while ( stack.length ) {
				    var value = stack.pop();
			    
				    if ( typeof value === 'boolean' ) {
					bytes += 4;
				    }
				    else if ( typeof value === 'string' ) {
					bytes += value.length * 2;
				    }
				    else if ( typeof value === 'number' ) {
					bytes += 8;
				    }
				    else if
				    (
					typeof value === 'object'
					&& objectList.indexOf( value ) === -1
				    )
				    {
					objectList.push( value );
			    
					for( var i in value ) {
					    stack.push( value[ i ] );
					}
				    }
				}
				return bytes;
			}
        		panel.append('<h3>Data</h3><br>');
        		var c2 = $('<div id="data">');
        		panel.append(c2);
			if (roughSizeOfObject(data[0].data)>10000) {
			    c2.append($('<pre>').append($('<code>')
					    .append(JSON.stringify(data[0].data,null,'  '))));
			} else {
			    c2.JSONView(JSON.stringify(data[0].data));
			}
        	}).fail(function(e){
        		self.loading(true);
        		self.$elem.append('<div class="alert alert-danger">'+
        				e.error.message+'</div>')
        	});
            return this;
        },
        
        getData: function() {
            return {
                type: 'JSON',
                id: this.options.id,
                workspace: this.options.ws,
                title: 'JSON'
            };
        },

        loading: function(doneLoading) {
            if (doneLoading) {
                this.hideMessage();
            } else {
                this.showMessage("<img src='" + this.options.loadingImage + "'/>");
            }
        },

        showMessage: function(message) {
            var span = $("<span/>").append(message);
            this.$messagePane.append(span);
            this.$messagePane.show();
        },

        hideMessage: function() {
            this.$messagePane.hide();
            this.$messagePane.empty();
        },

        uuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
                function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
        },

        loggedInCallback: function(event, auth) {
        	if (this.token == null) {
        		this.token = auth.token;
        		//this.render();
        	}
            return this;
        },

        loggedOutCallback: function(event, auth) {
            this.render();
            return this;
        }

    });
})( jQuery );