/*global
  define, describe, expect, it
 */
/*jslint
   browser: true,
   white: true
 */
define(['kb.html'], function (html) {
   'use strict';
   describe('A kbase html utility library', function () {
       it('should create a simple tag', function () {
           var div = html.tag('div'),
               divTagString = div('This is a div');
           expect(divTagString).toBe('<div>This is a div</div>');
       });
       it('should create an empty tag given no arguments', function () {
           var div = html.tag('div'),
               divTagString = div();
           expect(divTagString).toBe('<div></div>');
       });
       it('should create an empty tag given an empty string', function () {
           var div = html.tag('div'),
               divTagString = div('');
           expect(divTagString).toBe('<div></div>');
       });
       it('should create an empty tag given an empty string and empty attributes', function () {
           var div = html.tag('div'),
               divTagString = div({},'');
           expect(divTagString).toBe('<div></div>');
       });
       it('should create an empty tag given empty attributes', function () {
           var div = html.tag('div'),
               divTagString = div({});
           expect(divTagString).toBe('<div></div>');
       });
   });
    
});

