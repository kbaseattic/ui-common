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
    'kb.widget.vis.linechart'],
    function (html, R, q, _) {
        'use strict';

        function linechartWidget() {

            function widget(config) {

                var mount, container;


                function render() {


                    var $line = $.jqElem('div').css({width : '500px', height : '500px'}).kbaseLinechart(

                        {
                            scaleAxes       : true,

                            xLabel      : 'Some useful experiment',
                            yLabel      : 'Meaningful data',

                            dataset : [
                                {
                                    color : 'green',
                                    label : 'Data set 1',
                                    values : [{x : 0, y : -1}, {x : 1, y : -0.5}, {x : 2, y : 0}, {x : 3, y : 0.5}, {x : 4, y : 1}],
                                },
                                {
                                    color : 'blue',
                                    label : 'Data set 2',
                                    values : [{x : 0, y : 0.0001}, {x : 1, y : 100}, {x : 2, y : 0.0001}, {x : 3, y : 500}, {x : 4, y : .0001}],
                                },
                                {
                                    color : 'gray',
                                    label : 'mean line',
                                    dasharray : 5,
                                    values : [{x : 0, y : -0.3333}, {x : 1, y : 33.5}, {x : 2, y : 0.6667}, {x : 3, y : 167.833}, {x : 4, y : 1.6667}],
                                },
                            ],

                        }

                    );

                    return {
                        title: 'Sample line chart',
                        content: $line.$elem,
                    }

                }

                function attach(node) {
                    return q.Promise(function (resolve) {
                        mount = node;
                        container = document.createElement('div');
                        mount.appendChild(container);
                        var rendered = render();

                        R.send('app', 'title', rendered.title);
                        $(container).append(rendered.content);

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
