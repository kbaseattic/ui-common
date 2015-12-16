/**
 *	kbaseMediaEditor.js (kbaseMediaEditor)
 *
 * Authors:
 * 	nconrad@mcs.anl.gov
 *
 */

(function( $, undefined ) {

'use strict';

$.KBWidget({
    name: "kbaseMediaEditor",
    parent: "kbaseAuthenticatedWidget",
    version: "1.0.0",
    options: {
    },

    init: function(input) {
        this._super(input);
        var self = this;

        console.log('KBase media editor invoked')

        return this;
    }
})
}( jQuery ) );
