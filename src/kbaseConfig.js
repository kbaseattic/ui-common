define(['kb.utils', 'json!functional-site/config.json'],
    function (Utils, config) {
        'use strict';
        var Config = Object.create({}, {
            config: {
                value: null,
                writable: true
            },
            init: {
                value: function (cfg) {
                    this.config = config[config.current_config];
                    return this;
                }
            },
            // CONFIG
            getConfig: {
                value: function (key, defaultValue) {
                    return Utils.getProp(this.config, key, defaultValue);
                }
            },
            setConfig: {
                value: function (key, value) {
                    Utils.setProp(this.config, key, value);
                }
            },
            hasConfig: {
                value: function (key) {
                    if (Utils.getProp(this.config, key) !== undefined) {
                        return true;
                    }
                    return false;
                }
            },
            // CONFIG
            getItem: {
                value: function (key, defaultValue) {
                    return Utils.getProp(this.config, key, defaultValue);
                }
            },
            setItem: {
                value: function (key, value) {
                    Utils.setProp(this.config, key, value);
                }
            },
            hasItem: {
                value: function (key) {
                    if (Utils.getProp(this.config, key) !== undefined) {
                        return true;
                    }
                    return false;
                }
            }
        });
        return Config.init();
    });
