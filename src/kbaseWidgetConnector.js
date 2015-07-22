/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'q'
], function ($, q) {
    'use strict';
    
        function widgetConnector() {
            var widget, mount, container, $container, config;

            function create(cfg) {
                return q.Promise(function (resolve) {
                    config = cfg;                    
                    require([config.module], function (Widget) {
                        widget = Object.create(Widget);
                        resolve();
                    });
                });
            }
            function attach(node) {
                return q.Promise(function (resolve) {
                    mount = node;
                    container = document.createElement('div');
                    $container = $(container);
                    mount.appendChild(container);
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
                    var widgetConfig = config.config || {};
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
                    resolve();
                });
            }
            function destroy() {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }

            return {
                create: create,
                attach: attach,
                start: start,
                stop: stop,
                detach: detach,
                destroy: destroy
            };
        }
        
        return {
            create: function () {
                return widgetConnector();
            }
        };
    });