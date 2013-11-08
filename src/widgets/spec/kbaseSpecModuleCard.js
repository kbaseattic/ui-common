(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecModuleCard", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            id: null,
            width: 560
        },

        init: function(options) {
            this._super(options);
            var self = this;
            var container = this.$elem;
            self.$elem.append('<p class="muted loader-table"><img src="assets/img/ajax-loader.gif"> loading...</p>');

            var kbws = new Workspace('http://localhost:9999/');
            var wsAJAX = kbws.get_module_info(
            		{
            			mod: this.options.id,
            		});

            $.when(wsAJAX).done(function(data){

            var tabNames = ['Types', 'Functions', 'Included modules'];
            var tabIds = ['types', 'funcs', 'includes'];

            // build tabs
            var tabs = $('<ul id="table-tabs" class="nav nav-tabs"> \
                           <li class="active" > \
                            <a href="#'+tabIds[0]+'" data-toggle="tab" >'+tabNames[0]+'</a> \
                           </li> \
                          </ul>');
            for (var i=1; i<tabIds.length; i++) {
                tabs.append('<li><a href="#'+tabIds[i]+'" data-toggle="tab">'+tabNames[i]+'</a></li>');
            }

            // add tabs
            container.append(tabs);
            
            var tab_pane = $('<div id="tab-content" class="tab-content">');
            // add table views (don't hide first one)
            tab_pane.append('<div class="tab-pane in active" id="'+tabIds[0]+'"> \
                                <table cellpadding="0" cellspacing="0" border="0" id="'+tabIds[0]+'-table" \
                                class="table table-bordered table-striped" style="width: 100%;"></table>\
                            </div>');

            for (var i=1; i<tabIds.length; i++) {
                var tableDiv = $('<div class="tab-pane in" id="'+tabIds[i]+'"> ');
                var table = $('<table cellpadding="0" cellspacing="0" border="0" id="'+tabIds[i]+'-table" \
                                class="table table-striped table-bordered">');
                tableDiv.append(table);
                tab_pane.append(tableDiv);
            }

            container.append(tab_pane);
            
            // event for showing tabs
            $('#table-tabs a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            
            //$('#types-table');
            container.append("" + data.types);
            $('.loader-table').remove();

            });

            
            return this;
        },
        
        getData: function() {
            return {
                type: "KBaseSpecModuleCard",
                id: this.options.id,
                workspace: '',
                title: "Spec-document Module"
            };
        }
    });
})( jQuery );
