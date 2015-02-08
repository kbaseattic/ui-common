/*
 *  Directives
 *
 *  These can be thought of as the 'widgets' on a page.
 *  Scope comes from the controllers.
 *
 */

angular.module('dataview', []);
angular.module('dataview')
.directive('dataviewoverview', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
           "use strict";
           require(['kb.widget.dataview.overview', 'jquery'], function (W, $) {
                var widget = Object.create(W);
                widget.init({
                    container: $(ele),
                    workspaceId: scope.params.wsid,
                    objectId: scope.params.objid,
                    objectVersion: scope.params.ver,
                    sub: scope.params.sub
                }).go();
            });
        }
    };
})
.directive('dataviewprovenance', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            var $widgetDiv = $('<div>');
	    var widget = $widgetDiv.KBaseWSObjGraphCenteredView({
                                    objNameOrId: scope.params.objid,
                                    wsNameOrId: scope.params.wsid,
                                    kbCache: kb});
            
            var $collapsableHeader = $(
                    '<div class="panel-group" id="provAccordion" role="tablist" aria-multiselectable="true">'+
                         '<div class="panel panel-default">'+
                            '<div class="panel-heading" role="tab" id="provHeading">'+
                               '<h4 class="panel-title">'+
                                  '<span data-toggle="collapse" data-parent="#provAccordion"  data-target="#provCollapse" aria-expanded="false" aria-controls="provCollapse" class="collapsed" style="cursor:pointer;">'+
                                     '<span class="fa fa-sitemap fa-rotate-90 pull-left"></span> Data Provenance and Reference Network'+
                                  '</span>'+
                               '</h4>'+
                            '</div>'+
                            '<div id="provCollapse" class="panel-collapse collapse" role="tabpanel" aria-labelledby="provHeading">'+
                               '<div class="panel-body">'+
                               '</div>'+
                            '</div>'+
                         '</div>' +
                      '</div>'
            );
    
            $collapsableHeader.find('.panel-body').append($widgetDiv);
            /*var $group = $('<div class="panel-group" id="prov_accordion_group">');
            
            var $title = $('<div>').addClass('panel-heading')
                                        .append($('<span>').addClass('panel-title')
                                                    .append('<a data-toggle="collapse" href="#provcontent">Data Provenance and Reference Graph</a>'));
            var $body = $('<div id="provcontent" class="panel-collapse collapse in">')
                            $('<div>').addClass('panel-body').append($widgetDiv);
            
            var $panel = $('<div>').addClass("panel panel-default")
			    .append($title)
			    .append($body);*/
                            
            $(ele).append($collapsableHeader);
        }
    }; 
})
.directive('dataviewvisualizer', function($rootScope) {
    return {
        link: function(scope, ele, attrs) {
            $(ele).KBaseDataViewGenericViz({
                    objid: scope.params.objid,
                    wsid: scope.params.wsid,
                    ver: scope.params.ver,
                    sub: scope.params.sub
                });
        }
    }; 
});