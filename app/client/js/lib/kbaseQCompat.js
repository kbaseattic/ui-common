/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'bluebird'
], function (Promise) {
    'use strict';
    return function (p) {
        return new Promise.resolve(p);
    };
});