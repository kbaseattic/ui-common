

function respond(req, res, next) {
    var params = [{workspace: 'KBaseFBA', name: 'D_vulgaris_series_sample_378'}]
    var method = "Workspace.get_objects"
    var rpc = {
        params : [params],
        method : method,
        version: "1.1",
        id: String(Math.random()).slice(2),
    };

    console.log('****:', JSON.stringify(rpc))

    var options = {
        hostname: 'dev04.berkeley.kbase.us',
        port: 7058,
        method: 'POST',
        path: '/services/ws',
        data: JSON.stringify(rpc)
    };

    console.log(JSON.stringify(options))


    var req = http.request(options, function(res) {
          console.log("statusCode: ", res.statusCode);
          console.log("headers: ", res.headers);
          console.log("body: ", res.body);

          res.on('data', function(d) {
            process.stdout.write(d);
          });
    });

    req.end();    

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8080,  'localhost', function() {
    console.log('%s listening at %s', server.name, server.url);
});