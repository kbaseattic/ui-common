define(['kb.app', 'kb.statemachine', 'kb.session', 'kb.widget.dashboard.profile', 'kb.widget.dashboard.narratives', 'kb.widget.dashboard.sharedNarratives', 'kb.widget.dashboard.publicNarratives', 'kb.widget.dashboard.apps', 'kb.widget.dashboard.collaborators', 'kb.widget.dashboard.metrics', 'q', 'postal', 'css!kb.panel.dashboard.style'], function (App, StateMachine, Session, ProfileWidget, NarrativesWidget, SharedNarrativesWidget, PublicNarrativesWidget, AppsWidget, CollaboratorNetworkWidget, MetricsWidget, Q, Postal) {
    'use strict';

    function renderPanel(params) {
        return Q.Promise(function (resolve) {
            // View stat is a local state machine for this view.
            var viewState = Object.create(StateMachine).init();

            // Widgets
            // Widgets are an array of functions or promises which are 
            // invoked later...
            var widgets = {};
            function addWidget(name, widget) {
                var id = App.genId();
                var W = Object.create(widget);
                widgets[name] = {
                    widget: W,
                    id: id,
                    attach: function (node) {
                        W.init({
                            container: node,
                            userId: params.username,
                            viewState: viewState
                        }).go();
                    }
                };
                return id;
            }

            // Render panel
            var div = App.tag('div');
            var panel = div({class: 'kbase-view kbase-dashboard-view container-fluid', 'data-kbase-view': 'social'}, [
                div({class: 'row'}, [
                    div({class: 'col-sm-8'}, [
                        div({id: addWidget('narratives', NarrativesWidget)}),
                        div({id: addWidget('sharednarratives', SharedNarrativesWidget)}),
                        div({id: addWidget('publicnarratives', PublicNarrativesWidget)}),
                        div({id: addWidget('apps', AppsWidget)})
                    ]),
                    div({class: 'col-sm-4'}, [
                        div({id: addWidget('profile', ProfileWidget)}),
                        div({id: addWidget('metrics', MetricsWidget)}),
                        div({id: addWidget('usersearch', CollaboratorNetworkWidget)})
                    ])
                ])
            ]);
            resolve({
                title: 'Dashboard for ' + Session.getUsername(),
                content: panel,
                widgets: widgets
            });
        });
    }

    function setup() {
        App.addRoute({
            id: 'dashboard',
            path: ['dashboard'],
            promise: function (params) {                
                return Q.promise(function (resolve) {
                    resolve(renderPanel(params));
                });
            },
            start: start,
            stop: stop
        });
    }
    function teardown() {
        // TODO: remove routes
        return false;
    }
    
    var heartbeat = 0;
    var heartbeatTimer = null;
    function start() {
        // a cheap hartbeat for now... and just for the dashboard.
        console.log('Starting the heartbeat...');
        heartbeat = 0;
        heartbeatTimer = window.setInterval(function () {
                heartbeat++;
                Postal.channel('app').publish('heartbeat', {heartbeat: heartbeat});
        }, 100);
    }
    function stop() {    
        console.log('Stopping the heartbeat...');
        if (heartbeatTimer) {
            window.clearInterval(heartbeatTimer);
        }
    }
    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop
    };
});
