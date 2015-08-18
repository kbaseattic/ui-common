(function( $, undefined ) {

$.KBWidget({
    name: "kbaseModelTabs",    
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

    init: function(options) {
        this._super(options);
        var self = this;
        var ws = options.ws;
        var name = options.name;

        var container = this.$elem;

        var rxnTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">');
        var cpdTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">');
        var compartTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">');
        var biomassTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">');
        var gfTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">');
        var ggTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">');
        var mapTable = $('<div>');

        var tabs = container.kbTabs({tabs: [{name: 'Reactions', content: rxnTable, active: true},
                                            {name: 'Compounds', content: cpdTable},
                                            {name: 'Compartment', content: compartTable},
                                            {name: 'Biomass', content: biomassTable},
                                            {name: 'Gapfill', content: gfTable},
                                            {name: 'Gapgen', content: ggTable}, 
                                            {name: 'Pathways', content: mapTable}
                                    ]});



        container.loading();
        var p = kb.get_model(ws, name);
        $.when(p).done(function(data) {
            container.rmLoading();
            var data = data[0].data;
            self.loadTable(data);
        }).fail(function(e){
            container.rmLoading();            
            container.append('<div class="alert alert-danger">'+
                            e.error.message+'</div>');
        });


        self.loadTable = function(data) {
            mapTable.kbasePathways({model_ws: ws, 
                                    model_name: name, 
                                    editable: (options.editable ? true : false)});

            var tableSettings = {
                "iDisplayLength": 10,
                "aLengthMenu": [5, 10, 25,50,100],            
                "aaData": [],
                "oLanguage": {
                    "sSearch": "Search all:"
                }
            }

            // compartment table
            var dataDict = data.modelcompartments;
            var keys = ["label", "pH", "potential"];
            var labels = ["name", "pH", "potential"];
            var cols = getColumns(keys, labels);
            tableSettings.aoColumns = cols;
            var t = compartTable.dataTable(tableSettings);
            t.fnAddData(dataDict);

            // reaction table
            var dataDict = formatRxnObjs(data.modelreactions);
            var keys = ["reaction", "name", "eq"]
            var labels = ["reaction", "name", "eq"]// "equation", features","name"];
            var cols = getColumns(keys, labels);
            var rxnTableSettings = $.extend({}, tableSettings, {fnDrawCallback: rxnEvents});   
            rxnTableSettings.aoColumns = cols;
            rxnTableSettings.aoColumns[0].sWidth = '15%';
            var t = rxnTable.dataTable(rxnTableSettings);
            t.fnAddData(dataDict);

            // compound table
            var dataDict = formatCpdObjs(data.modelcompounds);
            var keys = ["id", "name", "formula"];//["compartment", "compound", "name"];
            var labels = ["id", "name", "formula"];//["compartment", "compound", "name"];
            var cols = getColumns(keys, labels);
            var cpdTableSettings = $.extend({}, tableSettings, {fnDrawCallback: cpdEvents});           
            cpdTableSettings.aoColumns = cols;
            var t = cpdTable.dataTable(cpdTableSettings);
            t.fnAddData(dataDict);

            // biomass table
            var dataDict = data.biomasses;
            var keys = ["id", "name", "eq"];
            var labels = ["id", "name", "eq"];
            var cols = getColumns(keys, labels);
            tableSettings.aoColumns = cols;
            var t = biomassTable.dataTable(tableSettings);
            t.fnAddData(dataDict);

            if (data.gapfillings.length > 0) {
                gapFillTableWS(data.gapfillings);
            } else {
                gfTable.after('<h5>There are no gapfilling solutions for this model.  Try running gapfill.</h5>')
            }
        }



        function formatRxnObjs(rxnObjs) {
            var rxn_objs = []
            for (var i in rxnObjs) {
                var rxn = $.extend({}, rxnObjs[i] );
                rxn.reaction = '<a class="rxn-click" data-rxn="'+rxn.id.split('_')[0]+'">'
                            +rxn.id.split('_')[0]+'</a> ('+rxn.id.split('_')[1] +')'
                //rxn.features = rxn.features.join('<br>')
                rxn_objs.push(rxn)
            }
            return rxn_objs;
        }

        function formatCpdObjs(cpdObjs) {
            var cpd_objs = []
            for (var i in cpdObjs) {
                var cpd = $.extend({}, cpdObjs[i] );
                cpd.id = '<a class="cpd-click" data-cpd="'+cpd.id.split('_')[0]+'">'
                            +cpd.id.split('_')[0]+'</a> ('+cpd.id.split('_')[1] +')'
                //rxn.features = rxn.features.join('<br>')
                cpd_objs.push(cpd)
            }
            return cpd_objs;
        }

        function getColumns(keys, labels) {
            var cols = [];

            for (var i=0; i<keys.length; i++) {
                cols.push({sTitle: labels[i], mData: keys[i]})
            }
            return cols;
        }

        function rxnEvents() {
            $('.rxn-click').unbind('click');
            $('.rxn-click').click(function() {
                var name = $(this).data('rxn');
                var c = $('<div>');
                c.kbaseRxn({id: name});
                tabs.addTab({name: name, content: c,  removable: true});
                tabs.showTab(name);
            });
        }

        function cpdEvents() {
            $('.cpd-click').unbind('click');
            $('.cpd-click').click(function() {
                var name = $(this).data('cpd');
                var c = $('<div>');
                c.kbaseCpd({id: name});
                tabs.addTab({name: name, content: c,  removable: true});
                tabs.showTab(name);
            });
        }

        function gapFillTableWS(gapfillings) {
            var tableSettings = {
                "iDisplayLength": 10,
                "aLengthMenu": [5, 10, 25,50,100],            
                "aaData": [],
                "oLanguage": {
                    "sSearch": "Search all:",
                    "sEmptyTable": "No gapfill objects for this model."
                },
               "fnDrawCallback": events,
            }

            var data = $.extend(gapfillings, {})
            var keys = ["id", "integrated"];
            var labels = ["ID", "Integrated"];
            var cols = getColumns(keys, labels);
            tableSettings.aoColumns = cols;
            var gapTable = gfTable.dataTable(tableSettings);


            var refs = []
            for (var i in data) {
                var obj = {}
                var ref =  data[i].gapfill_ref
                obj.wsid = ref.split('/')[0];
                obj.objid = ref.split('/')[1];
                obj.name = data[i].id
                refs.push(obj)
            }

            for (var i in refs) {
                var ws =  refs[i].wsid;
                var id = refs[i].objid;
                var name = refs[i].name

                data[i].id = '<a class="show-gap" data-name="'+name+'" data-id="'+id+'" data-ws="'+ws+'">'+name+'</a>';
                data[i].integrated = (data[i].integrated == 1 ? 'Yes' : 'No')
            }

            gapTable.fnAddData(data);



            function events() {
                $('.show-gap').unbind('click');
                $('.show-gap').click(function() {
                    var id = $(this).data('id');
                    var ws = $(this).data('ws');
                    var gap_name = $(this).data('name');

                    var tr = $(this).closest('tr')[0];
                    if ( gapTable.fnIsOpen( tr ) ) {
                        gapTable.fnClose( tr );
                    } else {
                        gapTable.fnOpen( tr, '', "info_row" );
                        $(this).closest('tr').next('tr').children('.info_row').append('<p class="muted loader-gap-sol"> \
                            <img src="assets/img/ajax-loader.gif"> loading possible solutions...</p>')                
                        showGapfillSolutionsWS(tr, id, ws, gap_name);
                    }


                })
            }


            function showGapfillSolutionsWS(tr, id, ws, gap_name){
                var p = kb.fba.get_gapfills({gapfills: [id], workspaces: [ws]})
                $.when(p).done(function(data) {
                    var data = data[0];  // only one gap fill solution at a time is cliclsked
                    var sols = data.solutions;

                    //$(tr).next().children('td').append('<h5>Gapfill Details</h5>');

                    var solList = $('<div class="gap-selection-list">');

                    for (var i in sols) {
                        var sol = sols[i];
                        var solID = sol.id;

                        var accepted_id = gap_name.replace(/(\.|\|)/g,'_')+solID.replace(/\./g,'_')

                        if (sol.integrated == "1") {
                            solList.append('<div> <a type="button" class="gap-sol"\
                                data-toggle="collapse" data-target="#'+accepted_id+'" >'+
                                solID+'</a> (Integrated)<span class="caret" style="vertical-align: middle;"></span>\
                                 </div>');
                            /*
                            <div class="radio inline gapfill-radio"> \
                                    <input type="radio" name="gapfillRadios" id="gapfillRadio'+i+'" value="integrated" checked>\
                                </div> <span class="label integrated-label">Integrated</span>\
                                    <button data-gapfill="'+gapRef+solID+'"\
                                     class="hide btn btn-primary btn-mini integrate-btn">Integrate</button> \
                            */
                        } else {
                            solList.append('<div> <a type="button" class="gap-sol"\
                                data-toggle="collapse" data-target="#'+accepted_id+'" >'+
                                solID+'</a> <span class="caret" style="vertical-align: middle;"></span>\
                                </div>');

                            /*
                                <div class="radio inline gapfill-radio"> \
                                    <input type="radio" name="gapfillRadios" id="gapfillRadio'+i+'" value="unitegrated">\
                                </div>\
                                <button data-gapfill="'+gapRef+solID+'"\
                                 class="hide btn btn-primary btn-mini integrate-btn">Integrate</button> \
                            */
                        }

                        var rxnAdditions = sol.reactionAdditions;
                        if (rxnAdditions.length == 0) {
                            var rxnInfo = $('<p>No reaction additions in this solution</p>')
                        } else {
                            var rxnInfo = $('<table class="gapfill-rxn-info">');
                            var header = $('<tr><th>Reaction</th>\
                                                <th>Equation</th></tr>');
                            rxnInfo.append(header);

                            for (var j in rxnAdditions) {
                                var rxnArray = rxnAdditions[j];
                                var row = $('<tr>');
                                row.append('<td><a class="gap-rxn" data-rxn="'+rxnArray[0]+'" >'+rxnArray[0]+'</a></td>');
                                row.append('<td>'+rxnArray[4]+'</td>');
                                rxnInfo.append(row);
                            }
                        }

                        var solResults = $('<div id="'+accepted_id+'" class="collapse">')
                        solResults.append(rxnInfo);

                        solList.append(solResults);
                    }

                    $(tr).next().children('td').append(solList.html());
                    $('.loader-gap-sol').remove();   

                })

            }            

        }

        

        //this._rewireIds(this.$elem, this);
        return this;
    }  //end init


})
}( jQuery ) );
