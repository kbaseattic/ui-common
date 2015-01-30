## KBase API clients

This directory contains all current KBase Javascript clients, as of 
January 29, 2015.

These are not likely to change very often, and the generation process to get 
the whole batch is not straightforward in all cases, so they've been included 
here.

This also has a Gruntfile that will concatenate, uglify, and minify all of them
into a single kbase-client-api.js and kbase-client-api.min.js file (instructions below).

Here's the list of the included service client names. Except for AweClient and 
ShockClient, which were constructed by hand, they all follow the same idiom for 
instantiation:

`var client = new ClientName(endpointUrl, authToken);`
e.g.
`var workspaceClient = new Workspace("https://kbase.us/services/ws", authToken);`

- AbstractHandle
- AweClient
- CDMI_API
- CDMI_EntityAPI
- CoExpression
- CompressionBasedDistance
- ERDB_Service
- ExpressionServices
- fbaModelServices
- GWAS
- GenomeAnnotation
- GenomeComparison
- HandleMngr
- IDServerAPI
- KBaseDataImport
- KBaseExpression
- KBaseGeneFamilies
- KBaseNetworks
- KBaseProteinStructure
- KBaseTrees
- KmerAnnotationByFigfam
- MEME
- NarrativeJobService
- NarrativeMethodStore
- ProbabilisticAnnotation
- ShockClient
- Transform
- UserAndJobState
- UserProfile
- Workspace

## Installation

This uses npm and grunt. If you don't have either of those installed, and you
work with Javascript, you're missing out!

npm = Node Package Manager: https://www.npmjs.com/
Grunt = the Javascript Task Runner: http://gruntjs.com/

Installing npm is different for different operating systems. It's part of apt
if you're on Ubuntu (apt-get install npm), and there are various ways to grab
it for other OSes.

With npm installed, you can use that to install Grunt easily. The best way to
make it global to your system is use this line:

`npm install -g grunt-cli`

This will put grunt on your system path and allow it to run from any directory.

Grunt works on a plugin basis. These are included in the package.json file in
this directory. Now, all you need to do to get the clients minified is:

    npm install
    grunt

And you're ready to go.

Of course, this is all kinda moot since the end products are also included in this
git repo. But this is a useful thing to document.