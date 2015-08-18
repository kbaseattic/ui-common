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
    'underscore'
], function ($, q, _) {
    'use strict';
    
        function adapter(config) {
            var widget, mount, $container, initConfig;
            
            var module = config.module;

            function init(cfg) {
                        console.log('init'); console.log(cfg);
                return q.Promise(function (resolve) {
                    require([module], function (Widget) {
                        if (!Widget) {
                            throw new Error('Widget module did not load properly (undefined) for ' + config.module);
                        }
                        // NB we save the config, because the internal widget 
                        // unfortunately requires the container in init, and 
                        // that is not available until attach...
                        initConfig = cfg || {};
                        widget = Object.create(Widget);
                        resolve();
                    });
                });
            }
            function attach(node) {
                return q.Promise(function (resolve) {
                    mount = node;
                    $container = $('<div></div>');
                    mount.appendChild($container.get(0));
                    resolve();
                });
            }
            function start(params) {
                return q.Promise(function (resolve) {
                    // The config is supplied by the caller, but we add 
                    // standard properties here.
                    /* TODO: be more generic */
                    // But then again, a widget constructed on this model does
                    // not need a connector!
                    // not the best .. perhaps merge the params into the config
                    // better yet, rewrite the widgets in the new model...
                    var widgetConfig = config.config || params || {};
                    console.log('initConfig:'); console.log(initConfig);
                    _.extend(widgetConfig, initConfig);
                    widgetConfig.container = $container;
                    widgetConfig.userId = params.username;
                    widget.init(widgetConfig);
                    widget.go();
                    
                    resolve();
                });
            }
            function stop() {
                return q.Promise(function (resolve) {
                    widget.stop();
                    resolve();
                });
            }
            function detach() {
                return q.Promise(function (resolve) {
                    mount.removeChild($container.get(0));
                    resolve();
                });
            }
            function destroy() {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }

            return {
                init: init,
                attach: attach,
                start: start,
                stop: stop,
                detach: detach,
                destroy: destroy
            };
        }
        
        return {
            make: function (config) {
                return adapter(config);
            }
        };
    });