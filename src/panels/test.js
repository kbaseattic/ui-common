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
    'kb.rgbcolor'],
    function (html, R, q, _, RGBColor) {
        'use strict';

        function testWidget() {

            function widget(config) {
                var mount, container;

                function renderLighten() {
                    var div = html.tag('div');

                    var rgbc = new RGBColor(0, 0, 0);

                    return _.range(0, 255, 5).map(function (i) {
                        return div({style: {
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                border: '1px silver solid',
                                'background-color': rgbc.lightenBy(i).asString()
                            }}, String(i));
                    });
                }


                function renderDarken() {
                    var
                        div = html.tag('div');

                    var rgbc = new RGBColor(255, 255, 255);

                    return _.range(0, 255, 5).map(function (i) {
                        return div({style: {
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                border: '1px silver solid',
                                'background-color': rgbc.lightenBy(i).asString()
                            }}, String(i));
                    });
                }
                
                function render() {
                    var h1 = html.tag('h1'),
                        div = html.tag('div');
                    return div([
                        h1('Testing at KBase'),
                        div({class: 'row'}, [
                            div({class: 'col-md-6'}, [
                                html.bsPanel('Lighten', renderLighten()),
                                html.bsPanel('Darken', renderDarken())
                            ])
                        ])
                    ]);
                }

                function attach(node) {
                    return q.Promise(function (resolve) {
                        mount = node;
                        container = document.createElement('div');
                        mount.appendChild(container);
                        container.innerHTML = render();

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
                path: ['test'],
                widget: testWidget()
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
