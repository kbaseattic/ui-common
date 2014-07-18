/*


*/

kb_define('kbasePlantsNTO',
    [
        'jquery',
        'kbaseIrisWidget',
        'kbaseTable',
    ],
    function ($) {
        $.KBWidget(
        {

            name: "kbasePlantsNTO",
            parent: 'kbaseIrisWidget',

            version: "1.0.0",

            _accessors : [
                'terminal',
                'networkGraph',
                'msgBox',
            ],

            options: {
                maxVisibleRowIndex : 5,
                navControls : true,
                extractHeaders : false,
            },

            setInput : function(newInput) {
                if (typeof(newInput) === 'string') {
                    newInput = JSON.parse(newInput);
                }

                this.setValueForKey('input',  newInput);
                this.appendUI(this.$elem);
            },

            appendUI : function($elem) {

                $elem.empty();

                var $self = this;

                if (this.input() == undefined) {
                    this.setError("Cannot use network table widget w/o input file");
                }
                else {
//$elem.append(JSON.stringify(this.input(), undefined, 2));
console.log("OBJ");console.log(this.input());console.log("OUT");
var cluster_ids = [];

$.each(
    this.input().data.nodes,
    function (idx, val) {
        if (val.type == 'CLUSTER') {
            console.log(val);

            cluster_ids.push(
                {
                    id          : val.id,
                    cluster_id  : val.entity_id,
                    genes       : 0,
                    edges       : 0,
                    go_enrichment : val.user_annotations.go_enrichnment_annotation,
                }
            );
        }
    }
)

var throttle = 0;
var edge_ids = [];
console.log("CID");
console.log(cluster_ids);

$.each(
    this.input().data.edges,
    function (eidx, edge) {
        $.each(
            cluster_ids,
            function (idx, cluster_info) {
//if (throttle++ > 10) {
//    return false;
//}
//            console.log(edge);

                if (cluster_info.gene_ids == undefined) {
                    cluster_info.gene_ids = [];
                }


                if (edge.node_id1 == cluster_info.id) {
                    cluster_info.gene_ids.push(edge.node_id2);
                    edge_ids.push(edge.node_id2);
                    cluster_info.edges++;
                    cluster_info.genes++;
                }
                else if (edge.node_id2 == cluster_info.id) {
                    cluster_info.gene_ids.push(edge.node_id1);
                    edge_ids.push(edge.node_id1);
                    cluster_info.edges++;
                    cluster_info.genes++;
                }

//                    console.log("found edge");console.log(edge);
//                }
            }
        )
    }
);

console.log(edge_ids);

//okay, now we go back through the damn nodes and pull out the actual data we need.

var data = [];

$.each(
    this.input().data.nodes,
    function (idx, val) {
        $.each(
            edge_ids,
            function (eidx, edge_id) {
                if (val.id == edge_id) {
                    data.push(
                        {

                        }
                    );

                }
            }
        )
    }
);

var data =
    {
        structure : {
            header : [
                'cluster_id',
                'genes',
                'edges',
                'go_enrichment',
                "gene_list",
                "link",
            ],
            rows : cluster_ids
        }
    };

var cluster_data = {
    structure : {
        header      : [
            {
                value : 'cluster_id',
                label : 'ID',
                style: "max-width : 190px; background-color : black; color : white",
            },
            {
                value : 'genes',
                label : 'No. of genes',
                style: "min-width : 250px; background-color : black; color : white",
            },
            {
                value : 'edges',
                label : 'No. of edges',
                style: "min-width : 75px; background-color : black; color : white",
            },
            {
                value : 'go_enrichment',
                label : 'GO enrichment',
                style: "min-width : 75px; background-color : black; color : white",
            },
            {
                value : 'gene_list',
                label : 'Gene List',
                style: "min-width : 90px; background-color : black; color : white",
            },
            {
                value : 'link',
                label : 'Another link',
                style: "max-width : 125px; background-color : black; color : white",
            },
        ],
        rows        : cluster_ids,
    },
    sortable    : true,
    hover       : true,
    //resizable   : true,
    headerOptions : {
        style : 'background-color : black; color : white;',
        sortable : true,
    },
    maxVisibleRowIndex : this.options.maxVisibleRowIndex,
    navControls : this.options.navControls,
};


var $tables =
    $.jqElem('div')
        .attr('id', 'tables')
        .append(
            $.jqElem('div').attr('id', 'cluster_table')
        )
        .append(
            $.jqElem('div').attr('id', 'gene_table')
        )
;

this._rewireIds($tables, this);

var $tbl = this.data('cluster_table').kbaseTable(cluster_data);

$elem.append($tables);

                }

            }
        }

    );
} ) ;
