/*global
    define
*/
/*jslint
    white: true
    browser: true
 */
define(['jquery', 'q'], function ($, q) {
    'use strict';
    function getNarrativeHistogram() {
        return q($.get('/data/metrics/narrative_histogram.json'));
    }
    
    function getNarrativeSharingHistogram() {
        return q($.get('/data/metrics/narrative_sharing_histogram.json'));
    }
   
    return {
        get_narrative_histogram: getNarrativeHistogram,
        get_narrative_sharing_histogram: getNarrativeSharingHistogram
    };
});