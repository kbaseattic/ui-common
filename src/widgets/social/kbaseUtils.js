define(['q'], 
function(Q) {
  "use strict";
  var Utils = Object.create({}, {
    getProp: {
      value: function(obj, prop, defaultValue) {
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
      value: function(obj, prop) {
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
      value: function(object, path, value) {

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
   
    deleteProp: {
      value: function(path, name) {
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
      value: function(client, method, arg1) {
        return Q.Promise(function(resolve, reject, notify) {
          client[method](arg1,
            function(result) {
              resolve(result);
            },
            function(err) {
              reject(err);
            });
          });
        }
    },
    
    getSchemaNode: {
      value: function(schema, propPath) {
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
      value: function(value) {
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
      value: function(objA, objB) {
        var Merger = {
          init: function(obj) {
            this.dest = obj;
            return this;
          },
          getType: function(x) {
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
          merge: function(dest, obj) {
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
          mergeObject: function(obj) {
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
          mergeArray: function(arr) {
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
              return this.dest.filter(function(value) {
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
    }
    
    
  });
  
  return Utils;
});