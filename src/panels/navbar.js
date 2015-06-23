define(['kb.app', 'kb.session'], function (App, Session) {
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
    var title = '** title here **';
    function setTitle(newTitle) {
        title = newTitle;
    }

    var menu = [
        {
            uri: '/functional-site/#/search/?q=*',
            label: 'Search Data',
            icon: 'search'
        },
        {
            uri: '/functional-site/#/narrativemanager/start',
            label: 'Narrative',
            icon: 'file'
        },
        {
            type: 'divider'
        },
        {
            uri: '#about',
            label: 'About',
            icon: 'info-circle'
        },
        {
            uri: 'https://kbase.us/narrative-guide',
            label: 'Narrative Tutorial',
            icon: 'info-circle'
        },
        {
            uri: '/functional-site/#/contact',
            label: 'Contact Us',
            icon: 'envelope-o'
        }
    ];

    

    // EVENTS
    // TODO; Move to separate module.
    var events = [];
    function resetEvents() {
        events = [];
    }
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
                App.navigateTo('about');
            })
            .done();
    }
    
    // SUBS
    var subs = [];
    function addSub(id, handler) {
        App.sub(id, handler);
    }
    
    // RENDERERS
    function renderMenuItem(item) {
        var li = App.tag('li'),
            a =  App.tag('a'),
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
        return ul({class: 'dropdown-menu', role: 'menu', 'aria-labeledby': 'kb-nav-menu'}, menu.map(function (item) {
            return renderMenuItem(item);
        }));
    }
    function renderAvatar() {
        var img = App.tag('img', {close: false});
        var profile = App.getItem('userprofile');
        console.log(profile);
        if (profile) {
            return img({src: profile.getAvatarURL(), style: 'width: 40px;', class: 'login-button-avatar', 'data-element': 'avatar'});
        } else {
            return img({src: 'assets/images/nouserpic.png', style: 'width: 40px;', class: 'login-button-avatar', 'data-element': 'avatar'});
        }
    }
    function renderLogin() {
        var button = App.tag('button'),
            div = App.tag('div'),
            a = App.tag('a'),
            img = App.tag('img', {close: false}),
            span = App.tag('span'),
            ul = App.tag('ul'),
            li = App.tag('li'),
            br = App.tag('br', {close: false}),
            i = App.tag('i');
        if (Session.isLoggedIn()) {
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
                                Session.getRealname(),
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

    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop,
        render: render
    };
});
