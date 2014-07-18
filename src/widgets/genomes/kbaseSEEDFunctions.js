/* Shows the SEED functional category hierarchy as a 
 * collapsable/expandable bar chart
 * 
 * Found a collapsable hierarcy example from Mike Bostock to follow:
 * https://gist.github.com/mbostock/1093025
 * 
 * will adapt this to work with the KBase SEED annotations
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
            width:900         
        },
        
        SEEDTree:[],
        subsysToGeneMap:[],

        objName:"",
        wsName:"",


        /**
         * Initialize the widget.
         */

        init: function(options) {
            this._super(options);          

            var SEEDTree = this.SEEDTree;
            var subsysToGeneMap = this.subsysToGeneMap;

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

                genomeObj.features.forEach( function(f){

                    // Each function can have multiple genes, creating mapping of function to list of gene ids
                    if (subsysToGeneMap[f["function"]] === undefined) {subsysToGeneMap[f["function"]] = [];}
                    subsysToGeneMap[f["function"]].push(f["id"]);

                    // Not sure if this is necessary, but I'm going to keep track of the number of genes with
                    // SEED assigned functions in this count variable.
                    SEEDTree.count++; 
                });

                this.loadSEEDHierarcy();

            }, this));

            this.render();
            

            return this;
        },

        /*
          I need to load the SEED subsystem ontology. I am going to use
          the "subsys.txt" file I found at: 
                ftp.theseed.org/subsystems/subsys.txt
          
          Note that this file is updated weekly, but not versioned. It's 
          possible that errors will arise because the subsystems assigned
          in the genome object are out of date relative to the current
          subsys.txt file.

          file format is:
          Level 1 \t Level 2 \t Level 3 \t Level 4\t Optional GO id \t Optional GO desc \n

          ontologyDepth is set to 4 for SEED

          SEED is not a strict heirarchy, some nodes have multiple parents
          I'm going to keep track of a nodes parents to map things right.

          loadSEEDHierarcy() function will parse file and populate the SEEDTree data structure
        */
        loadSEEDHierarcy: function() {

            var ontologyDepth = 4; //this should be moved up to the global variables
            var nodeMap = {};

            var SEEDTree = this.SEEDTree;
            var subsysToGeneMap = this.subsysToGeneMap;

            d3.text("assets/data/subsys.txt", function(text) {
                var data = d3.tsv.parseRows(text);
                console.log("Lines: " + data.length);

                for (i = 0; i < data.length; i++) {
                    var geneCount = 0;

                    if (subsysToGeneMap[data[i][3]] === undefined) {
                        //continue;
                    } else {
                      geneCount = subsysToGeneMap[data[i][3]].length;
                      console.log("Count: " + geneCount);
                    }
                    SEEDTree.count += geneCount;

                    for (j = 0; j < ontologyDepth; j++) {

                    }
                }
                console.log("Genes in SEED hierarchy: " + SEEDTree.count);
            });

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