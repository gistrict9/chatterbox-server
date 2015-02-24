/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var rooms = {};
rooms['messages'] = [{"username":"test", "message":"test message"}, {"username":"test2", "message":"test message2"}];
rooms['room1'] = [{"username":"test", "message":"test message"}, {"username":"test2", "message":"test message2"}];

var requestHandler = function(request, response) {
  var userData = '';

  // The outgoing status.
  var statusCode = 200;

  //Get the room name
  var room = request.url.split("/")[2];
  console.log("ROOM:", request.url, room)

  if (!rooms.hasOwnProperty(room)) {
    statusCode = 404;
  }

  // POST Request
  if (request.method === 'POST') {

    statusCode = 201;

    request.on('data', function(data) {
      userData += data;
    });

    request.on('end', function() {
      var toSave = JSON.parse(userData);
      rooms[room].unshift(toSave);
    });

  }

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";

  response.writeHead(statusCode, headers);

  //** WRAP OUTPUT IN results:
  var output = {};
  output.results = rooms[room];

  response.end(JSON.stringify(output));


};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
