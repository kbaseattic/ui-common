/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([],
    function () {

        'use strict';

        function Size (width, height) {
            this.width = width;
            this.height = height;
        }

        Size.prototype.asString = function () {
            return "{" + this.width + ", " + this.height + "}";
        };

        return Size;
    }
);
