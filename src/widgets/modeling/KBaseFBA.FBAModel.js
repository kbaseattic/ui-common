function KBaseFBA_FBAModel(modeltabs) {
    var self = this;
    this.modeltabs = modeltabs;

    this.setMetadata = function (data) {
        this.overview = {wsid: data[7]+"/"+data[1],
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
            "linkformat": "dispid",
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
        }, /*{
            "label": "Genes",
            "key": "genes",
            "type": "tabLinkArray",
            "method": "GeneTab",
        }*/]
    }, {
        "key": "modelcompounds",
        "name": "Compounds",
        "type": "dataTable",
        "columns": [{
            "label": "Compound",
            "key": "id",
            "type": "tabLink",
            "linkformat": "dispid",
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
            "key": "id",
            "type": "tabLink",
            "method": "GapfillTab"
        }, {
            "label": "Integrated",
            "key": "integrated"
        }, {
            "label": "Media",
            "key": "media_ref",
            "type": "wslink"
        }, {
            "label": "FBA",
            "key": "fba_ref",
            "type": "wslink"
        }]
    }, {
        "name": "Pathways",
        "widget": "kbasePathways"
    }];


    this.ReactionTab = function (id) {
        var rxn = this.rxnhash[id];
        if (id.search(/rxn\d+/g) == -1)
            return;

        // This needs to be a promise or the design needs to change
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


    this.setData = function (indata) {
        this.data = indata;
        this.modelreactions = this.data.modelreactions;
        this.modelcompounds = this.data.modelcompounds;
        this.modelgenes = [];
        this.modelcompartments = this.data.modelcompartments;
        this.biomasses = this.data.biomasses;
        this.gapfillings = this.data.gapfillings;
        this.cpdhash = {};
        this.rxnhash = {};
        this.cmphash = {};
        this.genehash = {};
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
            }
            rxn.equation = reactants+" "+sign+" "+products;
        }
    };

}

// make method of base class
KBObjects.prototype.KBaseFBA_FBAModel = KBaseFBA_FBAModel;
