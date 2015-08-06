'use strict';
define(['jquery', 'kb.jquery.tabs'], function($) {

    describe('Tests for kbaseTabs', function() {
        var tabList = [{
                    tab : 'T1',
                    content : $('<div>').html('I am a tab'),
                }, {
                    tab : 'T2',
                    content : $('<div>').html('Me too!')
                }];
        var $el;
        var $tabWidget;

        beforeEach(function() {
            $el = $('<div>');
            $tabWidget = $el.kbaseTabs({ tabs: tabList });
        });

        afterEach(function() {
            $el = null;
            $tabWidget = null;
        });

        it('loaded kb.jquery.tabs', function() {
            expect($.kbaseTabs).toBeDefined();
        });

        it('creates a basic tab widget', function() {
            expect($tabWidget.hasTab('T1')).toBeTruthy();
        });

        it('creates a tab widget with a border', function() {
            var $el2 = $('<div>');
            $el2.kbaseTabs({
                border: true,
                borderColor: '#000',
                tabs : tabList
            });
            var $activePane = $el2.find('.tab-pane.active');
            expect($activePane.css('border-left-color')).toBe('rgb(0, 0, 0)');
            // expect($el2.kbaseTabs('hasTab', 'T1')).toBeTruthy();
        });

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
