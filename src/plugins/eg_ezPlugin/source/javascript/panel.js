/*global
 define, require
 */
/*jslint
 browser: true,
 white: true
 */
define([
    'bluebird',
    'kb_panelBases_widgetPanel',
    'kb.dom',
    'kb.html',
    'kb_widgetBases_simpleWidget',
    'kb_widgetBases_baseWidget',
    'kb.runtime',
    'kb_widget_eg_ezPanel_myDataWidget',
    'kb_widget_eg_ezPanel_dataWidget'
], function (Promise, WidgetPanel, DOM, html, SimpleWidget, BaseWidget, R, myDataWidget, dataWidget) {
    'use strict';
    
    var myWidget1 = Object.create(SimpleWidget, {
        onInit: {
            value: function (config) {
                this.refreshInterval = 1000;
                this.setContent('Hi, I am a real widget');
            }
        },
        onRefresh: {
            value: function (elapsed) {
                this.setContent((new Date()));
            }
        }
    });
    
    var myWidget2 = Object.create(SimpleWidget, {
        onInit: {
            value: function (config) {
                this.refreshInterval = 3000;
                this.setContent('Hi, I am another real widget');
            }
        },
        onRefresh: {
            value: function (elapsed) {
                this.setContent((new Date()));
            }
        }
    });
    
    var myWidget3 = Object.create(BaseWidget, {       
        onInit: {
            value: function (container) {
                this.refreshInterval = 500;           
                var div = html.tag('div');
                this.myElapsedId = html.genId();
                this.content = div([
                    div({id: this.myElapsedId}),
                    this.addWidget(myWidget31),
                    this.addWidget(myWidget32)
                ]);                
            }
        },
        onAttach: {
            value: function (container) {
                return new Promise(function (resolve) {
                    var self = this;
                    window.setTimeout(function () {
                        self.container.innerHTML = self.content;
                        resolve();
                    }, 1000);
                }.bind(this));
            }
        },
        onRefresh: {
            value: function (elapsed) {
                var div = DOM.getById(this.myElapsedId);
                if (div) {
                    div.innerHTML = 'elapsed: ' + elapsed;
                    this.lastRefresh = Date.now();
                }
            }
        }
    });
    
    var myWidget31 = Object.create(BaseWidget, {
        onStart: {
            value: function (params) {
                this.container.innerHTML = 'I am widget 31';
            }
        }
    });
    
    var myWidget32 = Object.create(BaseWidget, {
        onAttach: {
            value: function (container) {
                container.innerHTML = 'And me? I am # 32';
            }
        }
    });
    
    return Object.create(WidgetPanel, {
        
        onInit: {
            value: function (config) {
                // can use this config, or this.config, the same thing.
                //this.setRendered('See, I could render here if i do not need params for it.');
                var div = html.tag('div'), 
                    p = html.tag('p'),
                    i = html.tag('i'),
                    h1 = html.tag('h1'),
                    panel = html.bsPanel;
                
                var content = div([
                    div({class: 'row'}, [
                        div({class: 'col-md-6'}, [
                            h1('EZ Panel'),
                            p(['This is an ', i('EZ Panel'),'. What makes it EZ is that it uses a base object which implements the widget lifecycle api, so it does not have to'])
                        ]), 
                        div({class: 'col-md-6'}, [
                            panel('EZ Panel', 'I was set in onInit'),
                            panel('Widget 1', this.addWidget(myWidget1)),
                            panel('Widget 2', this.addWidget(myWidget2)),
                            panel('Widget 3', this.addWidget(myWidget3))                            
                        ])
                    ]),
                    div({class: 'row'}, [
                        div({class: 'col-md-12'}, [
                            panel('Widget 4', this.addWidget(Object.create(dataWidget)))
                        ])
                    ])
                ]);
                
                this.setContent(content);
            }
        },
        
        onAttach: {
            value: function (container) {
                // can use container, or this.container, same thing.
                //this.setRendered('Or, I could rendered upon attach too.');
                console.log('on attach');
            }
        },
        
        onStart: {
            value: function (params) {
                //this.setRendered('Finally, I could render here, if I need params for it...')
                console.log('on start');
            }
        }
    });
});