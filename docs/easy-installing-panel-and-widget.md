# Installing a Panel and Widget
# Quick and Dirty Version


## steps

- create widget in src/widgets
- add widget module to require-config.js
- create panel in src/panels
- add panel module to require-config.js
- add panel to main.js
- reload browser



## create widget

Widgets live in ```src/widgets```. Note that this location will change. (For one, the location for all source will change!)

Groups of related widgets should live in ```src/widgets/group```

The widget file name needs to be unique within the directory, of course.

Traditionally they are prefixed with kbase, so kbaseMyWidget, but I'm not sure this is really necessary.
I've been placing jquery widgets that have been wrapped in AMD calls into src/widgets/jquery. That is not a permanent solution, just a way to set them aside from the original non-AMD ones.

There are many ways to create widgets. A widget, after all, is merely an implementation of the widget interface.

TODO: doc reference


### kbwidget jquery widgets

Jquery widgets work within the new framework by following specific conventions.

#### wrap in AMD define

First the classic kbase jquery widget needs to be wrapped in an AMD define, like so

    define([
        'jquery',
        'kb.runtime',
        'kb.service.workspace',
        'kb.jquery.authenticatedwidget'
    ],
        function ($, R, Workspace) {
            'use strict';
            $.KBWidget({
                name: 'kbaseMyWidget',
                parent: 'kbaseAuthenticatedWidget',
    ..
    widget does stuff
    ..
            });
        });

(for the patient, there will be a complete set of sample widgets available in the repo quite soon.)

Explanation of dependencies:
 
- ```jquery``` is required, of course, since this is a jquery based widget. The jquery AMD impelementation returns the classic $ compatible object.
- ```kb.runtime``` is the new runtime api. It provides configuration, auth token, and other services (no explained here yet... hold on for the example widget...)
- ```kb.service.workspace``` represents how a kbase service client api is brought into the module, and is not required for a module of course. There is a sprinkling of them available 
- ```kb.jquery.authenticatedwidget``` is the classic kbase authenticated widget base object, provided as an AMD module. For now, jquery widgets are provided with the kb.jquery prefix. This is not permanent, and there will be surely be a refactor, but it is handy for recognizing them. Note that we don't have a parameter matching the auth widget module. jquery widget modules do not return anything, they are loaded purely for side effect (which is to say, they make some mutation to the global jquery object.)

### Factory widgets

TO BE DONE

### Object widgets

TO BE DONE

## Add Widget to require-config.js

The ```require-config.js``` file contains the mapping from module name to file name. Widgets are all listed in a widget section, and are grouped if need be. To provide your widget as a module, add a new line for it, preferrably at the bottom of the widgets section. This is just a javscript object.

Widgets modules are named according to this convention (for now)

vendorprefix.widget.group.widgetname
or
vendorprefix.jquery.group.widgetname

where 

vendorprefix is kb for kbase widgets
widget for factory or object widgets, jquery for jquery based widgets (the latter will change)
group is optional, used if the widgets are grouped together, and
widgetname is a sensible name for the widget sans the kbase prefix (if that is in the file name) and any mention of widget.

basically, the module naming convention solves two problems:

- it namespaces modules to help avoid collision
- should reflect the directory path to get to the file to help locate 

the jquery widget module naming is not optimal. Following the pattern, a jquery widget module name would actually be 

    kb.widget.jquery.bgroup.myfancy

but at the time that seemed too long (some of the groups + widget names are long as well.)

E.g. if your jquery widget is 

    kbaseMyFancyWidget

the module name might be

    kb.jquery.myfancy



## create panel

Panels implement the Panel interface and operate through the router mechanism. The panel interface is really just a means for an application to setup and teardown a Panel. Realistically, an application only sets up a panel. When an application would be ready to tear down a panel, the window is probably being destroyed, and there is no reason to manage the panel. Regardless, this API will eventually be fully implemented.

The setup method for a panel currently does just one thing -- it registers a route that is associated with a widget. The app installs a function on the route which knows how to do things that the panel sets up. For instance, it knows how to mount a panel, and redirect. (And that is about it!)

WORK IN PROGRESS

A panel can also do more interesting things to wire together its widgets, providing interwidget communication, refreshing services, shared state, and so forth. All of that is purely up to the panel implementation, with the help of external and internal libraries (modules) made available in the user interface environment.

TODO: provide a list of the external deps and versions, and the internal utilities.

Panels live in ```src/panels```. They typically consist of a single file, but may also have an accompanying css file 

TODO: how is that loaded? I think it is through require
TODO: remember, this is a brief how-to!

The good news is that there is a working sample panel in ```/src/panels/sample.js```

This sample panel includes simple "hello world" examples of all major types of widgets.

TODO: See the advanced samples for examples which exemplify common use cases.

## Add Panel to require-config.js

There is a separate section for panels. The module naming convention is ```kb.panel.myawesomepanel```.

E.g.

    'kb.panel.myawesomepanel': 'src/panels/myawesomepanel'

## Update main.js

```main.js``` is the main driver for the web app, invoked from the index page. 

It lives, for now, in ```/functional-site/js/main.js```.

It contains a short section which contains a list of panel "factory" objects. The factory objects have a setup method which adds routes to the runtime. Part of adding a route is adding a handler, which in this case is a factoryPanel.

FUTURE: this will soon be driven by a modular plugin system which is driven by configuration.

Adding a panel to this list is all that is required to add the panel route and panel to the system.



## Add to the system menu for testing

If your panel is standalone -- is not invoked from some other context with specific parameters, it can be called directly from the ui hamburger menu.

(this process will be under revision soon.)

The changes are made to ```src/panels/navbar.js```.

The navbar itself is a panel which is installed on the navbar area at the top of the window. It contains a section which defines system menus which may be installed in the navbar. The menu items are set up as a simple map directly in the navbar.js factory:

    var menuItems = {
                search: {
                    uri: '/functional-site/#/search/?q=*',
                    label: 'Search Data',
                    icon: 'search'
                },

each menu item has a uri, a text label, and an icon, which is a font awesome icon.

FUTURE: this will also be driven by configuration so that the core code does not need to change.

Any url prefixed with ```/functional-site/#``` will route directly through the page's router. Consult the file, for now, to see the different forms that menu items can take.

The renderMenu function assembles the menu items into the hamburger menu. To add your item to the system menu, simply insert the map key for the menu item into the appropriate location within the list. There are two menus defined here, the authenticated menu and the unauthentcated.

FUTURE: there menu will be driven by configuration soon.

NOTE: this will likely change, it is a first pass without getting stuck on configuration, etc.

## Reload

That should be it. The panel url should appear on the system menu, clicking it should load the panel and the panel should load the widgets.



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