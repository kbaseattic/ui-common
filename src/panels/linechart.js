/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.html',
    'kb.runtime',
    'q',
    'underscore',
    'kb.widget.kbwidgetadapter'],
    function (html, R, q, _, kbWidgetAdapterFactory) {
        'use strict';

        function linechartWidget() {

            function widget(config) {
                var mount, container;


                function render() {
                    var h1 = html.tag('h1'),
                        div = html.tag('div');
                    var content = div([
                        h1('Testing at KBase'),
                        div({class: 'row'}, [
                            div({class: 'col-md-6'}, [
                                'You can use this page to test widgets. Nothing special, just edit it to suite your needs.'
                            ])
                        ])
                    ]);
                    var $div = $('<div></div>').append("This would be a line chart").on('click', function(e) { alert ("FOO") });

var $lc = kbWidgetAdapterFactory.make(
    {
        name: 'linechart',
        module : 'kb.widget.vis.linechart',
        jquery_object : 'kbaseLinechart',
        widgetConfig : {
            debug : true
        }
    }
);

console.log("LC IS ", $lc);

                    return {
                        title: 'Sample line chart',
                        content: $div[0],
                    }
                }

                function attach(node) {
                    return q.Promise(function (resolve) {
                        mount = node;
                        container = document.createElement('div');
                        mount.appendChild(container);
                        var rendered = render();
                        R.send('app', 'title', rendered.title);
                        container.innerHTML = rendered.content;

                        resolve();
                    });
                }
                function start(params) {
                    return q.Promise(function (resolve) {
                        resolve();
                    });
                }
                function stop(node) {
                    return q.Promise(function (resolve) {

                        resolve();
                    });
                }
                function detach(node) {
                    return q.Promise(function (resolve) {

                        resolve();
                    });
                }

                return {
                    attach: attach,
                    start: start,
                    stop: stop,
                    detach: detach
                };
            }


            return {
                create: function (config) {
                    return widget(config);
                }
            };
        }


        function setup(app) {
            app.addRoute({
                path: ['linechart'],
                widget: linechartWidget()
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
