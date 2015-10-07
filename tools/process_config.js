'use strict';
var iniParser = require('node-ini');
var fs = require('fs');
var _ = require('lodash');
var outFile = 'build/config.yml'

// grabs the deploy config file, by default deploy.cfg
var deployCfg = iniParser.parseSync('deploy.cfg');
fs.readFile('config/service-config-template.yml', 'utf8', function(err, serviceTemplate) {
    if (err) return console.log(err);

    var compiled = _.template(serviceTemplate);
    var services = compiled(deployCfg['ui-common']);
    console.log(services);

    fs.readFile('config/settings.yml', 'utf8', function(err, settings) {
        if (err) return console.log(err);

        fs.writeFile(outFile, services + '\n\n' + settings, function(err) {
            if (err) return console.log(err);
        });
    });
});