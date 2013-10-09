/*


*/

(function( $, undefined ) {


    $.KBWidget(
        {

            name: "kbaseIrisTerminalWidget",
            parent: 'kbaseIrisWidget',

            version: "1.0.0",

            _accessors : [
                {name : 'subCommand', setter : 'setSubCommand'}
            ],

            options: {
                subCommand : false,
            },

            appendUI : function($elem) {

console.log("E IN");console.log($elem);
                var $inputDiv = $.jqElem('div')
                    .css('white-space', 'pre')
                    .css('position', 'relative')
                    .css('style', 'font-weight : bold')
                    .append('&gt;')
                    .append(
                        $.jqElem('span')
                            .attr('id', 'cwd')
                            .addClass('command')
                            .kb_bind(this, 'cwd')
                    )
                    .append('&nbsp;')
                    .append(
                        $.jqElem('span')
                            .attr('id', 'input')
                            .addClass('command')
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

                $elem
                    .append(
                        $inputDiv
                            .attr('id', 'inputContainer')
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

            setSubCommand : function(subCommand) {

                if (this.data('inputContainer') == undefined) {
                console.log("NO INPUT CONTAINER!");
                    return;
                }

                if (subCommand) {
                console.log("SC");
                    this.data('inputContainer').css('color', 'gray');
                }
                else {
                console.log("is C");
                    this.data('inputContainer').css('color', 'black');
                }

            },
        }

    );

}( jQuery ) );
