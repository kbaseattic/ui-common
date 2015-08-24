var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var serverConfig = {
    port: 8080
}

http.createServer(function (request, response) {
    'use strict';
    // console.log('request starting...');

// Configure.
    var mainRoot = ['..', 'client'];
    
    var requstUrl = url.parse(request.url);


// convert to an array
    var l = requstUrl.pathname.split('/');
    // console.log(request.url);
    var normalized = l.filter(function (pathElement) {
        var el = pathElement.trim();
        switch (el) {
            case '':
            case '.':
            case '..':
                return false;
        }
        return true;
    });


// This creates a plugins mount point at the same level as thes
    var mounts = {
        plugins: ['..', '..', '..', 'plugins']
    };


    var root = mainRoot;
    var pathList = normalized;
    if (normalized.length === 0) {
        // simulate the root index.
        pathList = ['index.html'];
    } else if (normalized[0] === 'DEV') {
        // and we also have a special escape hatch for testing.
        // it is invoked by the special prefix DEV followed by a 
        // mount point (a directory) defined herein.
        var mount = normalized[1];
        pathList = normalized.slice(2);
        root = mounts[mount];
    }

    var filePath = root.concat(pathList);
    var extension = path.extname(pathList[pathList.length-1]);
    // console.log('Extension: ' + extension);
    var contentType = 'text/html';
    // extend if need to...
    switch (extension) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'text/json';
            break;
        case '.yml':
            contentType = 'text/yaml';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.woff':
            contentType = 'font/woff'
            break;
        default:
            response.writeHead(400);
            response.end('Extension ' + extension + ' not supported', 'utf-8');
            return;
    }

    var filePathString = filePath.join('/');
    fs.readFile(filePathString, function (error, content) {
        if (error) {
            console.log('ERROR reading file');
            console.log(error);
            if (error.code === 'ENOENT') {
                var filePath = root.concat(['404.html']);
                fs.readFile(filePathString, function (error, content) {
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            response.writeHead(200, {'Content-Type': contentType});
            response.end(content, 'utf-8');
        }
    });

}).listen(serverConfig.port);
console.log('Server running at ' + serverConfig.port);