/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.runtime',
    'bluebird',
    'kb_widget_vis_lineChart'],
    function (R, Promise) {
        'use strict';
        function widget(config) {
            var mount, container;
            function render() {

                var sin = [];
                var sin2 = [];
                for (var i = 20; i < 200; i++) {
                    sin.push(
                        {
                            x: i,
                            y: 100 + 50 * Math.sin(0.1 * i),
                            y2: 50 + 50 * Math.sin(0.1 * i)
                        }
                    );
                    sin2.push(75 + 50 * Math.sin(0.1 * i));
                }

                var $line = $.jqElem('div').css({width: '800px', height: '500px'}).kbaseLinechart(
                    {
                        scaleAxes: true,
                        //debug       : true,

                        xLabel: 'Expression profile',
                        //yLabel      : 'Meaningful data',
                        hGrid: true,
                        xLabels: false,
                        dataset: [
                            {
                                strokeColor: 'red',
                                fillColor: 'red',
                                values: [
                                    {x: 10, y: 10, y2: -10},
                                    {x: 20, y: 15, y2: -20},
                                    {x: 30, y: 16, y2: -5},
                                    {x: 40, y: 18, y2: -2},
                                    {x: 50, y: 15, y2: 5},
                                    {x: 60, y: 20, y2: 8},
                                    {x: 70, y: 22, y2: 3},
                                    {x: 80, y: 25, y2: 4},
                                    {x: 90, y: 18, y2: -5},
                                    {x: 100, y: 15, y2: -10},
                                    {x: 110, y: 10, y2: -12},
                                    {x: 120, y: 5, y2: -20},
                                    {x: 130, y: 8, y2: -30},
                                    {x: 140, y: 10, y2: -100},
                                    {x: 150, y: 4, y2: -10}
                                ],
                                label: 'area',
                                width: 0,
                                fillOpacity: 0.3
                            },
                            {
                                strokeColor: 'red',
                                label: 'parabolic',
                                values: [0, 1, 4, 9, 16, 25, {x: 60, y: 36}, 49, 64, 81, 100, 121, 144, 169],
                                width: 1,
                                shape: 'circle',
                                shapeArea: 64,
                                fillColor: 'red'
                            },
                            {
                                strokeColor: 'orange',
                                label: 'jagged',
                                values: [{x: 0, y: 180}, {x: 10, y: 160}, {x: 20, y: 140}, {x: 30, y: 120}, {x: 40, y: 100}, {x: 50, y: 80},
                                    {x: 60, y: 60}, {x: 70, y: 40}, {x: 80, y: 20}, {x: 90, y: 0}, {x: 100, y: 20}, {x: 110, y: 40},
                                    {x: 120, y: 60}, {x: 130, y: 80}, {x: 140, y: 100}],
                                width: 2,
                                shape: 'square',
                                shapeArea: 64
                                    //fillColor : 'red',
                            },
                            {
                                strokeColor: 'blue',
                                label: 'sin',
                                values: sin,
                                width: 1,
                                fillColor: 'blue',
                                strokeOpacity: 0.3,
                                fillOpacity: 0.3
                            }
                            /*{
                             strokeColor : 'black',
                             label : 'sin',
                             values : sin2,
                             width : 1,
                             },*/
                        ]

                    }

                );

                return {
                    title: 'Sample line chart',
                    content: $line.$elem
                };

            }
            function init(confi) {
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function attach(node) {
                return new Promise(function (resolve) {
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
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function stop() {
                return new Promise(function (resolve) {
                    resolve();
                });
            }
            function detach() {
                return new Promise(function (resolve) {
                    resolve();
                });
            }

            return {
                init: init,
                attach: attach,
                start: start,
                stop: stop,
                detach: detach
            };
        }


        return {
            make: function (config) {
                return widget(config);
            }
        };

    });
