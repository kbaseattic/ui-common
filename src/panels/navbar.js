/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'kb.runtime',
    'kb.html',
    'q',
    'kb.session'],
    function ($, R, html, Q, Session) {
        'use strict';
        // ACTUALLY: a widget
        /*
         * Use the factory pattern.
         * This lets us create objects which don't use "this" and which use
         * natural closures for modularization rather than object construction
         * by way of Object.create()
         *
         */
        var factory = function () {
            var self = this;
            function setup() {
                return self;
            }
            function teardown() {
                // TODO: remove routes
                return false;
            }

            var isDirty = undefined;
            function dirty() {
                isDirty = true;
            }
            function clean() {
                isDirty = false;
            }

            var $mount = null;
            var $container = null;
            function attach(node) {
                return Q.Promise(function (resolve) {
                    if ($mount) {
                        throw new Error('Already attached');
                    }
                    $mount = $(node);
                    $container = $('<div></div>');
                    $mount.html($container);
                    var content = render();
                    $container.html(content);
                    attachEvents();
                    clean();
                    resolve();
                });
            }
            function reattach() {
                return Q.Promise(function (resolve) {
                    detach()
                        .then(function () {
                            return stop();
                        })
                        .then(function () {
                            $container = $('<div></div>');
                            $mount.empty().append($container);
                            var content = render();
                            $container.html(content);
                            attachEvents();
                            clean();
                        })
                        .then(function () {
                            return start();
                        })
                        .done();
                });
            }
            function detach() {
                return Q.Promise(function (resolve) {
                    detachEvents();
                    // $mount.empty();
                    $container.remove();
                    $container = null;
                    resolve();
                });
            }


            var subscriptions = [];
            var subscriptions2 = [];
            function start() {
                return Q.Promise(function (resolve) {
                    subscribeAll();
                    resolve();
                });
                /*

                 R.whenItem('userprofile')
                 .then(function (profile) {
                 attach($container).done();
                 })
                 .done();
                 */
            }
            function subscribeAll() {
                unsubscribeAll();
                subscriptions2.push(R.recv('app', 'loggedout', function () {
                    // all we care about is the avatar menu
                    // this will be automatically re-rendered if we set the dirty
                    // flag.
                    dirty();
                }));
                subscriptions2.push(R.recv('app', 'loggedin', function () {
                    // all we care about is the avatar menu
                    dirty();
                }));
                subscriptions2.push(R.recv('app', 'profile.loaded', function () {
                    // all we care about is the avatar menu
                    dirty();
                }));

                subscriptions2.push(R.recv('app', 'title', function (title) {
                    setTitle(title);
                }));
                subscriptions2.push(R.recv('navbar', 'clearButtons', function () {
                    clearButtons();
                }));
                subscriptions2.push(R.recv('navbar', 'addButton', function (data) {
                    addButton(data);
                }));
                subscriptions2.push(R.recv('navbar', 'enableButton', function (data) {
                    var button = buttonMap[data.id];
                    if (button) {
                        button.disabled = false;
                    }
                    dirty();
                }));
                /*
                subscriptions.push(R.sub('refresh', function () {
                    if (isDirty) {
                        console.log('yo, dirty, trying to reattach....');
                        console.log($container);
                        reattach()
                            .catch(function (err) {
                                console.log('ERROR');
                                console.log(err);
                            })
                            .done();
                    }
                }));
                */

                subscriptions2.push(R.recv('app', 'heartbeat', function (data) {
                    if (isDirty) {
                        reattach()
                            .catch(function (err) {
                                console.log('ERROR');
                                console.log(err);
                            })
                            .done();
                    }
                }));
            }
            function unsubscribeAll() {
                subscriptions.forEach(function (sub) {
                    R.unsub(sub);
                });
                subscriptions2.forEach(function (sub) {
                    R.drop(sub);
                });
            }
            function stop() {
                return Q.Promise(function (resolve) {
                    unsubscribeAll();
                    resolve();
                });
            }

            /*
             * These are the registered menu items. Any menu item must be registered
             * here.
             * Menu items may also be added using the defMenuItem method.
             * A menu item might be defined by a panel or widget when it is first loaded. In this case,
             */
            var menuItems = {
                search: {
                    uri: R.getConfig('ui.paths.spa_root')+'search/?q=*',
                    label: 'Search Data',
                    icon: 'search'
                },
                narrative: {
                    uri: R.getConfig('ui.paths.spa_root')+'narrativemanager/start',
                    label: 'Narrative',
                    icon: 'file'
                },
                divider: {
                    type: 'divider'
                },
                about: {
                    uri: '#about',
                    label: 'About',
                    icon: 'info-circle'
                },
                narrativeTutorial: {
                    uri: 'https://kbase.us/narrative-guide',
                    label: 'Narrative Tutorial',
                    icon: 'info-circle'
                },
                contact: {
                    uri: R.getConfig('ui.paths.spa_root')+'contact',
                    label: 'Contact Us',
                    icon: 'envelope-o'
                },
                about_kbase: {
                    uri: 'https://kbase.us/about',
                    label: 'About KBase',
                    icon: 'info-circle'
                },
                contact_us: {
                    uri: 'https://kbase.us/contact-us',
                    label: 'Contact Us',
                    icon: 'envelope-o'
                },
                dashboard: {
                    uri: '#dashboard',
                    label: 'Dashboard',
                    icon: 'dashboard'
                },
                databrowser: {
                    uri: '#databrowser',
                    label: 'Data Browser',
                    icon: 'database'
                },
                typebrowser: {
                    uri: '#typebrowser',
                    label: 'Type Browser',
                    icon: 'beer'
                },
                sample: {
                    uri: '#sample',
                    label: 'Sample Panel',
                    icon: 'flask'
                },
                linechart: {
                    uri: '#linechart',
                    label: 'Line chart',
                    icon: 'line-chart'
                },
                test: {
                    uri: '#test',
                    label: 'Testing Panel',
                    icon: 'flask'
                }
            };
            function defMenuItem(id, menuDef) {
                menuItems[id] = menuDef;
            }

            var menu = [];
            function clearMenu() {
                menu = [];
            }
            function addMenuItem(id, afterItem) {
                menu.push(id);
            }
            function deleteMenuItem(id) {
                delete menu[id];
            }
            function insertMenuItem(id, beforeItem) {
            }
            function setMenu(ids) {
                clearMenu();
                menu = ids.map(function (id) {
                    return id;
                });
            }


            //
            var title = '';
            function setTitle(newTitle) {
                title = newTitle;
                dirty();
            }

            // EVENTS
            // TODO; Move to separate module.
            var events = [];
            function addEvent(type, handler, id, data) {
                if (!id) {
                    id = html.genId();
                }
                events.push({
                    type: type,
                    selector: '#' + id,
                    handler: handler
                });
                dirty();
                return id;
            }
            function matches (element, selector) {
                var matches = ['matches', 'webkitMatchesSelector', 'msMatchesSelector', 'mozMatchesSelector', 'oMatchesSelector'],
                    matcher = _.find(matches, function (m) {return (m in element);});
                if (matcher) {
                    return element[matcher](selector);
                } else {
                    throw new Error('No mathches method found!');
                }
            }
            function attachEvents() {
                events.forEach(function (event) {
                    $container.on(event.type, event.selector, event.data, event.handler);
                    /*var fun = function (e) {
                        console.log('trying...');
                        console.log(e.target);
                        console.log(event.selector);
                        console.log(matches(e.target, event.selector));
                        if (matches(e.target, event.selector)) {
                            event.handler();
                        }
                    };
                    event.actualHandler = fun;
                    $container.get(0).addEventListener(event.type, fun);
                    */
                });
            }
            function detachEvents() {
                events.forEach(function (event) {
                    if (event.listener) {
                        $container.off(event.type, event.selector);
                        // $container.get(0).removeEventListener(event.type, event.actualHandler);
                    }
                });
            }

            function handleSignout(e) {
                Session.logout()
                    .then(function () {
                        R.send('app', 'loggedout');
                        R.send('app', 'navigate', 'welcome');
                    })
                    .catch(function (err) {
                        console.log('ERROR');
                        console.log(err);
                        alert('Error signing out (check console for details)');
                    })
                    .done();
            }

            // RENDERERS
            function renderMenuItem(item) {
                var li = html.tag('li'),
                    a = html.tag('a'),
                    div = html.tag('div'),
                    span = html.tag('span');
                var icon = null;
                if (item.icon) {
                    icon = div({class: 'navbar-icon'}, [
                        span({class: 'fa fa-' + item.icon})
                    ]);
                }
                var type = item.type || 'button';
                switch (type) {
                    case 'button':
                        return li({}, a({href: item.uri}, [
                            icon,
                            item.label
                        ]));
                    case 'divider':
                        return li({role: 'presentation', class: 'divider'});
                }
            }
            function renderMenu() {
                var ul = html.tag('ul');
                if (R.isLoggedIn()) {
                    setMenu(['search', 'narrative', 'dashboard', 'databrowser', 'typebrowser', 'test', 'sample', 'linechart', 'divider', 'about', 'contact', 'divider', 'about_kbase', 'contact_us']);
                } else {
                    setMenu(['about', 'contact', 'divider', 'about_kbase', 'contact_us']);
                }
                return ul({class: 'dropdown-menu', role: 'menu', 'aria-labeledby': 'kb-nav-menu'}, menu.map(function (id) {
                    var item = menuItems[id];
                    if (!item) {
                        console.log('item ' + id + ' not defined');
                    } else {
                        return renderMenuItem(item);
                    }
                }));
            }
            function renderAvatar() {
                var img = html.tag('img', {close: false});
                var profile = R.getItem('userprofile');
                if (profile) {
                    return img({src: profile.getAvatarURL(), style: 'width: 40px;', class: 'login-button-avatar', 'data-element': 'avatar'});
                }
                return img({src: 'assets/images/nouserpic.png', style: 'width: 40px;', class: 'login-button-avatar', 'data-element': 'avatar'});
            }
            function renderLogin() {
                var button = html.tag('button'),
                    div = html.tag('div'),
                    a = html.tag('a'),
                    span = html.tag('span'),
                    ul = html.tag('ul'),
                    li = html.tag('li'),
                    br = html.tag('br', {close: false}),
                    i = html.tag('i');


                if (R.isLoggedIn()) {
                    /* TODO: fix dependencies like this -- realname is not available until, and unless, the
                      profile is loaded, which happens asynchronously.
                    */
                    var profile = R.getItem('userprofile');
                    var realname = profile ? profile.getProp('user.realname') : '?';
                    return div({class: 'dropdown', style: 'display:inline-block'}, [
                        button({type: 'button', class: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown', 'aria-expanded': 'false'}, [
                            renderAvatar(),
                            span({class: 'caret', style: 'margin-left: 5px;'})
                        ]),
                        ul({class: 'dropdown-menu', role: 'menu'}, [
                            li({}, [
                                a({href: R.getConfig('ui.paths.spa_root') + 'people/' + R.getUsername(), 'data-menu-item': 'userlabel'}, [
                                    div({style: 'display:inline-block; width: 34px; vertical-align: top;'}, [
                                        span({class: 'fa fa-user', style: 'font-size: 150%; margin-right: 10px;'})
                                    ]),
                                    div({style: 'display: inline-block', 'data-element': 'user-label'}, [
                                        realname,
                                        br(),
                                        i({}, R.getUsername())
                                    ])
                                ])
                            ]),
                            li({class: 'divider'}),
                            li({}, [
                                a({href: '#', 'data-menu-item': 'logout', id: addEvent('click', handleSignout)}, [
                                    div({style: 'display: inline-block; width: 34px;'}, [
                                        span({class: 'fa fa-sign-out', style: 'font-size: 150%; margin-right: 10px;'})
                                    ]),
                                    'Sign Out'
                                ])
                            ])
                        ])
                    ]);
                }
                return a({type: 'button', class: 'btn btn-primary navbar-btn kb-nav-btn', 'data-button': 'signin', href: '#login'}, [
                    div({class: 'fa fa-sign-in  fa-inverse', style: 'margin-right: 5px;'}),
                    div({class: 'kb-nav-btn-txt'}, ['Sign In'])
                ]);
            }

            function render() {
                var div = html.tag('div'),
                    button = html.tag('button'),
                    span = html.tag('span'),
                    a = html.tag('a'),
                    img = html.tag('img', {close: false});
                var content = div({class: 'container-fluid'}, [
                    div({class: 'navbar-header navbar-menu'}, [
                        div({style: 'display: inline-block;', 'data-element': 'menu'}, [
                            button({id: 'kb-nav-menu',
                                class: 'btn btn-default navbar-btn kb-nav-btn',
                                'data-toggle': 'dropdown',
                                'aria-haspopup': 'true'}, [
                                span({class: 'fa fa-navicon'})
                            ]),
                            renderMenu()
                        ]),
                        a({href: 'http://kbase.us'}, [
                            img({id: 'logo', src: 'assets/navbar/images/kbase_logo.png', width: '46'})
                        ])
                    ]),
                    div({class: 'navbar-text navbar-title'}, [
                        span({class: 'title', 'data-element': 'title'}, [
                            title
                        ])
                    ]),
                    div({class: 'navbar-right'}, [
                        span({class: 'navbar-buttons', 'data-element': 'buttons'}, [
                            renderButtons()
                        ]),
                        span({id: 'signin-button', 'data-element': 'signin-button'}, [
                            renderLogin()
                        ])
                    ])
                ]);
                return content;
            }




            /* BUTTONS */
            var buttons = [];
            var buttonMap = {};
            function clearButtons() {
                if (!$container) {
                    return false
                }
                // $container.find('.navbar-buttons').empty();
                buttons = [];
                buttonMap = {};
                return true;
            }

            function addButton(cfg) {
                if (cfg.place === 'end') {
                    buttons.push(cfg);
                } else {
                    buttons.unshift(cfg);
                }
                buttonMap[cfg.name] = cfg;
                dirty();
                return true;
            }

            function renderButton(cfg) {
                var iconStyle = '';
                var label = '';

                var div = html.tag('div'),
                    a = html.tag('a'),
                    button = html.tag('button');

                if (cfg.label) {
                    label = div({class: 'kb-nav-btn-txt'}, cfg.label);
                } else {
                    iconStyle += 'font-size: 150%;';
                }

                var btn;
                var id = html.genId();
                var attribs = {
                    'data-button': cfg.name,
                    id: id,
                    class: 'btn btn-' + (cfg.style || 'default') + ' navbar-btn kb-nav-btn',
                    disabled: cfg.disabled ? true : false
                };
                var icon = div({
                    class: 'fa fa-' + cfg.icon,
                    style: iconStyle
                });
                if (cfg.url) {
                    // a link style button
                    attribs.role = 'button';
                    attribs.href = cfg.url;
                    if (cfg.target) {
                        attribs.target = cfg.target;
                    } else if (cfg.external) {
                        attribs.target = '_blank';
                    }
                    btn = a(attribs, [icon, label]);
                } else {
                    btn = button(attribs, [icon, label]);
                    addEvent('click', function (e) {
                        console.log('yes, here!');
                        //e.preventDefault();
                        console.log('yes, here2!');
                        cfg.callback();
                        return false;
                    }, id);
                }
                return btn;
            }


            function renderButtons() {
                return buttons.map(function (buttonDef) {
                    return renderButton(buttonDef);
                });
            }


            function findButton(name) {
                return $container.find('.navbar-buttons [data-button="' + name + '"]');
            }

            // All set up, set flags.
            dirty();


            /*
             * And this, dear friends, is the Navbar api.
             */
            return {
                // Standard panel/widget stuff
                setup: setup,
                teardown: teardown,
                attach: attach,
                detach: detach,
                start: start,
                stop: stop,
                // probably should remove after play time is over...
                render: render,
                // navbar api
                setTitle: setTitle,
                defMenuItem: defMenuItem,
                clearButtons: clearButtons,
                addButton: addButton



                    //addAppMenuItem: addAppMenuItem,
                    //removeAppMenuItem: removeAppMenuItem,
                    //addPanelMenuItem: addPanelMenuItem,
                    //removePanelMenuItem: removePanelMenuItem,
                    //clearMenu:
                    // On the other hand, panels and widgets don't need to muck with the menu,
                    // they can use buttons.
                    //clearButtons: clearButtons,
                    //addButton: addButton,
                    //addDropdown: addDropdown

            };
        };
        return {
            create: factory
        };
    });
