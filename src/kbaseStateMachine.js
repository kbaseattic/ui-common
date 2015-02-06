define(['kb.utils'], function (Utils) {
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
      setItem: {
         value: function (key, value) {
            var listeners = this.listeners[key];
            var oldValue = Utils.getProp(this.state, key);
            if (listeners) {
               listeners.forEach(function (x) {
                  this.queue.addItem({
                     info: 'key: '+key+', value: '+value,
                     onrun: (function (fun, value, oldvalue, machine) {
                        return function () {
                           fun(value, oldvalue, machine);
                        }
                     })(x.hear, value, oldValue, this)
                  });
               }.bind(this));
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
            if (typeof cfg === 'function') {
               cfg = {hear: cfg};
            }
            if (!this.listeners.key) {
               this.listeners[key] = [];
            }
            this.listeners[key].push(cfg);
            if (this.hasItem(key)) {
               cfg.hear(this.getItem(key));
            }
            return this;
         }
      },
      ignore: {
         value: function (key, id) {}
      }
   });
   return StateMachine;
});