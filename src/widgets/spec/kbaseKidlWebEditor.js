/**
 * @author Roman Sutormin <rsutormin@lbl.gov>
 */
(function($, undefined) {
    $.KBWidget({
        name: 'kbaseKidlWebEditor',
        parent: 'kbaseAuthenticatedWidget',
        version: '0.0.1',
        options: {
            type: null,
            mod: null,
            isInCard: false,
            width: 900,
            height: 600,
            wsUrl: null  //"http://dev04.berkeley.kbase.us:7058"
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
            	var elemId = self.$elem.attr("id");
            	var config = {token: this.token, moduleName: self.options.mod, 
            			typeName: self.options.type, wsUrl: self.options.wsUrl};
            	$(function() {
                	var card = self.$elem.parent();
                	var cmp = $("#" + elemId);
                	card.on( "resize", function( event, ui ) {
                		//var w = card.width();
                		//var h = card.height();
                		var resize = config["resize"];
                		if (resize)
                   			resize();
                	});
              	});
            	var oldDocumentWrite = document.write;
            	document.write = function(node) {
            		$("body").append(node);
                };
            	require(['../src/widgets/spec/ace/ace', 
            	         '../src/widgets/spec/ace/theme-eclipse', 
            	         '../src/widgets/spec/ace/ext-language_tools_fixed', 
            	         '../src/widgets/spec/ace/mode-kidl', 
            	         '../src/widgets/spec/ace/ext-searchbox', 
            	         '../src/widgets/spec/ace/ext-keybinding_menu_fixed'], 
            	        function() {
                			require(['../src/widgets/spec/editor/kidlwebeditor.nocache'], function() {
                				setTimeout(function() {
                					document.write = oldDocumentWrite;
                				}, 100);
                			});
            			}
            	);
                if (window.addKidlWebEditor) {
            	    window.addKidlWebEditor(elemId, config);
                } else {
                	if (!window.kildWebEditorMap)
                		window.kildWebEditorMap = {};
                	window.kildWebEditorMap[elemId] = config;
                }
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
                type: 'KidlWebEditor',
                id: this.options.mod,
                workspace: "type editor",
                title: 'Specification editor'
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