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
    'kb.widget.vis.barchart'],
    function (html, R, q, _) {
        'use strict';

        function barchartWidget() {

            function widget(config) {

                var mount, container;


                function render() {

                    var bars = [];

                    for (var i = 0; i < 20; i++) {
                        bars.push(
                            {
                                bar   : i,
                                color : ['#00BBBB', '#0000FF','#00BBBB', '#0000FF'],
                                value : [Math.random() * 10, Math.random() * 20,Math.random() * 10, Math.random() * 30]
                            }
                        );
                    }
                    console.log(bars);

                    var $bar = $.jqElem('div').css({width : '800px', height : '500px'}).kbaseBarchart(

                        {
                            scaleAxes   : true,

                            xLabel      : 'Survey Data',
                            //yLabel      : 'Meaningful data',
                            hGrid       : true,

                            dataset : bars,

                        }

                    );

                    return {
                        title: 'Sample bar chart',
                        content: $bar.$elem,
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
                path: ['barchart'],
                widget: barchartWidget()
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
