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
    'kb.service.networks',
    'kb.rgbcolor'],
    function (html, R, q, NetworksClient, RGBColor) {
        'use strict';

        function testWidget() {

            function widget(config) {
                var mount, container, $container;

                var networksClient;

                function render() {
                    var h1 = html.tag('h1'),
                        p = html.tag('p'),
                        div = html.tag('div');
                    return div([
                        h1('Teseting at KBase'),
                        p('This is a test panel. It is used for testing things...')
                    ]);
                }
                
                function testRGBColor() {
                    var h1 = html.tag('h1'),
                        p = html.tag('p'),
                        div = html.tag('div');
                    
                    var rgbc = new RGBColor(0,0,0);
                    
                    var testBlocks = [];
                    for (var i = 0; i <= 255; i += 5) {
                        testBlocks.push(div({style: {
                                width: '40px', 
                                height: '40px', 
                                border: '1px silver solid', 
                                'background-color': rgbc.lightenBy(i).asString()
                            }}, String(i)));
                    }
                    rgbc = new RGBColor(255,255,255);
                    for (var i = 0; i <= 255; i += 5) {
                        testBlocks.push(div({style: {
                                width: '40px', 
                                height: '40px', 
                                border: '1px silver solid', 
                                'background-color': rgbc.darkenBy(i).asString()
                            }}, String(i)));
                    }
                    
                    return div([
                        h1('Teseting at KBase'),
                        p('This is a test panel. It is used for testing things...'),
                       testBlocks
                    ]);
                }

                function init(config) {
                    networksClient = new NetworksClient(R.getConfig('networks_url'));
                }

                function attach(node) {
                    return q.Promise(function (resolve, reject) {
networksClient = new NetworksClient(R.getConfig('networks_url'));
                        mount = node;
                        container = document.createElement('div');
                        $container = $(container);
                        mount.appendChild(container);
                        container.innerHTML = testRGBColor();

                        /*q(networksClient.all_datasets())
                            .then(function (data) {
                                console.log('GOT');
                                console.log(data);
                                resolve();
                            })
                            .catch(function (err) {
                                console.log('ERR');
                                console.log(err);
                                reject(err);
                            })
                            .done();
                            */


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
                create: function (config) {
                    return widget(config);
                }
            }
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
