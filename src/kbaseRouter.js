define(['jquery'], function ($) {
    'use strict';
    return (function() {
        
        // Routing
        var routes = [];
        function addRoute(pathSpec) {
            /*
             * The path spec is an array of elements. Each element is either a
             * string, in which case it is a literal path component, 
             * regular expression, which case it is matched on a path component,
             * object with type:param
             */
            
            routes.push(pathSpec);
        };
        function findRoute(path) {            
        };
        
        var defaultRoute = null;
        function setDefaultRoute(routeSpec) {
            defaultRoute = routeSpec;
        }
        
        function parseQueryString(s) {
            var fields = s.split(/[\?\&]/),
                params = {};
            fields.forEach(function(field) {
                if (field.length > 0) {
                    var pair = field.split('=');
                    if (pair[0].length > 0) {
                        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                    }
                }
            });
            return params;
        };
        function getCurrentRequest() {
            // var path = window.location.pathname;
            var hash = window.location.hash,
                query = parseQueryString(window.location.search),
                path;
            
            // The path is (for now) from the hash component.
            if (hash && hash.length > 1) {
                hash = hash.substr(1);
            }
            path = hash.split('/');
            if (path[0].length === 0) {
                path.shift();
            }
            return {
                path: path,
                query: query
            }            
        };
        function findCurrentRoute() {
            var req = getCurrentRequest();
            
            // Match on the path
            var foundRoute;
            for (var i = 0; i < routes.length; i += 1) {
                var route = routes[i];
                if (route.path.length !== req.path.length) {
                    continue;
                }
                var params = {}, found = true;
                for (var j = 0; j < req.path.length; j += 1) {
                    var elValue = route.path[j],
                        elType = typeof elValue;
                    if (elType === 'string' && elValue !== req.path[j]) {
                        found = false;
                        break;
                    } else if (elType === 'object' && elValue.type === 'param') {
                        params[elValue.name] = req.path[j];
                    }
                }
                if (found) {
                    foundRoute = {
                        params: params,
                        route: route
                    };
                    break;
                }
            }
            
            // The total params is the path params and query params
            if (foundRoute) {
                var allowableParams = foundRoute.route.queryParams || {};
                Object.keys(req.query).forEach(function(key) {
                    var paramDef = allowableParams[key];
                    if (paramDef) {
                        foundRoute.params[key] = req.query[key];
                    }
                });
            } else {
                return {
                    params: {},
                    route: defaultRoute                    
                }
            }
            return foundRoute;
        };
        function removeRoute(routeSpec) {
            
        };
        function listRoutes() {
            return routes.map(function(route) {
                return route.path;
            });
        };
       
        return {
            addRoute: addRoute,
            listRoutes: listRoutes,
            findCurrentRoute: findCurrentRoute,
            setDefaultRoute: setDefaultRoute
        }
    }());
});