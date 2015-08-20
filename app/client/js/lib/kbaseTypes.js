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
            var icon = types.getItem(['types', arg.module, arg.type, 'icon']) || getDefault('icon'),
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
                return '<span class="' + classes.join(' ') + '"></span>';
            }
        }
        function getDefault(prop) {
            return types.getItem(['defaults', prop]);
        }
        
        return {
            getIcon: getIcon,
            getDefault: getDefault
        };
    });