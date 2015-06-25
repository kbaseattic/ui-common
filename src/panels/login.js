define(['kb.app', 'kb.session', 'jquery', 'q'], function (App, Session, $, Q) {
    'use strict';

    var panelId = App.genId();

    // This should be somewhere else, and handle all types of fields
    // I'm sure we've done this already.
    function getFieldValue(name) {
        var field = $('#' + panelId + ' form [name="' + name + '"]');
        if (field) {
            return field.val();
        }
    }
    function node(selector) {
        return $('#' + panelId + ' ' + selector);
    }
    function element(name) {
        return node('[data-element="' + name + '"]');
    }

    function handleLogin(e) {
        e.preventDefault();

        // TODO: add support for nextPath, nextURL

        // Angular does not populate the user property if nothing
        // was filled in.
        // var username = user?user.username:null;
        // var password = user?user.password:null;
        var username = getFieldValue('username'),
            password = getFieldValue('password');

        if (!username) {
            element('error').html('The username is required').show();
            return;
        }
        if (!password) {
            element('error').html('The password is required').show();
            return;
        }

        element('error').hide();
        element('sign-in').hide();
        element('signing-in').show();
        Session.login({
            username: username,
            password: password
        })
            .then(function (session) {
                App.pub('loggedin');
                App.navigateTo('about');
            })
            .catch(function (errorMsg) {
                element('running').hide();
                if (errorMsg === "LoginFailure: Authentication failed.") {
                    errorMsg = "Login Failed: your username/password is incorrect.";
                }
                element('error').html(errorMsg).show();
                element('sign-in').show();
                element('signing-in').hide();
            })
            .done();
    }

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

    function renderForm() {
        var form = App.tag('form'),
            input = App.tag('input'),
            button = App.tag('button'),
            div = App.tag('div'),
            p = App.tag('p'),
            h1 = App.tag('h1'),
            legend = App.tag('legend'),
            i = App.tag('i'),
            a = App.tag('a');

        // Variables for form.
        var nextPath = 'next path',
            nextURL = 'next url';

        resetEvents();

        var content = div({class: 'container', style: 'margin-top: 4em', id: panelId}, [
            div({}, [
                div({style: 'position:absolute; background-image: url(assets/images/doodle.png); background-repeat:no-repeat; background-size:35%; top:0; left:0; bottom: 0; right: 0; opacity: 0.1'})
            ]),
            div({class: 'row'}, [
                div({class: 'col-sm-7 col-sm-offset-1'}, [
                    h1({style: 'font-size:1.6em'}, ['Welcome to the KBase Search and Narrative Interface']),
                    p({}, 'After signing in you can upload your own experimental data or find data integrated from external resources or shared by other users. You can then perform, organize, and share sophisticated comparative genomics and systems biology analyses by creating Narratives.'),
                    p({}, 'Narratives are user-created interactive, dynamic, and shareable documents that are KBase’s way of making systems biology research transparent, reproducible, and reusable.'),
                    p({}, 'The Narrative Interface lets you customize and execute a set of ordered KBase analyses to create your own Narratives that include your analysis steps, commentary, visualizations, and custom scripts.'),
                    p({}, 'Want to learn more? We have an extensive and growing <a href="http://kbase.us/tutorials">library of tutorials</a> that show you how to use KBase’s new apps to analyze your data. To become familiar with the user interface, try the <a href="http://kbase.us/narrative-guide">Narrative Interface User Guide</a>.')
                ]),
                div({class: 'col-sm-3'}, [
                    div({class: 'well well-kbase'}, [
                        form({class: 'form login-form', id: addEvent('submit', handleLogin)}, [
                            input({type: 'hidden', value: nextPath}),
                            input({type: 'hidden', value: nextURL}),
                            legend({style: 'text-align: center'}, 'KBase Sign In'),
                            div({class: 'form-group'}, [
                                input({name: 'username', type: 'text', placeholder: 'username', id: 'kbase_username', class: 'form-control form-control-kbase', tabindex: '1'})
                            ]),
                            div({class: 'form-group'}, [
                                input({name: 'password', type: 'password', placeholder: 'password', id: 'kbase_password', class: 'form-control form-control-kbase', tabindex: '2'})
                            ]),
                            div({class: 'form-group'}, [
                                button({id: 'signinbtn', type: 'submit', class: 'btn btn-primary btn-block btn-kbase', tabindex: '3', 'data-element': 'sign-in'}, [
                                    i({class: 'fa fa-sign-in', style: 'margin-right: 1em;'}),
                                    'Sign In'
                                ]),
                                button({id: 'signinbtn', type: 'submit', class: 'btn btn-primary btn-block btn-kbase', style: 'display:none;', tabindex: '3', 'data-element': 'signing-in'}, [
                                     i({class: 'fa fa-spinner fa-spin', style: 'margin-right: 1em;'}),
                                    'Signing In...'
                                ]),
                                div({'data-element': 'error', class: 'alert alert-danger alert-kbase', style: 'display:none; margin-top: 1em'})
                            ]),
                            div({class: 'form-group', style: 'margin-top: 3em; margin-bottom: 0;'}, [
                                a({target: '_blank', href: 'https://gologin.kbase.us/Signup', class: 'btn btn-block btn-link'}, 'New to KBase? Sign Up'),
                                a({target: '_blank', href: 'https://gologin.kbase.us/ResetPassword', class: 'btn btn-block btn-link'}, 'Forgot your password?'),
                                a({target: '_blank', href: 'http://kbase.us/login-help', class: 'btn btn-block btn-link'}, 'Help')
                            ])
                        ])
                    ])
                ])
            ])
        ]);
        return {
            content: content,
            events: events
        };
    }

    function setup() {
        // Set up routes
        App.addRoute({
            path: ['login'],
            promise: function (params) {
                return Q.Promise(function (resolve) {
                    resolve({
                        content: renderForm(),
                        title: 'Sign In'
                    });
                });
            }
        });
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
    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop
    };
});
