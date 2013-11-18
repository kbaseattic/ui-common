/*


*/

(function( $, undefined ) {


    $.KBWidget(
        {

            name: "kbaseIrisContainerWidget",
            parent: 'kbaseIrisWidget',

            version: "1.0.0",

            _accessors : [

            ],

            setInput : function( newVal) {
                this.setValueForKey('input', newVal);
                this.options.widget.setInput(newVal);
            },

            setOutput : function( newVal) {
                this.setValueForKey('output', newVal);
                this.options.widget.setOutput(newVal);
            },

            setError : function( newVal) {
                this.setValueForKey('error', newVal);
                this.options.widget.setError(newVal);
            },

            setValue : function( newVal) {
                this.setValueForKey('value', newVal);
                this.options.widget.setValue(newVal);
            },

            init : function (options) {
                this._super(options);

//            observe : function($target, attribute, callback) {
            this.observe(
                this.options.widget,
                'didChangeValueForInput',
                function (e, $target, vals) {
                    this.setValueForKey('input', vals.newValue);
                }
            );

            this.observe(
                this.options.widget,
                'didChangeValueForOutput',
                function (e, $target, vals) {
                    this.setValueForKey('output', vals.newValue);
                }
            );

            this.observe(
                this.options.widget,
                'didChangeValueForError',
                function (e, $target, vals) {
                    this.setValueForKey('error', vals.newValue);
                }
            );

            this.observe(
                this.options.widget,
                'didChangeValueForValue',
                function (e, $target, vals) {
                    this.setValueForKey('value', vals.newValue);
                }
            );

                return this;
            },

            render : function () {
                if (this.options.widget.render) {
                    this.options.widget.render();
                }
            },

            appendUI : function($elem) {

                $elem.kbaseButtonControls(
                    {
                        context : this,
                        controls : [
                            /*{
                                icon : 'icon-eye-open',
                                callback :
                                    function (e, $it) {
                                        $it.viewOutput();
                                    },
                            },*/
                            {
                                icon : 'icon-remove',
                                callback :
                                    function (e) {
                                        $elem.remove();
                                    }
                            },

                        ]
                    }
                );

                $elem.append( this.options.widget.$elem)
                ;

                this._rewireIds($elem, this);

                return $elem;

            },

        }

    );

}( jQuery ) );
