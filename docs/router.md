# KBase Router

The Kbase Router is a straightforward mechanism for mapping from paths to actions. 

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



## 
