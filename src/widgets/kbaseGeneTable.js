/**
 * KBase widget to display a table of gene information.
 *
 * Expected input data is JSON with one key, 'table', whose value is a list.
 * Each list item is a row, with column values. The first row has column names.
 * For example:
 {'table':
    [
        [
            "Chromosome ID",
            "Source gene ID",
            "Gene ID",
            "Gene function"
        ],
        [
            "kb|g.3899.c.3",
            "AT2G02480",
            "kb|g.3899.locus.8705",
            "AAA-type ATPase-like protein [Source:EMBL;Acc:AEC05585.1]"
        ],
        [
            "kb|g.3899.c.3",
            "AT2G16485",
            "kb|g.3899.locus.10216",
            "DNA binding / nucleic acid binding / protein binding / zinc ion binding protein [Source:EMBL;Acc:AEC06501.1]"
        ],
        ... etc ...
    ]
}
*/kb_define('kbaseGeneTable',
    [
        'jquery',
        'kbaseTable',
	'kbwidget'
    ],
    function ($) {

    $.KBWidget({
        name: "GeneTableWidget",
        parent : 'kbaseTable',
        version: "0.1.0",
        options: {
            table: null,
            maxVisibleRowIndex : 20,
        },

        wsUrl: "https://kbase.us/services/ws/",

        init: function(options) {

            if (options.table) {
                var headers = options.table.shift();
                var rows = [];

                var i;
                for (i = 0; i < options.table.length; i++) {
                    var row = {};
                    var j;
                    for (j = 0; j < headers.length; j++) {
                        row[headers[j]] = options.table[i][j];
                    }
                    rows.push(row);
                }

                options.structure = {
                    header : headers,
                    rows   : rows,
                }
            }

            options.sortable = true;
            options.navControls = true;
            options.headerOptions = {
                style : 'background-color : #EEEEEE; color : #0D7876;',
                sortable : true,
            };

            return this._super(options);
        },

    });

});
