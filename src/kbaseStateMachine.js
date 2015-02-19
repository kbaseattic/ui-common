define(['kb.utils', 'q'], function (Utils, Q) {
   "use strict";
   /**
   A simple first in last out (FILO) job stack which is allowed to build up for some amount of time, after
   which the jobs (functions) are run.
   */
   var AsyncQueue = Object.create({}, {
      init: {
         value: function (cfg) {
            this.queue = [];
            this.running = false;
            return this;
         }
      },
      addItem: {
         value: function (item, options) {
            this.queue.push(item);
            this.run();
         }
      },
      run: {
         value: function () {
            if (this.running) {
               return
            };
            this.running = true;
            var that = this;
            this.timer = window.setTimeout(function () {
               that.processQueue();
            }.bind(this), 100);
         }
      },
      processQueue: {
         value: function () {
            // NB need the item declaration outside of the while loop
            var item;
            while (item = this.queue.shift()) {
               try {
                  item.onrun();
               } catch (e) {
                  console.log('ERROR');
                  console.log(e);
                  if (item.onerror) {
                     try {
                        item.onerror(e); 
                     } catch (e) {
                        console.log('ERROR runing onerror');
                        console.log(e);
                     }
                  }
               }
            }
            this.queue = [];
            this.running = false;
         }
      }

   });
   

   var StateMachine = Object.create({}, {
      init: {
         value: function (cfg) {
            this.state = {};
            this.listeners = {};
            this.queue = Object.create(AsyncQueue).init();
            return this;
         }
      },
      version: {
         value: '0.0.1',
         writable: false
      },

      setItem: {
         value: function (key, value) {
            var oldValue = Utils.getProp(this.state, key);
            if (this.listeners[key]) {
               var newListeners = [];
               this.listeners[key].forEach(function (item) {
                  this.queue.addItem({
                     info: {key: key, value: value},
                     onrun: (function (fun, value, oldvalue, machine) {
                        return function () {
                           try {
                              fun(value, oldvalue, machine);
                           } catch (ex) {
                              console.log('EX running onrun handler');
                              console.log(ex);
                           }
                        }
                     })(item.hear, value, oldValue, this)
                  });
                  if (!item.oneTime) {
                     newListeners.push(item);
                  }
               }.bind(this));
               this.listeners[key] = newListeners;
            }
            
            Utils.setProp(this.state, key, value);
         }
      },
      getItem: {
         value: function (key, defaultValue) {
            return Utils.getProp(this.state, key, defaultValue);
         }
      },
      hasItem: {
         value: function (key) {
            return Utils.hasProp(this.state, key);
         }
      },
      delItem: {
         value: function (key) {}
      },
      listen: {
         value: function (key, cfg) {
            return this.listenForItem(key, cfg);
         }
      },
      listenForItem: { 
         value: function (key, cfg) {
            if (typeof cfg === 'function') {
               cfg = {hear: cfg};
            }
             if (this.hasItem(key)) {
               cfg.hear(this.getItem(key));
               if (cfg.oneTime) {
                  return;
               }
            }
            if (this.listeners[key] === undefined) {
               this.listeners[key] = [];
            }
            this.listeners[key].push(cfg);
            return this;
         }
      },
      whenItem: {
         // This differs from listen in that it returns a promise that is 
         // fulfilled either now (the item is available) or when it is
         // first set (via a set of one-time listeners).
         value: function (key) {
            return Q.Promise(function (resolve, reject, notify) {
               if (this.hasItem(key)) {
                  resolve(this.getItem(key));
               } else {
                  this.listenForItem(key, {
                     oneTime: true,
                     addedAt: (new Date()).getTime(),
                     hear: function (value) {
                        resolve(value);
                     }
                  });
               }
            }.bind(this));
         }
      },
      ignore: {
         value: function (key, id) {
         }
      }
   });
   return StateMachine;
});