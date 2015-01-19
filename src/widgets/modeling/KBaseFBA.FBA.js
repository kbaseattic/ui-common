function KBase_FBA(modeltabs) {
    var self = this;
	this.modeltabs = modeltabs;
	this.tabList = [{
		"key": "overview",
		"name": "Overview",
		"type": "verticaltbl",
		"rows": [{
			"label": "ID",
			"key": "wsid"
		},{
			"label": "Object type",
			"key": "objecttype",
			"type": "typelink"
		},{
			"label": "Owner",
			"key": "owner"
		},{
			"label": "Version",
			"key": "instance"
		},{
			"label": "Mod-date",
			"key": "moddate"
		},{
			"label": "Objective value",
			"key": "objective"
		},{
			"label": "Objective function",
			"key": "objectivefunction"
		},{
			"label": "Model",
			"key": "model"
			"type": "wslink"
		},{
			"label": "Media",
			"key": "media",
			"type": "wslink"
		},{
			"label": "Regulome",
			"key": "regulome",
			"type": "wslink"
		},{
			"label": "Prom Constraint",
			"key": "promconstraint",
			"type": "wslink"
		},{
			"label": "Expression",
			"key": "expression",
			"type": "wslink"
		},{
			"label": "Single KO",
			"key": "singleko"
		},{
			"label": "Number reactions",
			"key": "numreactions"
		},{
			"label": "Number compounds",
			"key": "numcompounds"
		},{
			"label": "Gene KO",
			"key": "numgeneko"
		},{
			"label": "Reaction KO",
			"key": "numrxnko"
		},{
			"label": "Custom bounds",
			"key": "numcpdbounds"
		},{
			"label": "Custom constraints",
			"key": "numconstraints"
		},{
			"label": "Media supplements",
			"key": "numaddnlcpds"
		},{
			"label": "Uptake limits",
			"key": "uptakelimits"
		},{
			"label": "Uptake limits",
			"key": "uptakelimits"
		},{
			"label": "Minimize fluxes?",
			"key": "minfluxes",
			"type": "boolean"
		},{
			"label": "Find minimal media?",
			"key": "findminmedia",
			"type": "boolean"
		},{
			"label": "Minimize reactions?",
			"key": "minimizerxn",
			"type": "boolean"
		},{
			"label": "All reactions reversible?",
			"key": "allreversible",
			"type": "boolean"
		},{
			"label": "Thermodynamic constraints?",
			"key": "simplethermo",
			"type": "boolean"
		},{
			"label": "Objective fraction",
			"key": "objfraction"
		}]		
	}, {
		"key": "modelreactions",
		"name": "Reactions",
		"visible": 1,
		"columns": [{
			"label": "Reaction",
			"key": "dispid",
			"type": "tabLink",
			"tabLinkKey": "id"
			"function": "ReactionTab",
			"width": "15%",
			"visible": 1
		}, {
			"label": "Flux",
			"key": "flux",
			"visible": 1
		}, {
			"label": "Min flux<br>(Lower bound)",
			"key": "disp_low_flux",
			"visible": 1
		}, {
			"label": "Max flux<br>(Upper bound)",
			"key": "disp_max_flux",
			"visible": 1
		}, {
			"label": "Class",
			"key": "fluxClass",
			"visible": 1
		}, {
			"label": "Equation",
			"key": "equation",
			"visible": 1
		}, {
			"label": "Genes",
			"key": "genes",
			"type": "tabLinkArray",
			"function": "GeneTab",
			"visible": 1
		}]
	}, {
		"key": "modelcompounds",
		"name": "Compounds",
		"visible": 1,
		"columns": [{
			"label": "Compound",
			"key": "id",
			"type": "tabLink",
			"function": "CompoundTab",
			"visible": 1
		}, {
			"label": "Name",
			"key": "name",
			"visible": 1
		}, {
			"label": "Uptake flux",
			"key": "flux",
			"visible": 1
		}, {
			"label": "Min flux<br>(Lower bound)",
			"key": "disp_low_flux",
			"visible": 1
		}
		}, {
			"label": "Max flux<br>(Upper bound)",
			"key": "disp_max_flux",
			"visible": 1
		}, {
			"label": "Class",
			"key": "fluxClass",
			"visible": 1
		}, {
			"label": "Formula",
			"key": "formula",
			"visible": 1
		}, {
			"label": "Charge",
			"key": "charge",
			"visible": 1
		}, {
			"label": "Compartment",
			"key": "compartment",
			"type": "tabLink",
			"function": "CompartmentTab",
			"visible": 1
		}]
	}, {
		"key": "modelgenes",
		"name": "Genes",
		"visible": 1,
		"columns": [{
			"label": "Gene",
			"key": "id",
			"type": "tabLink",
			"function": "GeneTab",
			"visible": 1
		}, {
			"label": "Gene knocked out",
			"key": "ko",
			"visible": 1
		}, {
			"label": "Fraction of growth with KO",
			"key": "growthFraction",
			"visible": 0
		}]
	}, {
		"key": "biomasscpds",
		"name": "Biomass reactions",
		"visible": 1,
		"columns": [{
			"label": "Biomass",
			"key": "biomass",
			"type": "tabLink",
			"function": "BiomassTab",
			"visible": 1
		}, {
			"label": "Biomass flux",
			"key": "bioflux",
			"visible": 1
		}, {
			"label": "Name",
			"key": "name",
			"visible": 1
		}, {
			"label": "Coefficient",
			"key": "coefficient",
			"visible": 1
		}, {
			"label": "Compartment",
			"key": "compartment",
			"type": "tabLink",
			"function": "CompartmentTab",
			"visible": 1
		}, {
			"label": "Max production",
			"key": "maxprod",
			"visible": 0
		}]
	}];
	
	this.setMetadata = function (indata) {
		this.workspace = data[7];
        this.objName = data[1];
        this.overview = {wsid: data[7]+"/"+data[1],
                         ws: data[7],
                         obj_name: data[1],
                         objecttype: data[2],
                         owner: data[5],
                         instance: data[4],
                         moddate: data[3]}

        // if there is user metadata, add it
        if ('Model' in data[10]) {
            this.usermeta = {objective: data[10]["Objective"],
                             model: data[10]["Model"],
                             media: data[10]["Media"],
                             singleko: data[10]["Combination deletions"],
                             numreactions: data[10]["Number reaction variables"],
                             numcompounds: data[10]["Number compound variables"],
                             numgeneko: data[10]["Number gene KO"],
                             numrxnko: data[10]["Number reaction KO"],
                             numcpdbounds: data[10]["Number compound bounds"],
                             numconstraints: data[10]["Number constraints"],
                             numaddnlcpds: data[10]["Number additional compounds"]}
                             
            $.extend(this.overview, this.usermeta)
        }
	};
		
	this.setData = function (indata) {
		this.data = indata;
		this.modeltabs.kbapi('ws', 'get_objects', [{ref: indata.fbamodel_ref}])
          .done(function(data){
			  this.model = new KBaseFBA.FBAModel(this.modeltabs);
			  this.model.setMetadata(data[0].info);
			  var setMethod = this.model.setData(data[0].data);
              // see if setData method returns promise or not
              if (setMethod && 'done' in setMethod) {
                  setMethod.done(function() {
                    this.formatObject()
                })
              } else {
                  this.formatObject();
              }
        })
    }
        
    this.formatObject = function () {
    	this.usermeta.model = indata.fbamodel_ref;
		this.usermeta.media = indata.media_ref;
		this.usermeta.objective = indata.objectiveValue;
		this.usermeta.minfluxes = indata.fluxMinimization;
		this.usermeta.findminmedia = indata.findMinimalMedia;
		this.usermeta.minimizerxn = indata.minimize_reactions;
		this.usermeta.allreversible = indata.allReversible;
		this.usermeta.simplethermo = indata.simpleThermoConstraints;
		this.usermeta.objfraction = indata.objectiveConstraintFraction;
		this.usermeta.regulome = indata.regulome_ref;
		this.usermeta.promconstraint = indata.promconstraint_ref;
		this.usermeta.expression = indata.tintlesample_ref;
		this.usermeta.phenotypeset = indata.phenotypeset_ref;
		this.usermeta.phenotypesimulationset = indata.phenotypesimulationset_ref;		
		this.usermeta.singleko = indata.comboDeletions;
		this.usermeta.defaultmaxflux = indata.defaultMaxFlux;
		this.usermeta.defaultmaxdrain = indata.defaultMaxDrainFlux;
		this.usermeta.defaultmindrain = indata.defaultMinDrainFlux;
		this.usermeta.phenotypesimulationset = indata.phenotypesimulationset_ref;		
		this.usermeta.uptakelimits = "";
		for (var key in indata.uptakelimits) {
			if (this.usermeta.uptakelimits.length > 0) {
				this.usermeta.uptakelimits += "<br>";
			}
			this.usermeta.uptakelimits += key+":"+this.uptakelimits[key];
		}
		this.usermeta.objectivefunction = "Minimize{";
		if (indata.maximizeObjective == 1) {
			this.usermeta.objectivefunction = "Maximize{";
		}
		for (var key in indata.compoundflux_objterms) {
			this.usermeta.objectivefunction += " ("+indata.compoundflux_objterms[key]+") "+key;
		}
		for (var key in indata.reactionflux_objterms) {
			this.usermeta.objectivefunction += " ("+indata.reactionflux_objterms[key]+") "+key;
		}
		for (var key in indata.biomassflux_objterms) {
			this.usermeta.objectivefunction += " ("+indata.biomassflux_objterms[key]+") "+key;
		}
		this.usermeta.objectivefunction += "}";
		this.modelreactions = this.model.modelreactions;
		this.modelcompounds = this.model.modelcompounds;
		this.biomasscpds = this.model.biomasscpds;
		this.modelgenes = this.model.modelgenes;
		this.FBAConstraints = indata.FBAConstraints;
		this.FBAMinimalMediaResults = indata.FBAMinimalMediaResults;
		this.FBAMinimalReactionsResults = indata.FBAMinimalReactionsResults;
		var rxnhash;
		for (var i=0; i < indata.FBAReactionVariables.length; i++) {
			var rxnid = indata.FBAReactionVariables[i].modelreaction_ref.split("/").pop();
			indata.FBAReactionVariables[i].ko = 0;
			rxnhash[rxnid] = indata.FBAReactionVariables[i];
		}
		for (var i=0; i < indata.reactionKO_refs.length; i++) {
			var rxnid = indata.reactionKO_refs[i].split("/").pop();
			rxnhash[rxnid].ko = 1;
		}
		var cpdhash;
		for (var i=0; i < indata.FBACompoundBounds.length; i++) {
			var cpdid = indata.FBACompoundBounds[i].modelcompound_ref.split("/").pop();
			indata.FBACompoundBounds[i].additionalcpd = 0;
			cpdhash[cpdid] = indata.FBACompoundBounds[i];
		}
		for (var i=0; i < indata.additionalCpd_refs.length; i++) {
			var cpdid = indata.additionalCpd_refs[i].split("/").pop();
			cpdhash[cpdid].additionalcpd = 1;
		}
		var biohash;
		for (var i=0; i < indata.FBABiomassVariables.length; i++) {
			var bioid = indata.FBABiomassVariables[i].biomass_ref.split("/").pop();
			biohash[bioid] = indata.FBABiomassVariables[i];
		}
		this.maxpod = 0;
		var metprodhash;
		for (var i=0; i < this.FBAMetaboliteProductionResults.length; i++) {
			var metprod = indata.FBAMetaboliteProductionResults[i];
			var cpdid = metprod.modelcompound_ref.split("/").pop();
			metprodhash[cpdid] = metprod;
		}
		var genehash;
		for (var i=0; i < this.modelgenes.length; i++) {
			genehash[this.modelgenes[i].id] = this.modelgenes[i];
			genehash[this.modelgenes[i].id].ko = 0;
		}
		for (var i=0; i < indata.geneKO_refs.length; i++) {
			var geneid = indata.geneKO_refs[i].split("/").pop();
			genehash[geneid].ko = 1;
		}
		var delhash;
		for (var i=0; i < indata.FBADeletionResults.length; i++) {
			var geneid = indata.FBADeletionResults[i].feature_refs[0].split("/").pop();
			delhash[geneid] = indata.FBADeletionResults[i];
		}
		var cpdboundhash;
		for (var i=0; i < indata.FBACompoundBounds.length; i++) {
			var cpdid = indata.FBACompoundBounds[i].modelcompound_ref.split("/").pop();
			cpdboundhash[cpdid] = indata.FBACompoundBounds[i];
		}
		var rxnboundhash;
		for (var i=0; i < indata.FBAReactionBounds.length; i++) {
			var rxnid = indata.FBAReactionBounds[i].modelreaction_ref.split("/").pop();
			rxnboundhash[rxnid] = indata.FBAReactionBounds[i];
		}
		for (var i=0; i< this.modelgenes.length; i++) {
			var mdlgene = this.modelgenes[i];
			if (genehash[mdlgene.id]) {
				mdlgene.ko = genehash[mdlgene.id].ko;
			}
			if (delhash[mdlgene.id]) {
				mdlgene.growthFraction = delhash[mdlgene.id].growthFraction;
			}
		}
		for (var i=0; i< this.modelreactions.length; i++) {
			var mdlrxn = this.modelreactions[i];
			if (rxnhash[mdlrxn.id]) {
				mdlrxn.upperFluxBound = rxnhash[mdlrxn.id].upperFluxBound;
				mdlrxn.lowerFluxBound = rxnhash[mdlrxn.id].lowerFluxBound;
				mdlrxn.fluxMin = rxnhash[mdlrxn.id].min;
				mdlrxn.fluxMax = rxnhash[mdlrxn.id].max;
				mdlrxn.flux = rxnhash[mdlrxn.id].value;
				mdlrxn.fluxClass = rxnhash[mdlrxn.id].class;
				mdlrxn.disp_low_flux = mdlrxn.fluxMin + "<br>(" + mdlrxn.lowerFluxBound + ")";
				mdlrxn.disp_high_flux = mdlrxn.fluxMax + "<br>(" + mdlrxn.upperFluxBound + ")";
			}
			if (rxnboundhash[mdlrxn.id]) {
				mdlrxn.customUpperBound = rxnboundhash[mdlrxn.id].upperBound;
				mdlrxn.customLowerBound = rxnboundhash[mdlrxn.id].lowerBound;
			}
		}
		this.compoundFluxes = [];
		var cpdfluxhash;
		for (var i=0; i< this.modelcompounds.length; i++) {
			var mdlcpd = this.modelcompounds[i];
			if (cpdhash[mdlcpd.id]) {
				mdlcpd.upperFluxBound = cpdhash[mdlcpd.id].upperBound;
				mdlcpd.lowerFluxBound = cpdhash[mdlcpd.id].lowerBound;
				mdlcpd.fluxMin = cpdhash[mdlcpd.id].min;
				mdlcpd.fluxMax = cpdhash[mdlcpd.id].max;
				mdlcpd.uptake = cpdhash[mdlcpd.id].value;
				mdlcpd.fluxClass = cpdhash[mdlcpd.id].class;
				mdlcpd.disp_low_flux = mdlcpd.fluxMin + "<br>(" + mdlcpd.lowerFluxBound + ")";
				mdlcpd.disp_high_flux = mdlcpd.fluxMax + "<br>(" + mdlcpd.upperFluxBound + ")";
				cpdfluxhash[mdlcpd.id] = mdlcpd;
				this.compoundFluxes.push(mdlcpd);
			}
			if (metprodhash[mdlcpd.id]) {
				mdlcpd.maxProd = metprodhash[mdlcpd.id].maximumProduction;
				if (!cpdfluxhash[mdlcpd.id]) {
					this.compoundFluxes.push(mdlcpd);
				}
			}
			if (cpdboundhash[mdlcpd.id]) {
				mdlcpd.customUpperBound = cpdboundhash[mdlcpd.id].upperBound;
				mdlcpd.customLowerBound = cpdboundhash[mdlcpd.id].lowerBound;
				if (!cpdfluxhash[mdlcpd.id]) {
					this.compoundFluxes.push(mdlcpd);
				}
			}
		}
		for (var i=0; i< this.biomasses.length; i++) {
			var bio = this.biomasses[i];
			if (biohash[bio.id]) {
				bio.upperFluxBound = biohash[mdlcpd.id].upperBound;
				bio.lowerFluxBound = biohash[mdlcpd.id].lowerBound;
				bio.fluxMin = biohash[mdlcpd.id].min;
				bio.fluxMax = biohash[mdlcpd.id].max;
				bio.uptake = biohash[mdlcpd.id].value;
				bio.fluxClass = biohash[mdlcpd.id].class;
				this.modelreactions.push(bio);
			}
		}
		for (var i=0; i < this.biomasscpds.length; i++) {
			var biocpd = this.biomasscpds[i];
			if (biohash[biocpd.biomass.id]) {
				biocpd[i].bioflux = biohash[biocpd.biomass.id].value;	
			}
			if (metprodhash[biocpd.cpdid]) {
				biocpd[i].maxprod = metprodhash[mdlcpd.id].maximumProduction;
			}
		}
	};
	
	this.ReactionTab = function (id) {
        var rxn = this.rxnhash[id];
        if (id.search(/rxn\d+/g) == -1)
            return;

        var p = this.modeltabs
                    .getBiochemReaction(id)
                    .then(function(rxn){
                        return [{
                                   "label": "ID",
                                    "data": rxn.id
                                },{
                                    "label": "Name",
                                    "data": rxn.name
                                },{
                                    "label": "Equation",
                                    "data": rxn.equation,
                                    "type": "pictureEquation"
                                },/*{
                                    "label": "GPR",
                                    "data": rxn.gpr,
                            }*/];
                     })
        return p;
    }

    this.GeneTab = function (id) {
        var gene = this.genehash[id];
        return [{
                "label": "ID",
                "data": gene.id
            },{
                "label": "Reactions",
                "data": rxn.reactions,
                "type": "tabLinkArray"
        }];
    }

    this.CompoundTab = function (id) {
        var cpd = this.cpdhash[id];

         // your hash includes the compartement, so cpd.compartment (or cpd.cmpkbid?) is missing
        var p = this.modeltabs
                    .getBiochemCompound(id)
                    .then(function(cpd){
                        return [{
                                     "label": "Compound",
                                     "data": cpd.id,
                                 }, {
                                     "label": "Name",
                                     "data": "name"
                                 }, {
                                     "label": "Formula",
                                     "data": "formula"
                                 }, {
                                     "label": "Charge",
                                     "data": "charge"
                                 }, {
                                     "label": "Compartment",
                                     "data": cpd.compartment,
                                     "type": "tabLink",
                                     "function": "CompartmentTab"
                                 }];
                     })
        return p;

    }

    this.CompartmentTab = function (id) {
        return [[]];
    }

    this.BiomassTab = function (id) {
        return [[]];
    }

    this.GapfillTab = function (id) {
        return [[]];
    }    
}