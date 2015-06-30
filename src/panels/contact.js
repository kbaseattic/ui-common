define(['kb.app', 'q', 'knockout'], function (App, Q, ko) {
    'use strict';
    
    function renderContactForm () {
        var table = App.tag('table'),
            tr = App.tag('tr'),
            td = App.tag('td'),
            form = App.tag('form'),
            input = App.tag('input'),
            textarea = App.tag('textarea'),
            button = App.tag('button'),
            span = App.tag('span'),
            div = App.tag('div'),
            p = App.tag('p');
        return form({}, [
            div({class: 'panel panel-default'}, [
                div({class: 'panel-heading'}, [
                    span({class: 'panel-title'}, 'Contact Us')
                ]),
                div({class: 'panel-body'}, [
                    table({class: 'table', border:'1'},[
                        tr({}, [
                            td({}, [
                                'Name'
                            ]),
                            td({}, [
                                input({'data-bind': 'value: name'})
                            ])
                        ]),
                        tr({}, [
                            td({}, [
                                'E-Mail'
                            ]),
                            td({}, [
                                input({'data-bind': 'value: email'})
                            ])
                        ]),
                        tr({}, [
                            td({}, [
                                'What?'
                            ]),
                            td({}, [
                                textarea({'data-bind': 'value: what', style: 'width: 400px; height: 100px;'})
                            ])
                        ]),
                        tr({}, [
                            td({}),
                            td({}, [
                                button({type: 'submit', 'data-bind': 'click: submitForm'}, 'Submit')
                            ])
                        ])
                    ]),
                    table({class: 'table', border: '1'}, [
                        tr({}, [
                            td({}, [
                                'Name'
                            ]),
                            td({}, [
                                span({'data-bind': 'text: name'})
                            ])
                        ]),
                        tr({}, [
                            td({}, [
                                'E-Mail'
                            ]),
                            td({}, [
                                span({'data-bind': 'text: email'})
                            ])
                        ]),
                        tr({}, [
                            td({}, [
                                'What?'
                            ]),
                            td({}, [
                                 span({'data-bind': 'text: what'})
                            ])
                        ])
                    ]),
                    div({style: 'border: 1px red solid;'}, [
                        p({}, [
                           'Name: ', span({'data-bind': 'text: name', style: 'font-weight: bold; font-size: 150%;'})
                        ]),
                        p({}, [
                           'E-Mail: ', span({'data-bind': 'text: email', style: 'font-weight: bold; font-size: 150%;'}) 
                        ]),
                        p({}, [
                           'What?: ', span({'data-bind': 'text: what', style: 'font-weight: bold; font-size: 150%;'})
                        ])
                    ])
                ])
            ])
        ]);
    }
    
    function ContactViewModel() {
        // NB by using the event handler first argument, we can avoid usage of
        // the 'this', which would also work (being bound to the object the 
        // event handler is accessed.)
        function submitIt(contact) {
            var name = contact.name();
            alert('submitting form for ' + name);
        }
        return {
            name: ko.observable(''),
            email: ko.observable(''),
            what: ko.observable(''),
            submitForm: submitIt
        }
    }
    
    function setup() {
        App.addRoute({
            path: ['contact'],
            promise: function (params) {
                return Q.promise(function (resolve) {
                    var content = renderContactForm();
                    resolve({
                        content: content,
                        title: 'Contact Us'
                    });
                });
            },
            start: function (node) {
                var contact = ContactViewModel();
                ko.applyBindings(contact, node);
            },
            stop: function (node) {
                //
            }
        });
    };
    function teardown() {
        // TODO: remove routes
    };
    function start () {
        //
        console.log('starting');
        ko.applyBindings(ContactViewModel());
    };
    function stop () {
        //
    };
    return {
        setup: setup,
        teardown: teardown,
        start: start,
        stop: stop
    };
    
});
