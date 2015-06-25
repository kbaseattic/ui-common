define(['kb.appstate', 'kb.statemachine', 'kb.config', 'kb.session', 'kb.router', 'postal', 'jquery', 'q'], function (AppState, StateMachine, Config, Session, Router, Postal, $, Q) {
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
                rawContent: null,
                mounted: null
            };
        }
        
        function showPanel(mountName, handler) {
            if (handler.route.promise) {
                handler.route.promise(handler.params)
                    .then(function (result) {
                        if (result.content) {
                            mount(mountName, result.content, handler.route)
                            .then(function () {
                                if (result.title) {
                                    pub('title', {title: result.title});
                                } else {
                                    pub('title', ' ');
                                }
                                //if (result.style) {
                                //    loadStyle(result.id, resylt.style);
                                //}
                                if (result.widgets) {
                                    Object.keys(result.widgets).forEach(function (widgetName) {
                                        var widget = result.widgets[widgetName];
                                        widget.attach($('#' + widget.id));
                                    });
                                }
                            })
                            .catch(function (err) {
                                console.log('ERROR');
                                console.log(err);
                            })
                            .done();
                        } else if (result.redirect) {
                            replacePath(result.redirect);
                        }

                    })
                    .catch(function (err) {
                        mount('app', 'Error mounting this panel.' + err);
                    })
                    .done();       
            }
        }
        function show(mountName, handler) {
            if (handler.route.promise) {
                handler.route.promise(handler.params)
                    .then(function (result) {
                        if (result.content) {
                            mount(mountName, result.content, handler.route)
                            .then(function () {
                                if (result.widgets) {
                                    Object.keys(result.widgets).forEach(function (widgetName) {
                                        var widget = result.widgets[widgetName];
                                        widget.attach($('#' + widget.id));
                                    });
                                }
                            })
                            .catch(function (err) {
                                console.log('ERROR');
                                console.log(err);
                            })
                            .done();
                        }
                    })
                    .catch(function (err) {
                        mount('app', 'Error mounting this panel.' + err);
                    })
                    .done();       
            }
        }

        // TODO: do the content rendering here...
        function mount(mountName, content, mounted) {
            return Q.Promise(function (resolve, reject) {
                var mountPoint = mounts[mountName];
                if (!mountPoint) {
                    resolve();
                }
                if (mountPoint.mounted && mountPoint.mounted.stop) {
                    mountPoint.mounted.stop();
                }

                // This just gives us flexibility to make simple routes which
                // just produce a string.
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
                mountPoint.mounted = mounted;

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
                
                if (mounted && mounted.start) {
                    mounted.start();
                }
                
                resolve();
            });
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
            //if (window.history.pushState) {
            //    window.history.pushState(null, '', '#' + location);
            //} else {
                console.log('new location ' + location);
                window.location.hash = '#' + location;
            //}
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

        var loadedStyles = {};
        function loadStyle(id, href) {
            if (loadedStyles[id]) {
                return;
            }
            loadedStyles[id] = true;
            $('<link>')
            .appendTo('head')
            .attr({type: 'text/css', rel: 'stylesheet'})
            .attr('href', href);
        }

        return {
            addRoute: Router.addRoute,
            findCurrentRoute: Router.findCurrentRoute,
            setDefaultRoute: Router.setDefaultRoute,

            createMountPoint: createMountPoint,
            show: show,
            showPanel: showPanel,
            mount: mount,
            html: jsonToHTML,
            tag: makeTag,
            genId: genId,
            navigateTo: navigateTo,

            sub: sub,
            pub: pub,
            
            setItem: setItem,
            getItem: getItem,
            
            loadStyle: loadStyle
        };
    }());
});