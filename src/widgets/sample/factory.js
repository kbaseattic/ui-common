/*
 * HEADER
 * 
 */
/*
 * JS LINT CONFIG
 * 
 */
/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
/*
 * Sample Factory Pattern Widget
 * 
 * Follows a factory pattern for generation of widgets.
 * The module returns factory-maker - a function which returns a factory for making 
 * widgets.
 * The factory has a single method - create.
 * The widget it produces has the following methods:
 * init
 * attach
 * start
 * stop
 * detach
 */
define([
    'jquery',
    'q'
],
    function ($, q) {
        'use strict';
        
        var factory = function () {
            var mount;
            
            function init(config) {
                return q.Promise(function (resolve) {
                    resolve();
                });
            }
            function attach(node) {
                return q.Promise(function (resolve) {
                    mount = node;
                    resolve();
                });
            }
            function start(params) {
                return q.Promise(function (resolve) {
                    mount.innerHTML = 'Hi, I am a very simple minded widget.';
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
        };
        
        return {
            create: function () {
                return factory();
            }
        };
        
    }
);