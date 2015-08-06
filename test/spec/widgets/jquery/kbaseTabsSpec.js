'use strict';
define(['jquery', 'kb.jquery.tabs'], function($) {

    describe('Tests for kbaseTabs', function() {
        it('loaded kb.jquery.tabs', function() {
            expect($.kbaseTabs).toBeDefined();
        });

        it('creates a tab widget', function() {
            var $el = $('<div></div>');
            $el.kbaseTabs({
                tabs : [{
                    tab : 'T1',                                     //name of the tab
                    content : $('<div></div>').html("I am a tab"),  //jquery object to stuff into the content
                }]
            });
        });

    });

});
