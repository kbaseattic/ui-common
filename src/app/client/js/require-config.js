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
            'jquery-ui': 'bower_components/jquery-ui/jquery-ui',
            'jquery-ui-css': 'bower_components/jquery-ui/themes/ui-lightness/jquery-ui',
            bootstrap: 'bower_components/bootstrap/dist/js/bootstrap',
            bootstrap_css: 'bower_components/bootstrap/dist/css/bootstrap',
            // q: 'bower_components/q/q',
            bluebird: 'bower_components/bluebird/js/browser/bluebird',
            nunjucks: 'bower_components/nunjucks/browser/nunjucks',
            // md5: '/bower_components/md5/build/md5.min',
            md5: 'bower_components/spark-md5/spark-md5',
            lodash: 'bower_components/lodash/lodash',
            postal: 'bower_components/postal.js/lib/postal',
            // 'postal.request-response': '/ext/postal/postal.request-response.min',
            // postaldeluxe: 'js/lib/postal/postal-deluxe',
            domReady: 'bower_components/requirejs-domready/domReady',
            text: 'bower_components/requirejs-text/text',
            json: 'bower_components/requirejs-json/json',
            yaml: 'bower_components/require-yaml/yaml',
            underscore: 'bower_components/underscore/underscore',
            datatables: 'bower_components/datatables/media/js/jquery.dataTables',
            datatables_css: 'bower_components/datatables/media/css/jquery.dataTables',
            datatables_bootstrap: 'bower_components/datatables-bootstrap3-plugin/media/js/datatables-bootstrap3',
            datatables_bootstrap_css: 'bower_components/datatables-bootstrap3-plugin/media/css/datatables-bootstrap3',
            knockout: 'bower_components/knockout/dist/knockout',
            'knockout-mapping': 'bower_components/knockout-mapping/knockout-mapping',
            'jquery.blockUI': 'bower_components/blockUI/jquery.blockUI',
            'd3': 'bower_components/d3/d3',
            'd3-sankey': 'bower_components/d3-plugins-sankey/sankey',
            'd3-sankey-css': 'bower_components/d3-plugins-sankey/sankey',
            //'jquery-svg': 'bower_components/jquery.svg/jquery.svg',
            //'jquery-svg-anim': 'bower_components/jquery.svg/jquery.svganim.min',
            //'jquery-svg-dom': 'bower_components/jquery.svg/jquery.svgdom.min',
            //'jquery-svg-filter': 'bower_components/jquery.svg/jquery.svgfilter.min',
            //'jquery-svg-graph': 'bower_components/jquery.svg/jquery.svggraph.min',
            // 'jquery-svg-plot': 'bower_components/jquery.svg/jquery.svgplot.min',
            //'jquery-svg-plot': 'js/lib/widgets/jquery/communities/jquery.svg.plot',
            //'jquery-svg-graph-deviation': 'js/lib/etc/jquery-svg-graph-deviation',
            'uuid': 'bower_components/node-uuid/uuid',
            'google-code-prettify': 'bower_components/google-code-prettify/bin/prettify.min',
            'google-code-prettify-style': 'bower_components/google-code-prettify/bin/prettify.min',
            'font-awesome': 'bower_components/font-awesome/css/font-awesome',
            'stacktrace': 'bower_components/stacktrace-js/dist/stacktrace',
            'js-yaml': 'bower_components/js-yaml/dist/js-yaml',
            'handlebars' : 'bower_components/handlebars/handlebars.amd',

            // Manually installed external dependencies.
            'jquery-svg-graph-stacked-area': 'js/lib/etc/jquery-svg-graph-stacked-area',
            'canvastext': 'lib/canvastext',
            'popit': 'lib/popit',
            'knhx': 'lib/knhx',
            'googlepalette': 'lib/googlepalette',

            // KBase Styles
            // ----------------
            'kb.style.bootstrap': 'css/kb-bootstrap',
            'kb/style/sankey': 'css/sankeystyle',
            
            // KBase Client API
            // -------------------
            'kb.api': 'lib/kbase-client-api',
            'kb.narrative': 'js/lib/kbaseNarrative',
            'kb_client_metrics': 'js/lib/clients/kbaseMetrics',
            'kb_user_profile': 'js/lib/kbaseUserProfile',
            'kb.client.workspace': 'js/lib/clients/kbaseWorkspaceClient',
            'kb.client.methods': 'js/lib/clients/kbaseClientMethods',
            'kb.client.profile': 'js/lib/clients/profile',
            'kb.client.narrativemanager': 'js/lib/clients/narrativemanager',
            
            // DATA API
            thrift: 'bower_components/thrift-binary-protocol/thrift-core',
            thrift_transport_xhr: 'bower_components/thrift-binary-protocol/thrift-transport-xhr',
            thrift_protocol_binary: 'bower_components/thrift-binary-protocol/thrift-protocol-binary',
            
            taxon_types: 'bower_components/kbase-data-api-js-wrappers/thrift/taxon/taxon_types',
            taxon_service: 'bower_components/kbase-data-api-js-wrappers/thrift/taxon/thrift_service',        
            kb_taxon: 'bower_components/kbase-data-api-js-wrappers/Taxon',

            
            // KBase SPA
            // ---------
            'kb.main': 'js/main',
            'kb.runtime': 'js/lib/kbaseRuntime',
            'kb.app': 'js/lib/kbaseApp',
            
            'kb.router': 'js/lib/kbaseRouter',
            'kb.appstate': 'js/lib/kbaseAppState',
            
            'kb_types': 'js/lib/kbaseTypes',
            'kb_data':  'js/lib/kbaseData',
            
            
            // KBase Utils
            // ----------------------
            
            // Core building blocks
            'kb.cookie': 'js/lib/kbaseCookie',
            'kb.props': 'js/lib/kbaseProps',
            'kb.logger': 'js/lib/kbaseLogger',
            'kb.session': 'js/lib/kbaseSession',
            'kb.config': 'js/lib/kbaseConfig',
            
            // App widgets
            'kb.widget.navbar': 'js/lib/widgets/kbaseNavbar',
            'kb.widget.login': 'js/lib/widgets/kbaseLoginWidget',
            'kb.widget.error': 'js/lib/widgets/kbaseError',
            
            // Commonly Used
            'kb.html': 'js/lib/kbaseHTML',
            'kb.dom': 'js/lib/kbaseDOM',
            
            // Less Commonly Used
            'kb.utils': 'js/lib/kbaseUtils',
            'kb.utils.api': 'js/lib/kbaseAPIUtils',
            'kb.alert': 'js/lib/widgets/kbaseAlert',
            'kb.asyncqueue': 'js/lib/kbaseAsyncQueue',
            'kb.statemachine': 'js/lib/kbaseStateMachine',
            'kb.messaging': 'js/lib/kbaseMessaging',
            'kb.format': 'js/lib/kbaseFormat',
            'kb.easytree': 'js/lib/kbaseEasyTree',
            
            // Probably should go away
            

            // KBase Widgets
            // -------------
            
            // Adapters
            'kb.widget.widgetadapter': 'js/lib/widgets/kbaseWidgetAdapter',
            'kb.widget.kbwidgetadapter': 'js/lib/widgets/kbaseKbWidgetAdapter',
            
            
            // Base Widgets
            'kb_widgetBases_simpleWidget': 'js/lib/widgetBases/simpleWidget',
            'kb_widgetBases_domWidget': 'js/lib/widgetBases/domWidget',
            'kb_widgetBases_baseWidget': 'js/lib/widgetBases/baseWidget',
            'kb.widget.base': 'js/lib/widgets/kbaseBaseWidget',
            'kb_widgetBases_dataVisWidget': 'js/lib/widgetBases/dataVisWidget',

            // Base Panels (widget managing widgets...)
            'kb.simplepanel': 'js/lib/kbaseSimplePanel',            
            'kb_panelBases_widgetPanel': 'js/lib/panelBases/widgetPanel',
            
            // Widget capabilities
            'kb.widget.buttonbar': 'js/lib/widgets/kbaseButtonbar',
            
            // Dataview widgets
            // KBase clients. Wrappers around the service clients to provide packaged operations with promises.
            // Standalone Widgets
            // KBase Panels
            // ------------

            // Widget Managers
            'kb_widgetCollection': 'js/lib/kbaseWidgetCollection',
            
            // Built in Panels
            // 'kb.panel.login': 'js/lib/panels/login',
            'kb.panel.navbar': 'js/lib/panels/navbar',
            'kb.panel.welcome': 'js/lib/panels/welcome',
            'kb.panel.datasearch': 'js/lib/panels/datasearch',
            'kb.panel.typeview': 'js/lib/panels/typeview',
            'kb.panel.message': 'js/lib/panels/message',

            // KBase JQuery Plugin Widgets
            // ---------------------------
            'kb.jquery.widget': 'js/lib/widgets/jquery/kbaseWidget',
            'kb.jquery.authenticatedwidget': 'js/lib/widgets/jquery/kbaseAuthenticatedWidget',
            'kb.jquery.tabs': 'js/lib/widgets/jquery/kbaseTabs',
            'kb.jquery.kb-tabs': 'js/lib/widgets/jquery/kbTabs',
            // 'kb.jquery.media-editor': 'js/lib/widgets/jquery/kbaseMediaEditor',
            'kb.jquery.helper-plugins': 'js/lib/widgets/jquery/kbaseHelperPlugins',
            'kb.jquery.narrativestore': 'js/lib/widgets/jquery/kbaseNarrativeStoreView',

            // type spec
            'kb.spec.common': 'js/lib/widgets/jquery/spec/kbaseSpecCommon',
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
