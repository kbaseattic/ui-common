'use strict';
define(['kb.config'], function(Config) {

    var wsUrlConfig = 'services.workspace.url';
    var wsUrlRegex = /^http[s]?:\/\/.*kbase\.us\/services\/ws\/$/;
    var newWsUrl = 'temporaryNewUrl';
    var nonExistentItem = 'nonExistentItem';
    var defaultUrl = 'defaultUrl';

    describe('The kbase config object', function() {
        it('should get a config', function() {
            expect(Config).toBeDefined();
        });

        it('should fetch the workspace url with getItem', function() {
            var url = Config.getItem(wsUrlConfig).toLowerCase();
            expect(url).toMatch(wsUrlRegex);
        });

        it('should fail to fetch something that doesn\'t exist', function() {
            expect(Config.getItem(nonExistentItem)).not.toBeDefined();
        });

        it('should return a default for something that doesn\'t exist', function() {
            var defaultReturn = Config.getItem(nonExistentItem, defaultUrl);
            expect(defaultReturn).toBe(defaultUrl);
        });

        it('should set a new workspace url with setItem', function() {
            var curUrl = Config.getItem(wsUrlConfig);
            Config.setItem(wsUrlConfig, newWsUrl);
            expect(Config.getItem(wsUrlConfig)).toBe(newWsUrl);
            // put it back - easier this way with singletons
            Config.setItem(wsUrlConfig, curUrl);
        });

        it('should be truthy when checking for an existing url', function() {
            expect(Config.hasItem(wsUrlConfig)).toBeTruthy();
        });

        it('should be falsy when checking for a non-existing url', function() {
            expect(Config.hasItem(nonExistentItem)).toBeFalsy();
        });
    });

});
