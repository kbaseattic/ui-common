/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define(['underscore'], function (_) {
    'use strict';
    return (function () {
  
        function jsonToHTML(node) {
            var nodeType = typeof node;
            if (nodeType === 'string') {
                return node;
            }
            if (nodeType === 'boolean') {
                if (node) {
                    return 'true';
                }
                return 'false';
            }
            if (nodeType === 'number') {
                return '' + node;
            }
            var out;
            if (nodeType === 'object' && node.push) {
                out = '';
                node.forEach(function (item) {
                    out += jsonToHTML(item);
                });
                return out;
            }
            if (nodeType === 'object') {
                out = '';
                out += '<' + nodeType.tag;
                if (node.attributes) {
                    node.attributes.keys().forEach(function (key) {
                        out += key + '="' + node.attributes[key] + '"';
                    });
                }
                out += '>';
                if (node.children) {
                    out += jsonToHTML(node.children);
                }
                out += '</' + node.tag + '>';
                return out;
            }
        }

        var tags = {};
        /**
         * Given a simple object of keys and values, create a string which 
         * encodes them into a form suitable for the value of a style attribute.
         * Style attribute values are themselves attributes, but due to the limitation
         * of html attributes, they are embedded in a string:
         * The format is
         * key: value;
         * Note that values are not quoted, and the separator between fields is
         * a semicolon
         * Note that we expect the value to be embedded withing an html attribute
         * which is quoted with double-qoutes; but we don't do any escaping here.
         * @param {type} attribs
         * @returns {String}
         */
        function makeStyleAttribs(attribs) {
            if (attribs) {
                var fields = Object.keys(attribs).map(function (key) {
                    var value = attribs[key];
                    if (typeof value === 'string') {
                        return key + ':' + value;
                    } else {
                        // just ignore invalid attributes for now
                        // TODO: what is the proper thing to do?
                        return '';
                    }
                    return false;
                });
                return fields.filter(function(field) {return field?true:false;}).join(';');
            } else {
                return '';
            }
        }
        
        /**
         * The attributes for knockout's data-bind is slightly different than
         * for style. The syntax is that of a simple javascript object.
         * property: value, property: "value", property: 123
         * So, we simply escape double-quotes on the value, so that unquoted values
         * will remain as raw names/symbols/numbers, and quoted strings will retain
         * the quotes.
         * TODO: it would be smarter to detect if it was a quoted string
         * 
         * @param {type} attribs
         * @returns {String}
         */
        function makeDataBindAttribs(attribs) {
            if (attribs) {
                var fields = Object.keys(attribs).map(function (key) {
                    var value = attribs[key];
                    if (typeof value === 'string') {
                        //var escapedValue = value.replace(/\"/g, '\\"');
                        return key + ':' + value;
                    } else if (typeof value === 'object') {
                        return key + ': {' + makeDataBindAttribs(value) + '}';
                    } else {
                        // just ignore invalid attributes for now
                        // TODO: what is the proper thing to do?
                        return '';
                    }
                    return false;
                });
                return fields.filter(function(field) {return field?true:false;}).join(',');
            } else {
                return '';
            }
        }
        
        /**
         * Given a simple object of keys and values, create a string which 
         * encodes a set of html tag attributes.
         * String values escape the "
         * Boolean values either insert the attribute name or not
         * Object values are interpreted as "embedded attributes" (see above)
         * @param {type} attribs
         * @returns {String}
         */
        function makeTagAttribs(attribs) {
            var quoteChar = '"';
            if (attribs) {
                var fields = Object.keys(attribs).map(function (key) {
                    var value = attribs[key]
                    if (typeof value === 'object') {
                        switch (key) {
                            case 'style':
                                value = makeStyleAttribs(value);
                                break;
                            case 'dataBind':
                                key = 'data-bind';
                            case 'data-bind':
                                // reverse the quote char, since data-bind attributes 
                                // can contain double-quote, which can't itself
                                // be quoted.
                                quoteChar = "'";
                                value = makeDataBindAttribs(value);
                                break;
                        }                        
                    }
                    if (typeof value === 'string') {
                        var escapedValue = value.replace(new RegExp('\\'+quoteChar, 'g'), '\\'+quoteChar);
                        return key + '=' + quoteChar + escapedValue + quoteChar;
                    } else if (typeof value === 'boolean') {                        
                        if (value) {
                            return key;
                        }
                    }
                    return false;
                });
                return fields.filter(function(field) {return field?true:false;}).join(' ');
            } else {
                return '';
            }
        }
        function renderContent(children) {
            if (children) {
                if (_.isString(children)) {
                    return children;
                } else if (_.isArray(children)) {
                    var content = '';
                    children.forEach(function (item) {                        
                        content += renderContent(item);
                    });
                    return content;
                }
            } else {
                return '';
            }
        }
        function tag(tagName, options) {
            options = options || {};
            if (!tags[tagName]) {
                tags[tagName] = function (attribs, children) {
                    var node = '<' + tagName;
                    if (_.isArray(attribs)) {
                        // skip attribs, just go to children.
                        children = attribs;
                    } else if (_.isString(attribs)) {
                        // skip attribs, just go to children.
                        children = attribs;
                    } else if (_.isObject(attribs)) {
                        node += ' ' + makeTagAttribs(attribs);
                    } else if (!attribs) {
                        // Do nothing.
                    } else if (_.isNumber(attribs)) {
                        children = '' + attribs;
                    } else if (_.isBoolean(attribs)) {
                        if (attribs) {
                            children = 'true';
                        } else {
                            children = 'false';
                        }
                    } else if (_.isNull(attribs) || _.isUndefined(attribs)) {
                        children = '';
                    } else {
                        throw 'Cannot make tag ' + tagName + ' from a ' + (typeof attribs);                        
                    }
                    
                    node += '>';
                    if (options.close !== false) {
                        node += renderContent(children);
                        node += '</' + tagName + '>';
                    }
                    return node;
                };
            }
            return tags[tagName];
        }
        var generatedId = 0;
        function genId() {
            generatedId += 1;
            return 'kb_html_' + generatedId;
        }
        function makeTable(columns, rows, options) {
            var table = tag('table'),
                thead = tag('thead'),
                tbody = tag('tbody'),
                tr = tag('tr'),
                th = tag('th'),
                td = tag('td');
            var id = genId();
            options = options || {};
            options.generated = {id: id};
            return table({id: id, class: options.class}, [
                thead(tr(columns.map(function (x) {
                    return th(x);
                }))),
                tbody(rows.map(function (row) {
                    return tr(row.map(function (x) {
                        return td(x);
                    }));
                }))
            ]);
        }
        
        function bsPanel(title, content) {
            var div = tag('div'),
                span = tag('span');

            return div({class: 'panel panel-default'}, [
                div({class: 'panel-heading'}, [
                    span({class: 'panel-title'}, title)
                ]),
                div({class: 'panel-body'}, [
                    content
                ])
            ]);
        }
        
        function loading() {
            return '<img src="assets/img/ajax-loader.gif">';
        }

        return {
            html: jsonToHTML,
            tag: tag,
            makeTable: makeTable,
            genId: genId,
            bsPanel: bsPanel,
            panel: bsPanel,
            loading: loading
        };
    }());
});