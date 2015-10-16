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
            
            
            // Widget API

            onInitWrapper: {
                value: function (cfg) {
                    return new Promise(function (resolve) {
                        if (this.onInit) {
                            this.onInit(cfg);
                        }
                        resolve();
                    }.bind(this));
                }
            },
            init: {
                value: function (cfg) {
                    return new Promise(function (resolve, reject) {
                        this.onInitWrapper(cfg)
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
                                    });
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error initializing panel',
                                    error: err
                                });
                            });
                    }.bind(this));
                }
            },
            onAttachWrapper: {
                value: function (container) {
                    return new Promise(function (resolve) {
                        if (this.onAttach) {
                            this.onAttach(container);
                        }
                        resolve();
                    }.bind(this));
                }
            },
            attach: {
                value: function (node) {
                    return new Promise(function (resolve, reject) {
                        this.mount = node;
                        this.container = DOM.createElement('div');
                        this.mount.appendChild(this.container);
                        this.onAttachWrapper(this.container)
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
                                    });
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error attaching panel',
                                    error: err
                                });
                            });
                    }.bind(this));
                }
            },
            onStartWrapper: {
                value: function (params) {
                    return new Promise(function (resolve) {
                        if (this.onStart) {
                            this.onStart(params);
                        }
                        resolve();
                    }.bind(this));
                }
            },
            start: {
                value: function (params) {
                   return new Promise(function (resolve, reject) {
                        this.onStartWrapper(params)
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
                                    });
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error starting panel',
                                    error: err
                                });
                            });
                    }.bind(this));
                }
            },
            onRunWrapper: {
                value: function (params) {
                    return new Promise(function (resolve) {
                        if (this.onRun) {
                            this.onRun(params);
                        }
                        resolve();
                    }.bind(this));
                }
            },
            run: {
                value: function (params) {
                   return new Promise(function (resolve, reject) {
                        this.onRunWrapper(params)
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
                                    });
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error running panel',
                                    error: err
                                });
                            });
                    }.bind(this));
                }
            },
            onStopWrapper: {
                value: function () {
                    return new Promise(function (resolve) {
                        if (this.onStop) {
                            this.onStop();
                        }
                        resolve();
                    }.bind(this));
                }
            },
            stop: {
                value: function () {
                   return new Promise(function (resolve, reject) {
                        this.onStopWrapper()
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
                                    });
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error stopping panel',
                                    error: err
                                });
                            });
                    }.bind(this));
                }
            },
            onDetachWrapper: {
                value: function () {
                    return new Promise(function (resolve) {
                        if (this.onDetach) {
                            this.onDetach();
                        }
                        resolve();
                    }.bind(this));
                }
            },
            detach: {
                value: function () {
                   return new Promise(function (resolve, reject) {
                        this.onDetachWrapper()
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
                                    });
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error detaching panel',
                                    error: err
                                });
                            });
                    }.bind(this));
                }
            },
            onDestroyWrapper: {
                value: function () {
                    return new Promise(function (resolve) {
                        if (this.onDestroy) {
                            return this.onDestroy();
                        }
                        resolve();
                    }.bind(this));
                }
            },
            destroy: {
                value: function () {
                   return new Promise(function (resolve, reject) {
                        this.onDestroyWrapper()
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
                                    });
                            }.bind(this))
                            .catch(function (err) {
                                reject({
                                    message: 'Error destroying panel',
                                    error: err
                                });
                            });
                    }.bind(this));
                }
            }
        });
    });