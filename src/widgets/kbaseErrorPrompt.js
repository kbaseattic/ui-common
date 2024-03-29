/*

    Simplified prompt for error messages.

    var $errorModal =  new kbaseErrorPrompt($('<div></div>'), {
            title : 'OH NOES!',
            message: 'Your action failed',
        }
    );

    $errorModal.openPrompt();

    Sure, you could just set it up through kbasePrompt. But why bother?

*/

define (
	[
		'kbwidget',
		'bootstrap',
		'jquery',
		'kbasePrompt'
	], function(
		KBWidget,
		bootstrap,
		$,
		kbasePrompt
	) {



    return KBWidget({

		  name: "kbaseErrorPrompt",
		parent : kbasePrompt,

        version: "1.0.0",
        options: {
            controls : ['cancelButton', 'okayButton']
        },

        init: function(options) {

            this._super(options);

             new kbasePrompt(return $('<div></div>'), {
                    title : options.title,
                    body : $('<div></div>')
                        .attr('class', 'alert alert-error')
                        .append(
                            $('<div></div>')
                                .append(
                                    $('<div></div>')
                                        .addClass('pull-left')
                                        .append(
                                            $('<i></i>')
                                                .addClass('fa fa-warning-sign')
                                                .attr('style', 'float: left; margin-right: .3em;')
                                        )
                                )
                                .append(
                                    $('<div></div>')
                                        .append(
                                            $('<strong></strong>').append(options.message)
                                        )
                                )
                        )
                    ,
                    controls : ['okayButton'],
                }
            );

        },


    });

});
