'use strict';
define(['jquery', 'kb.jquery.widget'], function($) {

    describe('make a widget', function() {
        it('loaded kb.jquery.widget', function() {
            expect($.KBWidget).toBeDefined();
        });

        it('made a new widget', function() {
            // var $el = $('<div>text</div>');
            // $el.kbaseTabs({name: 'NewWidget'});
            // expect($el).toBeTruthy();
            var $newWidget = $.KBWidget({name: 'NewWidget'});
            expect($newWidget).toBeDefined();
        });
    });

});
