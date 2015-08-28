# How To: Add a Data Visualization Widget to the KBase App

## Goal

Add a new data visualization widget which becomes the default viewer for objects of a given type.

## Prerequisites

- On local machine the following packages:
    - git
    - nodejs
    - bower-cli

## Overview

- create a plugin in ui-common
    - it is easier to get a plugin going this way
    - TODO: create plugin from local repo... (just link the plugin dirs)
- after confirming that it works, move it outside to a repo, push.
- reconfigure ui-common
- import and run the plugin!

## Steps

### Set up local working environment

- Install git:
    - Get the git installer from ```http://git-scm.com/download/mac```
    - Install it
- Install node: 
    - Download the node installer from ```https://nodejs.org```
    - Install it
- Install bower-cli:
    - ```sudo npm install -g bower-cli```


### Install a local copy of the KBase App

For now, we’ll just cover locally, on a Mac. 

- Create a local working directory
    - e.g. /Users/erik/work/kbase/projects/samplewidget
    - ```mkdir /Users/erik/work/kbase/projects/samplewidget```
- In the working directory, clone the ui-common repo
    - ```cd /Users/erik/work/kbase/projects/samplewidget```
    - git clone XXX
        - for now use erik’s repo:
        - ```git clone https://github.com/eapearson/ui-common.git --branch ease-dev-campaign```
- Now set it up and make sure it works
    - cd ui-common
    - update npm:
        - npm install
    - update bower:
        - bower install
    - build the kbase app
        - grunt build
    - pull up a browser to review the site
        - take your browser to localhost:8080


### Create the widget plugin repo

First we will be creating the widget plugin in a local repo, and link that directly to the KBase App. Later we will move the repo into github, and show how you can load that directly into the KBase App.

- Alongside the KBase App repo create a directory named after your plugin.
    - E.g. ```my-widget-plugin```
- Inside this directory the following directory structure

```
my-widget-plugin
|
+--source
   |
   +--javascript
```
- e.g.
    ```mkdir -p source/javascript```
        
    - the name of the plugin directory, ```my-widget-plugin``` in this example, is only used to tie the plugin into the UI through a configuration file. However, it is good practice to consider this the "plugin id" and use the same string consistently.

- In the plugin directory, create the file ```config.yml``` and open it in an editor. This configuration file provides descriptive metadata, source file locations and module names, and the data type to widget mapping.

```yaml
 1  ## A data widget plugin
 2  ---
 3  package:
 4      author: M Mouse
 5      name: my-widget-plugin
 6      description: A package containing a sample widget plugin
 7      date: August 24, 2015
 8      version: 0.0.1
 9  source:
10      modules:
11          -
12              module: kb_widget_mine
13              file: widget.js            
14  install:
15     types:
16          -
17              type: 
18                  module: Communities
19                  name:   Collection
20                  version: any
21              icon: 
22                  type: fontAwesome
23                  classes: ['fa-list-ul']
24              viewers:
25                  -
26                      default: true
27                      title: 'Data View 3'                
28                      module: kb_widget_dataview_communities_collection
29                      type: widgetBase
```
- Explanation of the config file:
    - it is encoded in YAML
    - line ``` 1 ``` - the header line should be a comment containing a very short description 
    - line ``` 2 ``` - yaml way of marking the beginning of a document
    - lines ``` 3-8 ```: descriptive meta-information about the plugin. currently unused, but will be soon.
    - lines ``` 9-13 ```: defines all source files provided by the widget.
        - lines ``` 10-13 ```: defines all AMD modules which should be registered with the requirejs runtime.
            - line ``` 12 ```: the module name should conform to KBase AMD naming conventions. Note that although in this case the module name is only referenced in the install section below, some plugins may provide a module for consumption by other plugins.
            - line ``` 13 ```: The file name that the module is define in, relative to the plugin's source/javascript directory.
    - lines ``` 14-29 ```: the install section "glues" the plugin into the KBase runtime.
        - lines ``` 15-29 ```: in this example, we are utilizing just one plugin install feature, the type registry.
            - line ``` 16 ```: note that the type registry entries are supplied as a list.
            - lines ``` 17-20 ```: the type is identified by the standard type id object (ref?)
                - note that the specific version may be provided, or set as either "any" or left off altogether, in which case the version is ignored.
            - lines ``` 21-23 ```: one UI aspect of a type is the icon used.
                - line ``` 22 ```: specifies the type of icon as fontAwesome. KBase utilizes two types of icons -- fontAwesome and kbase. 
                - line ``` 23 ```: icons are specified as a class defined by the icon type. In the case of Font Awesome, any font awesome icon class may be used (currently version 4.3.)
            - lines ``` 24-31 ```: here we finally provide the widget definition to the type.
                - line ``` 25 ```: note that more than one data viewer widget may be specified. 
                - line ``` 26 ```: the default property can make this widget the default viewer for the type. 
                    - note that at this time only one data vis widget, the default one, will be shown.
                    - future extensions will provide a UI element to switch between any available vis widget for that type.
                -line ``` 27 ```: the title is displayed in UI contexts, such as the title bar of the containing panel, or a selector for switching between widgets.
                - line ``` 28 ```: the AMD module id will not typically be directly invoked by external code, rather it is utilized by the data viewer master widget to obtain the widget's module. However, the widget module name should conform to the KBase AMD module naming conventions.
                - line ``` 29 ```: there are several types of KBase widgets. Which one you choose may depend on the complexity of the widget you are creating...
                    - in this case we have chosen to implement a relatively simple type of widget 
            


