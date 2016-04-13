define (
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
        name: "kbaseCameraSupport",
        parent : kbaseWidget,
        version: "1.0.0",
        options: {
            color: "black",
        },

        init: function(options) {
            this._super(options);

            var self = this;



            this.$elem.append('Camera support not yet enabled');



            return this;
        }

    });
});
