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

        /**
         * Initialize the widget.
         */

        init: function(options) {
            this._super(options);
            var self = this;            


/*
            var obj = {"ref" : this.options.wsNameOrId + "/" + this.options.objNameOrId };

            var prom = this.options.kbCache.req('ws', 'get_objects', [obj]);
          
            $.when(prom).fail($.proxy(function(error) {
                this.renderError(error);
                console.log(error);
            }, this));

            var genomeObj;
            $.when(prom).done($.proxy(function(genome) {
                genomeObj = genome[0].data;
                console.log("hey " + genome.data.features.length);
            }, this));

            console.log(genomeObj.features.length);
*/
            self.$elem.append('<div id="loading-mssg"><p class="muted loader-table"><center><img src="assets/img/ajax-loader.gif"><br><br>Finding SEED functions for this genome...</center></p></div>');
            self.$elem.append('<div id="mainview">')



            
            //self.$elem.find('#loading-mssg').remove();
            return this;
        },


        getData: function() {
            return {title:"SEED Functional Categories :",id:this.objName, workspace:this.wsName};
        }

    });
})( jQuery );