/**
 *
 *
 *
 * This widget simply takes on objectinfo object
 *
 */ 
(function( $, undefined ) { 
    $.KBWidget({ 
        name: "KBaseDataViewGenericViz",
        parent: "kbaseAuthenticatedWidget",

        options: {
	    objid: null,
	    wsid: null,
	    ver: null,
            ws_url: "https://kbase.us/services/ws",
            loadingImage: "assets/img/ajax-loader.gif"
        },

        objref:null,
	
        ws: null, // the ws client
        loggedIn: false,

        $mainPanel: null,
        $errorPanel: null,
        $msgPanel: null,
        $copyDropdown: null,
	
        objData: null,
        
        init: function(options) {
            this._super(options);
	    
		    // first initialize the type to widget config
            this.setupType2Widget();
	    
	  	    // abort and do nothing
            if (!options.objid || !options.wsid ) {
                console.log('in kbaseDataViewGenericViz widget, objid or wsid param was null, options: ',options);
                return this;
            }
	    
            this.objref = options.wsid + '/' + options.objid;
            if (options.ver) {
                this.objref = this.objref + '/' + options.ver;
            }
            console.log(this.objref,options);
	    
            this.$mainPanel = $("<div>");
            this.$elem.append(this.$mainPanel);
	    
            if (!this.auth.token) {
                this.ws = kb.ws;  //new Workspace(this.options.ws_url);
                this.loggedIn = false;
            } else {
                console.log(this.auth);
                this.ws = new Workspace(this.options.ws_url, this.auth);
                this.loggedIn = true;
            }
            this.getInfoAndRender();
	    
            return this;
        },

        loggedInCallback: function(event, auth) {
            //this.ws = new Workspace(this.options.ws_url, auth);
            //this.refresh();
            return this;
        },
        loggedOutCallback: function(event, auth) {
            //this.ws = null;
            //this.refresh();
            return this;
        },

        refresh: function() {
            this.getInfoAndRender();
        },

        getInfoAndRender: function() {
            var self = this;
            if (self.ws) {
                self.ws.get_object_info_new({objects:[{ref:self.objref}],includeMetadata:1},
                    function(objInfoList) {
                        console.log(objInfoList);
                        if (objInfoList[0]) {
                            var obj_info = objInfoList[0];
                            self.objData = {
                                    obj_id: obj_info[0],
                                    name: obj_info[1],
                                    type: obj_info[2],
                                    save_date: obj_info[3],
                                    version: obj_info[4],
                                    saved_by: obj_info[5],
                                    wsid: obj_info[6],
                                    workspace: obj_info[7],
                                    chsum: obj_info[8],
                                    size: obj_info[9],
                                    meta: obj_info[10],
                            };
                            self.$mainPanel.empty();
                            self.$mainPanel.append(self.getVizWidgetDiv(obj_info,self.type2widget));
                        } else {
                            //self.showError({error:{message:'An unknown error occurred while fetching data.'}});
                        }
                    },
                    function(error) {
                        console.error(error);
                    }
                );
            }
        },

	
        type2widget: {},
	
        setupType2Widget: function() {
	    var self = this;
	    
	    // all the modeling types have the same config
	    var modelingConfig = {
		    widget:'kbaseTabTable',
		    options: '{"obj":???id,"ws":???ws,"type":"???type"}'
		};
	    
	    // this is crazy, but for now we just hard code this - should be loaded from a config
	    // widget : widget to use to render
	    // options : what to pass to the widget
	    // noPanel : set to true to give control of everything to the widget
	    self.type2widget = {
		
		'Communities.Collection': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		'Communities.FunctionalMatrix': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		'Communities.FunctionalProfile': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		'Communities.Heatmap': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		/* NEEDS A COMPLEX LANDING PAGE */
		'Communities.Metagenome': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		'Communities.PCoA': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		'Communities.TaxonomicMatrix': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		'Communities.TaxonomicProfile': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		
		
		'GenomeComparison.ProteomeComparison': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		
		'KBaseAssembly.AssemblyReport': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		
		/* STILL NEEDS A MORE COMPLEX LANDING PAGE */
		'KBaseBiochem.Media': modelingConfig,
		'KBaseFBA.FBA': modelingConfig,
		
		/* STILL NEEDS A COMPLEX LANDING PAGE */
		'KBaseFBA.FBAModel': modelingConfig,
		
		'KBaseGeneDomains.DomainAnnotation': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		
		'KBaseGenomes.ContigSet': {
		    widget:'kbaseContigSetView',
		    options: '{"ws_id":???id,"ws_name":???ws,"loadingImage":"'+this.options.loadingImage+'"}'
		},
		'KBaseGenomes.MetagenomeAnnotation': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		'KBaseGenomes.Pangenome': {
		    widget:'kbaseJsonView',
		    options: '{"id":???id,"ws":???ws}'
		},
		
		'KBasePhenotypes.PhenotypeSet': modelingConfig,
		'KBasePhenotypes.PhenotypeSimulationSet': modelingConfig,
		'KBaseSearch.GenomeSet': modelingConfig,
		
		'KBaseTrees.Tree': {
		    widget:'kbaseTree',
		    options: '{"treeID":???id,"workspaceID":???ws,"treeObjVer":???ver,"loadingImage":"'+this.options.loadingImage+'"}'
		},
		
		/* COMPLEX LANDING PAGE */
		'KBaseGenomes.Genome': {
		    widget:'KBaseGenomePage',
		    noPanel:true,
		    options: '{"genomeID":???id,"workspaceID":???ws,"loadingImage":"'+this.options.loadingImage+'"}'
		},
	    };
	},
	
	
	getVizWidgetDiv: function(obj_info, type2widget) {
	    var type = obj_info[2].split('-')[0];
	    if (type2widget.hasOwnProperty(type)) {
		var config = type2widget[type];
		if (config.widget && config.options) {
		    var options = config.options;
		    options = options.replace(/\?\?\?ws/g, obj_info[6]);
		    options = options.replace(/\?\?\?wsname/g, obj_info[7]);
		    options = options.replace(/\?\?\?id/g, obj_info[0]);
		    options = options.replace(/\?\?\?objname/g, obj_info[1]);
		    options = options.replace(/\?\?\?ver/g, obj_info[4]);
		    options = options.replace(/\?\?\?type/g, type);
		    
		    var optionsObj;
		    try {
			optionsObj = JSON.parse(options);
		    } catch(err) {
			console.error('loading viewer widget "'+config.widget+'" with unparsable options: ', options, err);
		    }
		    if (optionsObj) {
			console.log('loading viewer widget "'+config.widget+'" with options ',options);
			var $widgetDiv = $('<div>');
			var widget = $widgetDiv[config.widget](optionsObj);
			if (config.noPanel) { return $widgetDiv; } // no panel, so assume widget takes care of everything
			
			// put this all in a panel
			var $panel = $('<div>').addClass("panel panel-default")
					.append($('<div>').addClass('panel-heading')
						.append($('<span>').addClass('panel-title')
							    .append('Data Visualization')))
					.append($('<div>').addClass('panel-body').append($widgetDiv));
					
				//css({'margin':'10px'});
			return $panel;
		    }
		} else {
		    console.error('Viewer config does not have properties "widget" and "options" for: ',obj_info);
		}
	    } else {
		console.log('No default viewer configured for: ',obj_info);
	    }
	    // no viewer found or there was a bad config, so don't show anything
	    return $('<div>');
	}
	
    });
})( jQuery );
