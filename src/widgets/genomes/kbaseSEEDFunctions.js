/* Shows the SEED functional category hierarchy as a 
 * collapsable/expandable bar chart
 *
 */

 (function( $, undefined ) {
    $.KBWidget({
        name: "KBaseSEEDFunctions",
        parent: "kbaseWidget",
        version: "1.0.0",

        wsUrl:"https://kbase.us/services/ws",

        options: {
            objNameOrId: null,
            wsNameOrId: null,
            objVer: null,
            loadingImage: "assets/img/loading.gif",
            kbCache:{},         
            width:900,
            SEEDTree:[]           
        },
        
        objName:"",
        wsName:"",


        /**
         * Initialize the widget.
         */

        init: function(options) {
            this._super(options);          

            var SEEDTree = this.options.SEEDTree;

            var obj = {"ref" : this.options.wsNameOrId + "/" + this.options.objNameOrId };
            
            var prom = this.options.kbCache.req('ws', 'get_objects', [obj]);
        
            $.when(prom).fail($.proxy(function(error) {
                //this.renderError(error); Need to define this function when I have time
                console.log(error);
            }, this));

            $.when(prom).done($.proxy(function(genome) {
                var genomeObj = genome[0].data;
                console.log("Num Features: " + genomeObj.features.length);

                /*
                    First I am going to iterate over the Genome Typed Object and 
                    create a mapping of the assigned functional roles (by SEED) to
                    an array of genes with those roles. 

                    subsysToGeneMap [ SEED Role ] = Array of Gene Ids
                */
                var subsysToGeneMap = [];

                genomeObj.features.forEach( function(f){

                    // Each function can have multiple genes, creating mapping of function to list of gene ids
                    if (subsysToGeneMap[f["function"]] === undefined) {subsysToGeneMap[f["function"]] = [];}
                    subsysToGeneMap[f["function"]].push(f["id"]);

                    // Not sure if this is necessary, but I'm going to keep track of the number of genes with
                    // SEED assigned functions in this count variable.
                    SEEDTree.count++; 
                });


            }, this));


            this.render();

            return this;
        },

        getData: function() {
            return {title:"SEED Functional Categories :",id:this.objName, workspace:this.wsName};
        },

        render: function() {
            var margin = {top: 30, right: 20, bottom: 30, left: 20},
                width = 960 - margin.left - margin.right;

            this.$elem.append('<div id="mainview">');

            var svg = d3.select("#mainview").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        }

    });
})( jQuery );