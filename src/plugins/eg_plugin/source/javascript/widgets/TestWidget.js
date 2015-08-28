/*
 * 
 */
/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
/* DOC: sample pure object widget with interface
 */
define([
    'kb_widgetBases_domWidget',
    'kb.html'
],
    function (SimpleDOM, html) {
        'use strict';
        var moduleRunCount = 0;
        return Object.create(SimpleDOM, {
            onInit: {
                value: function (config) {
                }
            },
            onStart: {
                value: function (params) {
                    var div = html.tag('div');
                    moduleRunCount += 1;
                    var content = div([
                        (params.name===undefined ? '' : 'Hi, ' + params.name + ', how are you?'),
                        'I am a simple widget. I have been run ' + moduleRunCount + ' times.'
                    ])
                    this.setHTML(content);
                }
            }

        });
    });