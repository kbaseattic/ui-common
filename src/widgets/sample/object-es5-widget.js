define([
    'q',
    'kb.runtime'
],
    function (Q, UserProfileService, R) {
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
                    this.container.html('Hi, I am a pure object widget');
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