/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'q',
    'kb.html',
    'kb.runtime',
    'kb.simplepanel',
    'kb.widget.typebrowser'
],
    function (q, html, R, simplePanel, typeBrowser) {
        'use strict';

        return q.Promise(function (resolve) {
            // Widgets
            // Widgets are an array of functions or promises which are 
            // invoked later...
            var widgets = [];
            function addWidget(config) {
                var id = html.genId();
                widgets.push({
                    id: id,
                    config: config,
                    widget: config.widget
                });
                return id;
            }

            // Render panel
            var div = html.tag('div'),
                panel = html.panel;
            var panel = div({class: 'kbase-view kbase-typebrowser-view container-fluid', 'data-kbase-view': 'typebrowser'}, [
                div({class: 'row'}, [
                    div({class: 'col-sm-12'}, [
                        panel('Type Browser',
                            div({id: addWidget({
                                    name: 'typebrowser',
                                    config: {},
                                    widget: typeBrowser.create()
                                })})
                            )
                    ])
                ])
            ]);
            resolve({
                title: 'Type Browser for ' + R.getUsername(),
                content: panel,
                widgets: widgets
            });
        });
    });
