var static = require('node-static');
 var path = require('path');
 var fs = require('fs');
 
 function go () {
// 
    // Create a node-static server instance to serve the './public' folder 
    // 
    var rootDir = path.normalize(__dirname + '/../client');
    if (!fs.existsSync(rootDir)) {
        console.log('root dir ' + rootDir + ' does not exist or is not accessible to you');
        return;
    }
    var file = new static.Server(rootDir);
    console.log('root: ' + rootDir);

    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            // 
            // Serve files! 
            // 
            file.serve(request, response)
                .addListener('error', function (err) {
                   console.log('ERROR: ' + request.url + ':' + err.message);
                });

        }).resume();
    }).listen(8080);
}

go();