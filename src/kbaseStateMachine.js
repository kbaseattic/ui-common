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
            var oldState = Utils.getProp(this.state, key);
            if (this.listeners[key]) {
               var newListeners = [];
               this.listeners[key].forEach(function (item) {
                  this.queue.addItem({
										onrun: (function (fun, value, oldvalue, machine) {
                        return function () {
                           try {
                              fun(value, oldvalue, machine);
                           } catch (ex) {
                              console.log('EX running onrun handler');
                              console.log(ex);
                           }
                        }
                     })(item.onSet, value, (oldState && oldState.value), this)
                  });
                  if (!item.oneTime) {
                     newListeners.push(item);
                  }
               }.bind(this));
               this.listeners[key] = newListeners;
            }
            
            Utils.setProp(this.state, key, {status: 'set', value: value, time: new Date()});
         }
      },
      getItem: {
         value: function (key, defaultValue) {
				 	var item = Utils.getProp(this.state, key);
				 	if (item) {
						 if (item.status === 'set') {
							 return item.value;
						 }
						 // what to do if not set?
					 } else {
						 return defaultValue;
					 }
         }
      },
      hasItem: {
         value: function (key) {
            return Utils.hasProp(this.state, key);
         }
      },
			setError: {
        value: function (key, err) {
				
           var oldState = Utils.getProp(this.state, key);
           if (this.listeners[key]) {
              var newListeners = [];
              this.listeners[key].forEach(function (item, machine) {
								
                 this.queue.addItem({
									 onrun: (function (fun, err, machine) {
                       return function () {
                          try {
                             fun(err); 
                          } catch (ex) {
                             console.log('EX running onrun handler');
                             console.log(ex);
                          }
                       }
                    })(item.onError, err, this)
                 });
                 if (!item.oneTime) {
                    newListeners.push(item);
                 }
              }.bind(this));
              this.listeners[key] = newListeners;
           }
           
           Utils.setProp(this.state, key, {status: 'error', error: err, time: new Date()});
        }
			},
			hasError: {
				value: function (key) {
					var item = Utils.getProp(this.state, key);
					if (item && item.status === 'error') {
						return true;
					} else {
						return false;
					}
				}
			},
      delItem: {
         value: function (key) {
					 Utils.deleteProp(this.state, key);
				 }
      },
      listen: {
         value: function (key, cfg) {
            return this.listenForItem(key, cfg);
         }
      },
      listenForItem: { 
         value: function (key, cfg) {
            if (typeof cfg === 'function') {
               cfg = {onSet: cfg};
            }
						var item = Utils.getProp(this.state, key);
             if (item) {							 
							 if (cfg.hear) {
	               cfg.hear(item.value);
	               if (cfg.oneTime) {
	                  return;
	               }
							 } else {
								 switch (item.status) {
								 case 'set':
									 cfg.onSet(item.value);
									 break;
								 case 'error':
									 cfg.onError(item.error);
									 break;
								 default:
									 throw 'Invalid status: ' + item.status;
								 }
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
         value: function (key, timeout) {
            var p =  Q.Promise(function (resolve, reject, notify) {
               if (Utils.hasProp(this.state, key)) {
								 var item = Utils.getProp(this.state, key);
								 if (item.status === 'error') {
									 reject(item.error);
								 } else {
									 resolve(item.value);
								}
               } else {
                  this.listenForItem(key, {
                     oneTime: true,
                     addedAt: (new Date()).getTime(),
                     onSet: function (value) {
                        resolve(value);
                     },
										 onError: function (err) {
											 reject(err);
										 }
                  });
               }
            }.bind(this));
						if (timeout) {
							return p.timeout(timeout);
						} else {
							return p;
						}
         }
      },
      ignore: {
         value: function (key, id) {
         }
      }
   });
   return StateMachine;
});