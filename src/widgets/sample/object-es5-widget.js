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
/* DOC: sample pure object widget
 * Another approach to widget creation is to use ES5-based objects which utilize
 * prototypal inheritance. 
 * 
 * The advantage of these widgets is that they can exploit abstraction through 
 * a standard language feature. 
 * 
 * The disadvantage is that it may not be familiar to more casual javascript developers.
 * This particular widget is an "old style" object widget. It is created in the style
 * of other widgets which were created prior to the widget lifecycle interface.
 * 
 * See the widget "src/widgets/sample/object-widget-interface.js" for an es5-object
 * based widget which implements the widget lifecycle interface by itself.
 * 
 */
define([
    'q',    
    'kb.runtime'
],
    function (Q, R) {
        "use strict";
        var widget = Object.create({}, {
           
             init: {
                value: function (cfg) {
                    // Keep the container reference as an instance property.
                    this.container = cfg.container;
                    return this;
                }
            },
            
            go: {
                value: function () {
                    this.container.html('Greetings, I am a pure object widget.');
                    return this;
                }
            }, 
            
            stop: {
                value: function () {
                    // nothing to stop here...
                    return this;
                }
            }


        });
        return widget;
    });