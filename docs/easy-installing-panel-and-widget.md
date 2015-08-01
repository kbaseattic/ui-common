# Installing a Panel and Widget
# Quick and Dirty Version

## create widget

Widgets live in src/widgets. Note that this location will change.

Groups of related widgets should live in src/widgets/group

The widget file name needs to be unique within the directory, of course.

Traditionally they are prefixed with kbase, so kbaseMyWidget, but I'm not sure this is really necessary.
I've been placing jquery widgets that have been wrapped in AMD calls into src/widgets/jquery. That is not a permanent solution, just a way to set them aside from the original non-AMD ones.

### Factory widgets


### 

### jquery widgets

Jquery widgets work within the new framework by following specific conventions.

#### wrap in amd define

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

#### Add to require-config.js

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



### create panel

Panels are specialized widgets. They implement the widget lifecycle interface but are wrapped in a factory which knows how to both emit a panel and also inform the runtime about requested routes, and internally implements a widget manager in order to create and manage a set of widgets.

A panel can also do more interesting things to wire together its widgets, providing interwidget communication, refreshing services, shared state, and so forth. All of that is purely up to the panel implementation, with the help of external and internal libraries (modules) made available in the user interface environment.

( provide a list of the external deps and versions, and the internal utilities.)

Panels live in ```src/panels```. They typically consist of a single file, but may also have an accompanying css file (how is that loaded? I think it is through require)

The good news is that there is a working sample panel in /src/panels/sample.js

It implements the latest widget interface, which adds the mandatory init method.

As of this writing (which will change very soon, within hours I hope) this sample panel incorporates only a widgetFactory not a kbase jquery widget.

####