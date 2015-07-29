/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'q',
    'kb.runtime'
], function ($, q, R) {
    'use strict';

    function panelFactory(config) {
        
        // We get a factory for making panels using the given renderer...
        var renderer = config.renderer;
        
        function widget() {
            var mount, container;

            var children = [];

            // API
            function attach(node) {
                return q.Promise(function (resolve, reject) {
                    mount = node;
                    container = document.createElement('div');
                    mount.appendChild(container);
                    renderer()
                        .then(function (rendered) {
                            container.innerHTML = rendered.content;
                            R.send('app', 'title', rendered.title);
                            // create widgets.
                            children = rendered.widgets;
                            q.all(children.map(function (w) {
                                return w.widget.init(w.config);
                            }))
                                .then(function () {
                                    q.all(children.map(function (w) {
                                        return w.widget.attach($('#' + w.id).get(0));
                                    }))
                                        .then(function (results) {
                                            resolve();
                                        })
                                        .catch(function (err) {
                                            console.log('ERROR attaching');
                                            console.log(err);
                                        })
                                        .done();
                                })
                                .catch(function (err) {
                                    console.log('ERROR creating');
                                    console.log(err);
                                })
                                .done();
                        })
                        .catch(function (err) {
                            console.log('ERROR rendering console');
                            console.log(err);
                            reject(err);
                        })
                        .done();
                });
            }

            function start(params) {
                return q.Promise(function (resolve, reject) {
                    // for now these are fire and forget.
                    // this has implications for lifecycle --
                    // for instance, if stop is called immediately after start
                    // can it really stop the widgets? they may be in the middle
                    // of loading dependencies or fetching data!
                    // Better for lifecycle control might be a to have the 
                    // widgets return attachment promises, as we now do for
                    // panels...
                    // 
                    // NB: the widget connector, for now, needs the params
                    // for attachment.
                    q.all(children.map(function (wc) {
                        return wc.widget.start(params);
                    }))
                        .then(function (results) {
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();
                });
            }
            function stop() {
                return q.Promise(function (resolve, reject) {
                    q.all(children.map(function (wc) {
                        return wc.widget.stop();
                    }))
                        .then(function (results) {
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();
                });
            }
            function detach() {
                return q.Promise(function (resolve, reject) {
                    q.all(children.map(function (wc) {
                        return wc.widget.detach();
                    }))
                        .then(function (results) {
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                        .done();
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
            create: function () {
                return widget();
            }
        };
    }
    
    return panelFactory;
});