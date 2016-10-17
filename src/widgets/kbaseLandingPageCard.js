/**
 * A simple mechanism for embedding widgets into cards for the data landing pages.
 * A "card" in this case, is just a somewhat glorified jQuery-ui dialog.
 *
 * These kinds of cards should not be just instantiated on their own, but handled by a
 * manager - either the kbaseCardManager, or a derivative (kbaseGenomeCardManager, etc.).
 * Thus, cards should 
 */define (
	[
		'kbwidget',
		'bootstrap',
		'jquery',
		'kbwidget'
	], function(
		KBWidget,
		bootstrap,
		$,
		KBWidget
	) {


    return KBWidget({
        name: "LandingPageCard", 
        
        version: "1.0.0",
        options: { 
            resizable: true,
            draggable: true,
            autoOpen: true,
            closeOnEscape: false,
            position: null,
            id: 0
        },

        init: function(options) {
            this._super(options);

            if (this.options.position === null) {
                this.options.position = {
                    my: "center",
                    at: "center"
                };
            }

            var self = this;

            //console.log(options);
            if (options.hasOwnProperty("dialogClass") && options.dialogClass !== null) {
                this.options.dialogClass = options.dialogClass;
            }
            
            this.options.close = function(event, ui) {
                self.$elem.dialog("destroy");
                self.$elem.remove();
                $(document).trigger("kbaseCardClosed", self.options.id);
            };

            this.$elem.addClass("kblpc");
            this.$elem.dialog(this.options);
            return this;
        },

        close: function(options) {
            this.$elem.dialog("close");
        },

        destroy: function(options) {
            this.$elem.dialog("destroy");
            this.$elem.remove();
        }
    });


});
