/**
 * A simple image viewer widget.
 * Takes a URL for an image as input and displays it.
 * Optionally compacts the image to given width and or height parameters.
 *
 */
(function( $, undefined ) {
    $.KBWidget({
        name: 'kbaseImageViewer',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            imageUrl: null,
            height: null,
            width: null
        },

        init: function(options) {
            this._super(options);

            if (this.options.imageUrl === null) {
                this.showError('No image URL given!');
            }
            else {
                var $img = $('<img>')
                           .attr('src', this.options.imageUrl);

                if (this.options.height)
                    $img.attr('height', this.options.height);

                if (this.options.width)
                    $img.attr('width', this.options.width);
                this.$elem.append($img);
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
                title: "Test Image"
            }
        }
    });
})( jQuery )