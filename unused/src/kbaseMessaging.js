/*global
 define
 */
/*jslint
 browser: true,
 white: true
 */
define([], function () {
    'use strict';
    var Module = Object.create({});
    Module.version = '0.0.2';

    // Utilities

    // OID Service: Each managed object is assigned an OID. Useful
    // for various things where we need to address an object by 
    // a unique (for this browser session) string. E.g. events.

    // Meant to be used as a singular (singleton) object.

    var ID = (function () {
        var id = 0;
        return {
            current: function () {
                return id;
            },
            next: function () {
                id += 1;
                return 'oid_' + id;
            }
        };
    }());


    /* MESSAGES 
     var Message = function () {
     var id, from, to, data, broadcast, oid;
     function getId
     function create(msg) {
     id = msg.id;
     from = msg.from;
     data = msg.data;
     broadcast = msg.broadcast;
     oid = id.next();
     return {
     
     }
     
     }
     }
     */

    var Message = Object.create({}, {
        id: {
            value: null, writable: true
        },
        broadcast: {
            value: false, writable: true
        },
        init: {
            value: function (config) {
                if (config) {
                    this.id = config.id;
                    this.from = config.from;
                    this.to = config.to;
                    this.data = config.data;
                    this.broadcast = config.broadcast;
                    this.oid = ID.next();
                }
                return this;
            }
        }
    });
    Module.Message = Message;

    // Holds all info needed to handle a message.
    // Each message handler holds an array of applets that
    // want to receive this message. 
    var MessageHandler = Object.create({}, {
        /*applets: {
         value: {}, writable: true
         },
         */
        init: {
            value: function () {
                this.targets = {};
                this.listeners = [];
                return this;
            }
        },
        addTarget: {
            value: function (targetConfig) {
                if (targetConfig.id) {
                    if (!this.targets[targetConfig.id]) {
                        this.targets[targetConfig.id] = targetConfig;
                    }
                }
                this.listeners.push(targetConfig);
                return this;
            }
        },
        removeTarget: {
            value: function () {
                // To be done.
            }
        },
        clearTargets: {
            value: function () {
                this.targets = [];
            }
        },
        getTargets: {
            value: function () {
                return this.targets;
            }
        }
    });
    Module.MessageHandler = MessageHandler;

    var MessageQueue = Object.create({}, {
        /* Instance properties 
         messages: Array
         app: reference to the app that owns this.
         
         */

        /*
         messages: {
         value: [], writable: true
         },
         app: {
         value: null, writable: true
         },
         */
        /* Object Properties */
        sendRate: {
            // Rate at which to send messages. The value is the # of messages
            // per second. Set to null for no limit (all pending messages sent
            // at once).
            value: 60, writable: true
        },
        lastMessageTime: {
            // Last time a message was sent.
            value: null, writable: true
        },
        messageProcessedCount: {
            value: 0, writable: true
        },
        timer: {
            // Holds the current timer, if any.
            value: null, writable: true
        },
        /* Init */
        init: {
            value: function (cfg) {
                this.messages = [];
                this.app = cfg.app;
                return this;
            }
        },
        /* Methods */
        addMessage: {
            value: function (msg) {
                // We don't look up anything when we get the message
                // we do this when handling.
                this.messages.unshift(msg);
                this.ensureTimer();
                return this;
            }
        },
        handleError: {
            value: function (error, msg, targetObject, funName) {
                // Do nothing now.
                alert("Error is " + error + " for message: " + msg.id + ", target " + targetObject + ", fun " + funName);
            }
        },
        processMessage: {
            value: function (msg) {
                // loop through the registered applets, calling the method for
                // each one with the message data.
                // var applet = this.app.getApplet(msg.from);
                // alert("Processing message "+msg.id);
                var handler = this.app.getMessageHandler(msg.id);
                //if (msg.id === "domready") {
                //	alert("Processing domready:"+handler);
                //}
                if (handler) {
                    if (msg.broadcast) {
                        var msgq = this, i;
                        var target, targetObject, filter, pass;
                        for (i = 0; i < handler.listeners.length; i += 1) {
                            target = handler.listeners[i];

                            if (target) {
                                pass = true;
                            }

                            if (target.filter && pass) {
                                pass = false;
                                // Hmm, filters.
                                // Does the sender match one we are interested in?
                                if (target.filter.from) {
                                    if (target.filter.from === msg.from) {
                                        pass = true;
                                    } else {
                                        pass = false;
                                    }
                                }

                                if (target.filter.to) {
                                    if (target.filter.to === msg.to) {
                                        pass = true;
                                    } else {
                                        pass = false;
                                    }
                                }

                                if (target.filter.source) {
                                    if (target.filter.source === msg.source) {
                                        pass = true;
                                    } else {
                                        pass = false;
                                    }
                                }
                            }
                            if (pass) {
                                try {
                                    target.receive(msg);
                                } catch (e) {
                                    msgq.handleError(e, msg, i, target.receive);
                                } finally {
                                    msgq.lastMessageTime = (new Date()).getTime();
                                    msgq.messageProcessedCount += 1;
                                }
                            }
                        }
                    } else {
                        var targetId = msg.to;
                        //if (typeof targetId != "string") {
                        var target = handler.targets[targetId];
                        if (!target) {
                            return;
                        }
                        if (target.receive) {
                            try {
                                target.receive(msg);
                            } catch (e) {
                                this.handleError(e, msg, targetId, target.receive);
                            } finally {
                                this.lastMessageTime = (new Date()).getTime();
                                this.messageProcessedCount++;
                            }
                        }
                    }
                }
                return this;
            }
        },
        processQueue: {
            value: function () {
                // alert("processing..." + this.messages.length);
                //var msg = this.messages.pop();
                //this.checkTimer();
                //this.processMessage(msg);

                // Only process one message at a time if we have a rate limited
                // message queue.
                if (this.sendRate) {
                    if (this.messages.length > 0) {
                        this.processMessage(this.messages.pop());
                    }
                    this.checkTimer();
                } else {
                    while (this.messages.length > 0) {
                        this.processMessage(this.messages.pop());
                    }
                    this.checkTimer();
                }
            }
        },
        getMessages: {
            value: function () {
                return this.messages;
            }
        },
        clearQueue: {
            value: function () {
                this.messages = [];
                return this;
            }
        },
        cancelTimer: {
            value: function () {
                if (this.timer) {
                    window.clearTimeout(this.timer);
                    delete this.timer;
                }
                return this;
            }
        },
        startTimer: {
            value: function (fun) {
                var interval;
                if (this.sendRate) {
                    interval = this.sendRate / 1000;
                } else {
                    interval = 0;
                }
                this.timer = window.setTimeout(fun, interval);
                return this;
            }
        },
        isTimer: {
            value: function () {
                if (this.timer) {
                    return true;
                } 
                return false;
            }
        },
        ensureTimer: {
            // RUN WHENEVER A MESSAGE IS ADDED
            // Set up the timer based on the sendRate and the
            // length of the queue. 
            // If there is no queue, we don't set the timer, the timer is always
            // created when the first new message is queued.
            // If there is a sendRate, we set the timer to rate/1000. If there
            // is no sendRate, we use the default timerInterval.
            value: function () {
                if (this.messages.length > 0) {
                    // We don't know if a timer is active -- if it is we assume it has been
                    // set by a previous add, and we leave it alone.
                    if (!this.isTimer()) {
                        var that = this;
                        this.startTimer(function () {
                            that.handleMessageTimer();
                        });
                    }
                } else {
                    this.cancelTimer();
                }
                return this;
            }
        },
        checkTimer: {
            // RUN AFTER QUEUE IS PROCESSED
            // Set up the timer based on the sendRate and the
            // length of the queue. 
            // If there is no queue, we don't set the timer, the timer is always
            // created when the first new message is queued.
            // If there is a sendRate, we set the timer to rate/1000. If there
            // is no sendRate, we use the default timerInterval.
            value: function () {
                if (this.messages.length > 0) {
                    // This blanks out the timer, and if by some twisted logic it is 
                    // still active it will be cancelled.
                    this.cancelTimer();
                    var that = this;
                    this.startTimer(function () {
                        that.handleMessageTimer();
                    });
                } else {
                    this.cancelTimer();
                }
                return this;
            }
        },
        // Called by the timer.
        handleMessageTimer: {
            value: function () {
                // Process the queue
                this.processQueue();
                return this;
            }
        }
    });
    Module.MessageQueue = MessageQueue;


    var MessageManager = Object.create({}, {
        /*
         instance properties:
         messageQueue: MessageQueue object
         messageHandlers: Object
         */

        // Lifecycle
        init: {
            value: function (config) {
                if (config === undefined) {
                    config = {};
                }
                this.messageQueue = Object.create(MessageQueue).init({app: this, timerInterval: config.interval});
                this.messageHandlers = {};
                return this;
            }
        },
        start: {
            value: function () {
                return this;
            }
        },
        stop: {
            value: function () {
                return this;
            }
        },
        // Messages
        setMessageQueue: {
            value: function (q) {
                this.messageQueue = q;
            }
        },
        on: {
            value: function (messageId, config) {
                // See if there is a message handler for this messageId.
                var handler = this.messageHandlers[messageId];

                // If so, add the applet to it.
                if (!handler) {
                    handler = Object.create(MessageHandler, {id: {value: messageId}}).init();
                    this.messageHandlers[messageId] = handler;
                }
                // The target fun is either targetConfig.callback or is "on"+messageId.
                if (!config) {
                    throw new Error('No message handler supplied');                    
                }
                if (typeof config ==='function') {
                    config = {receive: config};
                } else if (!config.receive) {
                    throw new Error('Missing message handler configuration');
                }

                // Ensure our target has an id. If it doesn't, it can't 
                // be the target of an individual message, it can only 
                // get broadcasts.

                //if (!config.id) {
                //	config.id = ID.nextID();
                //}

                handler.addTarget(config);
            }
        },
        getMessageHandler: {
            value: function (messageId) {
                return this.messageHandlers[messageId];
            }
        },
        broadcast: {
            value: function (messageId, data, from) {
                var msg;
                if (typeof messageId === 'string') {
                    msg = Object.create(Message).init({
                        id: messageId,
                        from: from,
                        broadcast: true,
                        data: data
                    });
                } else {
                    msg = messageId;
                    msg.broadcast = true;
                }
                this.messageQueue.addMessage(msg);
            }
        },
        send: {
            value: function (messageId, targetId, from) {
                var msg;
                if (typeof messageId === 'string') {
                    msg = Object.create(Message).init({
                        id: messageId,
                        from: from,
                        to: targetId
                    });
                } else {
                    msg = messageId;
                }
                this.messageQueue.addMessage(msg);
            }
        }

    });
    Module.MessageManager = MessageManager;

    return Module;
});