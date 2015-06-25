define(['kb.app', 'kb.session', 'q'], function (App, Session, Q) {
    'use strict';
    // ACTUALLY: a widget
    function setup() {
        return false;
    }
    function teardown() {
        // TODO: remove routes
        return false;
    }
    function start() {
        //
        return false;
    }
    function stop() {
        //
        return false;
    }

    var menuItems = {
        search: {
            uri: '/functional-site/#/search/?q=*',
            label: 'Search Data',
            icon: 'search'
        },
        narrative: {
            uri: '/functional-site/#/narrativemanager/start',
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
            uri: '/functional-site/#/contact',
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
        }
    };
    function defMenuItem(id, menuDef) {
        menuItems[id] = menuDef;
    }
    
    var menu = ['search', 'narrative', 'divider', 'about', 'narrativeTutorial', 'contactUs'];
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
    var title = '** title here **';
    function setTitle(newTitle) {
        title = newTitle;
    }

    // EVENTS
    // TODO; Move to separate module.
    var events = [];
    function addEvent(type, handler) {
        var id = App.genId();
        events.push({
            type: type,
            selector: '#' + id,
            handler: handler
        });
        return id;
    }
    function handleSignout(e) {
        Session.logout()
            .then(function () {
                App.pub('loggedout');
                App.navigateTo('welcome');
            })
            .done();
    }

    // RENDERERS
    function renderMenuItem(item) {
        var li = App.tag('li'),
            a = App.tag('a'),
            div = App.tag('div'),
            span = App.tag('span');
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
        var ul = App.tag('ul');
        if (Session.isLoggedIn()) {
            setMenu(['search', 'narrative', 'dashboard', 'divider', 'about', 'contact', 'divider', 'about_kbase', 'contact_us'])
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
        var img = App.tag('img', {close: false});
        var profile = App.getItem('userprofile');
        if (profile) {
            return img({src: profile.getAvatarURL(), style: 'width: 40px;', class: 'login-button-avatar', 'data-element': 'avatar'});
        }
        return img({src: 'assets/images/nouserpic.png', style: 'width: 40px;', class: 'login-button-avatar', 'data-element': 'avatar'});
    }
    function renderLogin() {
        var button = App.tag('button'),
            div = App.tag('div'),
            a = App.tag('a'),
            span = App.tag('span'),
            ul = App.tag('ul'),
            li = App.tag('li'),
            br = App.tag('br', {close: false}),
            i = App.tag('i');


        if (Session.isLoggedIn()) {
            // TODO: fix dependencies like this -- realname is not available until, and unless, the 
            // profile is loaded, which happens asynchronously.            
            var profile = App.getItem('userprofile');
            var realname = profile ? profile.getProp('user.realname') : '?';
            return div({class: 'dropdown', style: 'display:inline-block'}, [
                button({type: 'button', class: 'btn-btn-default dropdown-toggle', 'data-toggle': 'dropdown', 'aria-expanded': 'false'}, [
                    renderAvatar(),
                    span({class: 'caret', style: 'margin-left: 5px;'})
                ]),
                ul({class: 'dropdown-menu', role: 'menu'}, [
                    li({}, [
                        a({href: '/functional-site/#/people/' + Session.getUsername(), 'data-menu-item': 'userlabel'}, [
                            div({style: 'display:inline-block; width: 34px; vertical-align: top;'}, [
                                span({class: 'fa fa-user', style: 'font-size: 150%; margin-right: 10px;'})
                            ]),
                            div({style: 'display: inline-block', 'data-element': 'user-label'}, [
                                realname,
                                br(),
                                i({}, Session.getUsername())
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
        var div = App.tag('div'),
            button = App.tag('button'),
            span = App.tag('span'),
            a = App.tag('a'),
            img = App.tag('img', {close: false});
        var content = div({class: 'container-fluid'}, [
            div({class: 'navbar-header navbar-menu'}, [
                div({style: 'display: inline-block;', 'data-element': 'menu'}, [
                    button({id: 'kb-nav-menu',
                        class: 'btn btn-default navbar-btn kb-nav-btn',
                        'data-toggle': 'dropdown',
                        'aria-haspopup': true}, [
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
                span({class: 'navbar-buttons', 'data-element': 'buttons'}),
                span({id: 'signin-button', 'data-element': 'signin-button'}, [
                    renderLogin()
                ])
            ])
        ]);
        return {
            content: content,
            events: events
        };
    }
    
    function promise() {
        return Q.Promise(function (resolve, reject) {
            resolve(render());
        });
    }

    return {        
        setup: setup,
        teardown: teardown,
        promise: promise,
        start: start,
        stop: stop,
        setTitle: setTitle
    };
});
