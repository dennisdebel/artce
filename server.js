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

//create persistency, monog db integration
//db = require('sharedb-mongo')('mongodb://localhost:27017/test');
//var backend = new ShareDB({db});

//createDoc(startServer); //create new doc and then start server (as callback)...weird
startServer();

// Create initial document then fire callback
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get('examples', 'richtext2');
  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{insert: 'Hi!'}], 'rich-text', callback); //'rich-text' is the type of data to be input in mongodb
      return;
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  var app = express();
 
// app.all('*', function(req, res, next){ //listen to http requests 
//     var path = req.param('path'); //filter out the requested paths for use to create new databases
  //   console.log(req.path); //gets the fkn path from the browser....
//   app.use(express.static('static'));
  //  app.use(express.static('node_modules/quill/dist'));
		 //    var filePath = 'art/' + project + '/' + project;
		//	     res.render(filePath)
		   app.use(express.static('static'));
		       app.use(express.static('node_modules/quill/dist'));

	//	});
 app.get('*', function(req, res, next){ //listen to all http requests 
      var path = req.param('path'); //filter out the requested paths for use to create new databases
           console.log(req.path); //gets the fkn path from the browser....
                                     res.sendFile(__dirname + '/static/index.html'); //send all req's to that file
                                              // db.close();
//var db = require('sharedb-mongo')('mongodb://localhost:27017/test');
// var db = require('sharedb-mongo')('mongodb://localhost:27017/'+path); //works! only 1 time! (until server restart fuck)
        app.use(express.static('static'));
         app.use(express.static('node_modules/quill/dist'));
});

//app.all('*', function(req, res, next, callback){ 
//console.log(req.path);

//app.use(express.static('static'));
  //             app.use(express.static('node_modules/quill/dist'));
// res.redirect('/'); //mjeh redirect nu naar main page mjaaa
//pathie = req.path; 
//console.log(pathie);
//});



//	app.use(express.static('static'));
//    app.use(express.static('node_modules/quill/dist'));
//
//    app.use(express.static(path.relative(__dirname,'static')));
//app.use((req, res) => res.sendFile(`${__dirname}/index.html`))



//	app.all('*', function (req, res, next) {
		//  console.log('Hello from serverjs') //shows this message in terminal when hittin the url /example
//				  res.send(req.path); //echos path in plaintext in browser
//			var path=req.path;
//next()
//				});

//THIS LOCATION FOR MONOG WORKED!
//create persistency, monog db integration
var db = require('sharedb-mongo')('mongodb://localhost:27017/test');
var backend = new ShareDB({db});
var connection = backend.connect();
var doc = connection.get('examples', 'richtext2');
console.log("requested path is: " + path);
doc.fetch(function(err) {
	if (err) throw err;
	if (doc.type === null) {
		doc.create([{insert: 'Hi!'}], 'rich-text'); // 'rich-text' is the type of data to be input in mongodb
		return;
	 }
		//      callback();
});


  
 // app.use(express.static('static'));
//  app.use(express.static('node_modules/quill/dist'));
  var server = http.createServer(app);

  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({server: server});
  wss.on('connection', function(ws, req) {
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  server.listen(8080);
  console.log('Listening on http://localhost:8080');

   }
