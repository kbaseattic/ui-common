/*global
    define
*/
/*jslint
    white: true
    browser: true
 */
define(['jquery', 'q'], function ($, q) {
    'use strict';
    function getJSON(path, file) {
        return q($.get('/data/' + path + '/' + file + '.json'));
    }
   
    return {
        getJSON: getJSON
    };
});