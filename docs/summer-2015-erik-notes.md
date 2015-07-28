# Eriks' notes on summer 2015 cleanup

These notes will make their way into real documentation, but this is a place to collect thoughts.

- Move all external dependencies under bower configuration and control
- Move all external dependenceis into requirejs
    - exceptions are requirejs and bootstrap (for now)
- move all kbase code into requirejs


## Bowerization of External Depencdencies

Fairly straightforward. 
- for each dependency in index.html:
    - look up packages in bower through netbeans interface
    - install latest (mostly) version
    - set up module in require-config.js

In some cases there may be dependency conflicts, which will mandate a specific version. This came up several times with angular. 
I ended up removing angular, for now at least, in order to simplify EVERYTHING.


## Move dependencies into requirejs

