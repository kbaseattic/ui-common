define([], function() {
    return {
        'paths': {
            'kbaseTabTable'                         : 'src/widgets/modeling/kbaseTabTable',
            'KBModeling'                            : 'src/widgets/modeling/KBModeling',
            'KBaseFBA.FBAModel'                     : 'src/widgets/modeling/KBaseFBA.FBAModel',
            'KBaseFBA.FBAModelSet'                  : 'src/widgets/modeling/KBaseFBA.FBAModelSet',
            'KBaseFBA.FBA'                          : 'src/widgets/modeling/KBaseFBA.FBA',
            'KBaseFBA.FBAComparison'                : 'src/widgets/modeling/KBaseFBA.FBAComparison',        
            'KBaseBiochem.Media'                    : 'src/widgets/modeling/KBaseBiochem.Media',
            'KBasePhenotypes.PhenotypeSet'          : 'src/widgets/modeling/KBasePhenotypes.PhenotypeSet',
            'KBasePhenotypes.PhenotypeSimulationSet': 'src/widgets/modeling/KBasePhenotypes.PhenotypeSimulationSet',
            'KBaseSearch.GenomeSet'                 : 'src/widgets/modeling/KBaseSearch.GenomeSet',
            'kbaseTabTableTabs'                     : 'src/widgets/modeling/kbaseTabs',
            'modelSeedVizConfig'                    : 'src/widgets/modeling/modelSeedVizConfig',
            'msPathway'                             : 'src/widgets/modeling/msPathway',
            'kbasePathways'                         : 'src/widgets/modeling/kbasePathways',
        },
        'shim': {
            'KBaseFBA.FBAModel' : {
                'deps' : ['KBModeling',
                          'kbasePathways']
            },
            'KBaseFBA.FBAModelSet' : {
                'deps' : ['KBModeling',
                          'kbasePathways']
            },
            'KBaseFBA.FBA' : {
                'deps' : ['KBModeling',
                          'kbasePathways']
            },
            'KBaseFBA.FBAComparison' : {
                'deps' : ['KBModeling']
            },
            'KBaseBiochem.Media' : {
                'deps' : ['KBModeling']
            },
            'KBasePhenotypes.PhenotypeSet' : {
                'deps' : ['KBModeling']
            },
            'KBasePhenotypes.PhenotypeSimulationSet' : {
                'deps' : ['KBModeling']
            },
            'KBaseSearch.GenomeSet' : {
                'deps' : ['KBModeling']
            },
            'kbaseTabTable' : {
                'deps' : ['jquery', 
                          'jquery-dataTables',
                          'jquery-dataTables-bootstrap',
                          'bootstrap',
                          'KBModeling',
                          'KBaseFBA.FBAModel',
                          'KBaseFBA.FBAModelSet',
                          'KBaseFBA.FBA',
                          'KBaseFBA.FBAComparison',
                          'KBaseBiochem.Media',
                          'KBasePhenotypes.PhenotypeSet',
                          'KBasePhenotypes.PhenotypeSimulationSet',
                          'KBaseFBA.FBAComparison',
                          'kbaseTabTableTabs']
            },
            'kbasePathways' : {
                'deps' : ['jquery', 
                          'kbwidget', 
                          'KBModeling', 
                          'jquery-dataTables',
                          'jquery-dataTables-bootstrap',
                          'bootstrap',
                          'msPathway']
            },
            'msPathway' : {
                'deps' : ['jquery',
                          'modelSeedVizConfig',
                          'd3']
            },
            'kbaseTabTableTabs' : {
                'deps' : ['jquery',
                          'jquery-dataTables',
                          'jquery-dataTables-bootstrap',
                          'bootstrap']
            }
        }
    };
});