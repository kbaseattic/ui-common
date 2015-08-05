/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.runtime',
    'kb.panel.eg_plugin'
],
    function (R, panelFactory) {
        'use strict';
        function setup() {
            
            R.addRoute({
                path: ['eg_plugin'],
                panelFactory: panelFactory
            });
            
            R.send('navbar', 'add-menu-item', {
                name: 'eg_plugin', 
                definition: {
                    path: 'eg_plugin', 
                    label: 'Example Plugin Panel', 
                    icon: 'bolt'
                }
            });

        }
        function teardown() {
            // TODO: remove routes
            return false;
        }
        
        return {
            setup: setup,
            teardown: teardown
        };
    });