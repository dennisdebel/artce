var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
var pathie; //define global var for path use
var db;
var path = require('path');
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

ShareDB.types.register(richText.type);

startServer();

function startServer() {
	// Create a web server to serve files and listen to WebSocket connections
	var app = express();
 
	app.get('/', function(req, res, next){ //redirect when root dir is requested 
        res.send('go home'); //send raw html strings
	});


	app.get('/admin', function(req, res, next){ //redirect to admin page
   
		// Connection URL 
		var url = 'mongodb://localhost:27017/test';
		// Use connect method to connect to the Server 
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			//console.log("Connected correctly to Mongodb server");

			db.listCollections().toArray(function(err, collections){
				var answer = '';
				collections.forEach(function(coll){ //iterate over json/bson object returend by listCollections
				if (coll.name.substr(0,1) == "/") {
					answer =  answer + "<a href="+coll.name+">"+coll.name+"</a><br>";
				}

			});

		res.send("<h2>existing pads:</h2>"+answer); //send html response

		});
																										});
});
																														    
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
