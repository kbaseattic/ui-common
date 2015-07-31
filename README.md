#UI Common
**Version 0.0.1**
Common user interface components and libraries for the KBase Project.

##Contents
 * Installation
 * KBase Widget API
 * Widget Library
 * Landing Pages
 * KBase Labs Templates

##Installation

###Developer


####Works for Erik

At present, my working model is 

- the git repo, 
- switched to a tracking branch at my fork, 
- mapped as a synced directory into a vagrant/virtualbox VM 
- which has a running narrative service

If I need to change the state of my ui-common, I can either checkout a different branch in the repo, or install a fresh copy of the repo with a new branch (sometimes I find that easiest for a hotfix, but that is probably just my poor git skills.)

This will get ui-common and set it up into a working state:

- Clone the ui-common repo, preferably your own
    - ```git clone https://github.com/YOU/ui-common.git ui-common.our-current-campaign```
    - I like to create a repo directory named after the project I'm working on.
- Work your git magic to get the repo into the correct state. E.g. In your local repo switch to the relevant branch
    - ```git checkout -t origin/our-current-campaign```
- Map this ui-common into your development environment
    - TODO
- Ensure that you have bower installed locally
    - TODO
- Within the repo, install the bower dependencies
    - ```cd ui-common.our-current-campaign```
    - ```bower install```
- For testing (and soon, building)
    - ```npm install```
- Copy the correct config file into the build dir
    - ```mkdir build && cp -r source/config/prod.yml build/config.yml```
    - this will be part of the build process when we have one.


##The Widget API
TODO: Add documentation

###Testing the Widget API

##Widget Library

##Landing Pages

##KBase Labs Template

##Contributors

 * [Neal Conrad](mailto:nconrad@mcs.anl.gov)
 * [Matt Henderson](mailto:mhenderson@lbl.gov)
 * [Shiran Pasternak](mailto:shiran@cshl.edu)
 * [Bill Riehl](mailto:wjriehl@lbl.gov)
 * [Jim Thomason](mailto:thomason@cshl.edu)
 * [Erik Pearson](mailto:eapearson@lbl.gov)
