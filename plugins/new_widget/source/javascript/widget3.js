/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
/**
 * A slightly fancier widget factory
 * This widget adds the config and params arguments, 
 * and the html module.
 */
define([
    'q',
    'kb.html'
],
    function (q, html) {
        'use strict';

        var widget = function (config) {
            var mount, container,
                div = html.tag('div'),
                p = html.tag('p'),
                br = html.tag('br'),
                h3 = html.tag('h3');

            function dumpObject(obj) {
                if (obj) {
                    var cols = ['Key', 'Value'],
                        rows = Object.keys(obj).map(function (key) {
                        return [key, obj[key]];
                    });
                    return html.makeTable({
                        columns: cols,
                        rows: rows,
                        classes: ['table', 'table-striped']
                    });
                }
                return 'nothing';
            }

            // API

            function attach(node) {
                return q.Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    resolve();
                });
            }

            function start(params) {
                return q.Promise(function (resolve) {
                    var improvements = [
                        'using the html module to compose html functionally',
                        'using html functions to generate complex html pieces',
                        'wrapping the widget in a panel'
                    ];
                    container.innerHTML = html.makePanel({
                        title: 'My Panel',
                        content: div(
                            [
                                p('Hi, I am even fancier!'),
                                p(['My improvements include:',
                                    html.makeList({items: improvements})
                                ]),
                                h3('Params'),
                                p(['My params are: ', br(), dumpObject(params)]),
                                h3('Config'),
                                p(['And config is: ', br(), dumpObject(config)])
                            ])
                    });
                    resolve();
                });
            }

            return {
                attach: attach,
                start: start
            };
        };

        return {
            make: function (config) {
                return widget(config);
            }
        };
    });
