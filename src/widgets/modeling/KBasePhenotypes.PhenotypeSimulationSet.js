function KBasePhenotypes_PhenotypeSimulationSet(tabwidget) {
    var self = this;
    this.tabwidget = tabwidget;
    console.log('loading widget')

	this.setMetadata = function (data) {
        //console.log('meta', data)
	this.workspace = data[7];
        this.objName = data[1];
        this.overview = {wsid: data[7]+"/"+data[1],
                         objecttype: data[2],
                         owner: data[5],
                         instance: data[4],
                         moddate: data[3]};
        // if there is user metadata, add it
        if ('Name' in data[10]) {
            this.usermeta = {name: data[10]["Name"],
                             source: data[10]["Source"]+"/"+data[10]["Source ID"],
                             numphenotypes: data[10]["Number phenotypes"],
                             type: data[10]["Type"]}

            $.extend(this.overview, this.usermeta)}
    };

    this.setData = function (indata) {
	console.log('mydata', indata);
	this.data = indata;
	this.phenotypes = this.data.phenotypeSimulations;


	console.log('mydata1',this.phenotypes);
    }

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
	    "type": "dataTable",
	    "columns": [{
		    "label": "Phenotype Simulation id",
		    "key": "id",
		    "visible": 1
		}, {
		    "label": "Experimental Growth",
		    "key": "phenoclass",
		    "type": "wstype"
		}, {
		    "label": "PhenotypeRef",
		    "type": "tabLink",
		    "method": "PhenotypeSetTab",
		    "linkformat": "dispid",
		    "key": "phenotype_ref",
		    "visible": 1
		}, {
		    "label": "Predicted Growth",
		    "key": "simulatedGrowth",
		    "type": "wstype",
		    "visible": 1
		}, {
		    "label": "Simulated Growth Fraction",
		    "key": "simulatedGrowthFraction",
		    "visible": 1
		}]
	}];

    this.PhenotypeSetTab = function (ref) {
	var objIdentity = {"obj_ref": ref};
	var p = tabwidget.kbapi('ws', 'get_objects', [objIdentity])
	.then(function(data) {
		console.log(data);
		return [];
	    });

        return p;

    }
    
}


// make method of base class
KBObjects.prototype.KBasePhenotypes_PhenotypeSimulationSet = KBasePhenotypes_PhenotypeSimulationSet;