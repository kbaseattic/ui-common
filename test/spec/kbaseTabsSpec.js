'use strict';
define(['jquery', 'kb.jquery.tabs'], function($) {

    describe('Tests for kbaseTabs', function() {
        // Boring test input for the kbaseTabs widget.
        var tabList = [{
                    tab : 'T1',
                    content : $('<div>').html('I am a tab'),
                }, {
                    tab : 'T2',
                    content : $('<div>').html('Me too!')
                }];
        var $el;
        var $tabWidget;

        /* At the start of each test, make a new tab widget.
         * We're going to be pretty destructive to these, so
         * make a new one every time.
         */
        beforeEach(function() {
            $el = $('<div>');
            $tabWidget = $el.kbaseTabs({ tabs: tabList });
        });

        /* After each spec, make sure that we unload any changes
         * to the element and widget variables.
         */
        afterEach(function() {
            $el = null;
            $tabWidget = null;
        });

        /* Check that the widget loaded. Probably superfluous, 
         * but nice to make sure that it gets plugged into jquery.
         */
        it('loaded kb.jquery.tabs', function() {
            expect($.kbaseTabs).toBeDefined();
        });

        /* Check that our tab widget was created as expected. */
        it('creates a basic tab widget', function() {
            expect($tabWidget.hasTab('T1')).toBeTruthy();
        });

        /* Make a new widget with some custom options, and make
         * sure that those options take effect. Note that you can
         * just use jquery selectors here to look up what you expect
         * to see.
         */
        it('creates a tab widget with a border', function() {
            var $el2 = $('<div>');
            $el2.kbaseTabs({
                border: true,
                borderColor: '#000',
                tabs : tabList
            });
            var $activePane = $el2.find('.tab-pane.active');
            expect($activePane.css('border-left-color')).toBe('rgb(0, 0, 0)');
        });

        /* Use multiple expect statements to check the state of 
         * the widget before and after a change.
         */
        it('creates a widget with multiple tabs, starts with the first active, and activates the second', function() {
            expect($tabWidget.activeTab()).toBe('T1');
            $tabWidget.showTab('T2');
            expect($tabWidget.activeTab()).toBe('T2');
        });

        it('deletes a tab programmatically and shifts to the other tab', function() {
            $tabWidget.removeTab('T1');
            expect($tabWidget.activeTab()).toBe('T2');
        });

        it('deletes a tab programmatically and shifts to the previous tab', function() {
            $tabWidget.showTab('T2');
            $tabWidget.removeTab('T2');
            expect($tabWidget.activeTab()).toBe('T1');
        });

        /* Simulating a click is just like jquery. This tests that
         * the widget sets up the events properly - we're not really just 
         * testing jquery.
         */
        it('selects a tab by clicking', function() {
            $el.find('[data-tab="T2"]').click();
            expect($el.kbaseTabs('activeTab')).toBe('T2');
        });

        it('make a deletable tab, and delete the first one with a click', function() {
            var $el2 = $('<div>');
            var $tabWidget = $el2.kbaseTabs({
                canDelete: true,
                tabs: tabList
            });
            $el2.find('[data-tab="T1"] > button').click();
            expect($tabWidget.hasTab('T1')).toBeFalsy();
        });

    });

});
