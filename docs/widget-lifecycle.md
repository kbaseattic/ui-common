# Widget Lifecycle

In order to automate and animate the KBase UI, widgets and widget-like things need to follow a set of patterns. These patterns are expressed on one hand as an API, or set of methods, implemented by a widget (or widget wrapper), and on the other as a set of lifecycle procedures which manage the widgets.

The basic lifecycle is:

- construction: not a method, but the act of creating a widget constructor object
- create(confg): a widget is created with a set of configuration data from a factory object.
- attach(node): a widget is attached to a dom node, and creates any dom structure it needs
- start(params): a widget is run for the first time with a set of runtime parameters, also starting any runtime services
- run(params): a widget is run with a set of runtime parameters, perhaps passed from a url or another widget.
- halt: a widget must cease any activity, such as responding to events
- detach: a widget should detach any nodes it has installed in the original mount node, which should be empty before the detach method returns
- destroy: a widget must remove any artifacts outside of its own self

All methods are asynchronous, returning a promise object. This allows the widget to perform asynchronous calls in any lifecycle state.

## Widget Manager

## Widget

## Overview

This widget lifecycle model assumes a concrete DOM runtime. This is in contrast to a virtual DOM model in which the DOM is not manipulated directly by client code -- rather client code manipulates a virtual, or mirror, DOM in javscript and the virtual DOM engine does the actual manipulation. However, many widgets and libraries in use at KBase are designed with the concrete DOM, and this widget lifecyle has been developed to support the existing code base, as well as new code going forward.

There is nothing to stop a specific widget, and any subwidget it creates, from utilizing a different model. A virtual DOM based library like React will operate just fine in this environment, as long as the top level widget implements to the specified widget lifecycle hooks.



### construction

This is the construction phase of the basic widget javascript object.
It can take many forms, due to the myriad ways to create a Javascript object. 
Unlike the other lifecycle events, this is not encapsuled in a method.
It is implemented by the widget manager
At its core it is asyncronous

#### factory
- load module via requirejs, asyncronously
- the module returns a simple factory maker -- with a single create method
- instantiate a factory object (used later to create a panel)

#### constructor
- load module via requirejs
- provide a constructor function as the module


### factory.create(config)

After a widget factory or constructor has been created, the widget itself is created from the factory or constructor. 

#### factory 

For a factory object, this is through a ```create``` method which takes a configuration object argument. The configuration object represents startup information required for the creation of the object. It does not represent the actual invocation parameters. For instance, it may contain urls required to make service calls. In fact, the factory may actually return different widgets based on the input configuration.

### widget.init(config)

The widget ```init``` method is used to initialize a widget to a known state with a given configuration object. It is called after the widget is created, and the widget is attached.

### widget.attach(node)

A widget's ```attach``` method will be called in order to provide a chance for the widget to attach any DOM elements to the given node. The node provided should be considered stable for the entire life of the widget. The widget should not use it for attaching events or attributes. The widget should only use it for attaching its own top level container node. 

In reality (implementation), the widget manager will have created a dedicated node for this widget, and will probably destroy it after the widget itself is destroyed. However, in order for a widget to control its own lifecycle while it is running, it should create its own top level node, attaching it to the provided node, which can be manipulated and even destroyed if need be.

The ```attach``` method may be used to populate the provided node, or simply to build its own container node to attach to it. This differentiation is important when considering that this method does not carry the runtime parameters. Thus a widget which needs to build content based on parameters will need to defer that process until the ```run``` method.

Another consideration is the management of sub-widgets. Other widgets following this model will require a fully attached DOM node for the attachment points of sub-widgets before calling the attach method of a sub widget. This implies that the parent widget's rendering and DOM attachment happens either in attach or run, depending on whether it needs runtime params or not.

A widget which uses another system for sub-widgets may want to follow some other model. For example, using Knockout components, it might make sense to register knockout widgets during construction (module loading), build the widget ui, attach it, and set up knockout during the attach method, and populate the viewmodel during the run method.

### widget.start(params)

The start method is the call to action for a widget! It is called in the context in which there are parameters available for the widget. After the start call, the widget is expected to be fully operational, with any runtime services started.

### widget.run(params) [optional]

The run method is called when a parent context has new information to give the widget and expects the widget the respond accordingly. It is equivalent to a function call, with the params being the arguments. 

In the case of widgets, the run method may be called multiple times -- whenever the parameters change. This is very similar to the start() method, with the following exeptions:
- the start method is called on the first invocation of the widget, run on the second and following
- the start method starts any runtime services, the run method does not

For example, a widget which serves as the main panel will have parameters derived from the url path and query parameters. The first time a path is invoked, these parameters are fed to the run method and the widget builds itself for the first time. If the path is invoked after this, for instance a link is clicked, or an option is changed in the interface, the widget is not reloaded (construct, create, attach, run), but rather the run method is called again with new parameters. It is up to the widget to handle this case. A simple widget may just re-render. A more sophisticated widget, or one that is large and requires noticable time to generate, may just alter elements that are affected by the parameter chages.


### widget.stop()

The stop method tells the widget to stop all activity. If the widget has timers registered, they should be unregistered; subscriptions should be unsubscribed; and so forth. 

This may be called prior to closing a widget, or just when the widget will be hidden (e.g. a new tab is opened and this one hidden). The actions taken by the halt() should be resumable (see resume()).

### widget.resume() [optional]

This method tells the widget to resume runtime services that were stopped by a halt().
The use case for this call is a widget which has been hidden, and whose runtime services are not necessary and would be drain on the system when it is inactive. In fact, this supports scalability, since it supports many open panel tabs, only the exposed one being actually active.

### widget.detach()

This method tells the widget to remove any DOM nodes it has attached to the node passed to it in the attach() method.

### widget.destroy() [optional]

This method tells the widget to remove any javscript resources that would not be destroyed naturally when no further references to the widget remain. 

This certainly includes any parent DOM nodes create -- destroying them will also remove any event handlers and all descendent nodes.



<style type="text/css">
    body {
        font-family: sans-serif;
    }
    h1, h2, h3, h4, h5, h6 {
        xcolor: #FFF;
        color: blue;
    }
    h3 {
        padding: 4px;
        background-color: gray;
        color: #FFF;
    }
     code {
        xmargin: 1em;
        xdisplay: block;
        xpadding: 1em;
        xcolor: lime;
        background-color: #CCC;
    }
    pre > code {
        margin: 1em;
        display: block;
        padding: 1em;
        color: lime;
        background-color: black;
    }
</style>