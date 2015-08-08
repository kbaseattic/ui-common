/*
 * 
 */
/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
/* DOC: sample pure object widget with interface
 */
define([
    'kb.dom',
    'kb.widget.base.simple'
],
    function (DOM, SimpleWidget) {
        "use strict";
        return Object.create(SimpleWidget, {
            
           onStart: {
               value: function (params) {
                   DOM.setHTML(this.container, 'Hello, I am a simple widget.');
               }
           }
            
    });
});