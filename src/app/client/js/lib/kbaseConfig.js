define(['kb.utils', 'yaml!DEV/config/client.yml'],
    function (Utils, config) {
        'use strict';
        var Config = Object.create({}, {
            config: {
                value: null,
                writable: true
            },
            init: {
                value: function (cfg) {
                    this.config = config;
                    return this;
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
