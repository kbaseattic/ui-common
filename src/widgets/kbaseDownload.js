kb_define('kbaseDownload',
    [
        'jquery',
    	'kbwidget'
    ],
    function ($) {

    $.KBWidget({
        name: "kbaseDownload",
        parent: "kbaseWidget",
        version: "1.0.0",
        options: {
            btnClass    : 'btn-default btn-xs',
            newWindow   : false,
            mimeType    : 'application/vnd.kbase-data',
            delimiter   : ',',
            detect      : 'json',
            title       : function() { return $.jqElem('i').addClass('fa fa-download') },
        },

        _accessors : [
            {name : 'content',      setter : 'setContent'},
            {name : 'btnClass',     setter : 'setBtnClass'},
            {name : 'mimeType',     setter : 'setMimeType'},
            {name : 'delimiter',    setter : 'setDelimiter'},
            {name : 'detect',       setter : 'setDetect'},
            {name : 'title',        setter : 'setTitle'},
        ],

        init: function(options) {
            this._super(options);

            if ( ! this.$elem.is('button') ) {
                throw "Cannot create kbaseDownload on non-button";
            }

            this.appendUI(this.$elem);

            return this;
        },

        setContent : function(content) {
            this.setValueForKey('content', content);

            if ( this.data('dlbutton') ) {
                this.data('dlbutton').prop('disabled', content ? false : true);
            }
        },

        appendUI : function($elem) {

            var title = $.isFunction( this.title() )
                ? this.title()()
                : this.title();

            $elem.off('.kbase');

            $elem
                .attr('class', 'btn ' + this.btnClass())
                .append( title );

            $elem.on('click.kbase', $.proxy(function(e) {
                e.preventDefault(); e.stopPropagation();

                this.download();
            }, this));

            if (! this.content()) {
                $elem.prop('disabled', true);
            }

            this.$elem.css('display', '');

        },

        asString : function(content) {

            var ret;
            var $self = this;

            if ($.isArray(content) && this.detect() == 'auto') {
                ret = [];
                $.each(
                    content,
                    function (idx, row) {
                        ret.push( row.join( $self.delimiter() ) );
                    }
                );

                ret = ret.join("\n");


            }
            else if (
                $.isPlainObject(content)
                || $.isArray(content) && this.detect() == 'json') {

                ret = ['application/json', JSON.stringify(content, undefined, 2)];
            }
            else if ($.isFunction(content)) {
                ret = content();
            }
            else {
                ret = content;
            }

            return ret;
        },

        download : function() {

            var type = this.mimeType();

            var output = this.asString( this.content() );
            if ($.isArray(output)) {
                type = output[0];
                output = output[1];
            }

            if (! output.length) {
                return;
            }

            var d = encodeURI( output );

            var url = "data:" + type + "," + d;

            if (this.options.newWindow) {
                window.open(url);
            }
            else {
                location.href = url;
            }

        }

    });
});
