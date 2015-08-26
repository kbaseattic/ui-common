/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
/**
 * A very simply widget factory.
 */
define(['q'], function (q) {
    'use strict';
    
    var widget = function () {
        var mount, container;
        
        function attach(node) {
            return q.Promise(function (resolve) {
                mount = node;
                container = document.createElement('div');
                mount.appendChild(container);
                resolve();
            });
        }
        
        function start() {
            return q.Promise(function (resolve) {
                container.innerHTML = 'Hi, I am a widget';
                resolve();
            });
        }
        
        return {
            attach: attach,
            start: start
        };
    };
    
    return {
        make: function () {
            return widget();
        }
    };
});
