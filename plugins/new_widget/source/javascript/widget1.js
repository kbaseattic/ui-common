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
define(['bluebird'], function Promise {
    'use strict';
    
    var widget = function () {
        var mount, container;
        
        function attach(node) {
            return new Promise(function (resolve) {
                mount = node;
                container = document.createElement('div');
                mount.appendChild(container);
                resolve();
            });
        }
        
        function start() {
            return new Promise(function (resolve) {
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
