/*global
 define
 */
/*jslint
 white: true
 browser: true
 */
define([
    'underscore',
    'kb.props',
    'yaml!data/types/data_types.yml'
],
    function (_, props, typeDefs) {
        'use strict';
        
        var types = props.make({
            data: typeDefs
        });

        function getIcon(arg) {
            var icon = types.getItem(['types', arg.type.module, arg.type.name, 'icon']) || getDefault('icon'),
                classes = icon.classes.map(function (x) {return x;});
            switch (icon.type) {
                case 'kbase':
                    classes.push('icon');
                    if (arg.size) {
                        switch (arg.size) {
                            case 'small':
                                classes.push('icon-sm');
                                break;
                            case 'medium':
                                classes.push('icon-md');
                                break;
                            case 'large':
                                classes.push('icon-lg');
                                break;
                        }
                    }
                    break;
                case 'fontAwesome':
                    classes.push('fa');
                    break;
            } 
            if (classes) {
                return {
                    classes: classes,
                    type: icon.type,
                    html: '<span class="' + classes.join(' ') + '"></span>'
                }
            }
        }
        function getViewer(arg) {
            var viewer = types.getItem(['types', arg.type.module, arg.type.name, 'viewer']);
            return viewer;
        }
        function getDefault(prop) {
            return types.getItem(['defaults', prop]);
        }
        function makeTypeId(type) {
            return type.module + '.' + type.name + '-' + type.version.major + '.' + type.version.minor;
        }
        function parseTypeId(typeId) {
            var matched = typeId.match(/^(.+?)\.(.+?)-(.+?)\.(.+)$/);
            if (!matched) {
                throw new Error('Invalid data type ' + typeId);
            }
            if (matched.length !== 5) {
                throw new Error('Invalid data type ' + typeId);
            }

            return {
                module: matched[1],
                name: matched[2],
                version: {
                    major: matched[3],
                    minor: matched[4]
                }
            };
        }
        function makeType() {
            if (arguments.length === 1) {
                // make from an object.
                var spec = arguments[0];
                if (spec.version) {
                    var version = spec.version.split('.');
                    return {
                        module: spec.module,
                        name: spec.name,
                        version: {
                            major: version[0],
                            minor: version[1]
                        }
                    };

                }
            }
        }
        function makeVersion(type) {
            return type.version.major + '.' + type.version.minor;
        }
        
        return {
            getIcon: getIcon,
            getViewer: getViewer,
            getDefault: getDefault,
            makeTypeId: makeTypeId,
            parseTypeId: parseTypeId,
            makeType: makeType,
            makeVersion: makeVersion
        };
    });