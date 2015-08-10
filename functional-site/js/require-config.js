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
            jquery: 'bower_components/jquery/dist/jquery.min',
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
            //angular: 'bower_components/angular/angular',
            //'angular-ui': 'bower_components/angular-ui/build/angular-ui.min',
            //'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router.min',
            //'angular-ui-bootstrap': 'bower_components/angular-ui-bootstrap-bower/ui-bootstrap.min',
            //'angular-ui-bootstrap-templates': 'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min',
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
            // 'ace': 'bower_components/ace-builds/src-min/ace',
            // Just style, man.
            'font-awesome': 'bower_components/font-awesome/css/font-awesome.min',
            'stacktrace': 'bower_components/stacktrace-js/dist/stacktrace.min',
            'js-yaml': 'bower_components/js-yaml/dist/js-yaml.min',
            
            // KBase Styles
            // ----------------
            'kb.style.bootstrap': 'css/kb-bootstrap',
            'kb/style/sankey': 'css/sankeystyle',
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
            
            
            // KBase Widgets
            // -------------
            
            'kb_widgetBases_simpleWidget': 'src/widgetBases/simpleWidget',
            'kb_widgetBases_domWidget': 'src/widgetBases/domWidget',
            'kb_widgetBases_baseWidget': 'src/widgetBases/baseWidget',
            
            'kb.widget.buttonbar': 'src/widgets/kbaseButtonbar',
            'kb_user_profile': 'src/kbaseUserProfile',
            'kb.session': 'src/kbaseSession',
            'kb.config': 'src/kbaseConfig',
            'kb.widget.navbar': 'src/widgets/kbaseNavbar',
            'kb.widget.base': 'src/widgets/kbaseBaseWidget',
            'kb.widget.login': 'src/widgets/kbaseLoginWidget',
            
            // Dataview widgets
            // KBase clients. Wrappers around the service clients to provide packaged operations with promises.
            'kb.client.workspace': 'src/clients/kbaseWorkspaceClient',
            'kb.client.methods': 'src/clients/kbaseClientMethods',
            // Standalone Widgets
            'kb.widget': 'src/widgets/Widget',
            // KBase Panels
            // ------------
            
            'kb_panelBases_widgetPanel': 'src/panelBases/widgetPanel',
            
            'kb.panel.login': 'src/panels/login',
            'kb.panel.navbar': 'src/panels/navbar',
            'kb.panel.welcome': 'src/panels/welcome',
            'kb.panel.datasearch': 'src/panels/datasearch',
            'kb.panel.typeview': 'src/panels/typeview',
            'kb.panel.message': 'src/panels/message',
            'kb.panel.sample.router': 'src/panels/sample-router',
            
            // KBase JQuery Plugin Widgets
            // ---------------------------
            'kb.jquery.widget': 'src/widgets/jquery/kbaseWidget',
            'kb.jquery.authenticatedwidget': 'src/widgets/jquery/kbaseAuthenticatedWidget',
            'kb.jquery.tabs': 'src/widgets/jquery/kbaseTabs',
            'kb.jquery.kb-tabs': '/src/widgets/jquery/kbTabs',
            'kb.jquery.media-editor': 'src/widgets/jquery/kbaseMediaEditor',
            'kb.jquery.helper-plugins': 'src/widgets/jquery/kbaseHelperPlugins',
            'kb.jquery.narrativestore': 'src/widgets/jquery/kbaseNarrativeStoreView',

            // type spec
            'kb.spec.common': 'src/widgets/jquery/spec/kbaseSpecCommon',
            'kb.jquery.spec.type-card': 'src/widgets/jquery/spec/kbaseSpecTypeCard',
            // 'kb.jquery.card-layout-manager': 'src/widgets/jquery/kbaseCardLayoutManager',
            'kb.jquery.landing-page-card': 'src/widgets/jquery/kbaseLandingPageCard',
            'kb.widget.spec.data-type-specification': 'src/widgets/specview/DataTypeSpecification',
            'kb.widget.spec.module-specification': 'src/widgets/specview/ModuleSpecification',
            'kb.widget.spec.function-specification': 'src/widgets/specview/FunctionSpecification',
            'kb.widget.error': 'src/widgets/kbaseError',
            // KBase Data Visualization Widget
            // ----------------------------
            // 'kb.jquery.contigset': 'src/widgets/jquery/contigset/kbaseContigSetView',
            
            
            // KBase Services
            // non-visual dependencies of plugins
            // --------------
            'kb.client.profile': 'src/clients/profile',
            'kb.client.narrativemanager': 'src/clients/narrativemanager',
            // KBase Angular Apps
            // ------------------
            //'kb.angular.search': 'src/angular/search'


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
            /*
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
            */
            'd3-sankey': {
                deps: ['d3', 'css!d3-sankey-css', 'css!kb/style/sankey']
            },
            /*
            'kb.jquery.genome.seed-functions': {
                deps: ['css!kb.jquery.genome.seed-functions.styles']
            },
            'kb.jquery.genome.multi-contig-browser': {
                deps: ['css!kb.jquery.genome.multi-contig-browser.styles']
            },
            'kb.jquery.genome.overview': {
                deps: ['css!kb.jquery.genome.overview.styles']
            },
            */
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
                'css': 'bower_components/require-css/css'
            }
        }


    });