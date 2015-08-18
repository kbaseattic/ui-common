/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'underscore',
    'q',
    'kb.runtime',
    'kb.html'
], function ($, _, q, R, html) {
    'use strict';
    
        function adapter(config) {
            var mount, container, $container;
            
            var module = config.module;
            var jqueryObject = config.jquery_object;

            function init() {
                return q.Promise(function (resolve) {
                    require([module], function () {
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
                    var jqueryWidget = $(container)[jqueryObject];
                    var widgetConfig = _.extendOwn({}, params, {
                        // Why this?
                        wsNameOrId: params.workspaceId,
                        objNameOrId: params.objectId,
                        // commonly used, but really should remove this.
                        /* TODO: remove default params like this */
                        ws_url: R.getConfig('services.workspace.url'),
                        token: R.getAuthToken()
                    });
                    if (!jqueryWidget) {
                        $(container).html(html.panel('Not Found', 'Sorry, cannot find widget ' + jqueryObject));
                    } else {                    
                        $(container)[jqueryObject](widgetConfig);
                    }
                    resolve();
                });
            }
            function run(params) {
                return q.Promise(function (resolve) {
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
                run: run,
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