function KBaseFBA_FBAModel(modeltabs) {
    var self = this;
    this.modeltabs = modeltabs;

    this.setMetadata = function (data) {
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
        if ('Name' in data[10]) {
            this.usermeta = {name: data[10]["Name"],
                             source: data[10]["Source"]+"/"+data[10]["Source ID"],
                             genome: data[10]["Genome"],
                             modeltype: data[10]["Type"],
                             numreactions: data[10]["Number reactions"],
                             numcompounds: data[10]["Number compounds"],
                             numcompartments: data[10]["Number compartments"],
                             numbiomass: data[10]["Number biomasses"],
                             numgapfills: data[10]["Number gapfills"]}
            $.extend(this.overview, this.usermeta)
        }
    };

    this.tabList = [{
        "key": "overview",
        "name": "Overview",
        "type": "verticaltbl",
        "rows": [{
            "label": "Name",
            "key": "name"
        },{
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
            "label": "Source",
            "key": "source"
        },{
            "label": "Genome",
            "key": "genome",
            "type": "wstype",
        },{
            "label": "Model type",
            "key": "modeltype"
        },{
            "label": "Number reactions",
            "key": "numreactions"
        },{
            "label": "Number compounds",
            "key": "numcompounds"
        },{
            "label": "Number compartments",
            "key": "numcompartments"
        },{
            "label": "Number biomass",
            "key": "numbiomass"
        },{
            "label": "Number gapfills",
            "key": "numgapfills"
        }
        ]
    }, {
        "key": "modelreactions",
        "name": "Reactions",
        "type": "dataTable",
        "columns": [{
            "label": "Reaction",
            "type": "tabLink",
            "linkformat": "dispIDCompart",
            "key": "id",
            "method": "ReactionTab",
            "width": "15%"
        }, {
            "label": "Name",
            "key": "name"
        }, {
            "label": "Equation",
            "key": "equation",
            "type": "tabLink",
            "linkformat": "linkequation",
        }, {
            "label": "Genes",
            "key": "genes",
            "type": "tabLinkArray",
            "method": "GeneTab",
        }]
    }, {
        "key": "modelcompounds",
        "name": "Compounds",
        "type": "dataTable",
        "columns": [{
            "label": "Compound",
            "key": "id",
            "type": "tabLink",
            "linkformat": "dispIDCompart",
            "method": "CompoundTab",
            "width": "15%"
        }, {
            "label": "Name",
            "key": "name"
        }, {
            "label": "Formula",
            "key": "formula"
        }, {
            "label": "Charge",
            "key": "charge"
        },/*{
            "label": "Compartment",
            "key": "compartment",
            "type": "tabLink",
            "method": "CompartmentTab"
        }*/]
    }, {
        "key": "modelgenes",
        "name": "Genes",
        "type": "dataTable",
        "columns": [{
            "label": "Gene",
            "key": "id",
            "type": "tabLink",
            "method": "GeneTab"
        }, {
            "label": "Reactions",
            "key": "reactions",
            "type": "tabLinkArray",
            "method": "ReactionTab",
        }]
    }, {
        "key": "modelcompartments",
        "name": "Compartments",
        "type": "dataTable",
        "columns": [{
            "label": "Compartment",
            "key": "id",
            "type": "tabLink",
            "method": "CompartmentTab"
        }, {
            "label": "Name",
            "key": "label"
        }, {
            "label": "pH",
            "key": "pH"
        }, {
            "label": "Potential",
            "key": "potential"
        }]
    }, {
        "key": "biomasscpds",
        "name": "Biomass",
        "type": "dataTable",
        "columns": [{
            "label": "Biomass",
            "key": "biomass",
            "type": "subTabLink",
            "method": "BiomassTab"
        }, {
            "label": "Compound",
            "key": "id",
            "type": "tabLink",
            "linkformat": "dispIDCompart",
            "method": "CompoundTab"
        }, {
            "label": "Name",
            "key": "name"
        }, {
            "label": "Coefficient",
            "key": "coefficient"
        }, /*{
            "label": "Compartment",
            "key": "compartment",
            "type": "tabLink",
            "method": "CompartmentTab"
        }*/]
    }, {
        "key": "gapfillings",
        "name": "Gapfilling",
        "type": "dataTable",
        "columns": [{
            "label": "Gapfill",
            "key": "simpid",
            "linkformat": "dispID",
            "type": "tabLink",
            "method": "GapfillTab",
        }, {
            "label": "Integrated",
            "key": "integrated"
        }, {
            "label": "Media",
            "key": "media_ref",
            "linkformat": "dispWSRef",
            "type": "wstype",
            "wstype": "KBaseFBA.Media"
        }, /*{
            "label": "FBA",
            "key": "fba_ref",
            "type": "wslink"
        }*/]
    }, /*{
        "name": "Pathways",
        "widget": "kbasePathways",
        "keys": "workspace, objName",
        "arguments": "model_ws, model_name"
    }*/];


    this.ReactionTab = function (info) {
        if (info.id.search(/rxn\d+/g) == -1)
            return;

        var p = this.modeltabs
                    .getBiochemReaction(info.id)
                    .then(function(rxn){
                        return [{
                                    label: "ID",
                                    data: rxn.id
                                },{
                                    label: "Name",
                                    data: rxn.name
                                },{
                                    label: "Equation",
                                    data: rxn.equation,
                                    type: "pictureEquation"
                                },/*{
                                    label: "GPR",
                                    data: rxn.gpr,
                            }*/];
                     })
        return p;
    }

    this.GeneTab = function (info) {
        // var gene = this.genehash[id];
        // doing this instead of creating hash
        var data;
        self.modelgenes.forEach(function(gene) {
            if (gene.id == info.id)
                data = [{
                            label: "ID",
                            data: gene.id
                        },{
                            label: "Reactions",
                            data: gene.reactions,
                            type: "tabLinkArray",
                            method: "ReactionTab"
                        }];
        })
        return data;
    }

    this.CompoundTab = function (info) {
        var cpd = this.cpdhash[info.id];
        if (info.id.search(/cpd\d+/g) == -1)
            return;

         // your hash includes the compartement, so cpd.compartment (or cpd.cmpkbid?) is missing
        var p = this.modeltabs
                    .getBiochemCompound(info.id)
                    .then(function(cpd){
                        return [{
                                     "label": "Compound",
                                     "data": cpd.id,
                                 }, {
                                     "label": "Name",
                                     "data": cpd.name
                                 }, {
                                     "label": "Formula",
                                     "data": cpd.formula
                                 }, {
                                     "label": "Charge",
                                     "data": cpd.charge
                                 }, {
                                     "label": "Compartment",
                                     "data": cpd.compartment,
                                     "type": "tabLink",
                                     "function": "CompartmentTab"
                                 }];
                     })
        return p;

    }

    this.CompartmentTab = function (info) {
        return [[]];
    }

    this.BiomassTab = function (info) {
        return [[]];
    }

    this.GapfillTab = function (info) {
    	var gfid = info.id;
        console.log(gfid);
        var gf = self.gfhash[gfid];
        var ref;
        if ("gapfill_ref" in gf) {
        	ref = gf.gapfill_ref;
        } else if ("fba_ref" in gf) {
        	ref = gf.fba_ref;
        }
        if ("output" in gf) {
        	return gf.output;
        }
        var p = self.modeltabs.kbapi('ws', 'get_objects', [{ref: ref}]).then(function(data){
			var solutions = data[0].data.gapfillingSolutions;
			return self.parse_gf_solutions(solutions);
		}).then (function(solutions) {
			if (gf.integrated == "1") {
				gf.integrated = "yes";
			} else if (gf.integrated == "0") {
				gf.integrated = "no";
			}
			gf.output = [{
				 "label": "Gapfill ID",
				 "data": gf.simpid,
			 }, {
				 "label": "Media",
				 "linkformat": "dispWSRef",
				 "type": "wstype",
				 "wstype": "KBaseFBA.Media",
				 "data": gf.media_ref
			 }, {
				 "label": "Integrated",
				 "data": gf.integrated
			 }];
			 if (gf.integrated == "yes") {
			 	gf.output.push({
			 		"label": "Integrated solution",
				 	"data": gf.integrated_solution
			 	});
			 }
			 var rxns = "";
			 for (var i=0; i < solutions.length; i++) {
			 	var solrxns = solutions[i].gapfillingSolutionReactions;
			 	for (var j=0; j < solrxns.length; j++) {
			 		if (j > 0) {
			 			rxns += "<br>";
			 		}
			 		rxns += solrxns[j].id;
			 		if ("equation" in solrxns[j]) {
			 			rxns += ":"+solrxns[j].equation;
			 		}
			 	}
			 }
			 	
			gf.output.push({
			 	"label": "Solution "+i,
				"data": rxns
			});
			console.log(gf.output);
			return gf.output;
		});
        return p;
    }
	
	this.parse_gf_solutions = function(solutions) {		
		var rxnshash = {};
		for (var i=0; i < solutions.length; i++) {
			var solrxns = solutions[i].gapfillingSolutionReactions;
			for (var j=0; j < solrxns.length; j++) {
				solrxns[j].id = solrxns[j].reaction_ref.split("/").pop();
				if (solrxns[j].id.match(/^rxn\d\d\d\d\d$/)) {
					rxnshash[solrxns[j].id] = solrxns[j];
				}
			}
		}
		var ids = new Array();
		for (var key in rxnshash) {
    		ids.push(key);
		}
		if (ids.length > 0) {
			var p = self.modeltabs.kbapi('fba', 'get_reactions', {reactions: ids}).then(function(data){
				for (var i=0; i < data.length; i++) {
					rxnshash[data[i].id].equation = data[i].definition;
				}
				return solutions;
			});
			return p;
		}
		return solutions;
	};
	
    this.setData = function (indata) {
        this.data = indata;
        this.modelreactions = this.data.modelreactions;
        this.modelcompounds = this.data.modelcompounds;
        this.modelgenes = [];
        this.modelcompartments = this.data.modelcompartments;
        this.biomasses = this.data.biomasses;
        this.biomasscpds = [];
        this.gapfillings = this.data.gapfillings;
        this.cpdhash = {};
        this.rxnhash = {};
        this.cmphash = {};
        this.genehash = {};
        this.gfhash = {};
        for (var i=0; i < this.gapfillings.length; i++) {
        	this.gapfillings[i].simpid = "gf."+(i+1);
        	this.gfhash[this.gapfillings[i].simpid] = this.gapfillings[i];
        }
        for (var i=0; i< this.modelcompartments.length; i++) {
            var cmp = this.modelcompartments[i];
            this.cmphash[cmp.id] = cmp;
        }
        for (var i=0; i< this.modelcompounds.length; i++) {
            var cpd = this.modelcompounds[i];
            cpd.cmpkbid = cpd.modelcompartment_ref.split("/").pop();
            cpd.cpdkbid = cpd.compound_ref.split("/").pop();
            if (cpd.name === undefined) {
                cpd.name = cpd.id;
            }
            cpd.name = cpd.name.replace(/_[a-zA-z]\d+$/, '');
            this.cpdhash[cpd.id] = cpd;
            if (cpd.cpdkbid != "cpd00000") {
                this.cpdhash[cpd.cpdkbid+"_"+cpd.cmpkbid] = cpd;
            }
        }
        for (var i=0; i < this.biomasses.length; i++) {
        	var biomass = this.biomasses[i];
        	biomass.dispid = biomass.id;
        	for(var j=0; j < biomass.biomasscompounds.length; j++) {
        		var biocpd = biomass.biomasscompounds[j];
        		biocpd.id = biocpd.modelcompound_ref.split("/").pop();
        		biocpd.name = this.cpdhash[biocpd.id].name+"<br>("+biocpd.id+")";
        		biocpd.formula = this.cpdhash[biocpd.id].formula;
        		biocpd.charge = this.cpdhash[biocpd.id].charge;
        		biocpd.cmpkbid = this.cpdhash[biocpd.id].cmpkbid;
        		biocpd.biomass = biomass.id;
        		this.biomasscpds.push(biocpd);
        	}
        }
        for (var i=0; i< this.modelreactions.length; i++) {
            var rxn = this.modelreactions[i];
            rxn.rxnkbid = rxn.reaction_ref.split("/").pop();
            rxn.cmpkbid = rxn.modelcompartment_ref.split("/").pop();
            rxn.dispid = rxn.id.replace(/_[a-zA-z]\d+$/, '')+"["+rxn.cmpkbid+"]";
            rxn.name = rxn.name.replace(/_[a-zA-z]\d+$/, '');
            if (rxn.name == "CustomReaction") {
                rxn.name = rxn.id.replace(/_[a-zA-z]\d+$/, '');
            }
            this.rxnhash[rxn.id] = rxn;
            if (rxn.rxnkbid != "rxn00000") {
                this.rxnhash[rxn.rxnkbid+"_"+rxn.cmpkbid] = rxn;
                if (rxn.rxnkbid+"_"+rxn.cmpkbid != rxn.id) {
                    rxn.dispid += "<br>("+rxn.rxnkbid+")";
                }
            }
            var reactants = "";
            var products = "";
            var sign = "<=>";
            if (rxn.direction == ">") {
                sign = "=>";
            } else if (rxn.direction == "<") {
                sign = "<=";
            }
            for (var j=0; j< rxn.modelReactionReagents.length; j++) {
                var rgt = rxn.modelReactionReagents[j];
                rgt.cpdkbid = rgt.modelcompound_ref.split("/").pop();
                if (rgt.coefficient < 0) {
                    if (reactants.length > 0) {
                        reactants += " + ";
                    }
                    if (rgt.coefficient != -1) {
                        var abscoef = Math.round(-1*100*rgt.coefficient)/100;
                        reactants += "("+abscoef+") ";
                    }
                    reactants += this.cpdhash[rgt.cpdkbid].name+"["+this.cpdhash[rgt.cpdkbid].cmpkbid+"]";
                } else {
                    if (products.length > 0) {
                        products += " + ";
                    }
                    if (rgt.coefficient != 1) {
                        var abscoef = Math.round(100*rgt.coefficient)/100;
                        products += "("+abscoef+") ";
                    }
                    products += this.cpdhash[rgt.cpdkbid].name+"["+this.cpdhash[rgt.cpdkbid].cmpkbid+"]";
                }
            }
            rxn.ftrhash = {};
            for (var j=0; j< rxn.modelReactionProteins.length; j++) {
                var prot = rxn.modelReactionProteins[j];
                for (var k=0; k< prot.modelReactionProteinSubunits.length; k++) {
                    var subunit = prot.modelReactionProteinSubunits[k];
                    for (var m=0; m< subunit.feature_refs.length; m++) {
                        rxn.ftrhash[subunit.feature_refs[m].split("/").pop()] = 1;
                    }
                }
            }

            rxn.dispfeatures = "";
            rxn.genes = [];
            for (var gene in rxn.ftrhash) {
                if (rxn.dispfeatures.length > 0) {
                    rxn.dispfeatures += "<br>";
                }
                rxn.genes.push(gene);

                var genes = [];
                this.modelgenes.forEach(function(item) {
                    genes.push(item.id)
                })

                if (genes.indexOf(gene) == -1)
                    this.modelgenes.push({id: gene, reactions: [rxn.dispid]});
                else
                    this.modelgenes[genes.indexOf(gene)].reactions.push(rxn.dispid)
            }

            rxn.equation = reactants+" "+sign+" "+products;
        }

    };

}

// make method of base class
KBObjects.prototype.KBaseFBA_FBAModel = KBaseFBA_FBAModel;
