
load index.html

load core css and js

render index page to get layout

meanwhile ... kb.main is loaded via requirejs but is only available when dom is ready

main.start() kicks off app

much of what main does is just a specific pattern of configuring and hooking together with events the top level singleton objects -- app, router, logging, user profile, 

still some confusion between App and Main. App should provide capabilities and capture repeated or complex procedures, main should provide the initial startup logic and glue layer. 

main should be merged if possible with panel and widget to be life-cycle aware and management capable, but perhaps it is too specialized and small to worry about this.

setup:

adds "mount points" for the layout to install top level components

installs default and not-found routes

sets up listeners for events the app needs to be aware of:
  login, logout, navigate, new-route, 

it loads panels, calls setup to install routes

run: 

off it goes
