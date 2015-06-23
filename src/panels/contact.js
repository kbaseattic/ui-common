define(['kb.app'], function (App) {
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
        // Set up routes
        // var tag = App.makeTag;
        var p = App.tag('p'),
            div = App.tag('div');
        App.addRoute({
            path: ['contact'],
            render: function (params) {
                return renderContactForm();
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
