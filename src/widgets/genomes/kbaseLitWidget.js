(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseLitWidget", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            genomeID: null,
            loadingImage: "../../widgets/images/ajax-loader.gif",
            isInCard: false,
        },

		init: function(options) {
			this._super(options);

			if (this.options.row === null) {
				//throw an error
				return;
			}				
            return this.render();
		},
		
		render: function(options) {
			
			self = this
			var lit = self.options.literature
			console.log(lit)
			
			var literature = $.get(lit,
				function(data) {
					console.log(data)
				})
			return this;
		},
		
	    getData: function() {
            return {
                type: "LitWidget",
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: "Literature Widget"
            };
        },
	});
})(jQuery);