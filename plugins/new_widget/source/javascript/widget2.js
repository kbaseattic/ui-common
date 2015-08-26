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
    'q'
], 
    function (q) {
    'use strict';
    
    var widget = function (config) {
        var mount, container;
        
        function dumpObject(obj) {
            if (obj) {
                return Object.keys(obj).map(function (key) {
                    return key + ' = ' + obj[key];
                }).join('<br>');
            } else {
                return 'nothing';
            }
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
                
                container.innerHTML = 'Hi, I am a slightly fancier widget. My params are:<br>' + dumpObject(params) + '.<br>My config is :<br>' + dumpObject(config);
                
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
