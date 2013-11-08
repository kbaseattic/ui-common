(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseSpecStorageCard", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            id: '',
            width: 560
        },

        init: function(options) {
        	options.id = '';
            this._super(options);
            var self = this;
            self.$elem.append('<p class="muted loader-table"><img src="assets/img/ajax-loader.gif"> loading...</p>');

            var kbws = new Workspace('http://localhost:9999/');
            var wsAJAX = kbws.list_modules({});

            $.when(wsAJAX).done(function(data){
            	var dataList = [];
            	for (var i = 0; i < data.length; i++)
            		dataList[i] = {module: '<a class="module-click" data-module="'+data[i]+'">'+data[i]+'</a>'};
                self.$elem.append('<table id="module-table" class="table table-striped table-bordered"></table>');
                var tableSettings = {
                        "fnDrawCallback": modelEvents,
                        "sPaginationType": "full_numbers",
                        "iDisplayLength": 10,
                        "aoColumns": [{sTitle: "Module name", mData: "module"}],
                        "aaData": [],
                        "oLanguage": {
                            "sSearch": "Search module:",
                            "sEmptyTable": "No modules registered."
                        }
                    };
                var table = $('#module-table').dataTable(tableSettings);
                table.fnAddData(dataList);

                $('.loader-table').remove();
            });
            
            function modelEvents() {
                $('.module-click').unbind('click');
                $('.module-click').click(function() {
                    var module = $(this).data('module');
                    self.trigger('showSpecElement', 
                    		{
                    			kind: "module", 
                    			id : module,
                    			event: event
                    		});
                });
            }

            return this;
        },
        
        getData: function() {
            return {
                type: "KBaseSpecStorageCard",
                id: this.options.id,
                workspace: '',
                title: "Spec-document Storage"
            };
        }
    });
})( jQuery );
