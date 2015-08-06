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


                    var $bar = $.jqElem('div').css({width : '500px', height : '500px'}).kbaseBarchart(

                        {
                            scaleAxes   : true,

                            xLabel      : 'Some useful experiment',
                            yLabel      : 'Meaningful data',

                            dataset : [
                                {
                                    bar : 'Bar 1',
                                    value : 20,
                                    color : 'red',
                                },
                                {
                                    bar : 'Bar 2',
                                    value : 50,
                                    color : 'green'
                                },
                                {
                                    bar : 'Bar 3',
                                    value : 10,
                                    color : 'blue',
                                    label : 'Some meaningful mouseover value'
                                },

                                {
                                    bar : 'Bar 4',
                                    value : [10,20,30,40,50],
                                    color : 'purple',
                                },
                                {
                                    bar : 'Bar 5',
                                    value : [10,20,30,40,50],
                                    color : ['red', 'green', 'blue', 'cyan', 'magenta'],
                                    label : ['6.67% effort', '13.34% talent', '20% failure', '26.67% determination', '33.33% mustard'],
                                    stacked : true,
                                },

                            ],

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
