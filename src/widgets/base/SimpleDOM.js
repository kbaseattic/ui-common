define([
    'kb.widget.base.simple'
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