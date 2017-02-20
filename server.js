var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
var pathie; //define global var for path use
var db;
var path = require('path');

ShareDB.types.register(richText.type);

startServer();

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
 

//addition for serving files started from startup script, us express to serve static files from the scope of the scripts current dir (__dirname):
app.use(express.static( __dirname + '/static'));
app.use(express.static(__dirname + '/node_modules/quill/dist'));
app.get('*', function(req, res, next){ //listen to all http requests 
	var path = req.param('path'); //filter out the requested paths for use to create new databases
	res.sendFile(__dirname + '/static/index.html'); //send all req's to that file

	//addition for serving files started from startup script, us express to serve static files from the scope of the scripts
// current dir (__dirname):
	app.use(express.static( __dirname + '/static'));
	app.use(express.static(__dirname + '/node_modules/quill/dist'));

});

//create persistency, monog db integration
var db = require('sharedb-mongo')('mongodb://localhost:27017/test');
var backend = new ShareDB({db});
var connection = backend.connect();
var doc = connection.get('examples', 'richtext2');
doc.fetch(function(err) {
	if (err) throw err;
	if (doc.type === null) {
		doc.create([{insert: 'Hi!'}], 'rich-text'); // 'rich-text' is the type of data to be input in mongodb
		return;
	 }
		//      callback();
});


  
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws, req) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(9999, "0.0.0.0"); //listen to port 9999 and magic ip 0.0.0.0 to listen to external requests
  console.log('Listening on http://localhost:9999');

   }
