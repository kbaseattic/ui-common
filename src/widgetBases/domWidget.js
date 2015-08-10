define([
    'kb_widgetBases_simpleWidget'
],
    function (Simple) {
        'use strict';
        return Object.create(Simple, {
            setHTML: {
                value: function (html) {
                    if (this.container) {
                        this.container.innerHTML = html;
                    }
                }
            }
        });
    });