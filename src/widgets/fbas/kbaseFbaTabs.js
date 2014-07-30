kb_define('kbaseFbaTabs',
    [
        'jquery',
	'kbwidget'
    ],
    function ($) {


$.KBWidget({
    name: "kbaseFbaTabs",
    version: "1.0.0",
    options: {
    },
    getData: function() {
        return {
            id: this.options.ids,
            workspace: this.options.workspaces,
            title: this.options.title,
            type: "FBA"
        }
    },
    init: function(options) {
        this._super(options);
        var self = this;        
        var fbas = options.ids;
        var workspaces = options.workspaces;
        var data = options.fbaData;
        var meta = options.meta;

        var container = this.$elem;

        var tables = ['Overview', 'Reactions', 'Compounds'];


        var overviewTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">');
        var rxnTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">')
        var cpdTable = $('<table cellpadding="0" cellspacing="0" border="0" \
                class="table table-bordered table-striped" style="width: 100%;">')


        var tabs = container.kbTabs({tabs: [{name: 'Overview', content: overviewTable, active: true},
                                           {name: 'Reactions', content: rxnTable},
                                           {name: 'Compounds', content: cpdTable},
                                  ]});        

        var tableSettings = {
            "sPaginationType": "bootstrap",
            "iDisplayLength": 10,
            "aLengthMenu": [5, 10, 25,50,100],
            "oLanguage": {
                "sSearch": "Search:"
            }
        }

        var fba = data[0].data;
        //var meta = meta[0]

        // meta data (overview) table 
        /*var labels = ['ID', 'Name', 'Type','Moddate','Instance',
                      'Command','Last Modifier','Owner','Workspace','Ref']
        kb.ui.listTable('meta-table', meta, labels)
        container.append(table);*/


        /*
        media_ref
        maximizeObjective
        id  Rhodobacter-2.4.1.fbamdl.2.fba.20
        drainfluxUseVariables
        __VERSION__
        noErrorThermodynamicConstraints
        objectiveConstraintFraction
        minimizeErrorThermodynamicConstraints
        allReversible
        objectiveValue
        numberOfSolutions
        fluxMinimization
        thermodynamicConstraints
        defaultMaxDrainFlux
        fbamodel_ref
        fluxUseVariables
        findMinimalMedia
        PROMKappa
        simpleThermoConstraints
        comboDeletions
        defaultMinDrainFlux
        fva
        decomposeReversibleDrainFlux
        defaultMaxFlux
        decomposeReversibleFlux
        */

        var keys = [{key: 'id'},
                    {key: 'maximizeObjective', type: 'bool'},        
                    {key: 'drainfluxUseVariables', type: 'bool'},
                    {key: 'noErrorThermodynamicConstraints', type: 'bool'},
                    {key: 'objectiveConstraintFraction'},
                    {key: 'minimizeErrorThermodynamicConstraints', type: 'bool'},
                    {key: 'allReversible', type: 'bool'},
                    {key: 'objectiveValue'},
                    {key: 'numberOfSolutions'},
                    {key: 'fluxMinimization', type: 'bool'},
                    {key: 'thermodynamicConstraints', type: 'bool'},
                    {key: 'defaultMaxDrainFlux'},
                    {key: 'fluxUseVariables', type: 'bool'},
                    {key: 'findMinimalMedia', type: 'bool'},
                    {key: 'PROMKappa'},
                    {key: 'simpleThermoConstraints', type: 'bool'},
                    {key: 'comboDeletions', type: 'bool'},
                    {key: 'defaultMinDrainFlux'},
                    {key: 'fva', type: 'bool'},
                    {key: 'decomposeReversibleDrainFlux',type: 'bool'},
                    {key: 'defaultMaxFlux'},
                    {key: 'decomposeReversibleFlux', type: 'bool'}];

        var labels = ['Name',
                      'Maximize Objective',                      
                      'Drain Flux Use Variables',
                      'No Error Thermodynamic Constraints',
                      'Objective Constraint Fraction',
                      'Minimize Error Thermodynamic Constraints',
                      'All Reversible',
                      'Objective Value',
                      'Number Of Solutions',
                      'Flux Minimization',
                      'Thermodynamic Constraints',
                      'Default Max Drain Flux',
                      'Flux Use Variables',
                      'Find Minimal Media',
                      'PROM Kappa',
                      'Simple Thermo Constraints',
                      'Combo Deletions',
                      'Default Min Drain Flux',
                      'fva',
                      'Decompose Reversible Drain Flux',
                      'Default Max Flux',
                      'Decompose Reversible Flux'];

        var table = kb.ui.objTable('overview-table', fba, keys, labels);
        overviewTable.append(table);


        // rxn flux table
        var dataDict = formatObjs(fba.FBAReactionVariables, 'rxn');
        var labels = ["ID", "flux", "lower", "upper", "min", "max", "Eq"]; //type
        var keys = ["modelreaction_ref", "value", "lowerBound", "upperBound", "min", "max", "eq"]; //variableType
        var cols = getColumnsByKey(keys, labels);
        cols[0].sWidth = '18%'
        var rxnTableSettings = $.extend({}, tableSettings, {fnDrawCallback: events});               
        rxnTableSettings.aoColumns = cols;
        rxnTableSettings.aaData = dataDict;
        var table = rxnTable.dataTable(rxnTableSettings);

        // cpd flux table
        console.log(fba)
        var dataDict = formatObjs(fba.FBACompoundVariables, 'cpd');
        var labels = ["id", "Flux", "lower", "upper", "min", "max"];
        var keys = ["modelcompound_ref", "value", "lowerBound", "upperBound", "min", "max"]        
        var cols = getColumnsByKey(keys, labels);
        var cpdTableSettings = $.extend({}, tableSettings, {fnDrawCallback: events});
        cpdTableSettings.aoColumns = cols;
        cpdTableSettings.aaData = dataDict;
        var table = cpdTable.dataTable(cpdTableSettings);
        
 
        function formatObjs(objs, type) {
            var fluxes = []
            if (type == 'rxn') {
                for (var i in objs) {
                    var obj = $.extend({}, objs[i]);
                    var rxn = obj.modelreaction_ref
                                 .split('/')[5];
                    var rxn_id = rxn.split('_')[0];
                    var compart = rxn.split('_')[1];
                    obj.modelreaction_ref = '<a class="rxn-click" data-rxn="'+rxn_id+'">'
                                +rxn_id+'</a> ('+compart+')';
                    fluxes.push(obj);
                }
            } else if (type == 'cpd') {
                for (var i in objs) {
                    var obj = $.extend({}, objs[i]);
                    var id = obj.modelcompound_ref.split('/')[5]
                    var cpd = id.split('_')[0]
                    var compart = id.split('_')[1]
                    obj.modelcompound_ref = '<a class="cpd-click" data-cpd="'+cpd+'">'
                                +cpd+'</a> ('+compart+')';
                    fluxes.push(obj);
                }                
            }

            return fluxes;
        }

        function getColumnsByLabel(labels) {
            var cols = [];
            for (var i in labels) {
                cols.push({sTitle: labels[i]})
            }
            return cols;
        }

        function getColumnsByKey(keys, labels) {
            var cols = [];

            for (var i=0; i<keys.length; i++) {
                cols.push({sTitle: labels[i], mData: keys[i]})
            }
            return cols;
        }

        function events() {
            $('.rxn-click').unbind('click');
            $('.rxn-click').click(function() {
                var rxn = [$(this).data('rxn')];
                self.trigger('rxnClick', {ids: rxn});
            });            
            $('.cpd-click').unbind('click');
            $('.cpd-click').click(function() {
                var cpd = [$(this).data('cpd')];
                self.trigger('cpdClick', {ids: cpd});
            });                        
        }

        //this._rewireIds(this.$elem, this);
        return this;
    }  //end init

})
});
