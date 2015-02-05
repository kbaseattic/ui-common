define(['q'],
   function (Q) {
      "use strict";
      var Utils = Object.create({}, {
         getProp: {
            value: function (obj, prop, defaultValue) {
               var props = prop.split('.');

               var temp = obj;
               for (var i = 0; i < props.length; i++) {
                  var key = props[i];
                  if (temp[key] === undefined) {
                     return defaultValue;
                  } else {
                     temp = temp[key];
                  }
               }
               return temp;
            }
         },

         hasProp: {
            value: function (obj, prop) {
               var props = prop.split('.');

               var temp = obj;
               for (var i = 0; i < props.length; i++) {
                  var key = props[i];
                  if (temp[key] === undefined) {
                     return false
                  } else {
                     temp = temp[key];
                  }
               }
               return true;
            }
         },

         setProp: {
            value: function (object, path, value) {

               if (typeof path === 'string') {
                  path = path.split('.');
               }

               var key = path.pop();

               for (var i = 0; i < path.length; i++) {
                  if (object[path] === undefined) {
                     object[path] = {};
                  }
                  object = object[path];
               }

               object[key] = value;
            }
         },
         
         incrProp: {
            value: function (object, path, value) {

               if (typeof path === 'string') {
                  path = path.split('.');
               }

               var key = path.pop();

               for (var i = 0; i < path.length; i++) {
                  if (object[path] === undefined) {
                     object[path] = {};
                  }
                  object = object[path];
               }
               
               if (object[key] === undefined) {
                  object[key] = value?value:1;
               } else {
                  object[key] += value?value:1;
               }
            }

         },

         deleteProp: {
            value: function (path, name) {
               if (typeof path === 'string') {
                  path = path.split('.');
               }
               for (var i = 0; i < path.length; path++) {
                  if (!rec[path[i]]) {
                     return
                  }
                  rec = rec[path[i]];
               }
               delete rec[name];
            }
         },

         promise: {
            value: function (client, method, arg1) {
               return Q.Promise(function (resolve, reject, notify) {
                  if (!client[method]) {
                     throw 'Invalid KBase Client call; method "' + method +'" not found in client "'+client.constructor+'"';
                  }
                  client[method](arg1,
                     function (result) {
                        resolve(result);
                     },
                     function (err) {
                        reject(err);
                     });
               });
            }
         },

         getSchemaNode: {
            value: function (schema, propPath) {
               var props = propPath.split('.');
               // doesn't handle arrays now.
               for (var i = 0; i < props.length; i++) {
                  var prop = props[i];
                  // Get the node.
                  switch (schema.type) {
                  case 'object':
                     var field = schema.properties[prop];
                     if (!field) {
                        throw 'Field ' + prop + ' in ' + propPath + ' not found.';
                     }
                     schema = field;
                     break;
                  case 'string':
                  case 'integer':
                  case 'boolean':
                  default:
                     throw 'Cannot get a node on type type ' + schema.type;
                  }
               }

               return schema;
            }
         },

         isBlank: {
            value: function (value) {
               if (value === undefined) {
                  return true;
               } else if (typeof value === 'object') {
                  if (value === null) {
                     return true;
                  } else if (value.push && value.pop) {
                     if (value.length === 0) {
                        return true;
                     }
                  } else {
                     if (value.getOwnPropertyNames().length === 0) {
                        return true;
                     }
                  }
               } else if (typeof value === 'string' && value.length === 0) {
                  return true;
               }
               return false;
            }
         },

         merge: {
            value: function (objA, objB) {
               var Merger = {
                  init: function (obj) {
                     this.dest = obj;
                     return this;
                  },
                  getType: function (x) {
                     var t = typeof x;
                     if (t === 'object') {
                        if (x === null) {
                           return 'null';
                        } else if (x.pop && x.push) {
                           return 'array';
                        } else {
                           return 'object';
                        }
                     } else {
                        return t;
                     }
                  },
                  merge: function (dest, obj) {
                     this.dest = dest;
                     switch (this.getType(obj)) {
                     case 'string':
                     case 'integer':
                     case 'boolean':
                     case 'null':
                        throw "Can't merge a '" + (typeof val) + "'";
                        break;
                     case 'object':
                        return this.mergeObject(obj);
                        break;
                     case 'array':
                        return this.mergeArray(obj);
                        break;
                     default:
                        throw "Can't merge a '" + (typeof val) + "'";
                     }

                  },
                  mergeObject: function (obj) {
                     var keys = Object.keys(obj);
                     for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var val = obj[key];
                        var t = this.getType(val);
                        switch (t) {
                        case 'string':
                        case 'number':
                        case 'boolean':
                        case 'null':
                           this.dest[key] = val;
                           break;
                        case 'object':
                           if (!this.dest[key]) {
                              this.dest[key] = {};
                           }
                           this.dest[key] = Object.create(Merger).init(this.dest[key]).mergeObject(obj[key]);
                           break;
                        case 'array':
                           if (!this.dest[key]) {
                              this.dest[key] = [];
                           } else {
                              this.dest[key] = [];
                           }
                           this.dest[key] = Object.create(Merger).init(this.dest[key]).mergeArray(obj[key]);
                           break;
                        case 'undefined':
                           if (this.dest[key]) {
                              delete this.dest[key];
                           }
                           break;
                        }
                     }
                     return this.dest;
                  },
                  mergeArray: function (arr) {
                     var deleted = false;
                     for (var i = 0; i < arr.length; i++) {
                        var val = arr[i];
                        var t = this.getType(val);
                        switch (t) {
                        case 'string':
                        case 'number':
                        case 'boolean':
                        case 'null':
                           this.dest[i] = val;
                           break;
                        case 'object':
                           if (!this.dest[i]) {
                              this.dest[i] = {};
                           }
                           this.dest[i] = Object.create(Merger).init(this.dest[i]).mergeObject(arr[i]);
                           break;
                        case 'array':
                           if (!this.dest[i]) {
                              this.dest[i] = [];
                           }
                           this.dest[i] = Object.create(Merger).init(this.dest[i]).mergeArray(obj[i]);
                           break;
                        case 'undefined':
                           if (this.dest[i]) {
                              this.dest[i] = undefined;
                           }
                           break;
                        }
                     }
                     if (deleted) {
                        return this.dest.filter(function (value) {
                           if (value === undefined) {
                              return false;
                           } else {
                              return true;
                           }
                        });
                     } else {
                        return this.dest;
                     }
                  }
               };
               return Object.create(Merger).merge(objA, objB);
            }
         },
         /**
             Given an ISO8601 date in full regalia, with a GMT/UTC timezone offset attached
             in #### format, reformat the date into ISO8601 with no timezone.
             Javascript (at present) does not like timezone attached and assumes all such
             datetime strings are UTC.
             */
         iso8601ToDate: {
            value: function (dateString) {
               if (!dateString) {
                  return null;
               }
               var isoRE = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([\+\-])(\d\d)(:?[\:]*)(\d\d)/;
               var dateParts = isoRE.exec(dateString);
               if (!dateParts) {
                  throw 'Invalid Date Format for ' + dateString;
               }
               // This is why we do this -- JS insists on the colon in the tz offset.
               var offset = dateParts[7] + dateParts[8] + ':' + dateParts[10];
               var newDateString = dateParts[1] + '-' + dateParts[2] + '-' + dateParts[3] + 'T' + dateParts[4] + ':' + dateParts[5] + ':' + dateParts[6] + offset;
               return new Date(newDateString);
            }
         },

         /**
         Shows a date with a more human oriented approach to expressing the difference 
         between the current date and the subject date.
            
         Example:
         If a time a time is within the last hour, express it in minutes.
         If it is in the last day, express it in hours.
         If it is yesterday, yesterday.
         If it is any other date in the past, use the date, with no time.
         If it is in the past and it is not a date, append "ago", as in "3 hours ago"
         If it is in the future, prepend "in", as in "in 5 minues"
         */

         niceElapsedTime: {
            value: function (dateString) {
               // console.log('NICE'); console.log(dateString);
               // need to strip off the timezone from the string.
               // var date = this.iso8601ToDate(dateString);
               // assumes a JS compatible date string.
               var date = new Date(dateString);
               var now = new Date();

               var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
               var minutes = date.getMinutes();
               if (minutes < 10) {
                  minutes = "0" + minutes;
               }
               if (date.getHours() >= 12) {
                  if (date.getHours() != 12) {
                     var time = (date.getHours() - 12) + ":" + minutes + "pm";
                  } else {
                     var time = "12:" + minutes + "pm";
                  }
               } else {
                  var time = date.getHours() + ":" + minutes + "am";
               }
               var timestamp = shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " at " + time;

               var elapsed = Math.round((now.getTime() - date.getTime()) / 1000);
               var elapsedAbs = Math.abs(elapsed);

               if (elapsedAbs < 60 * 60 * 24 * 2) {
                  if (elapsedAbs === 0) {
                     return 'now!';
                  } else if (elapsedAbs < 60) {
                     var measure = elapsed;
                     var measureAbs = elapsedAbs;
                     var unit = 'second';
                  } else if (elapsedAbs < 60 * 60) {
                     var measure = Math.round(elapsed / 60);
                     var measureAbs = Math.round(elapsedAbs / 60);
                     var unit = 'minute';
                  } else if (elapsedAbs < 60 * 60 * 24) {
                     var measure = Math.round(elapsed / 3600);
                     var measureAbs = Math.round(elapsedAbs / 3600);
                     var unit = 'hour';
                  } else {
                     if (elapsed < 0) {
                        return 'tomorrow';
                     } else {
                        return 'yesterday';
                     }
                  }

                  if (measureAbs > 1) {
                     unit = unit + 's';
                  }

                  var prefix = null,
                     suffix = null;
                  if (measure < 0) {
                     var prefix = 'in ';
                  } else if (measure > 0) {
                     var suffix = ' ago';
                  }

                  return (prefix ? prefix + ' ' : '') + measureAbs + ' ' + unit + (suffix ? ' ' + suffix : '');
               } else {
                  if (now.getFullYear() === date.getFullYear()) {
                     return shortMonths[date.getMonth()] + " " + date.getDate();
                  } else {
                     return shortMonths[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
                  }
               }
            }
         },
         
         fileSizeFormat: { 
            value: function (num) {
               if (typeof num === 'string') {
                  var num = parseInt(num);
               } 
               
               var pieces = [];
               while (num > 0) {
                  var group = num % 1000;
                  pieces.unshift(group+'');
                  num = Math.floor(num/1000);
                  if (num > 0) {
                     pieces.unshift(',');
                  }                     
               }
               return pieces.join('')+ ' bytes';
            }
         },

         getJSON: {
            value: function (path, timeout) {
               // web just wrap the jquery ajax promise in a REAL Q promise.
               // JQuery ajax config handles the json conversion.
               // If we want more control, we could just handle the jquery promise
               // first, and then return a promise.
               return Q($.ajax(path, {
                  type: 'GET',
                  dataType: 'json',
                  timeout: timeout || 10000,
               }));

            }
         },
          object_to_array: {
            value: function (object, keyName, valueName) {
               var keys = Object.keys(object);
               var l = [];
               for (var i in keys) {
                  var newObj = {};
                  newObj[keyName] = keys[i];
                  newObj[valueName] = object[keys[i]];
                  l.push(newObj);
               }
               return l;
            }
         }


      });

      return Utils;
   });