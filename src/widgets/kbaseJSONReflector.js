/**

    A simple debugging widget which simply spits out pretty formatted JSON of whatever was handed into it.

    $('<div>').kbaseJSONReflector(
        {
            a : 'b',
            c : 'd',
            e : [1,2,3]
        }
    );
*/
kb_define('kbaseJSONReflector',
    [
        'jquery',
    	'kbwidget'
    ],
    function ($) {

    $.KBWidget({
        name: "kbaseJSONReflector",
        version: "1.0.0",
        options: {

        },

        init: function(options) {

            this._super(options);

            this.$elem.append($.jqElem('div').css('white-space', 'pre').append(JSON.stringify(options, undefined, 2)));

            return this;
        },

    });

});
