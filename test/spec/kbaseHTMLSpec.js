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
       /* Basic tests */
       it('creates a simple tag', function () {
           var div = html.tag('div'),
               divTagString = div('This is a div');
           expect(divTagString).toBe('<div>This is a div</div>');
       });
       it('create an empty tag given no arguments', function () {
           var div = html.tag('div'),
               divTagString = div();
           expect(divTagString).toBe('<div></div>');
       });
       it('create an empty tag given an empty string', function () {
           var div = html.tag('div'),
               divTagString = div('');
           expect(divTagString).toBe('<div></div>');
       });
       it('create an empty tag given an empty string and empty attributes', function () {
           var div = html.tag('div'),
               divTagString = div({},'');
           expect(divTagString).toBe('<div></div>');
       });
       it('create an empty tag given empty attributes', function () {
           var div = html.tag('div'),
               divTagString = div({});
           expect(divTagString).toBe('<div></div>');
       });
       
       /* Tests with attributes */
       it('create a tag with one attribute', function () {
            var div = html.tag('div'),
                s = div({attrib1: 'attrib1_value'});
            expect(s).toBe('<div attrib1="attrib1_value"></div>');
       });
       it('create a tag with two attributes', function () {
            var div = html.tag('div'),
                s = div({attrib1: 'attrib1_value', attrib2: 'attrib2_value'});
            expect(s).toBe('<div attrib1="attrib1_value" attrib2="attrib2_value"></div>');
       });
       it('create a tag with one attribute with numeric value', function () {
            var div = html.tag('div'),
                s = div({attrib1: 123});
            expect(s).toBe('<div attrib1="123"></div>');
       });
       it('create a tag with one attribute with boolean value of true', function () {
            var div = html.tag('div'),
                s = div({attrib1: true});
            expect(s).toBe('<div attrib1></div>');
       });
       it('create a tag with one attribute with boolean value of false', function () {
            var div = html.tag('div'),
                s = div({attrib1: false});
            expect(s).toBe('<div></div>');
       });
       
       /* Special case attributes */
       
       it('create a tag with a style attribute using extended form', function () {
            var div = html.tag('div'),
                s = div({style: {width: '100px'}});
            expect(s).toBe('<div style="width: 100px"></div>')
       });
       it('create a tag with a style attribute with two properties using extended form', function () {
            var div = html.tag('div'),
                s = div({style: {width: '100px', height: '200px'}});
            expect(s).toBe('<div style="width: 100px; height: 200px"></div>')
       });
       
   });
    
});

