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
    'q',    
    'kb.dom'
],
    function (q, DOM) {
        'use strict';
        return Object.create({}, {
           
            init: {
                value: function (cfg) {
                    return q.Promise(function (resolve) {
                        
                        if (this.onInit) {
                            this.onInit(cfg);
                        }
                        
                        resolve();
                    }.bind(this));
                }
            },
            
            attach: {
                value: function (node) {
                    return q.Promise(function (resolve) {
                        this.mount = node;
                        this.container = DOM.createElement('div');
                        DOM.append(this.mount, this.container);
                        
                        if (this.onAttach) {
                            this.onAttach(node);
                        }
                        
                        resolve();
                    }.bind(this));
                }
            },
            
            start: {
                value: function (params) {
                    return q.Promise(function (resolve) {                        
                        if (this.onStart) {
                            this.onStart(params);
                        }
                        resolve();
                    }.bind(this));
                }
            },
            
            run: {
                value: function (params) {
                    return q.Promise(function (resolve) {
                        if (this.onRun) {
                            this.onRun(params);
                        }
                        resolve();
                    }.bind(this));
                }
            },
            
            stop: {
                value: function () {
                    return q.Promise(function (resolve) {
                        if (this.onStop) {
                            this.onStop();
                        }
                        resolve();
                    }.bind(this));
                }
            },
            
            detach: {
                value: function () {
                    return q.Promise(function (resolve) {
                        if (this.onDetach) {
                            this.onDetach();
                        }
                        resolve();
                    }.bind(this));
                }
            },
            
            destroy: {
                value: function () {
                    return q.Promise(function (resolve) {
                        if (this.onDestroy) {
                            this.onDestroy();
                        }
                        resolve();
                    }.bind(this));
                }
            }
    });
});