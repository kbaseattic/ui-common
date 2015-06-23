define(['kb.appstate', 'kb.statemachine', 'kb.config', 'kb.session', 'kb.router', 'postal', 'jquery'], function (AppState, StateMachine, Config, Session, Router, Postal, $) {
    'use strict';
    return (function () {

        /*
         * Mounts are named locations in the persistent html page where 
         * we can display content.
         */
        var mounts = {};
        function createMountPoint(name, selector) {
            mounts[name] = {
                selector: selector,
                element: $(selector).get(),
                rawContent: null
            };
        }

        function mount(mountName, content) {
            var mountPoint = mounts[mountName];
            if (!mountPoint) {
                return;
            }

            if (typeof content === 'string') {
                content = {
                    content: [content],
                    events: []
                };
            } else if (typeof content === 'object' && content.push) {
                content = {
                    content: content,
                    events: []
                };
            } else {
                if (typeof content.content === 'string') {
                    content.content = [content.content];
                }
            }

            mountPoint.rawContent = content.content;
            mountPoint.events = content.events;

            // We make a node to hold both the content and the events.
            // This makes it easy to throw away the node later, and lose 
            // the events without having to manage it all.

            var container = $('<div/>');
            content.content.forEach(function (el) {
                container.append(el);
            });
            if (content.events) {
                content.events.forEach(function (event) {
                    container.on(event.type, event.selector, event.handler);
                });
            }
            $(mountPoint.element).empty().append(container);
        }

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
        function makeTag(tagName, options) {
            options = options || {};
            if (!tags[tagName]) {
                tags[tagName] = function (attribs, children) {
                    var node = '<' + tagName;
                    if (attribs && Object.keys(attribs).length > 0) {
                        node += ' ';
                        Object.keys(attribs).forEach(function (key) {
                            node += key + '="' + attribs[key] + '"';
                        });
                    }
                    node += '>';
                    if (options.close !== false) {
                        children = children || [];
                        if (typeof children === 'string') {
                            node += children;
                        } else {
                            children.forEach(function (item) {
                                node += item;
                            });
                        }
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
            return 'kb_' + generatedId;
        }

        function navigateTo(location) {
            window.location.href = '#' + location;
        }

        // Very simple message system.
        var messages = {};
        function sub(id, fun) {
            if (messages[id] === undefined) {
                messages[id] = [];
            }
            messages[id].push(fun);
        }
        function pub(id, data) {
            if (messages[id]) {
                messages[id].forEach(function (fun) {
                    try {
                        fun(data);
                    } catch (ex) {
                        console.log('Execption runnning sub ' + id);
                        console.log(ex);
                    }
                });
            }
        }
        
        function setItem(name, value) {
            AppState.setItem(name, value);
        }
        function getItem(name) {
            return AppState.getItem(name);
        }

        return {
            addRoute: Router.addRoute,
            findCurrentRoute: Router.findCurrentRoute,
            setDefaultRoute: Router.setDefaultRoute,

            createMountPoint: createMountPoint,
            mount: mount,
            html: jsonToHTML,
            tag: makeTag,
            genId: genId,
            navigateTo: navigateTo,

            sub: sub,
            pub: pub,
            
            setItem: setItem,
            getItem: getItem
        };
    }());
});