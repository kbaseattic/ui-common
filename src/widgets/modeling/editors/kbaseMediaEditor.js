/**
 *	kbaseMediaEditor.js (kbaseMediaEditor)
 *
 *	Given a pair of workspace and media object names or ids,
 *	produce an editable media table.
 *
 * Authors:
 * 	 nconrad@mcs.anl.gov
 *
 */

(function( $, undefined ) {

'use strict';

$.KBWidget({
    name: "kbaseMediaEditor",
    parent: "kbaseAuthenticatedWidget",
    version: "1.0.0",
    options: {
    },
    getData: function() {

    },
    init: function(input) {
        this._super(input);
        var self = this,
            container = $('<div class="kb-editor">');

        self.$elem.append(container);

        // api
        var modeling = new KBModeling( self.authToken() ),
            kbapi = modeling.kbapi,
            biochem = modeling.biochem,
            getCpds = modeling.getCpds;

        // accept either workspace/object names or workspace/object ids
        var wsName = input.ws,
            objName = input.obj;

        if (isNaN(wsName) && isNaN(objName) )
            var param = {workspace: wsName, name: objName};
        else if (!isNaN(wsName) && !isNaN(objName) )
            var param = {ref: wsName+'/'+objName};
        else
            console.error('kbaseMediaEditor arguements are invalid');

        var table; // main table to be rendered
        var media; // media data

        // keep track of edits
        var _editHistory = new EditHistory();

        // get media data
        container.loading();
        kbapi('ws', 'get_objects', [param])
            .done(function(res){
                media = sanitizeMedia(res[0].data.mediacompounds);

                // get cpd names from biochem, add to media data
                // and render table
                var ids = getCpdIds(media)
                getCpds(ids, {select: ['name', 'id']} )
                    .done(function(objs) {
                        for (var i=0; i<objs.length; i++) {
                            media[i].name = objs[i].name;
                        }
                        //console.log('media', media)
                        renderTable(media);
                        container.rmLoading();
                    })
            })

        // renders table, any associated controls, and events
        function renderTable(data) {
            table = $('<table class="table table-bordered table-striped'+
                ' kb-media-editor" style="width: 100% !important;">')
            container.append(table);

            table = table.DataTable({
                data: data,
                order: [[ 2, "asc" ]],
                dom: '<"top col-sm-6 controls"l><"top col-sm-6"f>rt<"bottom"ip><"clear">',
                columns: [
                    { orderable: false, data: function(row) {
                        return '<i class="fa fa-square-o"></i>';
                    } },
                    { title: "Name", data: 'name'},
                    { title: "Compound", data: 'id'},
                    { title: "Concentration", data: 'concentration', className: 'editable'},
                    { title: "Max Flux", data: 'maxFlux', className: 'editable'},
                    { title: "Min Flux", data: 'minFlux', className: 'editable'}
                ]
            })

            // add controls
            var controls = container.find('.controls');

            var saveBtn = $('<button class="btn btn-primary btn-save pull-right hide">'+
                'Save as...</button>');
            controls.append(saveBtn);

            var addBtn = $('<button class="btn btn-primary pull-right">'+
                '<i class="fa fa-plus"></i> Add compounds...</button>');
            controls.append(addBtn);

            var rmBtn = $('<button class="btn btn-danger pull-right hide">');
            controls.append(rmBtn);

            addBtn.on('click', cpdModal);
            saveBtn.on('click', saveModal);
            rmBtn.on('click', function() {
                // get all selected data
                var data = getTableData('.row-select');

                // edit table
                var op = {op: 'rm', data: data};
                editTable(op);
                modeling.notice(container, 'Removed '+data.length+' compounds')

                rmBtn.toggleClass('hide');
                addBtn.toggleClass('hide');
            })

            // event for clicking on table row
            table.on('click', 'tbody tr td:first-child', function() {
                $(this).parent().toggleClass('row-select');

                var count = table.rows('.row-select').data().length;

                if (count > 0){
                    addBtn.addClass('hide');
                    rmBtn.html('<i class="fa fa-minus"></i> '+
                        'Remove '+count+' compounds')
                    rmBtn.removeClass('hide');
                } else {
                    rmBtn.addClass('hide');
                    addBtn.removeClass('hide');
                }
            });

            // event for clickingon editable cells
            table.on('click', '.editable', function(e) {
                $(this).attr('contentEditable', true);
                $(this).addClass('editing-focus');
                $(this).focus();
            })

            table.on('blur', 'td.editable', function(){
                var before = table.cell(this).data(),
                    after = $(this).text();

                // fixme: add better validation and error handling
                after = parseFloat(after);
                if (before === after) return;

                // set data in datable memory
                table.cell( this ).data(after).draw()

                // save in history
                var op = {op: 'modify', before: before, after: after};
                editTable(op)
            })

            // emit blur on enter as well
            table.on('keydown', 'td.editable', function(e) {
                if(e.keyCode == 13) {
                    e.preventDefault();
                    $(this).blur();
                }
            })
        }

        // takes media data, adds id key/value, and sorts it.
        function sanitizeMedia(media) {
            var i = media.length;
            while (i--) {
                media[i].id = media[i].compound_ref.split('/').pop();
            }
            return media.sort(function(a, b) {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            })
        }

        function getCpdIds(media) {
            var ids = [];
            for (var i=0; i<media.length; i++) {
                ids.push(media[i].id )
            }
            return ids;
        }


        function cpdModal() {
            var table = $('<table class="table table-bordered table-striped kb-media-editor'+
                ' " style="width: 100% !important;">');

            var modal = $('<div>').kbaseModal({
                title: 'Add Compounds',
                subText: 'Select compounds below, then click "add".',
                body: table
            })

            var table = table.DataTable({
                processing: true,
                serverSide: true,
                orderMulti: false,
                order: [[ 2, "asc" ]],
                ajax: function (opts, callback, settings) {
                    biochem('compounds', opts,
                        ['name', 'id', 'mass', 'deltag', 'deltagerr']
                    ).done(function(res){
                        var data = {
                            data: res.docs,
                            recordsFiltered: res.numFound,
                            recordsTotal: 27693
                        }
                        callback(data);
                    })
                },
                dom: '<"top col-sm-6 controls"l><"top col-sm-6"f>rt<"bottom"ip><"clear">',
                columns: [
                    { orderable: false, data: function(row) {
                        return '<i class="fa fa-square-o"></i>';
                    } },
                    { title: "Name", data: 'name'},
                    { title: "Compound", data: 'id'},
                    { title: "Mass", data: 'mass', defaultContent: '-'},
                    { title: "DeltaG", data: 'deltag', defaultContent: '-'},
                    { title: "DeltaG error", data: 'deltagerr', defaultContent: '-'}
                ],
                rowCallback: function( row, data, index ) {
                    if ( selectedRows.isSelected(data.id) )
                        $(row).addClass('row-select');
                }
            })

            // biochem table controls
            var controls = modal.body().find('.controls');
            var addBtn = $('<button class="btn btn-primary pull-right hide">');
            controls.append(addBtn);

            var selectedRows = new SelectedRows();

            // biochem table events
            table.on('click', 'tbody tr', function() {
                $(this).toggleClass('row-select');

                var data = table.rows( this ).data()[0];

                if ($(this).hasClass('row-select'))
                    selectedRows.add(data);
                else
                    selectedRows.rm(data.id);

                if (selectedRows.count() > 0){
                    addBtn.html('<i class="fa fa-plus"></i> Add ('+selectedRows.count()+')');
                    addBtn.removeClass('hide');
                } else {
                    addBtn.addClass('hide');
                }
            });

            // add compounds on click, hide dialog, give notice
            addBtn.on('click' , function() {
                var data = setCpdDefaults( selectedRows.getSelected() ),
                    op = {op: 'add', data: data};
                editTable(op);
                modal.hide();
                modeling.notice(container, 'Added '+data.length+' compounds')
            })

            modal.show();
        }

        function saveModal() {
            var name = objName+'-edited';
            var input = $('<input type="text" class="form-control" placeholder="'+name+'">'),
                form = $('<div class="form-group">'+
                            '<div class="col-sm-10"></div>' +
                          '</div>');

            form.find('div').append(input);

            var modal = $('<div>').kbaseModal({
                title: 'Save Media As...',
                body: form,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: 'Save',
                    kind: 'primary'
                }]
            })

            modal.button('Save').on('click', function() {
                if (input.val()) {
                    console.log('attempting to save', input.val());
                } else {
                    console.log('attempting to save', name);
                    console.log('rows', getTableData())
                }
            })

            modal.show();
        }

        // function to edit table, store history, and rerender
        function editTable(operation) {
            _editHistory.add(operation);

            container.find('.btn-save').removeClass('hide');

            if (operation.op === 'modify') {
                return;
            } else if (operation.op === 'add') {
                console.log('attempting to add', operation.data)
                table.rows.add( operation.data ).draw();
            } else if (operation.op === 'rm') {
                console.log('attempting to remove', operation.data)
                table.row( '.row-select' )
                      .remove()
                      .draw();
            }
        }

        // object for selected rows.
        // only used for biochem search engine table.
        function SelectedRows() {
            var rows = [];

            this.add = function(row) {
                rows.push(row);
            }

            this.rm = function(id) {
                var i = id.length;
                for (var i=0; i<rows.length; i++) {
                    if (rows[i].id === id) {
                        rows.splice(i, 1);
                        return;
                    }
                }
            }

            this.isSelected = function(id) {
                for (var i=0; i<rows.length; i++) {
                    if (rows[i].id === id) return true;
                }
                return false;
            }

            this.count = function() {
                return rows.length;
            }

            this.getSelected = function() {
                return rows;
            }

            this.clearAll = function() {
                rows = [];
            }
        }

        // object for managing edit history
        function EditHistory() {
            var ops = [];

            this.add = function(row) {
                ops.push(row);
                console.log('op:', ops)
            }

            this.rm = function(id) {
                var i = id.length;
                for (var i=0; i<ops.length; i++) {
                    if (ops[i].id === id) {
                        ops.splice(i, 1);
                        return;
                    }
                }
            }

            this.count = function() {
                return ops.length;
            }

            this.getHistory = function() {
                return ops;
            }

            this.clearAll = function() {
                ops = [];
            }
        }

        // takes list of cpd objects, sets defaults and returns
        // list of cpd objects.
        function setCpdDefaults(cpds) {
            for (var i=0; i<cpds.length; i++) {
                var cpd = cpds[i];
                cpd.concentration = 0.001;
                cpd.minFlux = -100;
                cpd.maxFlux = 100;
            }
            return cpds;
        }


        // takes optional selector, returns list of
        // data from datatables (instead of api object)
        function getTableData(selector) {
            var d = selector ? table.rows( selector ).data() : table.rows().data();

            var data = [];
            for (var i=0; i<d.length; i++) {
                data.push(d[i]);
            }
            return data;
        }

        // function to save data,
        function saveData(data) {
            console.log('saving data', data);
        }

        return this;
    }
})
}( jQuery ) );
