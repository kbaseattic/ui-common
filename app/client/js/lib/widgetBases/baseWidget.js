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
    'bluebird',
    'kb.dom',
    'kb.html',
    'kb.runtime',
    'kb.widget.kbwidgetadapter',
    'kb.widget.widgetadapter'
],
    function (Promise, DOM, html, R, kbWidgetAdapterFactory, widgetAdapterFactory) {
        'use strict';

        var div = html.tag('div');

        return Object.create({}, {
            // Widget management

            getWidgets: {
                value: function () {
                    if (this.widgets === undefined) {
                        this.widgets = [];
                    }
                    return this.widgets;
                }
            },
            addWidget: {
                value: function (widget) {
                    if (this.widgets === undefined) {
                        this.widgets = [];
                    }
                    var id = html.genId();
                    this.widgets.push({
                        id: id,
                        widget: widget
                    });
                    return div({id: id});
                }
            },
            addFactoryWidget: {
                value: function (def) {
                    this.addWidget(def.widget);
                }
            },
            addKBWidget: {
                value: function (config) {
                    this.addWidget(kbWidgetAdapterFactory.make(config));
                }
            },
            addObjectWidget: {
                value: function (config) {
                    this.addWidget(widgetAdapterFactory.make(config));
                }
            },
            // Runtime convenience.

            setTitle: {
                value: function (title) {
                    R.send('app', 'title', title);
                }
            },
            
            setContent: {
                value: function (content) {
                    this.content = content;
                    this.dirty = true;
                }
            },
            getContent: {
                value: function () {
                    return this.content;
                }
            },
            hasContent: {
                value: function () {
                    if (this.content) {
                        return true;
                    }
                    return false;
                }
            },
            placeContent: {
                value: function () {
                    if (this.dirty) {
                        if (this.content) {
                            this.container.innerHTML = this.content;
                        } else {
                            this.container.innerHTML = '';
                        }
                        this.dirty = false;
                    }
                }
            },
            
            //  Heartbeat 
            
            refreshInterval: {
                get: function () {
                    if (this._refreshInterval) {
                        return this._refreshInterval;
                    }
                    return 500;
                },
                set: function (newValue) {
                    this._refreshInterval = newValue;
                }
            },
            
            // Message Bus
            
            receiving: {
                get: function () {
                    if (this._receiving === undefined) {
                        this._receiving = []
                    }
                    return this._receiving;
                }
            },
            recv: {
                value: function (channel, message, fun) {
                    this.receiving.push(R.recv(channel, message, fun));
                }
            },
            dropAll: {
                value: function () {
                    this.receiving.forEach(function (listener) {
                        R.drop(listener);
                    });
                }
            },
            
            // Widget API

            onInitWrapper: {
                value: function (cfg) {
                    if (this.onInit) {
                        return this.onInit(cfg);
                    }
                }
            },
            init: {
                value: function (cfg) {
                    return new Promise(function (resolve, reject) {
                        Promise.resolve(this.onInitWrapper(cfg))
                            .then(function () {
                                Promise.all(this.getWidgets().map(function (w) {
                                    return w.widget.init(cfg);
                                }))
                                    .then(function () {
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        reject({
                                            message: 'Error initializing widgets',
                                            error: err
                                        });
                                    })
                                    .done();
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error initializing panel',
                                    error: err
                                });
                            })
                            .done();
                    }.bind(this));
                }
            },
            onAttachWrapper: {
                value: function (container) {
                    if (this.onAttach) {
                        return this.onAttach(container);
                    } else {
                        return false;
                    }
                }
            },
            attach: {
                value: function (node) {
                    return new Promise(function (resolve, reject) {
                        this.mount = node;
                        this.container = DOM.createElement('div');
                        this.mount.appendChild(this.container);
                        Promise.resolve(this.onAttachWrapper(this.container))
                            .then(function () {
                                this.placeContent();
                                Promise.all(this.getWidgets().map(function (w) {
                                    return w.widget.attach(DOM.getById(w.id));
                                }))
                                    .then(function () {
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        console.log('ERROR?');
                                        console.log(err);
                                        reject({
                                            message: 'Error attaching widgets',
                                            error: err
                                        });
                                    })
                                    .done();
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error attaching panel',
                                    error: err
                                });
                            })
                            .done();
                    }.bind(this));
                }
            },
            onStartWrapper: {
                value: function (params) {
                    this.lastRefresh = Date.now();
                       this.recv('app', 'heartbeat', function () {
                           var now = Date.now(),
                               elapsed = now - this.lastRefresh;
                           if (elapsed > this.refreshInterval) {
                               this.lastRefresh = now;
                               if (this.onRefresh) {
                                   this.onRefresh(elapsed);
                               }       
                           }
                    }.bind(this));
                    if (this.onStart) {
                        this.onStart(params);
                    }
                }
            },
            start: {
                value: function (params) {
                   return new Promise(function (resolve, reject) { 
                        Promise.resolve(this.onStartWrapper(params))
                            .then(function () {
                                this.placeContent();
                                Promise.all(this.getWidgets().map(function (w) {
                                    return w.widget.start(params);
                                }))
                                    .then(function () {
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        reject({
                                            message: 'Error starting widgets',
                                            error: err
                                        });
                                    })
                                    .done();
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error starting panel',
                                    error: err
                                });
                            })
                            .done();
                    }.bind(this));
                }
            },
            onRunWrapper: {
                value: function (params) {
                    if (this.onRun) {
                        return this.onRun(params);
                    }
                }
            },
            run: {
                value: function (params) {
                   return new Promise(function (resolve, reject) {                        
                        Promise.resolve(this.onRunWrapper(params))
                            .then(function () {
                                this.placeContent();
                                Promise.all(this.getWidgets().map(function (w) {
                                    return w.widget.run(params);
                                }))
                                    .then(function () {
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        reject({
                                            message: 'Error running widgets',
                                            error: err
                                        });
                                    })
                                    .done();
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error running panel',
                                    error: err
                                });
                            })
                            .done();
                    }.bind(this));
                }
            },
            onStopWrapper: {
                value: function () {
                    this.dropAll();
                    if (this.onStop) {
                        return this.onStop();
                    }
                }
            },
            stop: {
                value: function () {
                   return new Promise(function (resolve, reject) {                        
                        Promise.resolve(this.onStopWrapper())
                            .then(function () {
                                Promise.all(this.getWidgets().map(function (w) {
                                    return w.widget.stop();
                                }))
                                    .then(function () {
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        reject({
                                            message: 'Error stopping widgets',
                                            error: err
                                        });
                                    })
                                    .done();
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error stopping panel',
                                    error: err
                                });
                            })
                            .done();
                    }.bind(this));
                }
            },
            onDetachWrapper: {
                value: function () {
                    if (this.onDetach) {
                        return this.onDetach();
                    }
                }
            },
            detach: {
                value: function () {
                   return new Promise(function (resolve, reject) {
                        Promise.resolve(this.onDetachWrapper())
                            .then(function () {
                                Promise.all(this.getWidgets().map(function (w) {
                                    return w.widget.detach();
                                }))
                                    .then(function () {
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        reject({
                                            message: 'Error detaching widgets',
                                            error: err
                                        });
                                    })
                                    .done();
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error detaching panel',
                                    error: err
                                });
                            })
                            .done();
                    }.bind(this));
                }
            },
            onDestroyWrapper: {
                value: function () {
                    if (this.onDestroy) {
                        return this.onDestroy();
                    }
                }
            },
            destroy: {
                value: function () {
                   return new Promise(function (resolve, reject) {
                        Promise.resolve(this.onDestroyWrapper())
                            .then(function () {
                                Promise.all(this.getWidgets().map(function (w) {
                                    return w.widget.destroy();
                                }))
                                    .then(function () {
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        reject({
                                            message: 'Error destroying widgets',
                                            error: err
                                        });
                                    })
                                    .done();
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error destroying panel',
                                    error: err
                                });
                            })
                            .done();
                    }.bind(this));
                }
            }
        });
    });