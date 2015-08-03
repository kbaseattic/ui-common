/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([], function () {
    'use strict';
    function createElement(name) {
        return document.createElement(name);
    }
    function append(parent, child) {
        return parent.appendChild(child);
    }
    function remove(parent, child) {
        return parent.removeChild(child);
    }
    function setHTML(parent, content) {
        return parent.innerHTML = content;
    }
    
    return {
        createElement: createElement,
        append: append,
        remove: remove,
        setHTML: setHTML
    };
});