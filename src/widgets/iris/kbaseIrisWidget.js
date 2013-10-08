/*


*/

(function( $, undefined ) {


    $.KBWidget(
        {

            name: "kbaseIrisWidget",
            parent: 'kbaseAuthenticatedWidget',

            version: "1.0.0",
            _accessors : ['input', 'output', 'promise'],
            options: {

            },

            init: function(options) {

                this._super(options);

                this.appendUI( $( this.$elem ) );

                return this;

            },

            setEscapedText : function (key, newVal) {
            console.log("KEY : " + key);
                if (typeof newVal == 'string') {
                console.log("IS STRING");
                    newVal = newVal.replace(/</g, '&lt;');
                    newVal = newVal.replace(/>/g, '&gt;');
                    newVal = $.jqElem('span')
                        .append(
                            $.jqElem('span')
                            .css('white-space', 'pre')
                            .append(newVal)
                        );
                }
                else {
                console.log("IS OBJ");
                    newVal = $.jqElem('span').append(newVal);
                }
console.log("VAL IS NOW : " + newVal);
                this.setValueForKey(key, newVal);
            },

        }

    );

}( jQuery ) );
