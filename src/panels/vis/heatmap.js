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
    'kb.widget.vis.heatmap'],
    function (html, R, q, _) {
        'use strict';

        function heatmapWidget() {

            function widget(config) {

                var mount, container;


                function render() {

                    var heatmap =
                        {
                            row_ids : [],
                            row_labels : [],
                            column_ids : [],
                            column_labels : [],
                            data : [],
                        };
                    var numCells = 20;
                    var colors = ['red', 'green', 'blue', 'purple', 'cyan'];
                    for (var idx = 0; idx < numCells; idx++) {
                        var row = [];
                        heatmap.data.push(row);
                        for (var jdx = 0; jdx < numCells; jdx++) {
                            row.push(Math.random() * 2 - 1);
                        }
                        heatmap.row_ids.push('Wingding' + idx);
                        heatmap.row_labels.push('Wingding' + idx);
                        heatmap.column_ids.push('Frobnoz' + idx);
                        heatmap.column_labels.push('Frobnoz' + idx);
                    }

                    var $hm = $.jqElem('div').css({width : '1000px', height : '500px'}).kbaseHeatmap(
                        {
                            dataset : heatmap,
                            colors : ['#0000AA', '#FFFFFF', '#AA0000'],
                            //ulIcon : '/functional-site/assets/navbar/images/kbase_logo.png',
                        }
                    );

                    return {
                        title: 'Sample Heat map',
                        content: $hm.$elem,
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
                path: ['heatmap'],
                widget: heatmapWidget()
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
