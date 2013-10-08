/*


*/

(function( $, undefined ) {


    $.KBWidget(
        {

            name: "kbaseIrisTerminalWidget",
            parent: 'kbaseIrisWidget',

            version: "1.0.0",
            _accessors : [
                {name : 'input', setter : 'setInput'},
                {name : 'output', setter : 'setOutput'},
                {name : 'error', setter : 'setError'}
            ],

            options: {

            },

            setInput : function (newVal) {
            console.log("SEIT " + newVal);
                this.setEscapedText('input', newVal);
            },

            setOutput : function (newVal) {
                this.setEscapedText('output', newVal);
            },

            setError : function (newVal) {
                this.setEscapedText('error', newVal);
            },

            appendUI : function($elem) {

console.log("E IN");console.log($elem);
                var $inputDiv = $.jqElem('div')
                    .css('white-space', 'pre')
                    .css('position', 'relative')
                    .append(
                        $('<span></span>')
                            .attr('id', 'input')
                            .addClass('command')
                            .css('style', 'font-weight : bold')
//                            .text(">" + this.cwd + " " + text)
                            .kb_bind(this, 'input')
                    )
                    .mouseover(
                        function(e) {
                            $(this).children().first().show();
                        }
                    )
                    .mouseout(
                        function(e) {
                            $(this).children().first().hide();
                        }
                    )
                ;

                $inputDiv.kbaseButtonControls(
                    {
                        controls : [
                            {
                                icon : 'icon-eye-open',
                                callback :
                                    function (e) {
                                        var win = window.open();
                                        win.document.open();
                                        var output =
                                            $('<div></div>')
                                                .append(
                                                    $('<div></div>')
                                                        .css('white-space', 'pre')
                                                        .css('font-family' , 'monospace')
                                                        .append(
                                                            $(this).parent().parent().next().clone()
                                                        )
                                                )
                                        ;
                                        $.each(
                                            output.find('a'),
                                            function (idx, val) {
                                                $(val).replaceWith($(val).html());
                                            }
                                        );

                                        win.document.write(output.html());
                                        win.document.close();
                                    },
                            },
                            {
                                icon : 'icon-remove',
                                callback :
                                    function (e) {
                                        $(this).parent().parent().next().remove();
                                        $(this).parent().parent().next().remove();
                                        $(this).parent().parent().remove();
                                    }
                            },

                        ]
                    }
                );
console.log($elem);
                $elem
                    .append(
                        $inputDiv
                    )
                    .append(
                        $.jqElem('div')
                            .attr('id', 'output')
                            .kb_bind(this, 'output')
                    )
                    .append(
                        $.jqElem('div')
                            .attr('id', 'error')
                            .css('font-style', 'italic')
                            .kb_bind(this, 'error')
                    )
                ;

                this._rewireIds($elem, this);

                return $elem;

            },
        }

    );

}( jQuery ) );
