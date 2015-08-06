'use strict';
define(['jquery', 'kb.jquery.widget'], function($, widget) {

    describe('make a widget', function() {
        it('got a widget', function() {
            var $el = $('<div>text</div>');
            // $el.KBWidget({name: 'NewWidget'});
            expect($el).toBeTruthy();
        });
        // it('makes a widget function', function() {
        //     $.KBWidget.should.be.a.function;
        // });
    });

});
