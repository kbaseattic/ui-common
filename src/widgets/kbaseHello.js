/**
 * Just a simple example widget - makes a div with "Hello world!"
 * in a user-defined color (must be a css color - 'red' or 'yellow' or '#FF0000')
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
        name: "HelloWidget",
        
        version: "1.0.0",
        options: {
            color: "black",
        },

        init: function(options) {
            this._super(options);

            var self = this;



            this.$elem.append(options.data[0]);



            return this;
        }

    });
});
