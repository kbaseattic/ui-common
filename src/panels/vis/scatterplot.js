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
    'kb.widget.vis.scatterplot'],
    function (html, R, q, _) {
        'use strict';

        function scatterplotWidget() {

            function widget(config) {

                var mount, container;


                function render() {

                    var dataset = [];

                    var points = 200;

                    var randomColor = function() {
                        var colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow', 'orange', 'black'];
                        return colors[Math.floor(Math.random() * colors.length)];
                    }

                    var randomShape = function() {
                    //return 'circle';
                        var shapes = ['circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'square', 'triangle-up', 'triangle-down', 'diamond', 'cross'];
                        return shapes[Math.floor(Math.random() * shapes.length)];
                    }

                    for (var idx = 0; idx < points; idx++) {
                        dataset.push(
                            {
                                x : Math.random() * 500,
                                y : Math.random() * 500,
                                weight : Math.random() * 225,
                                color : randomColor(),
                                label : 'Data point ' + idx,
                                shape : randomShape(),
                            }
                        );
                    }

                    var $scatter = $.jqElem('div').css({width : '800px', height : '500px'}).kbaseScatterplot(
                        {
                            scaleAxes   : true,

                            //xLabel      : 'Some useful experiment',
                            //yLabel      : 'Meaningful data',

                            dataset : dataset,

                        }
                    );

                    return {
                        title: 'Sample scatter plot',
                        content: $scatter.$elem,
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
                path: ['scatterplot'],
                widget: scatterplotWidget()
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
