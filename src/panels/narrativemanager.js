define(['kb.app', 'kb.session', 'kb.service.narrativemanager', 'q'], function (App, Session, NarrativeManager, Q) {
    'use strict';
    
    
    function replacePath(path) {
        // maybe render message ...
        //
        //        'redirecting to <a href="/narrative/ws.' + workspaceId +
        //        '.obj.' + objId + '">/narrative/ws.' + workspaceId +
        //        '.obj.' + objId + '</a>');
        window.location.replace(path);
    }
    
    function makeNarrativePath(wsId, objId) {
        return '/narrative/ws.'+ wsId + '.obj.' + objId;
    }
    
    function renderError (error) {
        var message;
        if (typeof error == "string") {
            message = error;
        } else {
            message = error.message;
        }
        
        var div = App.tag('div'),
            button = App.tag('button'),
            span = App.tag('span');
        
        return div({class: 'alert alert-danger alert-dismissable', role: 'alert'}, [
            message,
            button({class: 'close', type: 'button', 'data-dismiss': 'alert', 'aria-label': 'Close'}, [
                span({'aria-hidden': 'true'}, '&times;')
            ])            
        ]);
    }
    
    function startOrCreateEmptyNarrative() {
        return Q.Promise(function (resolve, fail) {
            NarrativeManager.detectStartSettings(
                function(result) {
                    if (result.last_narrative) {
                        // we have a last_narrative, so go there
                        var wsId = result.last_narrative.ws_info[0],
                            objId = result.last_narrative.nar_info[0],
                            path = makeNarrativePath(wsId, objId);
                        replacePath(path);
                    } else {
                        //we need to construct a new narrative- we have a first timer
                        NarrativeManager.createTempNarrative(
                                {cells:[],parameters:[],importData : []},
                                function(info) {
                                    var wsId = info.nar_info[6],
                                        objId = info.nar_info[0],
                                        path = makeNarrativePath(wsId, objId);
                                    replacePath(path);
                                },
                                function(error) {
                                    renderError(error);
                                }
                        );
                    }
                },
                function(error) {
                    renderError(error);
                }
            );
        });
    }
    
    
    function setup() {
        
        /*
         $stateProvider
            .state('narrativemanager', {
                url: "/narrativemanager/:action?app&method&copydata&appparam",
                templateUrl: 'views/narrative/narrative-manager.html',
                controller: 'narrativemanager'
            });
        */
        
        App.addRoute({
            path: ['narrativemanager', 'start'],
            queryParams: {
                app: {},
                method: {},
                copydata: {},
                appparam: {}
            },
            render: null,
            promise: function () {
                return startOrCreateEmptyNarrative();
            }
                
            
        });
         App.addRoute({
            path: ['narrativemanager', 'new'],
            queryParams: {
                app: {},
                method: {},
                copydata: {},
                appparam: {}
            },
            render: function (params) {
                return "NOT YET";
            }
        });
        
    };
    function teardown() {
        // TODO: remove routes
    };
    function start () {
        //
    };
    function stop () {
        //
    };
    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop
    };
    
});
