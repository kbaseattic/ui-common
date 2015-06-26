/**
 * KBase widget to display a table of gene information.
 *
 * Expected input data is JSON with one key, 'table', whose value is a list.
 * Each list item is a row, with column values. The first row has column names.
 * For example :
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
*/define('kbaseGeneTable',
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

            /*row_callback : function (cell, header, row, $kb) {

                var def = $kb.default_row_callback(cell, header, row, $kb);

                if (def.length < 12) {
                    return def;
                }

                var max = '1.5em';

                var $div = $.jqElem('div')
                    .css({'max-height' : max, 'overflow' : 'hidden', display : 'inline-block'})
                    .attr('class', 'truncated')
                    .append(def);

                return $.jqElem('div').append($div).append($.jqElem('div').attr('class', 'dots').css({'font-style' : 'italic', 'text-align' : 'right'}).append('...more'));

            },*/

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

        /*appendUI : function($elem, struct) {
            this._super($elem, struct);

            $elem.find('.truncated').each(function(i,v) {
                if ($(v).height() == v.scrollHeight) {
                    $(v).css('max-height', '');
                    $(v).next().remove();
                    $(v).toggleClass('truncated');
                }

            });

            var max = '1.5em';
            $elem.find('tr')
                .on('mouseover', function(e) {
                    $(this).find('.truncated').css('max-height', '');
                    $(this).find('.dots').css('display', 'none');
                })
                .on('mouseout', function(e) {
                    $(this).find('.truncated').css('max-height', max);
                    $(this).find('.dots').css('display', '');
                })
            ;

            return $elem;
        },*/


    });

});