- config file notes:
    - the modules are added dynamically to the runtime system.
    - module names should follow the kbase namespacing standard:
        - underscores separate components
        - camelCasing to concatenate compound words
        - other than camelCasing, all characters lower case
        - for javscript module files, the ```.js``` suffix may be omitted (as this is the form accepted by require.js)

### Add a "Hello World" test widget

Now that the repo is set up, we will create a shell of a widget, enough to prove to ourselves that the plugin is being absorbed into the KBase runtime and the widget property registered. After this, we will add proper visualization.

- In the ```source/javascript``` directory, create the widget javascript file. The javscript file may be named anything you like. The file name is only used in the config file, so it may be a very simple file name like 'widget.js'.

```javascript
 1   define([
 2       'kb_widgetBases_baseWidget',
 3   ], function (BaseWidget) {
 4       'use strict';
 5       return Object.create(BaseWidget, {
 6           onAttach: {
 7               value: function (container) {
 8                   container.innerHTML = 'Hello, KBase';
 9               }
10           }
11       });
12   });
```
- This is all there is to it, because in this first example we are just creating an extremely simple widget which just displays a string. 
- Explanation of the widget file
    - line ``` 1 ```: every widget is defined as an AMD module. 
    - line ``` 2 ```: if a widget needs resources from the runtime, such as a base object, mixins, or utilities, they must be included here.
        - see: XXX for a catalog of all kbase runtime modules.
    - line ``` 3 ```: as is the case for all AMD modules, the entire widget is wrapped in an anonymous function.
    - line ``` 4 ```: KBase coding standards specify to use strict mode. 
        - This simplified code sample does not include jslint configuration or documentation, as would be required for KBase coding standards.
    - line ``` 5 ```: note that the entire widget object is returned as the value of the module. This follows the pattern of pure javascript object usage, in which objects themselves are manipulated, and may become prototypes for other objects.
        - also note that this widget type utilizes pure javascript objects and ES5 object creation and inheritance.
    - lines ``` 6-10 ```: The prototype for this widget implements the kbase widget lifecycle interface, and in return provides a simpler set of optional "onX" methods. These methods are called at specific points of the widget lifecycle. More on this later.
        - also note the specific construction of this object via Object.create. If you are unfamiliar with this usage, please consult the JS documentation XXX.
    - line ``` 8 ```: this is really all of the functionality of the widget! The container provided to the widget is populated with a simple string.


