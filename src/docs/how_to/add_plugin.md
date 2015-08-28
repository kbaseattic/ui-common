# How To: Add a Plugin to the KBase User Interface

## Goal

Write a Plugin, add it to an instance of the KBase User Interface, having it appear as a menu item, panel, and containing a widget.

## Prerequisites

- A running installation of the user interface (ui-common).
- On local machine the following packages:
    - git
    - nodejs
    - bower

## Overview

- create a plugin in ui-common
    - it is easier to get a plugin going this way
    - TODO: create plugin from local repo... (just link the plugin dirs)
- after confirming that it works, move it outside to a repo, push.
- reconfigure ui-common
- import and run the plugin!

## How To

### Create the plugin Locally

- local plugins are located in the ui-common source in the ```plugins``` directory. This is where we will create the plugin initially.
    - some built-in features of the ui-common are permanent features of the local plugins directory
- Create a Plugin
    - the plugin directory is located in the top level ```plugins``` directory in ui-common
    - from your favorite development environment, set up the plugin directory structure to look like this:

        plugins
            myplugin
                source
                    javascript
                    css

      - the name of the plugin directory, ```myplugin``` in this example, is only used to tie the plugin into the UI through a config file. However, it is good to consider this the "plugin id" and use the same string consistently.
    - In the plugin's directory, create the file ```config.yml```. This configuration file provides descriptive metadata, source file locations and module names, routes, and menu items. It is used by the UI to install the plugin at runtime.

        ## Demo Plugin for Screencast
        ---
        package:
            author: M Mouse
            name: myplugin
            description: A package containing a sample panel demonstration purposes
            date: August 9, 2015
            version: 0.0.1
        source:
            modules:
                -
                    module: kb_panel_demo
                    file: panel.js
            styles:
                -
                    file: style.css
        install:
            routes:
                -
                    path: ['screencast']
                    queryParams: 
                        param1: {}
                    panelObject: kb_panel_demo
            menu:
                -
                    name: screencast
                    definition:
                        path: screencast
                        label: Screecast Demo
                        icon: paw

    - config file notes:
        - the modules are added dynamically to the runtime system.
        - module names should follow the kbase namespacing standard:
            - underscores separate components
            - camelCasing to concatenate compount words
            - other thatn camelCasing, all characters lower case
        - for javscript module files, the ```.js``` suffix may be omitted (as this is the form accepted by require.js)
        - we are adding both a route to invoke the panel and a menu. Neither are strictly necessary for a plugin. E.g. a plugin may just provide modules.
        - see AAA for the plugin config file format
    - In the ```source/javascript``` directory, create the panel javascript file. The panel javascript source file is typically named ```panel.js```, but can be whatever you like, as long as it matches the name specified in the panel definition in the config file. We are going to set up the simplest possible plugin UI element - a widget that just displays a string.

        define([
            'kb_widgetBases_baseWidget',
        ], function (BaseWidget) {
            'use strict';
            return Object.create(BaseWidget, {
                onAttach: {
                    value: function (container) {
                        container.innerHTML = 'Hello, KBase';
                    }
                }
            });
        });

    - This is all there is to it, because in this example we are just creating an extremely simple panel which just displays a string. However, we can note:
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

