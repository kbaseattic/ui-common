define([
    'underscore'
],
    function (_) {
        'use strict';

        var factory = function () {
            var obj = {};

            function getItem(props, defaultValue) {
                if (typeof props === 'string') {
                    props = props.split('.');
                } else if (!_.isArray(props)) {
                    throw new TypeError('Invalid type for key: ' + (typeof props));
                }
                var i;
                for (i = 0; i < props.length; i += 1) {
                    if ((obj === undefined) ||
                            (typeof obj !== 'object') ||
                            (obj === null)) {
                        return defaultValue;
                    }
                    obj = obj[props[i]];
                }
                if (obj === undefined) {
                    return defaultValue;
                }
                return obj;
            }

            function hasItem(propPath) {
                if (typeof propPath === 'string') {
                    propPath = propPath.split('.');
                }
                var i;
                for (i = 0; i < propPath.length; i += 1) {
                    if ((obj === undefined) ||
                            (typeof obj !== 'object') ||
                            (obj === null)) {
                        return false;
                    }
                    obj = obj[propPath[i]];
                }
                if (obj === undefined) {
                    return false;
                }
                return true;
            }

            function setItem(path, value) {
                if (typeof path === 'string') {
                    path = path.split('.');
                }
                if (path.length === 0) {
                    return;
                }
                // pop off the last property for setting at the end.
                var propKey = path.pop(),
                    key;
                // Walk the path, creating empty objects if need be.
                while (path.length > 0) {
                    key = path.shift();
                    if (obj[key] === undefined) {
                        obj[key] = {};
                    }
                    obj = obj[key];
                }
                // Finally set the property.
                obj[propKey] = value;
                return value;
            }

            function incrItem(path, increment) {
                if (typeof path === 'string') {
                    path = path.split('.');
                }
                if (path.length === 0) {
                    return;
                }
                increment = (increment === undefined) ? 1 : increment;
                var propKey = path.pop(),
                    key;
                while (path.length > 0) {
                    key = path.shift();
                    if (obj[key] === undefined) {
                        obj[key] = {};
                    }
                    obj = obj[key];
                }
                if (obj[propKey] === undefined) {
                    obj[propKey] = increment;
                } else {
                    if (_.isNumber(obj[propKey])) {
                        obj[propKey] += increment;
                    } else {
                        throw new Error('Can only increment a number');
                    }
                }
                return obj[propKey];
            }

            function deleteItem(path) {
                if (typeof path === 'string') {
                    path = path.split('.');
                }
                if (path.length === 0) {
                    return;
                }
                var propKey = path.pop(),
                    key;
                while (path.length > 0) {
                    key = path.shift();
                    if (obj[key] === undefined) {
                        return false;
                    }
                    obj = obj[key];
                }
                delete obj[propKey];
                return true;
            }

            return {
                setItem: setItem,
                hasItem: hasItem,
                getItem: getItem,
                incrItem: incrItem,
                deleteItem: deleteItem,
                debug: function () {
                    return obj;
                }
            };
        };

        return {
            create: function () {
                return factory();
            }
        };
    });