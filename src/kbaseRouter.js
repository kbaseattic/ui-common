define([], function () {
    'use strict';
    return (function () {
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
        }

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
        }

        function getCurrentRequest() {
            var path = [],
                query = {};

            // The path is (for now) from the hash component.
            if (window.location.hash && window.location.hash.length > 1) {
                var hash = window.location.hash.substr(1),
                    pathQuery = hash.split('?', 2);

                if (pathQuery.length === 2) {
                    query = parseQueryString(pathQuery[1]);
                }
                path = pathQuery[0].split('/').filter(function (x) {
                    return (x.length > 0);
                });
            }

            return {
                path: path,
                query: query
            };
        }

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
                };
            }
            return foundRoute;
        }
        
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