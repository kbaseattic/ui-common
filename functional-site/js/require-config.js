/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
    define('kb_clients', [], function () {
        return 'KBCLIENTS DUMMY OBJECT';
    });
    //NB underscore, as of 1.6, inclues AMD compatible loading. However, other parts of the kbase
    // codebase may rely on underscore being loaded globally, so se just use the global version, which
    // must already be loaded.
    var kbClients = [
        ['narrative_method_store', 'NarrativeMethodStore'],
        ['user_profile', 'UserProfile'],
        ['workspace', 'Workspace'],
        ['cdmi', 'CDMI_API'],
        ['cdmi-entity', 'CDMI_EntityAPI'],
        ['trees', 'KBaseTrees'],
        ['fba', 'fbaModelServices'],
        ['ujs', 'UserAndJobState'],
        ['networks', 'KBaseNetworks']
    ];
    // NB need the immediate function exec below in order to avoid
    // variable capture problem with anon funcs.
    kbClients.forEach(function (client) {
        define('kb.service.' + client[0], ['kb.api'], function () {
            return (function (c) {
                return c;
            }(window[client[1]]));
        });
    });
    /*
     for (var i in kbClients) {
     define('kb.client.' + kbClients[i][0], [], (function (client) {
     return function () {
     return client;
     };
     })(window[kbClients[i][1]]));

     }
     */

    require.config({
        baseUrl: '/',
        catchError: true,
        onError: function (err) {
            alert("Error:" + err);
        },
        paths: {
            // External Dependencies
            // ----------------------
            jquery: 'bower_components/jquery/dist/jquery',
            'jquery-ui': 'bower_components/jquery-ui/jquery-ui.min',
            'jquery-ui-css': 'bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min',
            bootstrap: 'bower_components/bootstrap/dist/js/bootstrap.min',
            bootstrap_css: 'bower_components/bootstrap/dist/css/bootstrap.min',
            q: 'bower_components/q/q',
            nunjucks: 'bower_components/nunjucks/browser/nunjucks.min',
            // md5: '/bower_components/md5/build/md5.min',
            md5: 'bower_components/spark-md5/spark-md5.min',
            lodash: 'bower_components/lodash/lodash.min',
            postal: 'bower_components/postal.js/lib/postal.min',
            // 'postal.request-response': '/ext/postal/postal.request-response.min',
            postaldeluxe: 'src/postal/postal-deluxe',
            domReady: 'bower_components/requirejs-domready/domReady',
            text: 'bower_components/requirejs-text/text',
            json: 'bower_components/requirejs-json/json',
            yaml: 'bower_components/require-yaml/yaml',
            underscore: 'bower_components/underscore/underscore-min',
            datatables: 'bower_components/datatables/media/js/jquery.dataTables.min',
            datatables_css: 'bower_components/datatables/media/css/jquery.dataTables.min',
            datatables_bootstrap: 'bower_components/datatables-bootstrap3-plugin/media/js/datatables-bootstrap3.min',
            datatables_bootstrap_css: 'bower_components/datatables-bootstrap3-plugin/media/css/datatables-bootstrap3.min',
            knockout: 'bower_components/knockout/dist/knockout.debug',
            'knockout-mapping': 'bower_components/knockout-mapping/knockout-mapping',
            angular: 'bower_components/angular/angular',
            'angular-ui': 'bower_components/angular-ui/build/angular-ui.min',
            'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router.min',
            'angular-ui-bootstrap': 'bower_components/angular-ui-bootstrap-bower/ui-bootstrap.min',
            'angular-ui-bootstrap-templates': 'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min',
            'jquery.blockUI': 'bower_components/blockUI/jquery.blockUI',
            'd3': 'bower_components/d3/d3.min',
            'd3-sankey': 'bower_components/d3-plugins-sankey/sankey',
            'd3-sankey-css': 'bower_components/d3-plugins-sankey/sankey',
            //'jquery-svg': 'bower_components/jquery.svg/jquery.svg',
            //'jquery-svg-anim': 'bower_components/jquery.svg/jquery.svganim.min',
            //'jquery-svg-dom': 'bower_components/jquery.svg/jquery.svgdom.min',
            //'jquery-svg-filter': 'bower_components/jquery.svg/jquery.svgfilter.min',
            //'jquery-svg-graph': 'bower_components/jquery.svg/jquery.svggraph.min',
            // 'jquery-svg-plot': 'bower_components/jquery.svg/jquery.svgplot.min',
            //'jquery-svg-plot': 'src/widgets/jquery/communities/jquery.svg.plot',
            //'jquery-svg-graph-deviation': 'src/etc/jquery-svg-graph-deviation',
            'jquery-svg-graph-stacked-area': 'src/etc/jquery-svg-graph-stacked-area',
            'uuid': 'bower_components/node-uuid/uuid',
            'canvastext': 'lib/canvastext',
            'popit': 'lib/popit',
            'knhx': 'lib/knhx',
            'googlepalette': 'lib/googlepalette',
            'google-code-prettify': 'bower_components/google-code-prettify/bin/prettify.min',
            'google-code-prettify-style': 'bower_components/google-code-prettify/bin/prettify.min',
            'ace': 'bower_components/ace-builds/src-min/ace',
            // Just style, man.
            'font-awesome': 'bower_components/font-awesome/css/font-awesome.min',
            'stacktrace': 'bower_components/stacktrace-js/dist/stacktrace.min',
            'js-yaml': 'bower_components/js-yaml/dist/js-yaml.min',
            'handlebars' : 'bower_components/handlebars/handlebars.amd.min',

            // KBase Styles
            // ----------------
            'kb.style.bootstrap': 'css/kb-bootstrap',
            'kb.style.sankey': 'css/sankeystyle',
            // KBase Client API
            // -------------------
            'kb.api': 'lib/kbase-clients/kbase-client-api.min',
            'kb.narrative': 'src/kbaseNarrative',
            // KBase Utils
            // ----------------------
            'kb.app': 'src/kbaseApp',
            'kb.main': 'functional-site/js/main',
            'kb.runtime': 'src/kbaseRuntime',
            'kb.router': 'src/kbaseRouter',
            'kb.utils': 'src/kbaseUtils',
            'kb.cookie': 'src/kbaseCookie',
            'kb.test': 'src/kbaseTest',
            'kb.utils.api': 'src/kbaseAPIUtils',
            'kb.alert': 'src/widgets/kbaseAlert',
            'kb.asyncqueue': 'src/kbaseAsyncQueue',
            'kb.statemachine': 'src/kbaseStateMachine',
            'kb.logger': 'src/kbaseLogger',
            // kbase app
            'kb.appstate': 'src/kbaseAppState',
            'kb.html': 'src/kbaseHTML',
            'kb.easytree': 'src/trees/easytree',
            'kb.messaging': 'src/kbaseMessaging',
            'kb.format': 'src/kbaseFormat',
            'kb.props': 'src/kbaseProps',
            'kb.widget.widgetadapter': 'src/widgets/kbaseWidgetAdapter',
            'kb.widget.kbwidgetadapter': 'src/widgets/kbaseKBWidgetAdapter',
            'kb.simplepanel': 'src/kbaseSimplePanel',
            'kb.dom': 'src/kbaseDOM',
            'kb.geometry.size'      : 'src/js/geometry/size',
            'kb.geometry.point'     : 'src/js/geometry/point',
            'kb.geometry.rectangle' : 'src/js/geometry/rectangle',
            'kb.RGBColor'           : 'src/js/RGBColor',

            'kb.widget.vis.barchart'       : 'src/widgets/vis/kbaseBarchart',
            //'kb.widget.vis.chordchart'     : 'src/widgets/vis/kbaseChordchart',
            //'kb.widget.vis.circularHeatmap': 'src/widgets/vis/kbaseCircularHeatmap',
            //'kb.widget.vis.forcedNetwork'  : 'src/widgets/vis/kbaseForcedNetwork',
            'kb.widget.vis.heatmap'        : 'src/widgets/vis/kbaseHeatmap',
            //'kb.widget.vis.histogram'      : 'src/widgets/vis/kbaseHistogram',
            'kb.widget.vis.linechart'      : 'src/widgets/vis/kbaseLinechart',
            //'kb.widget.vis.lineSerieschart': 'src/widgets/vis/kbaseLineSerieschart',
            //'kb.widget.vis.piechart'       : 'src/widgets/vis/kbasePiechart',
            //'kb.widget.vis.scatterplot'    : 'src/widgets/vis/kbaseScatterplot',
            //'kb.widget.vis.treechart'      : 'src/widgets/vis/kbaseTreechart',
            //'kb.widget.vis.venndiagram'    : 'src/widgets/vis/kbaseVenndiagram',
            'kb.widget.vis.widget'         : 'src/widgets/vis/kbaseVisWidget',


            // KBase Widgets
            // -------------
            // userProfileServiceClient: '/functional-site/assets/js/kbclient/user_profile_Client.js',
            'kb.widget.buttonbar': 'src/widgets/kbaseButtonbar',
            'kb.widget.social.base': 'src/widgets/social/kbaseSocialWidget',
            'kb.user_profile': 'src/kbaseUserProfile',
            //'kb.widget.social.user_profile': 'src/widgets/social/kbaseUserProfileWidget',
            //kbaseuserrecentactivity: '/src/widgets/social/kbaseUserRecentActivity',
            //kbaseuserpopularnarratives: '/src/widgets/social/kbaseUserPopularNarratives',
            //'kb.widget.social.user_search': 'src/widgets/social/kbaseUserSearch',
            //'kb.widget.social.browse_narratives': 'src/widgets/social/kbaseUserBrowseNarratives',
            //'kb.widget.social.collaborators': 'src/widgets/social/kbaseUserCollaboratorNetwork',
            'kb.session': 'src/kbaseSession',
            'kb.config': 'src/kbaseConfig',
            'kb.widget.navbar': 'src/widgets/kbaseNavbar',
            'kb.widget.base': 'src/widgets/kbaseBaseWidget',
            'kb.widget.login': 'src/widgets/kbaseLoginWidget',
            // Dashboard widgets
            'kb.widget.dashboard.base': 'src/widgets/dashboard/DashboardWidget',
            'kb.widget.dashboard.profile': 'src/widgets/dashboard/ProfileWidget',
            'kb.widget.dashboard.sharedNarratives': 'src/widgets/dashboard/SharedNarrativesWidget',
            'kb.widget.dashboard.narratives': 'src/widgets/dashboard/NarrativesWidget',
            'kb.widget.dashboard.publicNarratives': '/src/widgets/dashboard/PublicNarrativesWidget',
            'kb.widget.dashboard.apps': 'src/widgets/dashboard/AppsWidget',
            'kb.widget.dashboard.data': 'src/widgets/dashboard/DataWidget',
            'kb.widget.dashboard.collaborators': '/src/widgets/dashboard/CollaboratorsWidget',
            'kb.widget.dashboard.metrics': 'src/widgets/dashboard/MetricsWidget',
            // Dataview widgets
            'kb.widget.dataview.base': 'src/widgets/dataview/DataviewWidget',
            'kb.widget.dataview.overview': 'src/widgets/dataview/OverviewWidget',
            'kb.widget.genericvisualizer': 'src/widgets/dataview/genericvisualizer',
            'kb.widget.dataview.download': 'src/widgets/dataview/kbaseDownloadPanel',
            // KBase clients. Wrappers around the service clients to provide packaged operations with promises.
            'kb.client.workspace': 'src/clients/kbaseWorkspaceClient',
            'kb.client.methods': 'src/clients/kbaseClientMethods',
            // Standalone Widgets
            'kb.widget': 'src/widgets/Widget',
            // 'kb.widget.databrowser': 'src/widgets/DataBrowser/DataBrowser',
            'kb.widget.typebrowser': 'src/widgets/TypeBrowser',
            // KBase Panels
            // ------------
            'kb.panel.contact': 'src/panels/contact',
            'kb.panel.login': 'src/panels/login',
            'kb.panel.navbar': 'src/panels/navbar',
            'kb.panel.narrativemanager': 'src/panels/narrativemanager',
            // 'kb.panel.userprofile': 'src/panels/userprofile',
            'kb.panel.welcome': 'src/panels/welcome',
            'kb.panel.dashboard': 'src/panels/dashboard',
            'kb.panel.dashboard.style': 'src/panels/dashboard',
            'kb.panel.narrativestore': 'src/panels/narrativestore',
            'kb.panel.datasearch': 'src/panels/datasearch',
            'kb.panel.dataview': 'src/panels/dataview',
            'kb.panel.dataview.style': 'src/panels/dataview',
            'kb.panel.typebrowser': 'src/panels/typebrowser',
            'kb.panel.typeview': 'src/panels/typeview',
            'kb.panel.message': 'src/panels/message',
            'kb.panel.test': 'src/panels/test',
            'kb.panel.sample.router': 'src/panels/sample-router',

            'kb.panel.vis.linechart': 'src/panels/vis/linechart',
            'kb.panel.vis.heatmap': 'src/panels/vis/heatmap',
            'kb.panel.vis.barchart': 'src/panels/vis/barchart',

            // KBase JQuery Plugin Widgets
            // ---------------------------
            'kb.jquery.widget': 'src/widgets/jquery/kbaseWidget',
            'kb.jquery.authenticatedwidget': 'src/widgets/jquery/kbaseAuthenticatedWidget',
            'kb.jquery.tabs': 'src/widgets/jquery/kbaseTabs',
            'kb.jquery.kb-tabs': '/src/widgets/jquery/kbTabs',
            'kb.jquery.media-editor': 'src/widgets/jquery/kbaseMediaEditor',
            'kb.jquery.helper-plugins': 'src/widgets/jquery/kbaseHelperPlugins',
            'kb.jquery.narrativestore': 'src/widgets/jquery/kbaseNarrativeStoreView',
            // TODO: why this name for this widget?
            'kb.jquery.provenance': 'src/widgets/jquery/KBaseWSObjGraphCenteredView',
            // genomes
            'kb.jquery.genome': 'src/widgets/jquery/genomes/KBaseGenomePage',
            'kb.jquery.genome.wideoverview': 'src/widgets/jquery/genomes/kbaseGenomeWideOverview',
            'kb.jquery.genome.overview': 'src/widgets/jquery/genomes/kbaseGenomeOverview',
            'kb.jquery.genome.overview.styles': 'src/widgets/jquery/genomes/kbaseGenomeOverview',
            'kb.jquery.genome.wiki-description': 'src/widgets/jquery/genomes/kbaseWikiDescription',
            'kb.jquery.genome.literature': 'src/widgets/jquery/genomes/kbaseLitWidget',
            'kb.jquery.genome.genepage': 'src/widgets/jquery/genomes/kbaseGenePage',
            'kb.jquery.genome.lineage': 'src/widgets/jquery/genomes/kbaseGenomeLineage',
            'kb.jquery.genome.wide-taxonomy': 'src/widgets/jquery/genomes/kbaseGenomeWideTaxonomy',
            'kb.jquery.genome.wide-assembly-annotation': 'src/widgets/jquery/genomes/kbaseGenomeWideAssemAnnot',
            'kb.jquery.genome.multi-contig-browser': 'src/widgets/jquery/genomes/kbaseMultiContigBrowser',
            'kb.jquery.genome.multi-contig-browser.styles': 'src/widgets/jquery/genomes/kbaseMultiContigBrowser',
            'kb.jquery.genome.seed-functions': 'src/widgets/jquery/genomes/kbaseSEEDFunctions',
            'kb.jquery.genome.seed-functions.styles': 'functional-site/assets/css/kbaseSEEDFunctions',
            'kb.jquery.genome.gene-table': 'src/widgets/jquery/genomes/kbaseGenomeGeneTable',
            'kb.jquery.genome.contig-browser-buttons': 'src/widgets/jquery/genomes/kbaseContigBrowserButtons',
            'kb.jquery.from_narrative.annotation-set-table': 'src/widgets/jquery/from_narrative/kbaseAnnotationSetTable',
            'kb.jquery.genome.pangenome': 'src/widgets/jquery/genomes/kbasePanGenome',
            'kb.jquery.genomes.phenotype-set': 'src/widgets/jquery/genomes/kbasePhenotypeSet',
            // assembly
            'kb.jquery.assembly.single-object-basic': 'src/widgets/jquery/assembly/kbaseSingleObjectBasicWidget',
            'kb.jquery.assembly.assembly-input': 'src/widgets/jquery/assembly/kbaseAssemblyInput',
            'kb.jquery.assembly.view': 'src/widgets/jquery/from_narrative/kbaseAssemblyView',
            'kb.jquery.assembly.paired-end-library': 'src/widgets/jquery/assembly/kbasePairedEndLibrary',
            'kb.jquery.assembly.file-paired-end-library': 'src/widgets/jquery/assembly/kbaseFilePairedEndLibrary',
            // communities
            'kb.jquery.communities.collection': 'src/widgets/jquery/communities/kbaseCollectionView',
            'kb.jquery.communities.functional-matrix': 'src/widgets/jquery/communities/kbaseAbundanceDataView',
            'kb.jquery.communities.functional-profile': 'src/widgets/jquery/communities/kbaseAbundanceDataView',
            'kb.jquery.communities.graph': 'src/widgets/jquery/communities/kbStandaloneGraph',
            'kb.jquery.communities.plot': 'src/widgets/jquery/communities/kbStandalonePlot',
            'kb.jquery.communities.heatmap': 'src/widgets/jquery/communities/kbStandaloneHeatmap',
            'kb.jquery.communities.abundance-data-heatmap': 'src/widgets/jquery/communities/kbaseAbundanceDataHeatmap',
            'kb.jquery.communities.metagenome': 'src/widgets/jquery/communities/kbaseMetagenomeView',
            'kb.jquery.communities.jquery-svg': 'src/widgets/jquery/communities/jquery.svg',
            // proteome comparison
            'kb.jquery.proteome-comparison.genome-comparison': 'src/widgets/jquery/protcmp/kbaseGenomeComparison',
            'kb.jquery.proteome-comparison.genome-comparison-viewer': 'src/widgets/jquery/protcmp/kbaseGenomeComparisonViewer',
            // modeling
            'kb.jquery.modeling.objects': 'src/widgets/jquery/modeling/KBObjects',
            'kb.jquery.modeling.biochem-media': 'src/widgets/jquery/modeling/KBaseBiochem.Media',
            'kb.jquery.modeling.fba': 'src/widgets/jquery/modeling/KBaseFBA.FBA',
            'kb.jquery.modeling.fba-model': 'src/widgets/jquery/modeling/KBaseFBA.FBAModel',
            'kb.jquery.modeling.fba-model-set': 'src/widgets/jquery/modeling/KBaseFBA.FBAModelSet',
            'kb.jquery.modeling.phenotype-set': 'src/widgets/jquery/modeling/KBasePhenotypes.PhenotypeSet',
            'kb.jquery.modeling.phenotype-simulation-set': 'src/widgets/jquery/modeling/KBasePhenotypes.PhenotypeSimulationSet',
            'kb.jquery.modeling.genome-set': 'src/widgets/jquery/modeling/KBaseSearch.GenomeSet',
            'kb.jquery.modeling.tab-table': 'src/widgets/jquery/modeling/kbaseTabTable',
            // trees
            'kb.jquery.trees.tree': 'src/widgets/jquery/trees/kbaseTree',
            // type spec
            'kb.spec.common': 'src/widgets/jquery/spec/kbaseSpecCommon',
            'kb.jquery.spec.type-card': 'src/widgets/jquery/spec/kbaseSpecTypeCard',
            'kb.jquery.card-layout-manager': 'src/widgets/jquery/kbaseCardLayoutManager',
            'kb.jquery.landing-page-card': 'src/widgets/jquery/kbaseLandingPageCard',
            'kb.widget.spec.data-type-specification': 'src/widgets/specview/DataTypeSpecification',
            'kb.widget.spec.module-specification': 'src/widgets/specview/ModuleSpecification',
            'kb.widget.spec.function-specification': 'src/widgets/specview/FunctionSpecification',
            'kb.widget.error': 'src/widgets/kbaseError',
            // KBase Data Visualization Widget
            // ----------------------------
            'kb.jquery.contigset': 'src/widgets/jquery/contigset/kbaseContigSetView',

            // Sample Widgets
            //'kb.widget.sample.factory': 'src/widgets/sample/factory-widget',
            //'kb.widget.sample.jquery': 'src/widgets/sample/kbase-jquery-widget',
            //'kb.widget.sample.object': 'src/widgets/sample/object-es5-widget',
            //'kb.widget.sample.object-interface': 'src/widgets/sample/object-widget-interface',

            // KBase Services
            // non-visual dependencies of plugins
            // --------------
            'kb.client.profile': 'src/clients/profile',
            'kb.client.narrativemanager': 'src/clients/narrativemanager',
            // KBase Angular Apps
            // ------------------
            'kb.angular.search': 'src/angular/search'


        },
        shim: {
            datatables: {
                deps: ['jquery']
            },
            datatables_bootstrap: {
                deps: ['datatables', 'css!datatables_bootstrap_css']
            },
            'jquery.blockUI': {
                deps: ['jquery'], exports: '$.fn.block'
            },
            // Bootstrap Shims. From :
            // http://stackoverflow.com/questions/13377373/shim-twitter-bootstrap-for-requirejs
            // Note that bootstrap will be AMD/UMD compatible in v4.
            bootstrap: {
                deps: ['jquery']
            },
            angular: {
                deps: ['jquery'], exports: 'angular'
            },
            'angular-ui-bootstrap-templates': {
                deps: ['angular', 'angular-ui-bootstrap']
            },
            'angular-ui-bootstrap': {
                deps: ['angular']
            },
            'angular-ui-router': {
                deps: ['angular']
            },
            'd3-sankey': {
                deps: ['d3', 'css!d3-sankey-css', 'css!kb.style.sankey']
            },
            'kb.jquery.genome.seed-functions': {
                deps: ['css!kb.jquery.genome.seed-functions.styles']
            },
            'kb.jquery.genome.multi-contig-browser': {
                deps: ['css!kb.jquery.genome.multi-contig-browser.styles']
            },
            'kb.jquery.genome.overview': {
                deps: ['css!kb.jquery.genome.overview.styles']
            },
            /*
             'jquery-svg-graph': {
             deps: ['jquery', 'jquery-svg']
             },
             'jquery-svg-plot': {
             deps: ['jquery', 'jquery-svg', 'jquery-svg-graph']
             },
             'jquery-svg-graph-deviation': {
             deps: ['jquery', 'jquery-svg-graph']
             }
             */
            'kb.jquery.communities.jquery-svg': {
                deps: ['jquery']
            },
            'jquery-ui': {
                deps: ['jquery', 'css!jquery-ui-css']
            },
            'google-code-prettify': {
                deps: ['css!google-code-prettify-style']
            }


        },
        map: {
            '*': {
                'css': 'bower_components/require-css/css.min'
            }
        }


    });
