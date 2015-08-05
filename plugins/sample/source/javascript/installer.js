/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.runtime',
    'kb.panel.sample'
],
    function (R, samplePanelFactory) {
        'use strict';
        function setup() {
            R.addRoute({
                path: ['sample'],
                panelFactory: samplePanelFactory
            });
            
            R.send('navbar', 'add-menu-item', {
                name: 'sample', 
                definition: {
                    path: 'sample', 
                    label: 'Sample Panel', 
                    icon: 'bicycle'
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