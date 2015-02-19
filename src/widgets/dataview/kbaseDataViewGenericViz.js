/**
 *
 *
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
	    sub: null, // for specifying subobjects: ex. feature, must be object={sub:TYPE, subid:ID}
            ws_url: "https://kbase.us/services/ws",
            loadingImage: "assets/img/ajax-loader.gif",
            auth: null,
        },
        objref: null,
	
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
	    
            this.$mainPanel = $("<div>");
            this.$elem.append(this.$mainPanel);
	    
            if (!this.auth.token) {
                this.ws = kb.ws;  //new Workspace(this.options.ws_url);
                this.loggedIn = false;
            } else {
                //console.log(['authenticated:', this.auth]);
                this.ws = new Workspace(this.options.ws_url, this.auth);
                this.loggedIn = true;
                this.getInfoAndRender();
            }
	    
            return this;
        },

        loggedInCallback: function(event, auth) {
            this.options.auth = auth;
            //console.log(['authenticated:', this.options.auth]);
            this.ws = new Workspace(this.options.ws_url, this.options.auth);
            this.loggedIn = true;
            this.getInfoAndRender();
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
                            self.$mainPanel.append(self.getVizWidgetDiv(obj_info,self.options.sub,self.type2widget));
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
		    options: '{"obj":???objname,"ws":???wsname,"type":"???type"}'
		};
	    
	    // this is crazy, but for now we just hard code this - should be loaded from a config
	    // widget : widget to use to render
	    // options : what to pass to the widget
	    // noPanel : set to true to give control of everything to the widget
	    // sub : handler for subdata of the given object
	    // NOTE: if you are adding new subdata pages, then you also need to add the subdatata type to the
	    //       list of allowed types in functional-site/js/dataview.js
	    self.type2widget = {
		
		'Communities.Collection': {
            //no widget, yet? Doesn't work?
            //CollectionView - takes id, ws
		    widget:'CollectionView',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		'Communities.FunctionalMatrix': {
            /* Done! Narrative uses AbundanceDataView */

            //AbundanceDataBoxplot - id, name, ws, auth
            // expects auth, ws passed to it.
            //AbundanceDataView - id, name, ws
            //RankAbundancePlot - id, name [0,1], top ["10"-text], order [average, max, sum], ws, auth
            //AbundanceDataTable - id, name, ws, auth
		    widget:'AbundanceDataView',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		'Communities.FunctionalProfile': {
            /* Done! Narrative uses AbundanceDataView */

		    widget:'AbundanceDataView',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		'Communities.Heatmap': {
            /* Done! Same as narrative */

            //AbundanceDataHeatmap - id, ws
		    widget:'AbundanceDataHeatmap',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		/* NEEDS A COMPLEX LANDING PAGE */
		'Communities.Metagenome': {
            /* Plugged in MetagenomeView (required a different kbaseTabs than for Neal's modeling) */
            /* It works! */
            //MetagenomeView - id, ws
		    widget:'MetagenomeView',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		'Communities.PCoA': {
            /* Done! Same as what Narrative uses. Font sizes of axis labels is too big. */
            //AbundanceDataPcoa
            // expects id, x_axis (default 2, text), y_axis (default 2, text), ws
		    widget:'AbundanceDataPcoa',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		'Communities.TaxonomicMatrix': {
            /* Done! Narrative uses AbundanceDataView */

            //AbundanceDataBoxplot - id, name, ws, auth
            // expects auth, ws passed to it.
            //AbundanceDataView - id, name, ws
            //RankAbundancePlot - id, name [0,1], top ["10"-text], order [average, max, sum], ws, auth
            //AbundanceDataTable - id, name, ws, auth
            widget:'AbundanceDataView',
            options: '{"id":???objname,"ws":???wsname}'
		},
		'Communities.TaxonomicProfile': {
            /* Done! Narrative uses AbundanceDataView */

		    widget:'AbundanceDataView',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		
		
		'GenomeComparison.ProteomeComparison': {
		    widget:'GenomeComparisonWidget',
		    options: '{"ws_id":???objname,"ws_name":???wsname}'
		},
		
		'KBaseGenomes.GenomeComparison': {
		    widget:'kbaseGenomeComparisonViewer',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		
		'KBaseAssembly.AssemblyReport': {
		    widget:'kbaseAssemblyView',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		
		/* STILL NEEDS A MORE COMPLEX LANDING PAGE */
		'KBaseBiochem.Media': modelingConfig,
		'KBaseFBA.FBA': modelingConfig,
		
		/* STILL NEEDS A COMPLEX LANDING PAGE */
		'KBaseFBA.FBAModel': modelingConfig,
		
		'KBaseGeneFamilies.DomainAnnotation': {
		    widget:'kbaseDomainAnnotation',
		    options: '{"domainAnnotationID":???objid,"workspaceID":???wsid,"domainAnnotationVer":???ver,'+
				'"loadingImage":"'+this.options.loadingImage+'"}'
		},
		
        /* ASSEMBLY datatypes*/
        'KBaseAssembly.AssemblyInput': {
		    widget:'kbaseAssemblyInput',
		    options: '{"objId":???objid,"workspaceId":???wsid,"objVer":???ver,'+
				'"loadingImage":"'+this.options.loadingImage+'"}'
		},    
        'KBaseAssembly.PairedEndLibrary': {
		    widget:'kbasePairedEndLibrary',
		    options: '{"objId":???objid,"workspaceId":???wsid,"objVer":???ver,'+
				'"loadingImage":"'+this.options.loadingImage+'"}'
		},     
        'KBaseAssembly.ReferenceAssembly': {
		    widget:'kbaseReferenceAssembly',
		    options: '{"objId":???objid,"workspaceId":???wsid,"objVer":???ver,'+
				'"loadingImage":"'+this.options.loadingImage+'"}'
		},     
        'KBaseAssembly.SingleEndLibrary': {
		    widget:'kbaseSingleEndLibrary',
		    options: '{"objId":???objid,"workspaceId":???wsid,"objVer":???ver,'+
				'"loadingImage":"'+this.options.loadingImage+'"}'
		},     
        'KBaseFile.PairedEndLibrary': {
		    widget:'kbaseFilePairedEndLibrary',
		    options: '{"objId":???objid,"workspaceId":???wsid,"objVer":???ver,'+
				'"loadingImage":"'+this.options.loadingImage+'"}'
		},                 
            
            
		'KBaseGenomes.ContigSet': {
		    widget:'kbaseContigSetView',
		    options: '{"ws_id":???objname,"ws_name":???wsname,"ver":???ver,"loadingImage":"'+this.options.loadingImage+'"}'
		},
		'KBaseGenomes.MetagenomeAnnotation': {
		    widget:'AnnotationSetTable',
		    options: '{"id":???objname,"ws":???wsname}'
		},
		'KBaseGenomes.Pangenome': {
		    widget:'kbasePanGenome',
		    options: '{"name":???objname,"ws":???wsname}'
		},
		
		'KBasePhenotypes.PhenotypeSet': modelingConfig,
		'KBasePhenotypes.PhenotypeSimulationSet': modelingConfig,
		'KBaseSearch.GenomeSet': modelingConfig,
		
		'KBaseTrees.Tree': {
		    widget:'kbaseTree',
		    options: '{"treeID":???objname,"workspaceID":???wsname,"treeObjVer":???ver,"loadingImage":"'+this.options.loadingImage+'"}'
		},
		
		/* COMPLEX LANDING PAGE */
		'KBaseGenomes.Genome': {
		    widget:'KBaseGenomePage',
		    noPanel:true,
		    options: '{"genomeID":???objname,"workspaceID":???wsname,"loadingImage":"'+this.options.loadingImage+'"}',
		    sub:{
			Feature: {
			    widget:'KBaseGenePage',
			    noPanel:true,
			    options: '{"genomeID":???objname,"workspaceID":???wsname,"featureID":???subid,"loadingImage":"'+this.options.loadingImage+'"}'
			}
		    }
		}
	    };
	    
	    /*var list = ''; var list2=''
	    for(var x in self.type2widget) {
		if (self.type2widget.hasOwnProperty(x)) {
		    list = list + x+'\n';
		    list2 = list2 + self.type2widget[x].widget+"\n";
		}
	    }
	    console.log(list);
	    console.log(list2);*/
	},
	
	
	getVizWidgetDiv: function(obj_info, sub, type2widget) {
        var type = obj_info[2].split('-')[0];
        if (type2widget.hasOwnProperty(type)) {
            var config = type2widget[type];
	    if (sub) {
		if(sub.sub && sub.subid) {
		    if (config.sub) {
			if (config.sub.hasOwnProperty(sub.sub)) {
			    config = config.sub[sub.sub];  // ha, crazy line, i know.
			} else {
			    console.error('Sub was specified, but config has no correct sub handler, sub:',sub,"config:",config);
			    return $('<div>');
			}
		    } else {
			console.error('Sub was specified, but config has no sub handler, sub:',sub,"config:",config);
			return $('<div>');
		    }
		} else {
		    console.error('Something was in sub, but no sub.sub or sub.subid found',sub);
		    return $('<div>');
		}
	    }
	    
            if (config.widget && config.options) {
                var options = config.options;
                options = options.replace(/\?\?\?wsid/g, obj_info[6]);
                options = options.replace(/\?\?\?wsname/g, JSON.stringify(obj_info[7]));
                options = options.replace(/\?\?\?objid/g, obj_info[0]);
                options = options.replace(/\?\?\?objname/g, JSON.stringify(obj_info[1]));
                options = options.replace(/\?\?\?ver/g, obj_info[4]);
                options = options.replace(/\?\?\?type/g, type);
		if (sub && sub.subid) {
		    options = options.replace(/\?\?\?subid/g, JSON.stringify(sub.subid));
		}
                // thought I needed these, but I don't - still, I left them here.
                // options = options.replace(/\?\?\?auth/g, JSON.stringify(this.options.auth));
                // options = options.replace(/\?\?\?token/g, '"'+this.options.auth.token+'"');
                var optionsObj;
                try {
                    optionsObj = JSON.parse(options);
                } catch(err) {
                    console.error('loading viewer widget "'+config.widget+'" with unparsable options: ', options, err);
                }
                if (optionsObj) {
                    console.log('loading viewer widget "'+config.widget+'" with options ',options);
		    try {
			var $widgetDiv = $('<div>');
			var widget = $widgetDiv[config.widget](optionsObj);
			if (config.noPanel) { 
			    return $widgetDiv; 
			} // no panel, so assume widget takes care of everything
    
			// put this all in a panel
			var $panel = $('<div>').addClass("panel panel-default")
				     .append($('<div>').addClass('panel-heading')
				     .append($('<span>').addClass('panel-title')
				     .append('Data View')))
				     .append($('<div>').addClass('panel-body').append($widgetDiv));
    
			//css({'margin':'10px'});
			return $panel;
		    } catch(err) {
			console.error('Error rendering widget for ',obj_info);
			console.error(err);
			return $('<div>');
		    }
                }
            } else {
                console.error('Viewer config does not have properties "widget" and "options" for: ',obj_info);
            }
        } else {
            console.log('No default viewer configured for: ',obj_info);
        }
        // no viewer found or there was a bad config, so don't show anything
        return $('<div>');
    }});
})( jQuery );
