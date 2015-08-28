/*global
    define
*/
/*jslint
    white: true
    browser: true
 */
define(['jquery', 'bluebird'], function ($, Promise) {
    'use strict';
    function getNarrativeHistogram() {
        return new Promise.resolve($.get('/data/metrics/narrative_histogram.json'));
    }
    
    function getNarrativeSharingHistogram() {
        return new Promise.resolve($.get('/data/metrics/narrative_sharing_histogram.json'));
    }
   
    return {
        get_narrative_histogram: getNarrativeHistogram,
        get_narrative_sharing_histogram: getNarrativeSharingHistogram
    };
});