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
- Create a Plugin
    - from your favorite development environment, set up the plugin directory structure to look like this:

        plugins
            myplugin
                source
                    javascript
                    css

    - TODO: You can also use a framework template to build this and other boilerplate files with one command.

    - In the plugin's directoryc, create the configuration file ```config.yml```. The configuration file provides descriptive metadata, source file locations and module names, routes, and menu items.

        ## Demo Plugin for Screencast
        ---
        package:
            author: Erik Pearson
            name: demo_screencast
            description: A package containing the sample panel and associated widget for demonstration purposes
            date: August 9, 2015
            version: 0.0.1
        source:
            modules:
                -
                    module: kb_panel_demo_screencast
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
                    panelFactory: kb_panel_demo_screencast
            menu:
                -
                    name: screencast
                    definition:
                        path: screencast
                        label: Screecast Demo
                        icon: paw

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

    - This is all there is to it.

- Tell ui-common about the plugin.
    - Edit the local config file ```build.yml``` located in the ```/build``` directory within ui-common. Add the following line, which simply specifies the plugin id, which is also the same as the plugin directory:
    
            -
                eg_screencast

- Refresh, Enjoy!
    - refresh your browser -- the plugin should be on the menu and operational.

### Create a repo and move the plugin there

-  At github create a new public repository. 
    - kb-ui-plugin-demo
    - click 'initialize this repository with a README'
    - select MIT License, we'll be replacing it

- Clone it in your favorite development location

- In your favorite development location, create a directory with the following structure

        src

- Move plugin directory you were working on into the src directory

- Rename the plugin directory plugin
    - There is no need for the plugin directory to be the name of the plugin id any longer.

- add a bower config file

        {
        "name": "kbase-ui-plugin-demo",
        "version": "1.0.0",
        "main": "src/main.js",
        "dependencies": {
        },
        "devDependencies": {
        }
    }

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

        bower update

- confirm the plugin is not installed in bower_modules

- in ```build/ui.yml``` add the plugin dependency:  

        -
            name: kb_ui_plugin_demo
            directory: bower_components/kb-ui-plugin-demo/src/plugin



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
