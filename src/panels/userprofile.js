/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.html', 'kb.session', 'kb.widget.social.user_profile', 'kb.widget.social.user_search', 'kb.widget.social.browse_narratives', 'kb.widget.social.collaborators', 'q', 'jquery'], function (html, Session, UserProfileWidget, UserSearchWidget, NarrativeWidget, CollaboratorsWidget, Q, $) {
    'use strict';

    function renderUserProfilePanel(params) {
        return Q.Promise(function (resolve) {
            // Widgets
            // Widgets are an array of functions or promises which are 
            // invoked later...
            var widgets = {};
            function addWidget(name, widget) {
                var id = html.genId();
                var W = Object.create(widget);
                widgets[name] = {
                    widget: W,
                    id: id,
                    attach: function (node) {
                        W.init({
                            container: $(node),
                            userId: params.username
                        }).go();
                    }
                };
                return id;
            }

            // Render panel
            var div = html.tag('div');
            var panel = div({class: 'kbase-view kbase-user-page-view container-flud', 'data-kbase-view': 'social'}, [
                div({class: 'row'}, [
                    div({class: 'col-sm-9'}, [
                        div({id: addWidget('profile', UserProfileWidget)})
                    ]),
                    div({class: 'col-sm-3'}, [
                        div({id: addWidget('usersearch', UserSearchWidget)})
                    ])
                ]),
                div({class: 'row'}, [
                    div({class: 'col-sm-6'}, [
                        div({id: addWidget('narratives', NarrativeWidget)})
                    ]),
                    div({class: 'col-sm-6'}, [
                        div({id: addWidget('collaborators', CollaboratorsWidget)})
                    ])
                ])
            ]);
            resolve({
                title: Session.getUsername(),
                content: panel,
                widgets: widgets
            });
        });
    }

    function setup(app) {
        app.addRoute({
            path: ['people', {type: 'param', name: 'username'}],
            render: null,
            promise: function (params) {
                return renderUserProfilePanel(params);
            }
        });
        app.addRoute({
            path: ['people'],
            render: function (params) {
                return 'NOT YET';
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
