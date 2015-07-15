/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'jquery',
    'underscore',
    'q',
    'kb.runtime',
    'kb.html'],
    function ($, _, Q, R, html) {
        'use strict';
       
       // Just take params for now
       /* TODO: use specific arguments */
       var factory = function (params) {
           
           var container = null;
           
           // Several ways of passing error information.
           var message = null;
           if (params.exception) {
               if (typeof params.exception === 'string') {
                   message = params.exception;
               } else if (params.exception.message) {
                   message = params.exception.message;
               } else {
                   message = 'Unknown exception';
               }
           }
           
           
           function attach(node) {
               container = $(node);
               container.append(render());
           }
           function detach() {
               container.empty();
           }
           
           function render() {
               var h1 = html.tag('h1'),
                   div = html.tag('div'),
                   p = html.tag('p');
               return div([
                   h1('Error!'),
                   p('An Error Occurred!!'),
                   p(message)
               ]);
           }
           
           
           function start() {
               
           }
           
           function stop() {
               
           }
           
           return {
               attach: attach,
               detach: detach,
               start: start,
               stop: stop               
           };
       };

        return {
            create: function (params) {
                return factory(params);
            }
        };
    });