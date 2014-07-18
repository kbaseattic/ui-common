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
            width:900           
        },
        
        objName:"",
        wsName:"",

        SEEDTree : [], 

        /**
         * Initialize the widget.
         */

        init: function(options) {
            this._super(options);
            var self = this;            

            var obj = {"ref" : this.options.wsNameOrId + "/" + this.options.objNameOrId };
            

            var prom = this.options.kbCache.req('ws', 'get_objects', [obj]);
        
            $.when(prom).fail($.proxy(function(error) {
                this.renderError(error);
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

                genome["data"]["features"].forEach( function(f){

                    // Each function can have multiple genes, creating mapping of function to list of gene ids
                    if (subsysToGeneMap[f["function"]] === undefined) {subsysToGeneMap[f["function"]] = [];}
                    subsysToGeneMap[f["function"]].push(f["id"]);

                    // Not sure if this is necessary, but I'm going to keep track of the number of genes with
                    // SEED assigned functions in this count variable.
                    SEEDTree.count++; 
                });

                
            }, this));

            self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>Finding SEED functions for this genome...</center></p></div>');
            self.$elem.append('<div id="mainview">');


            //self.$elem.find('#loading-mssg').remove();
            return this;
        },


        getData: function() {
            return {title:"SEED Functional Categories :",id:this.objName, workspace:this.wsName};
        }

    });
})( jQuery );