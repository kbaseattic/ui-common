/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.runtime',
    'kb.panel.databrowser'
],
    function (R, panelFactory) {
        'use strict';
        function setup() {
            R.addRoute({
                path: ['databrowser'],
                panelFactory: panelFactory
            });
            
            R.send('navbar', 'add-menu-item', {
                name: 'databrowser', 
                definition: {
                    path: 'databrowser', 
                    label: 'Data Browser', 
                    icon: 'database'
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