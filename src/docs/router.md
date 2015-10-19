# KBase Router

The Kbase Router is a straightforward mechanism the task of mapping "hash paths" to web app resources.

By hash-path, I mean the practice of specifying a "path" after the hash component in a url. Changes in the hash component only are signaled by the browser and can be trapped by javascript. These hash paths, including any query parameter attached to them, are parsed by the router. The router matcches them against a list of path specifications (aka "routes"). The first match is a "hit".

The router does not have any way to take action upon these routes. It is merely a route registration, route query, and DOM inspection service. The host code will use the router to register routes, listen for hash changes, and query the router for matching route definitions. It is up to the host code to determine what to do with the returned route object.

The router places specific properties on the returned object, and also includes the originally regsitered route object.

In practice, in the KBase web app, the returned route object will specify one of several actions:

- a panel to be loaded
- a path to invoke
- a url to redirect to


Paths are 

A route is specified as an object with the following properties:

    {
        path: PATH,
        params: PARAMS,
        redirect: REDIRECT,
        widgetFactory: WIDGETFACTORY
    }

for example

    {
        path: ['hello', {type: 'param', name: 'planet'}],
        params: [
            {name: 'language', required: false},
            {name: 'size' }
        ],
        widgetFactory: myWidgetFactory.create()
    }

## Paths

A path is specified as an array of path segments. Each segment can correspond to the following components:

- a string
- a parameter


## The Router module

The router module, ```kb.router```, returns a Router factory object. In order to create a new router, call the make method on the module.

    require(['kb.router'], function (Router) {
        var router = Router.make();
    });

The Kbase App, the top level object in the KBase SPA, creates a single router for registering all routes in the application.


## Registering a Route

Routes are registered by calling the ```addRoute``` method, which takes a single route specification argument.

At present the Router will not signal an error if a route would mask an existing route.

A route spec consists of a simple object with the following properties:

- ```path```: a list of path components, some of which are literal strings, others being PathComponent objects which describe what to do with a matched path element
- ```params```: a map of query variables which may be provided on the path, and what to do with them. Only query variables provided in the params property will be made available if a path is matched.
- ```payload```: an arbitrary object which represents some state which tells the host what to do when the route is matched

### Examples


## Regsitering a default route

Although a host can handle the case of no route being found directly, it is convenient to be able to specify a route which is invoked if no route is found when requested. This provides a simple "path not found" capability.

### Example


## Finding a Route

The 