### Install the widget into the KBase App 

The widget will be installed in the KBase runtime by just a few lines of configuration. There will be no code changes at all.





### However, we can note:
    - a panel is actually a widget. in most cases it is a widget which manages widgets.
    - we are utilizing two KBase javascript coding standards:
        - the panel is implemented as an AMD module (and this is also part of the plugin mechanism referenced in the config)
        - strict mode is enabled by way of the magic ```'use strict';``` expression placed at the top of the module function
    - we are using a base widget class provided by ui-common. There is not anything magic about this widget, it just makes common use-cases for widgets easier to implement.
    - more advanced usage may require using the widget interface (which the base widget used here implements)
    - widget functionality is provided via optional "hooks" called by the base widget which are implemented in this widget.
        - TODO: need a reference for the widget lifecycle
    - this example uses standard prototypal inheritance via ```Object.create```. There are no other magic mechanisms going on here.

- Next we need to tell the UI about the plugin.
    - Edit the local config file ```build.yml``` located in the ```/build``` directory within ui-common. 
    - Add the following line, which simply specifies the plugin id, which is also the same as the plugin directory we created earlier:
    
            -
                myplugin

- Refresh, Enjoy!
    - refresh your browser -- the plugin should be on the menu and operational.

### Create a repo and move the plugin there

A non-local plugin typically lives in a public repository hosted at github. (We need some docs to discuss the different ways that plugins can be hosted.)

-  At github create a new public repository. 
    - Give it name, for instance ```kb-ui-plugin-demo```
    - click 'initialize this repository with a README'
    - select MIT License, we'll be replacing it

- Clone it in your favorite development location
    - e.g. ```git clone https://github.com/eapearson/kb-ui-plugin-demo.git```

- Within the repo directory create the top level source directory:

        src

- Move plugin directory you were working on into the ```src``` directory

- Rename the plugin directory ```plugin```
    - There is no need for the plugin directory to be the name of the plugin id any longer
    - a standard location for files simplifies configuration
    - the repo url is enough to identify and configure the plugin.

- add a bower config file, ```bower.json``` in the repo directory.

        {
        "name": "kbase-ui-plugin-demo",
        "version": "1.0.0",
        "main": "src/main.js",
        "dependencies": {
        },
        "devDependencies": {
        }
    }

    - the bower config file helps bower be happy, but at this point we are not utilizing it.

- Commit the changes 

        git add -A
        git commit -m 'Initial commit of new plugin repo'

- Push back to github

        git push

### Configure into the user interface

There are two aspects to configure -- the bower package dependency, and the ui-plugin dependency.

- in ```bower.json``` in the deps section, add the item
        
        "kbase-ui-plugin-demo": "eapearson/kbase-ui-plugin-demo"

- update bower to make sure it works.
    - run this in the command line within top level of the UI repository:

            bower update

- confirm the plugin is installed by inspecting the ```bower_modules``` directory. You should find a directory which is the same as the repo name.

- in ```build/ui.yml``` add the plugin dependency:  

        -
            name: kb_ui_plugin_demo
            directory: bower_components/kb-ui-plugin-demo/src/plugin

    - note that this is just for testing. A plugin which is to be installed in a deployment will be configured either in ```source/config/ui.yml``` or in a set of deployment config files (not yet determined?)


### Other excercises


#### Change the panel, update the ui

- in the local repo
    - change the panel
    - commit the change
    - push to github
- in the local ui-common app
    - bower update
    - refresh browser
- you should see the changes.
- this is because bower pulls the latest commit, since we haven't specified a tag.

#### Keep it stable with a tag
- in the local repo
    - create a tag
    - push it up
- in the local ui-common
    - in the bower config, append #tag to the dependency
    - bower update
- refresh
- in the local repo
    - make some changes
    - make a new tag
    - commit and push
- in ui-common
    - bower update
- refresh
    - should see no changes
- in ui-common
    - change the tag to the new one
    - bower update
- refresh
    - should see the new conifg


