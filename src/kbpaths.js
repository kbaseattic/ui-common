define('kbpaths',[], function (paths) {
 requirejs.config({
    baseUrl : '../../src/widgets',
    urlArgs: "bust=" + (new Date()).getTime(),
    paths : {
     jquery : '../../ext/jquery/jquery-1.10.2.min',
     jqueryui : '../../ext/jquery-ui/1.10.3/js/jquery-ui-1.10.3.custom.min',
     bootstrap : "../../ext/bootstrap/3.0.3/js/bootstrap.min",
     d3 : "../../ext/d3/d3.v3.min",
//     datavis : './jquery/kbase/datavis',
//     kbaseapi : './jquery/ui-js/kbase-api',
     kbwidget : '../kbwidget',

     kbaseVisWidget : 'kbaseVisWidget',
     kbaseHeatmap : 'vis/kbaseHeatmap',
     kbaseBarchart : 'vis/kbaseBarchart',
     kbaseScatterplot : 'vis/kbaseScatterplot',
     kbaseLinechart : 'vis/kbaseLinechart',
     kbaseLineSerieschart : 'vis/kbaseLineSerieschart',
     kbasePiechart : 'vis/kbasePiechart',
     kbaseForcedNetwork : 'vis/kbaseForcedNetwork',

     kbasePlantsNetworkTable : 'vis/plants/kbasePlantsNetworkTable',
     kbasePlantsNetworkNarrative : 'vis/plants/kbasePlantsNetworkNarrative',

        //iris widgets
        iris              : 'iris/iris',
        vis               : 'vis/vis',
        kbaseIrisCommands : 'iris/kbaseIrisCommands',
        kbaseIrisContainerWidget : 'iris/kbaseIrisContainerWidget',
        kbaseIrisEchoWidget : 'iris/kbaseIrisEchoWidget',
        kbaseIrisFileBrowser : 'iris/kbaseIrisFileBrowser',
        kbaseIrisFileEditor : 'iris/kbaseIrisFileEditor',
        kbaseIrisGrammar : 'iris/kbaseIrisGrammar',
        kbaseIrisGUIWidget : 'iris/kbaseIrisGUIWidget',
        kbaseIrisProcessList : 'iris/kbaseIrisProcessList',
        kbaseIrisTerminal : 'iris/kbaseIrisTerminal',
        kbaseIrisTerminalWidget : 'iris/kbaseIrisTerminalWidget',
        kbaseIrisTextWidget : 'iris/kbaseIrisTextWidget',
        kbaseIrisTutorial : 'iris/kbaseIrisTutorial',
        kbaseIrisWidget : 'iris/kbaseIrisWidget',
        kbaseIrisWorkspace : 'iris/kbaseIrisWorkspace',

        RGBColor : '../js/RGBColor',
        geometry_point : '../js/geometry/point',
        geometry_rectangle : '../js/geometry/rectangle',
        geometry_size : '../js/geometry/size',

        KbaseNetworkServiceClient : '../js/KbaseNetworkServiceClient',
        KbaseNetworkServiceClient : '../js/CDMI_API',
    },
    shim: {
        bootstrap:    { deps: ["jquery"] },
    }
 });
});


