    define('kbpaths', [], function(paths) {
        requirejs.config({
            baseUrl : 'src/widgets',
            urlArgs: "bust=" + (new Date()).getTime(),
            paths : {
                'jquery'      : '../../ext/jquery/jquery-1.10.2.min',
                'jqueryui'    : '../../ext/jquery-ui/1.10.3/js/jquery-ui-1.10.3.custom.min',
                'bootstrap'   : "../../ext/bootstrap/3.3.0/js/bootstrap.min",
                'd3'          : "../../ext/d3/d3.min",
                'colorbrewer' : "../../ext/colorbrewer/colorbrewer",
                'handlebars'  : '../../ext/handlebars/handlebars-v1.3.0',
				'CDMI_API'                          : '../js/CDMI_API',
				'IdMapClient'                       : '../js/IdMapClient',
				'KbaseNetworkServiceClient'         : '../js/KbaseNetworkServiceClient',
				'MetaTool'                          : '../js/MetaTool',
				'OntologyServiceClient'             : '../js/OntologyServiceClient',
				'RGBColor'                          : '../js/RGBColor',
				'geometry_point'                    : '../js/geometry/geometry_point',
				'geometry_rectangle'                : '../js/geometry/geometry_rectangle',
				'geometry_size'                     : '../js/geometry/geometry_size',
				'narrativeMethodStore'              : '../js/narrativeMethodStore',
				'Client'                            : '../js/workspaceService/Client',
				'kbapplication'                     : '../kbapplication',
				'kbwidget'                          : '../kbwidget',
				'all'                               : 'all',
				'kbaseBambiMotifCard'               : 'bambi/kbaseBambiMotifCard',
				'kbaseBambiRawOutputCard'           : 'bambi/kbaseBambiRawOutputCard',
				'kbaseBambiRunParametersCard'       : 'bambi/kbaseBambiRunParametersCard',
				'kbaseBambiRunResultCard'           : 'bambi/kbaseBambiRunResultCard',
				'kbaseBioCpdTable'                  : 'biochemistry/kbaseBioCpdTable',
				'kbaseBioRxnTable'                  : 'biochemistry/kbaseBioRxnTable',
				'kbaseCpd'                          : 'biochemistry/kbaseCpd',
				'kbaseRxn'                          : 'biochemistry/kbaseRxn',
				'kbaseRxnModal'                     : 'biochemistry/kbaseRxnModal',
				'kbaseCmonkeyClusterCard'           : 'cmonkey/kbaseCmonkeyClusterCard',
				'kbaseCmonkeyMotifCard'             : 'cmonkey/kbaseCmonkeyMotifCard',
				'kbaseCmonkeyRunResultCard'         : 'cmonkey/kbaseCmonkeyRunResultCard',
				'kbaseExpressionSeries'             : 'expression/kbaseExpressionSeries',
				'kbaseFbaMeta'                      : 'fbas/kbaseFbaMeta',
				'kbaseFbaTabs'                      : 'fbas/kbaseFbaTabs',
				'kbaseFormulationForm'              : 'fbas/kbaseFormulationForm',
				'kbaseRunFba'                       : 'fbas/kbaseRunFba',
				'kbaseContigBrowser'                : 'genomes/kbaseContigBrowser',
				'kbaseContigBrowserButtons'         : 'genomes/kbaseContigBrowserButtons',
				'kbaseFunctSeqGenomeComparison'     : 'genomes/kbaseFunctSeqGenomeComparison',
				'kbaseGeneBiochemistry'             : 'genomes/kbaseGeneBiochemistry',
				'kbaseGeneDomains'                  : 'genomes/kbaseGeneDomains',
				'kbaseGeneExprLinePlot'             : 'genomes/kbaseGeneExprLinePlot',
				'kbaseGeneInfo'                     : 'genomes/kbaseGeneInfo',
				'kbaseGeneInstanceInfo'             : 'genomes/kbaseGeneInstanceInfo',
				'kbaseGeneOperon'                   : 'genomes/kbaseGeneOperon',
				'kbaseGeneSequence'                 : 'genomes/kbaseGeneSequence',
				'kbaseGeneStructureMatches'         : 'genomes/kbaseGeneStructureMatches',
				'kbaseGenomeCompleteness'           : 'genomes/kbaseGenomeCompleteness',
				'kbaseGenomeGeneTable'              : 'genomes/kbaseGenomeGeneTable',
				'kbaseGenomeLineage'                : 'genomes/kbaseGenomeLineage',
				'kbaseGenomeOverview'               : 'genomes/kbaseGenomeOverview',
				'kbaseLitWidget'                    : 'genomes/kbaseLitWidget',
				'kbaseMultiContigBrowser'           : 'genomes/kbaseMultiContigBrowser',
				'kbaseObjectMeta'                   : 'genomes/kbaseObjectMeta',
				'kbasePanGenome'                    : 'genomes/kbasePanGenome',
				'kbasePhenotypeSet'                 : 'genomes/kbasePhenotypeSet',
				'kbaseSEEDFunctions'                : 'genomes/kbaseSEEDFunctions',
				'kbaseSimulationSet'                : 'genomes/kbaseSimulationSet',
				'kbaseWikiDescription'              : 'genomes/kbaseWikiDescription',
				'kbaseGWASGeneListTable'            : 'gwas/kbaseGWASGeneListTable',
				'kbaseGWASPop'                      : 'gwas/kbaseGWASPop',
				'kbaseGWASPopKinshipTable'          : 'gwas/kbaseGWASPopKinshipTable',
				'kbaseGWASPopMaps'                  : 'gwas/kbaseGWASPopMaps',
				'kbaseGWASPopTable'                 : 'gwas/kbaseGWASPopTable',
				'kbaseGWASTopVariations'            : 'gwas/kbaseGWASTopVariations',
				'kbaseGWASTopVariationsTable'       : 'gwas/kbaseGWASTopVariationsTable',
				'kbaseGWASTraitMaps'                : 'gwas/kbaseGWASTraitMaps',
				'kbaseGWASTraitTable'               : 'gwas/kbaseGWASTraitTable',
				'kbaseGWASVarTable'                 : 'gwas/kbaseGWASVarTable',
				'kbaseInferelatorHitsCard'          : 'inferelator/kbaseInferelatorHitsCard',
				'kbaseInferelatorRunResultCard'     : 'inferelator/kbaseInferelatorRunResultCard',
				'kbaseIrisTerminalDispatch'         : 'iris/config/kbaseIrisTerminalDispatch',
				'kbaseIrisTerminalDispatchAuth'     : 'iris/config/kbaseIrisTerminalDispatchAuth',
				'kbaseIrisTerminalDispatchEnv'      : 'iris/config/kbaseIrisTerminalDispatchEnv',
				'kbaseIrisTerminalDispatchFile'     : 'iris/config/kbaseIrisTerminalDispatchFile',
				'kbaseIrisTerminalDispatchHelp'     : 'iris/config/kbaseIrisTerminalDispatchHelp',
				'kbaseIrisTerminalDispatchHistory'  : 'iris/config/kbaseIrisTerminalDispatchHistory',
				'kbaseIrisTerminalDispatchScript'   : 'iris/config/kbaseIrisTerminalDispatchScript',
				'kbaseIrisTerminalDispatchTutorial' : 'iris/config/kbaseIrisTerminalDispatchTutorial',
				'iris'                              : 'iris/iris',
				'kbaseIrisCommands'                 : 'iris/kbaseIrisCommands',
				'kbaseIrisConfig'                   : 'iris/kbaseIrisConfig',
				'kbaseIrisContainerWidget'          : 'iris/kbaseIrisContainerWidget',
				'kbaseIrisEchoWidget'               : 'iris/kbaseIrisEchoWidget',
				'kbaseIrisFileBrowser'              : 'iris/kbaseIrisFileBrowser',
				'kbaseIrisFileEditor'               : 'iris/kbaseIrisFileEditor',
				'kbaseIrisGUIWidget'                : 'iris/kbaseIrisGUIWidget',
				'kbaseIrisGrammar'                  : 'iris/kbaseIrisGrammar',
				'kbaseIrisProcessList'              : 'iris/kbaseIrisProcessList',
				'kbaseIrisTerminal'                 : 'iris/kbaseIrisTerminal',
				'kbaseIrisTerminalWidget'           : 'iris/kbaseIrisTerminalWidget',
				'kbaseIrisTextWidget'               : 'iris/kbaseIrisTextWidget',
				'kbaseIrisTutorial'                 : 'iris/kbaseIrisTutorial',
				'kbaseIrisWhatsNew'                 : 'iris/kbaseIrisWhatsNew',
				'kbaseIrisWidget'                   : 'iris/kbaseIrisWidget',
				'kbaseIrisWorkspace'                : 'iris/kbaseIrisWorkspace',
				'jim'                               : 'jim',
				'jquery.kbase.ws-selector'          : 'jquery.kbase.ws-selector',
				'kbaseAccordion'                    : 'kbaseAccordion',
				'kbaseAuthenticatedWidget'          : 'kbaseAuthenticatedWidget',
				'kbaseBox'                          : 'kbaseBox',
				'kbaseButtonControls'               : 'kbaseButtonControls',
				'kbaseCameraSupport'                : 'kbaseCameraSupport',
				'kbaseCardLayoutManager'            : 'kbaseCardLayoutManager',
				'kbaseCarousel'                     : 'kbaseCarousel',
				'kbaseDataBrowser'                  : 'kbaseDataBrowser',
				'kbaseDeletePrompt'                 : 'kbaseDeletePrompt',
				'kbaseDownload'                     : 'kbaseDownload',
				'kbaseErrorPrompt'                  : 'kbaseErrorPrompt',
				'kbaseFormBuilder'                  : 'kbaseFormBuilder',
				'kbaseGeneTable'                    : 'kbaseGeneTable',
				'kbaseJSONReflector'                : 'kbaseJSONReflector',
				'kbaseLogin'                        : 'kbaseLogin',
				'kbaseLoginFuncSite'                : 'kbaseLoginFuncSite',
				'kbaseAppDescription'            : 'kbaseAppDescription',
				'kbaseMethodDescription'            : 'kbaseMethodDescription',
				'kbaseMethodGallery'                : 'kbaseMethodGallery',
				'kbaseModal'                        : 'kbaseModal',
				'kbasePanel'                        : 'kbasePanel',
				'kbasePopularMethods'               : 'kbasePopularMethods',
				'kbasePrompt'                       : 'kbasePrompt',
				'kbaseSearchControls'               : 'kbaseSearchControls',
				'kbaseTable'                        : 'kbaseTable',
				'kbaseTableEditor'                  : 'kbaseTableEditor',
				'kbaseTabs'                         : 'kbaseTabs',
				'kbaseVisWidget'                    : 'kbaseVisWidget',
				'kbaseWalkablePath'                 : 'kbaseWalkablePath',
				'Heatmap_widget'                    : 'mak/Heatmap_widget',
				'LineChart_widget'                  : 'mak/LineChart_widget',
				'Tiling_widget'                     : 'mak/Tiling_widget',
				'kbaseBarChartCard'                 : 'mak/kbaseBarChartCard',
				'kbaseHeatmapCard'                  : 'mak/kbaseHeatmapCard',
				'kbaseLineChartCard'                : 'mak/kbaseLineChartCard',
				'kbaseMAKBiclusterCard'             : 'mak/kbaseMAKBiclusterCard',
				'kbaseMAKResultCard'                : 'mak/kbaseMAKResultCard',
				'kbaseMAKTilingCard'                : 'mak/kbaseMAKTilingCard',
				'kbasePathway'                      : 'maps/kbasePathway',
				'kbasePathways'                     : 'maps/kbasePathways',
				'kbaseMediaEditor'                  : 'media/kbaseMediaEditor',
				'kbaseMastHitsCard'                 : 'meme/kbaseMastHitsCard',
				'kbaseMastRunParametersCard'        : 'meme/kbaseMastRunParametersCard',
				'kbaseMastRunResultCard'            : 'meme/kbaseMastRunResultCard',
				'kbaseMemeMotifCard'                : 'meme/kbaseMemeMotifCard',
				'kbaseMemeRawOutputCard'            : 'meme/kbaseMemeRawOutputCard',
				'kbaseMemeRunParametersCard'        : 'meme/kbaseMemeRunParametersCard',
				'kbaseMemeRunResultCard'            : 'meme/kbaseMemeRunResultCard',
				'kbaseMemeTable'                    : 'meme/kbaseMemeTable',
				'kbaseTomtomHitsCard'               : 'meme/kbaseTomtomHitsCard',
				'kbaseTomtomRunParametersCard'      : 'meme/kbaseTomtomRunParametersCard',
				'kbaseTomtomRunResultCard'          : 'meme/kbaseTomtomRunResultCard',
				'logo'                              : 'meme/logo',
				'kbaseSeqSearch'                    : 'misc/kbaseSeqSearch',
				'kbaseDeleteRxn'                    : 'models/kbaseDeleteRxn',
				'kbaseModelCore'                    : 'models/kbaseModelCore',
				'kbaseModelMeta'                    : 'models/kbaseModelMeta',
				'kbaseModelOpts'                    : 'models/kbaseModelOpts',
				'kbaseModelTable'                   : 'models/kbaseModelTable',
				'kbaseModelTabs'                    : 'models/kbaseModelTabs',
				'force-directed'                    : 'networks/force-directed',
				'kbaseNetworkCard'                  : 'networks/kbaseNetworkCard',
				'kbasePPICard'                      : 'networks/kbasePPICard',
				'kbaseWSObjGraphCenteredView'       : 'objgraphs/kbaseWSObjGraphCenteredView',
				'kbaseWSObjGraphView'               : 'objgraphs/kbaseWSObjGraphView',
				'kbaseRegulomeCard'                 : 'regprecise/kbaseRegulomeCard',
				'kbaseRegulonCard'                  : 'regprecise/kbaseRegulonCard',
				'kbasePromConstraint'               : 'regulation/kbasePromConstraint',
				'kbaseRegulome'                     : 'regulation/kbaseRegulome',
				'kbaseNarrativesUsingData'          : 'social/kbaseNarrativesUsingData',
				'kbaseWSObjRefUsers'                : 'social/kbaseWSObjRefUsers',
				'ace'                               : 'spec/ace/ace',
				'ext-keybinding_menu_fixed'         : 'spec/ace/ext-keybinding_menu_fixed',
				'ext-language_tools_fixed'          : 'spec/ace/ext-language_tools_fixed',
				'ext-searchbox'                     : 'spec/ace/ext-searchbox',
				'mode-kidl'                         : 'spec/ace/mode-kidl',
				'theme-eclipse'                     : 'spec/ace/theme-eclipse',
				'kidlwebeditor.nocache'             : 'spec/editor/kidlwebeditor.nocache',
				'kbaseKidlWebEditor'                : 'spec/kbaseKidlWebEditor',
				'kbaseSpecFunctionCard'             : 'spec/kbaseSpecFunctionCard',
				'kbaseSpecModuleCard'               : 'spec/kbaseSpecModuleCard',
				'kbaseSpecStorageCard'              : 'spec/kbaseSpecStorageCard',
				'kbaseSpecTypeCard'                 : 'spec/kbaseSpecTypeCard',
				'kbaseTaxonOverview'                : 'taxa/kbaseTaxonOverview',
				'kbaseMSA'                          : 'trees/kbaseMSA',
				'kbaseTree'                         : 'trees/kbaseTree',
				'kbaseBarchart'                     : 'vis/kbaseBarchart',
				'GeneDistribution'                 : 'vis/GeneDistribution',
				'kbaseChordchart'                   : 'vis/kbaseChordchart',
				'kbaseCircularHeatmap'              : 'vis/kbaseCircularHeatmap',
				'kbaseForcedNetwork'                : 'vis/kbaseForcedNetwork',
				'kbaseHeatmap'                      : 'vis/kbaseHeatmap',
				'kbaseHistogram'                    : 'vis/kbaseHistogram',
				'kbaseLineSerieschart'              : 'vis/kbaseLineSerieschart',
				'kbaseLinechart'                    : 'vis/kbaseLinechart',
				'kbaseSparkline'                    : 'vis/kbaseSparkline',
				'kbasePiechart'                     : 'vis/kbasePiechart',
				'kbaseRadialTreechart'              : 'vis/kbaseRadialTreechart',
				'kbaseScatterplot'                  : 'vis/kbaseScatterplot',
				'kbaseTreechart'                    : 'vis/kbaseTreechart',
				'kbaseVenndiagram'                  : 'vis/kbaseVenndiagram',
				'kbasePlantsNTO'                    : 'vis/plants/kbasePlantsNTO',
				'kbasePlantsNetworkNarrative'       : 'vis/plants/kbasePlantsNetworkNarrative',
				'kbasePlantsNetworkTable'           : 'vis/plants/kbasePlantsNetworkTable',
				'kbasePMIBarchart'                       : 'vis/plants/kbasePMIBarchart',
				'kbaseRNASeq'                       : 'kbaseRNASeq',
				'kbaseRNASeqPie'                       : 'kbaseRNASeqPie',
				'vis'                               : 'vis/vis',
				'kbaseSimpleWSSelect'               : 'workspaces/kbaseSimpleWSSelect',
				'kbaseWSButtons'                    : 'workspaces/kbaseWSButtons',
				'kbaseWSFbaTable'                   : 'workspaces/kbaseWSFbaTable',
				'kbaseWSHandler'                    : 'workspaces/kbaseWSHandler',
				'kbaseWSMediaTable'                 : 'workspaces/kbaseWSMediaTable',
				'kbaseWSModelTable'                 : 'workspaces/kbaseWSModelTable',
				'kbaseWSObjectTable'                : 'workspaces/kbaseWSObjectTable',
				'kbaseWSReferenceList'              : 'workspaces/kbaseWSReferenceList',
				'kbaseWSSelector'                   : 'workspaces/kbaseWSSelector',
            },
            shim : {
                bootstrap : {deps : ["jquery"]}
            }
        });
    });
