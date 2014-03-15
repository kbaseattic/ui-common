/**
 * A simple image viewer widget.
 * Takes a URL for an image as input and displays it.
 * Optionally compacts the image to given width and or height parameters.
 *
 */
(function( $, undefined ) {
    $.KBWidget({
        name: 'kbaseFrame',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            url: null,
            id: 'kb-frame'
        },

        init: function(options) {
            this._super(options);

            if (this.options.imageUrl === null) {
                this.showError('No URL given!');
            }
            else {
                var $frame = $('<iframe id="' + this.options.id + '">')
                           .attr({ 'src' : this.options.url,
                                   'width' : '100%',
                                   'height' : '100%'});

                this.$elem.append($frame);
            }

            return this;
        },

        showError: function(error) {
            this.$elem.append(error);
        },

        getData: function() {
            return {
                id: null,
                workspace: null,
                title: "Test Frame"
            }
        },
    });
})( jQuery )