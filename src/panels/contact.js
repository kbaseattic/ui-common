define(['kb.app', 'q'], function (App, Q) {
    'use strict';
    
    function renderContactForm () {
        var table = App.tag('table'),
            tr = App.tag('tr'),
            td = App.tag('td'),
            form = App.tag('form'),
            input = App.tag('input'),
            button = App.tag('button');
        return form({}, [
            table({border:'1'},[
                tr({}, [
                    td({}, [
                        'Name'
                    ]),
                    td({}, [
                        input({name:'name'})
                    ])
                ]),
                tr({}, [
                    td({}, [
                        'E-Mail'
                    ]),
                    td({}, [
                        input({name:'email'})
                    ])
                ]),
                tr({}, [
                    td({}, [
                        'What?'
                    ]),
                    td({}, [
                        input({name:'what'})
                    ])
                ]),
                tr({}, [
                    td({}),
                    td({}, [
                        button({type:'submit'}, 'Submit')
                    ])
                ])
            ])
        ]);
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
            }
        });
    };
    function teardown() {
        // TODO: remove routes
    };
    function start () {
        //
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
