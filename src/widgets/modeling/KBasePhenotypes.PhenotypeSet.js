function KBasePhenotypes_PhenotypeSet(modeltabs) {
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
			"label": "Name",
			"key": "name"
		},{
			"label": "Source",
			"key": "source"
		},{
			"label": "Number phenotypes",
			"key": "numphenotypes"
		},{
			"label": "Phenotype type",
			"key": "type"
		}]	
	}, {
		"key": "phenotypes",
		"name": "Phenotypes",
		"visible": 1,
		"columns": [{
			"label": "Phenotype",
			"key": "id",
			"type": "tabLink",
			"function": "PhenotypeTab",
			"width": "15%",
			"visible": 1
		}, {
			"label": "Name",
			"key": "name",
			"visible": 1
		}, {
			"label": "Growth condition",
			"key": "media_ref",
            "type": "wstype",
			"visible": 1
		}, {
			"label": "Gene KO",
			"type": "tabLinkArray",
			"key": "genes",
			"visible": 1
		}, {
			"label": "Additional compounds",
			"key": "additionalcompounds",
			"type": "tabLinkArray",
			"visible": 1
		}, {
			"label": "Observed normalized growth",
			"key": "normalizedGrowth",
			"visible": 1
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
        if ('Name' in data[10]) {
            this.usermeta = {name: data[10]["Name"],
                             source: data[10]["Source"]+"/"+data[10]["Source ID"],
                             numphenotypes: data[10]["Number phenotypes"],
                             type: data[10]["Type"]}
                           
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
    	this.usermeta.id = this.data.id;
		this.usermeta.source = this.data.source+"/"+this.data.source_id;
		this.usermeta.name = this.data.name;
		this.usermeta.type = this.data.type;
		this.usermeta.genome = this.data.genome_ref;
		this.phenotypes = this.indata.phenotypes;
		for (var i=0; i< this.phenotypes.length; i++) {
            var pheno = this.phenotypes[i];
			
		}
	};
	
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
}