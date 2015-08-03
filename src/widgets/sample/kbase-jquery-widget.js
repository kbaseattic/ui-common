/**
 * @author Bill Riehl <wjriehl@lbl.gov>, Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */
/*global
 define, console
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'kb.runtime',
    'kb.html',
    'jquery',
    'q',
    'uuid',
    'kb.service.workspace',
    'kb.service.ujs',
    'kb.easytree',
    'kb.jquery.authenticatedwidget'
],
    function (R, html, $, Q, uuid, Workspace, UserAndJobState, EasyTree) {
        'use strict';
        $.KBWidget({
            name: 'SampleWidget',
            parent: 'kbaseAuthenticatedWidget',
            version: '0.0.1',
            options: {
            },
            init: function (options) {
                console.log('init...');
                this._super(options);
                this.render();
                return this;
            },
            render: function () {
                console.log('render...');

                this.$elem.html('This jquery widget has been rendered...');
            },
            getData: function () {
                console.log('get data...');
                return {
                    name: 'mydata',
                    description: 'This is my data'
                };
            },
            getState: function () {
                console.log('get state...');
                return {
                    something: 'This is some state'
                };
            },
            loadState: function (state) {
                console.log('load state...');
            }

        });
    });