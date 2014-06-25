

(function( $, undefined ) {

    $.KBWidget({
        name: "tabs",
        version: "1.0.0",

        init: function(options) {
            this._super(options);
            var container = this.$elem;

            var tabs = $('<ul class="nav nav-tabs">');
            var tab_contents = $('<div class="tab-content">');
            container.append(tabs, tab_contents);

            this.addTab = function(p) {
                tabs.append('<li class="'+(p.active ? 'active' :'')+'">'+
                                '<a data-toggle="tab" data-id="'+p.name+'">'+
                                    p.name+
                                '</a>'+
                            '</li>');
                var content = tab_contents.append('<div class="tab-pane '+
                                                    (p.active ? 'active' :'')+
                                                    '" data-id="'+p.name+'">');
                content.append((p.content ? p.content : ''))
                return p.content;
            }

            this.rmTab = function(name) {
                container.find('[data-id="'+name+'"]').remove();
            }

            this.tab = function(name) {
                return container.find('[data-id="'+name+'"]');
            }

            this.addContent = function(p) {
                var c = tab_contents.find('[data-id="'+p.name+'"]')
                                    .append('<div class="tab-pane '+
                                                    (p.active ? 'active' :'')+
                                            '" data-id="'+p.name+'">');
                c.append((p.content ? p.content : ''));
                return c;
            }

            this.showTab = function() {
                // event for clicking on tabs. 
                tabs.find('a').unbind('click')
                tabs.find('a').click(function (e) {
                    e.preventDefault();
                    $(this).show();
                    tab_contents.find('.tab-pane').removeClass('active');
                    var id = $(this).data('id');
                    $('[data-id="'+id+'"]').addClass('active');
                })
            }

            // if tabs are supplied, add them
            if (options) {
                for (var i in options) {
                    this.addTab(options[i])
                }
            }


            return this;
        },

    });

}( jQuery ) );
