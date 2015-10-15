/**
 * An example of a test suite. This one uses the kbaseConfig.js module (aka 'kb.config').
 * 
 * A suite is composed of multiple test specs.
 *
 * Here, we use RequireJS to load the module we're testing, and any accessory modules, as
 * needed.
 */ 
'use strict';
define(['kb.config'], function(Config) {

    describe('The kbase config object', function() {

        /**
         * A few beginning variables.
         * Since these are all within the suite's scope, they're all
         * available to each spec.
         */
        var wsUrlConfig = 'services.workspace.url';
        var wsUrlRegex = /^http[s]?:\/\/.*kbase\.us\/services\/ws[\/]?$/;
        var newWsUrl = 'temporaryNewUrl';
        var nonExistentItem = 'nonExistentItem';
        var defaultUrl = 'defaultUrl';

        /**
         * The Config class should exist.
         */
        it('should get a config', function() {
            expect(Config).toBeDefined();
        });

        /**
         * This runs the first config function - getItem().
         * We expect that it should match the url regex.
         * (a regex was used in case this is built against CI or
         * some other host)
         */
        it('should fetch the workspace url with getItem', function() {
            var url = Config.getItem(wsUrlConfig).toLowerCase();
            expect(url).toMatch(wsUrlRegex);
        });

        /**
         * Notice the 'not' in there - that means we expect something false
         * instead of something true.
         */
        it('should fail to fetch something that doesn\'t exist', function() {
            expect(Config.getItem(nonExistentItem)).not.toBeDefined();
        });

        /**
         * Run getItem with a different signature. This makes sure that we go down
         * both branches.
         */
        it('should return a default for something that doesn\'t exist', function() {
            var defaultReturn = Config.getItem(nonExistentItem, defaultUrl);
            expect(defaultReturn).toBe(defaultUrl);
        });

        /**
         * Since we're dealing with a singleton object that gets loaded via Require,
         * this spec changes back the value to the default at the end.
         * You can also use the beforeAll() or afterAll() Jasmine functions to reset
         * things (which is cleaner and more in line with the framework), but for
         * such a small suite, this is easier and just as clear.
         */
        it('should set a new workspace url with setItem', function() {
            var curUrl = Config.getItem(wsUrlConfig);
            Config.setItem(wsUrlConfig, newWsUrl);
            expect(Config.getItem(wsUrlConfig)).toBe(newWsUrl);
            // put it back - easier this way with singletons
            Config.setItem(wsUrlConfig, curUrl);
        });

        /**
         * 'Truthy' and 'Falsy' are JavaScript shorthands.
         * 'Truthy' means that a variable is defined, its value is true, it has a 
         * non-empty string, or has a nonzero numerical value. It also is not
         * null or undefined.
         * 'Falsy' is the oppposite.
         */
        it('should be truthy when checking for an existing url', function() {
            expect(Config.hasItem(wsUrlConfig)).toBeTruthy();
        });

        it('should be falsy when checking for a non-existing url', function() {
            expect(Config.hasItem(nonExistentItem)).toBeFalsy();
        });
    });

});
