
/* this is a work in progress */

(function( $, undefined ) {

    $.KBWidget({
        name: "kbaseTableEditor",
        version: "1.0.0",
        options: {
        },

        init: function(options) {
            this._super(options);
            var container = this.$elem;

            table = $('<table class="table">');

            // button for editing table
            var edit_btn = $('<button type="button">Edit</button>')
            edit_btn.click(editTable);
            container.append(edit_btn);

            // build the editable table
            buildTable();


            function buildTable() {

                var head = $('<thead>');
                var tr = $('<tr>');
                for (var i in options.columns) {
                    tr.append('<td><b>'+options.columns[i].title+'</b></td>');
                }
                head.append(tr);
                table.append(head);

                var body = $('<tbody>');
                for (var i in options.data) {
                    var row = options.data[i];

                    var tr = $('<tr>');
                    for (var j in row) {
                        tr.append('<td>'+row[j]+'</td>');
                    }
                    body.append(tr);
                }
                table.append(body);

                // add table to dom
                container.append(table);
            }

            function editTable() {

                table.find('tr').each(function(i, row) {
                    console.log($(this))

                    $(this).find('td').each(function(j, cell) {
                        var input = $('<input type="text">');
                        input.val( $(this).text() )
                        $(this).html(input);
                    })

                    // add delete button to every row
                    $(this).append('<button type="button" class="btn btn-default btn-remove-row"><span class="glyphicon glyphicon-trash"></span></button>');
                })

                $('.btn-remove-row').unbind('click');
                $('.btn-remove-row').click(function() {
                    $(this).parents('tr').remove();
                })
            }

            return this;
        }, 



    });

}( jQuery ) );
