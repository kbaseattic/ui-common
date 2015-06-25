define(['kb.app', 'kb.session', 'jquery', 'q', 'kb.jquery.narrativestore'], function (App, Session, $, Q) {
    'use strict';

    // NB: the narrative store jquery plugin is not actually available here; but including
    // it in the dependencies ensures that it has been installed in jquery.

    function renderNarrativeStore (params) {
        return Q.promise(function (resolve) {
            var widgets = {};
            function addWidget(name, widget) {
                var id = App.genId();

                widgets[name] = {
                    widget: null,
                    id: id,
                    attach: function (node) {
                        $(node).KBaseNarrativeStoreView({
                            type: params.type,
                            id: params.id,
                            loadingImage: 'assets/img/ajax-loader.gif'
                        });
                    }
                };
                
                return id;
            }

            var div = App.tag('div'),
                span = App.tag('span');
            var content = div({class: 'panel panel-default', style: 'margin: "10px"'}, [
                div({class: 'panel-heading'}, [
                    span({class: 'panel-title'}, 'Narrative Apps and Methods Documentation')
                ]),
                div({class: 'panel-body', id: addWidget()})
            ]);
            resolve({
                title: 'Narrative Store',
                content: content,
                widgets: widgets
            });
        });
    }

    function setup() {
        App.addRoute({
            path: ['narrativestore', {type: 'param', name: 'type'}, {type: 'param', name: 'id'}],
            render: null,
            promise: function (params) {
                return renderNarrativeStore(params);
            }
        });
    }
    function teardown() {
        // TODO: remove routes
        return false;
    }
    function start() {
        //
        return false;
    }
    function stop() {
        //
        return false;
    }
    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop
    };
});
