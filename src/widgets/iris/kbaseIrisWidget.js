/*


*/

(function( $, undefined ) {


    $.KBWidget(
        {

            name: "kbaseIrisWidget",
            parent: 'kbaseAuthenticatedWidget',

            version: "1.0.0",
            _accessors : [
                'promise',
                {name : 'input', setter : 'setInput'},
                {name : 'output', setter : 'setOutput'},
                {name : 'error', setter : 'setError'},
                {name : 'cwd', setter : 'setCwd'}
            ],
            options: {

            },

            init: function(options) {

                this._super(options);

                this.appendUI( $( this.$elem ) );

                return this;

            },

            setValue : function(newVal) {
                this.setValueForKey('value', newVal);
            },

            setInput : function (newVal) {
                this.setEscapedText('input', newVal);
            },

            setOutput : function (newVal) {
                this.setEscapedText('output', newVal);
            },

            setError : function (newVal) {
                this.setEscapedText('error', newVal);
            },

            setCwd : function (newVal) {
                this.setEscapedText('cwd', newVal);
            },

            escapeText : function (newVal) {
                if (typeof newVal == 'string') {
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
                    newVal = $.jqElem('span').append(newVal);
                }

                return newVal;
            },

            setEscapedText : function (key, newVal) {
                newVal = this.escapeText(newVal);
                this.setValueForKey(key, newVal);
            },

        }

    );

}( jQuery ) );
