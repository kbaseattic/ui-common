define(['kb.app', 'kb.client.narrativemanager', 'q'], function (App, NarrativeManagerService, Q) {
    'use strict';

    return function () {
        var NarrativeManager = NarrativeManagerService();
        
        function makeNarrativePath(wsId, objId) {
            return '/narrative/ws.' + wsId + '.obj.' + objId;
        }

        function renderError(error) {
            var message;
            if (typeof error === 'string') {
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
                    function (result) {
                        if (result.last_narrative) {
                            // we have a last_narrative, so go there
                            var wsId = result.last_narrative.ws_info[0],
                                objId = result.last_narrative.nar_info[0],
                                path = makeNarrativePath(wsId, objId);
                            resolve({
                                redirect: path
                            });
                        } else {
                            //we need to construct a new narrative- we have a first timer
                            NarrativeManager.createTempNarrative(
                                {cells: [], parameters: [], importData: []},
                                function (info) {
                                    var wsId = info.nar_info[6],
                                        objId = info.nar_info[0],
                                        path = makeNarrativePath(wsId, objId);
                                    resolve({
                                        redirect: path
                                    });
                                },
                                function (error) {
                                    fail(error);
                                }
                            );
                        }
                    },
                    function (error) {
                        fail(error);
                    }
                );
            });
        }

        function createNewNarrative(params) {
            return Q.promise(function (resolve, fail) {
                if (params.app && params.method) {
                    fail("Must provide no more than one of the app or method params");
                    return;
                }
                var importData = null;
                if (params.copydata) {
                    importData = params.copydata.split(';');
                }
                var appData = null;
                if (params.appparam) {
                    var tmp = params.appparam.split(';');
                    appData = [];
                    for (var i = 0; i < tmp.length; i += 1) {
                        appData[i] = tmp[i].split(',');
                        if (appData[i].length !== 3) {
                            fail("Illegal app parameter set, expected 3 parameters separated by commas: " + tmp[i]);
                            return;
                        }
                        appData[i][0] = parseInt(appData[i][0]);
                        if (isNaN(appData[i][0]) || appData[i][0] < 1) {
                            fail("Illegal app parameter set, first item in set must be an integer > 0: " + tmp[i]);
                            return;
                        }
                    }
                }
                var cells = [];
                if (params.app) {
                    cells = [{app: params.app}];
                } else if (params.method) {
                    cells = [{method: params.method}];
                }
                NarrativeManager.createTempNarrative(
                    {cells: cells, parameters: appData, importData: importData},
                    function (info) {
                        var wsId = info.nar_info[6],
                            objId = info.nar_info[0],
                            path = makeNarrativePath(wsId, objId);
                        resolve({
                            redirect: path
                        });
                    },
                    function (error) {
                        fail(error);
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
                render: null,
                promise: function (params) {
                    return createNewNarrative(params);
                }
            });

        }
        ;
        function teardown() {
            // TODO: remove routes
        }
        ;
        function start() {
            //
        }
        ;
        function stop() {
            //
        }
        ;
        return {
            setup: setup,
            teardown: teardown,
            start: start,
            stop: stop
        };
    }

});
