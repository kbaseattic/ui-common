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
    'kb.runtime',
    'kb.html'
], function ($, q, R, html) {
    'use strict';
    
        function widgetConnector() {
            var widget, mount, container, $container, config;

            function init(cfg) {
                return q.Promise(function (resolve) {
                    config = cfg;                    
                    require([config.module], function () {
                        // these are jquery widgets, so they are just added to the
                        // jquery namespace.
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
                    // not the best .. perhaps merge the params into the config
                    // better yet, rewrite the widgets in the new model...
                    var jqueryWidget = $(container)[config.jqueryobject];
                    if (!jqueryWidget) {
                        $(container).html(html.panel('Not Found', 'Sorry, cannot find widget ' + widget));
                    } else {                    
                        $(container)[config.jqueryobject]({
                            wsNameOrId: params.workspaceId,
                            objNameOrId: params.objectId,
                            ws_url: R.getConfig('workspace_url'),
                            token: R.getAuthToken()
                        });
                    }
                    resolve();
                });
            }
            function stop() {
                return q.Promise(function (resolve) {
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
                init: init,
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