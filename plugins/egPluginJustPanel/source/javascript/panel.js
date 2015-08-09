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
    'underscore'],
    function (html, R, q, _) {
        'use strict';


        function widget(config) {
            var mount, container;

            function init() {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }

            function render() {
                var h1 = html.tag('h1'),
                    div = html.tag('div');
                var content = div([
                    h1('Testing at KBase'),
                    div({class: 'row'}, [
                        div({class: 'col-md-6'}, [
                            'You can use this page to test widgets. Nothing special, just edit it to suit your needs.'
                        ])
                    ])
                ]);
                return {
                    title: 'Widget Testing Panel',
                    content: content
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
