/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.runtime',
    'kb.panel.about'
],
    function (R, panelFactory) {
        'use strict';
        function setup() {
            R.addRoute({
                path: ['about'],
                panelFactory: panelFactory
            });
            
            R.send('navbar', 'add-menu-item', {
                name: 'about', 
                definition: {
                    path: 'about', 
                    label: 'About the Functional Site', 
                    icon: 'info-circle'
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