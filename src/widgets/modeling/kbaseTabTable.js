(function( $, undefined ) {

$.KBWidget({
    name: "kbaseTabTable",
    version: "1.0.0",
    options: {
    },

    getData: function() {
        return {
            id: this.options.id,
            type: "Model",
            workspace: this.options.ws,
            title: this.options.title
        };
    },

    init: function(input) {
        this._super(input);
        var self = this;

        var imageURL = "http://bioseed.mcs.anl.gov/~chenry/jpeg/";

        var type = input.type;

        var tabs;

        // 0) No more clients.  Make this global.  please.
        this.kbapi = function(service, method, params) {
            var url, method;
            if (service == 'ws') {
                url = "https://kbase.us/services/ws/";
                method = 'Workspace.'+method;
            } else if (service == 'fba') {
                url = "https://kbase.us/services/KBaseFBAModeling/";
                method = 'fbaModelServices.'+method;
            }

            var rpc = {
                params: [params],
                method: method,
                version: "1.1",
                id: String(Math.random()).slice(2),
            };

            var prom = $.ajax({
                url: url,
                type: 'POST',
                processData: false,
                data: JSON.stringify(rpc),
                beforeSend: function (xhr) {
                    if ('token' in input && input.token)
                        xhr.setRequestHeader("Authorization", input.token);
                }
            }).then(function(data) {
                return data.result[0];
            })

            return prom;
        }

        // base class for workspace object classes
        var kbObjects = new KBObjects();

        //
        // 1) Use type (periods replaced with underscores) to instantiate object
        //
        obj = new kbObjects[type.replace(/\./g, '_')](self);

        //
        // 2) add the tabs
        //
        var tabList = obj.tabList;

        var uiTabs = [];
        for (var i = 0; i < tabList.length; i++) {
            var tab = tabList[i];
            if (tab.type == 'dataTable')
                var content = $('<table class="table table-bordered table-striped">');
            else
                var content = $('<div>');

            uiTabs.push({name: tabList[i].name, content: content});
        }

        uiTabs[0].active = true;
        tabs = self.$elem.kbTabs({tabs: uiTabs});

        //
        // 3) get meta data, add any metadata tables
        //
        self.kbapi('ws', 'get_object_info_new', {objects: [{workspace: input.ws, name: input.name}], includeMetadata: 1})
          .done(function(res) {
              obj.set_metadata(res[0]);

              for (var i = 0; i < tabList.length; i++) {
                  var spec = tabList[i];

                  if (spec.type == 'verticaltbl') {
                      var key = spec.key;
                      var data = obj[key];

                      var table = self.verticalTable({rows: spec.rows, data: data});
                      tabs.tabContent(spec.name).append(table)
                  }
              }
          })

        //
        // 4) get object data, create tabs
        //
        self.kbapi('ws', 'get_objects', [{workspace: input.ws, name: input.name}])
          .done(function(data){
              obj.set_data(data[0].data);

              //5) Iterates over the entries in the spec and instantiates the table tabs
              for (var i = 0; i < tabList.length; i++) {
                  var tabSpec = tabList[i];

                  // skip any vertical tabls or widgets for now
                  if (tabSpec.type == 'verticaltbl') continue;
                  if (tabSpec.widget) continue;

                  var settings = self.getTableSettings(tabSpec, obj.data);

                  tabs.tabContent(tabSpec.name)
                      .find('table').dataTable(settings);
              }

        })

        // takes table spec and prepared data, returns datatables settings object
        this.getTableSettings = function(tab, data) {
            var tableColumns = getColSettings(tab);

            var settings = {dom: '<"top"lf>rt<"bottom"ip><"clear">',
                            aaData: data[tab.key],
                            aoColumns: tableColumns,
                            language: { search: "_INPUT_",
                                        searchPlaceholder: 'Search '+tab.name}}

            // add any events
            for (var i=0; i<tab.columns.length; i++) {
                var col = tab.columns[i];

                if (col.type == "tabLink") {
                    settings.fnDrawCallback = function() {
                        var tabPane = tabs.tabContent(tab.name).find('.id-click');
                        tabPane.unbind('click');
                        tabPane.click(function() {
                            var id = $(this).data('id'),
                                method = $(this).data('method');

                            var content = $('<div>');

                            if (method) {
                                var prom = obj[method](id);

                                $.when(prom).done(function(rows) {
                                    var table = self.verticalTable({rows: rows});
                                    content.append(table);
                                })
                            }

                            tabs.addTab({name: id, content: content, removable: true});
                            tabs.showTab(id);
                        });
                    }
                }
            }

            return settings;
        }

        // takes table spec, returns datatables column settings
        function getColSettings(tab) {

            var settings = [];

            var cols = tab.columns;

            for (var i=0; i<cols.length; i++) {
                var col = cols[i];
                var key = col.key,
                    type = col.type,
                    format = col.linkformat,
                    method = col.method;

                var config = {sTitle: col.label,
                              mData: ref(key, type, format, method)}

                if (col.width) config.sWidth = col.width;

                settings.push(config)
            }

            function ref(key, type, format, method) {
                return function(d) {
                            if (type == 'tabLink' && format == 'dispid') {
                                var id = d[key].split('_')[0];
                                var compart = d[key].split('_')[1];

                                return '<a class="id-click" data-id="'+id+'" data-method="'+method+'">'+
                                            id+'</a> ('+compart+')';
                            }
                            return d[key];
                        }
            }

            return settings
        }


        this.verticalTable = function(p) {
            var data = p.data;
            var rows = p.rows;

            var table = $('<table class="table table-bordered">');


            for (var i=0; i<rows.length; i++) {
                var row = rows[i];

                // don't display undefined things in vertical table
                if ('data' in row && typeof row.data == 'undefined' ||
                    'key' in row && typeof data[row.key] == 'undefined')
                    continue

                var r = $('<tr>');
                r.append('<td><b>'+row.label+'</b></td>')

                // if the data is in the row definition, use it
                if ('data' in row)
                    r.append('<td>'+row.data+'</td>');
                else if ('key' in row) {
                    if (row.type == 'wstype') {
                        var ref = data[row.key];
                        var cell = $('<td data-ref="'+ref+'">loading...</td>');

                        getLink(data[row.key]).done(function(url) {
                            var name = url.split('/')[2]
                            cell.html('<a href="#/test/'+url+'">'+name+'</a>');
                        })
                        r.append(cell);
                    } else {
                        r.append('<td>'+data[row.key]+'</td>');
                    }
                } else if (row.type == 'pictureEquation')
                    r.append('<td>'+pictureEquation(row.data)+'</td>');

                table.append(r);
            }

            return table;
        }


        this.getBiochemReaction = function(id) {
            return self.kbapi('fba', 'get_reactions', {reactions: [id]})
                       .then(function(data) {
                          return data[0];
                       })
        }

        this.getBiochemCompound = function(id) {
            return self.kbapi('fba', 'get_compounds', {compounds: [id]})
                       .then(function(data) {
                          return data[0];
                       })
        }

        this.compoundImage = function(id) {
            return 'http://bioseed.mcs.anl.gov/~chenry/jpeg/'+id+'.jpeg';
        }

        this.pictureEquation = function(eq) {
            var cpds = get_cpds(eq);

            for (var i =0; i < cpds.left.length; i++) {
                var cpd = cpds.left[i];
                var img_url =  imageURL+cpd+'.jpeg';
                panel.append('<div class="pull-left text-center">\
                                    <img src="'+img_url+'" width=150 ><br>\
                                    <div class="cpd-id" data-cpd="'+cpd+'">'+cpd+'</div>\
                                </div>');

                var plus = $('<div class="pull-left text-center">+</div>');
                plus.css('margin', '30px 0 0 0');

                if (i < cpds.left.length-1) {
                    panel.append(plus);
                }
            }

            var direction = $('<div class="pull-left text-center">'+'<=>'+'</div>');
            direction.css('margin', '25px 0 0 0');
            panel.append(direction);

            for (var i =0; i < cpds.right.length; i++) {
                var cpd = cpds.right[i];
                var img_url = imageURL+cpd+'.jpeg';
                panel.append('<div class="pull-left text-center">\
                                    <img src="'+img_url+'" data-cpd="'+cpd+'" width=150 ><br>\
                                    <div class="cpd-id" data-cpd="'+cpd+'">'+cpd+'</div>\
                                </div>');

                var plus = $('<div class="pull-left text-center">+</div>');
                plus.css('margin', '25px 0 0 0');

                if (i < cpds.right.length-1) {
                    panel.append(plus);
                }
            }


            var cpd_ids = cpds.left.concat(cpds.right);
            var prom = self.kbapi('fba', 'get_compounds', {compounds: cpd_ids})
            $.when(prom).done(function(d){
                var map = {};
                for (var i in d) {
                    map [d[i].id ] = d[i].name;
                }

                $('.cpd-id').each(function() {
                    $(this).html(map[$(this).data('cpd')])
                })
            });


            return panel;
        }

        function get_cpds(equation) {
            var cpds = {}
            var sides = equation.split('=');
            cpds.left = sides[0].match(/cpd\d*/g);
            cpds.right = sides[1].match(/cpd\d*/g);

            return cpds;
        }

        function getLink(ref) {
            return self.kbapi('ws', 'get_object_info_new',
                        {objects: [{ref: ref}]})
                        .then(function(data){
                            var a = data[0];
                            return a[2].split('-')[0]+'/'+a[7]+'/'+a[1];
                        })
        }

        return this;
    }
})
}( jQuery ) );


