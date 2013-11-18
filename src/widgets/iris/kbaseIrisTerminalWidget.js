/*


*/

(function( $, undefined ) {


    $.KBWidget(
        {

            name: "kbaseIrisTerminalWidget",
            parent: 'kbaseIrisWidget',

            version: "1.0.0",

            _accessors : [

            ],

            options: {
                subCommand : false,
            },

            appendUI : function($elem) {

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
                        context : this,
                        controls : [
                            {
                                icon : 'icon-eye-open',
                                callback :
                                    function (e, $it) {
                                        $it.viewOutput();
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
                    return;
                }

                if (subCommand) {
                    this.data('inputContainer').css('color', 'gray');
                }
                else {
                    this.data('inputContainer').css('color', 'black');
                }

                this._super(subCommand);

            },
        }

    );

}( jQuery ) );
