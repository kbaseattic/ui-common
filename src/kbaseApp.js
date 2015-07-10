/**
 * A singleton object module used for global state, and providing the primary api
 * for panels and widgets.
 * It is the clearinghouse for users used across the kbase app.
 * Design principles:
 * - expose minimal api
 * - dependencies on services, but don't expose them
 * 
 */
/*global
 define, console, window
 */
/*jslint
 browser: true,
 white: true
 */
define(['kb.appstate', 'kb.session', 'kb.config', 'kb.router', 'jquery', 'q', 'underscore', 'postal'],
    function (AppState, Session, Config, Router, $, Q, _, Postal) {
        'use strict';
        var factory = function () {
            function navigateTo(location) {
                //if (window.history.pushState) {
                //    window.history.pushState(null, '', '#' + location);
                //} else {
                window.location.hash = '#' + location;
                //}
            }
            function replacePath(location) {
                window.location.replace(location);
            }

            var generatedId = 0;
            function genId() {
                generatedId += 1;
                return 'kb_' + generatedId;
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
                    state: {},
                    mounted: null
                };
            }
            // TODO: do the content rendering here...
            function mount(mountName, content, mounted) {
                return Q.Promise(function (resolve) {
                    var mountPoint = mounts[mountName];
                    if (!mountPoint) {
                        resolve();
                    }
                    if (mountPoint.mounted && mountPoint.mounted.stop) {
                        mountPoint.mounted.stop($(mountPoint.mounted.id), mountPoint.mounted);
                    }

                    // Coerce the content into the content object format.
                    // This gives api users the convenience of supplying content as
                    // either a string, an array of content, or a content object.
                    if (_.isString(content)) {
                        content = {
                            content: [content],
                            events: []
                        };
                    } else if (_.isArray(content)) {
                        content = {
                            content: content,
                            events: []
                        };
                    } else if (!_.isObject(content)) {
                        console.log('Invalid content container object');
                        console.log(content);
                        throw 'Invalid content container object (see console for details)';
                    }

                    // Now massage just the content property
                    if (_.isString(content.content)) {
                        content.content = [content.content];
                    } else if (content.content === null && content.content === undefined) {
                        content.content = [];
                    } else if (!_.isArray(content.content)) {
                        console.log('Invalid content object');
                        console.log(content.content);
                        throw 'Invalid content object (see console for details)';
                    }

                    mountPoint.rawContent = content.content;
                    mountPoint.events = content.events;
                    mountPoint.mounted = mounted;
                    if (!mounted.id) {
                        mounted.id = genId();
                    }

                    // We make a node to hold both the content and the events.
                    // This makes it easy to throw away the node later, and lose 
                    // the events without having to manage it all.

                    var container = $('<div id="' + mounted.id + '"/>');
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
                        mounted.start($('#' + mounted.id).get(0), mounted);
                    }

                    resolve();
                });
            }
            function showPanel(mountName, handler) {
                if (handler.route.promise) {
                    handler.route.promise(handler.params)
                        .then(function (result) {
                            if (result.content) {
                                mount(mountName, result, handler.route)
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
                            console.log('ERROR');
                            console.log(err);
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
                                mount(mountName, result, handler.route)
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
                            console.log('ERROR');
                            console.log(err);
                            mount('app', 'Error mounting this panel.' + err);
                        })
                        .done();
                }
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
                    return String(node);
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
                        }
                        // just ignore invalid attributes for now
                        // TODO: what is the proper thing to do?
                        return '';
                    });
                    return fields.filter(function (field) {
                        return field ? true : false;
                    }).join(';');
                }
                return '';
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
                        }
                        if (typeof value === 'object') {
                            return key + ': {' + makeDataBindAttribs(value) + '}';
                        }
                        // just ignore invalid attributes for now
                        // TODO: what is the proper thing to do?
                        return '';
                    });
                    return fields.filter(function (field) {
                        return field ? true : false;
                    }).join(',');
                }
                return '';
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
                        var value = attribs[key];
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
                            var escapedValue = value.replace(new RegExp('\\' + quoteChar, 'g'), '\\' + quoteChar);
                            return key + '=' + quoteChar + escapedValue + quoteChar;
                        }
                        if (typeof value === 'boolean') {
                            if (value) {
                                return key;
                            }
                        }
                        return false;
                    });
                    return fields.filter(function (field) {
                        return field ? true : false;
                    }).join(' ');
                }
                return '';
            }
            function renderContent(children) {
                if (children) {
                    if (_.isString(children)) {
                        return children;
                    }
                    if (_.isArray(children)) {
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
            function makeTag(tagName, options) {
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

            var heartbeat = 0,
                heartbeatTimer;

            function startHeartbeat() {
                console.log('Starting the heartbeat...');
                heartbeat = 0;
                heartbeatTimer = window.setInterval(function () {
                    heartbeat += 1;
                    Postal.channel('app').publish('heartbeat', {heartbeat: heartbeat});
                }, 100);
            }
            function stopHeartbeat() {
                console.log('Stopping the heartbeat...');
                if (heartbeatTimer) {
                    window.clearInterval(heartbeatTimer);
                }
            }
            
            // LIFECYCLE
            
            function setup() {
                
            }
            
            function doRoute() {
                var handler = Router.findCurrentRoute();
                if (!handler) {
                    pub('route-not-found');
                }
                pub('new-route', {
                    routeHandler: handler
                });
            }
            
            function start() {
                $(window).bind('hashchange', function (e) {
                    // NB this is called AFTER it has changed. The browser will do nothing by
                    // default.
                    doRoute();
                });
                
                startHeartbeat();
                
                if (Session.isLoggedIn) {
                    pub('loggedin');
                } else {
                    pub('loggedout');
                }
                
                // Handle the initial route upon app load
                doRoute();
            }
            
            function stop() {
                stopHeartbeat();
                
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
                loadStyle: loadStyle,
                getAuthToken: Session.getAuthToken.bind(Session),
                getUserId: Session.getUsername.bind(Session),
                getUserRealname: Session.getRealname.bind(Session),
                isLoggedIn: Session.isLoggedIn.bind(Session),
                getConfig: Config.getItem.bind(Config),
                startHeartbeat: startHeartbeat,
                stopHeartbeat: stopHeartbeat,
                
                start: start,
                stop: stop
            };
        };
        
        
        return {
            create: factory
        };
    });