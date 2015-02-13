(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseGenomeWideTaxonomy", 
        parent: "kbaseWidget", 
        version: "1.0.0",

        options: {
            genomeID: null,
            workspaceID: null,
            loadingImage: "assets/img/ajax-loader.gif",
            kbCache: null,
            genomeInfo: null
        },

        init: function(options) {
            this._super(options);
            this.render();
            return this;
        },

        render: function() {
            var self = this;
            var row = $('<div class="row">');
            self.$elem.append(row);
            var taxonomyinfo = $('<div class="col-md-5">');
            row.append(taxonomyinfo);
            var tree = $('<div class="col-md-7">');
            row.append(tree);
            taxonomyinfo.KBaseGenomeLineage({genomeID: self.options.genomeID, 
            	workspaceID: self.options.workspaceID, kbCache: self.options.kbCache,
                loadingImage: self.options.loadingImage, genomeInfo: self.options.genomeInfo});
            this.prepareTree({ws: self.options.workspaceID, id: self.options.genomeID}, tree);
        },

        prepareTree: function(scope, $div) {
        	var objectIdentity = { ref:scope.ws+"/"+scope.id };
            kb.ws.list_referencing_objects([objectIdentity], function(data) {
            	var treeName = null; var treeWs=null; var treeVer=null;
            	for (var i in data[0]) {
            		var objInfo = data[0][i]
            		var wsName = objInfo[7];
            		var wsId = objInfo[6];
                    var objName = objInfo[1];
                    var type = objInfo[2].split('-')[0];
                	console.log("Links: " + wsName + "(" + scope.ws + ")" + "/" + objName + ", " + type);
		    // either match exactly the string, or we match with coercion the number
                    //if (( wsName === scope.ws || wsId===scope.ws ) && type === "KBaseTrees.Tree") {
		    if (type === "KBaseTrees.Tree") {
                    	treeName = objName;
			treeWs = wsId;
                    	break;
                    }
            	}
		var $buildBtn = $("<button>")
				.addClass("kb-primary-btn")
				.append("Build Another Tree in a New Narrative");
		var $buildNarPanel = $("<div>")
		    .append($('<a href="#/narrativemanager/new?copydata='+scope.ws+'/'+scope.id+'&app=build_species_tree&appparam=1,param0,'+scope.id+'" target="_blank">')
			.append($buildBtn));
		
            	if (treeName) {
		    var $widgetDiv = $('<div>');
		    $div.append(
			$('<table>').append($('<tr>')
			    .append($('<td>')
				.append('<h4>Showing Phylogenetic Tree: <a href="#/dataview/'+treeWs+'/'+treeName+'" target="_blank">'+treeName+'</a></h4>'))
			    .append($('<td>')
				.append($buildNarPanel))));
		    
		    $widgetDiv.kbaseTree({treeID: treeName, workspaceID: treeWs, genomeInfo: self.options.genomeInfo});   
                    $div.append($widgetDiv);       		
            	} else {
		    $buildBtn.html("Launch a new Tree Building Narrative");
                    $div
                        .append('<b>There are no species trees created for this genome, but you can use the Narrative to build a new species tree of closely related genomes.</b>');
                        
                    $div.append("<br><br>");
                    $div.append($buildNarPanel);
                    $div.append("<br><br>");
            	}
            },
            function(error) {
        		var err = '<b>Sorry!</b>  Error retreiveing species trees info';
        		if (typeof error === "string") {
                    err += ": " + error;
        		} else if (error.error && error.error.message) {
                    err += ": " + error.error.message;
        		}
                $div.append(err);
            });
        },
        
        getData: function() {
            return {
                type: "Genome Taxonomy",
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: "Taxonomy"
            };
        }

    });
})( jQuery );