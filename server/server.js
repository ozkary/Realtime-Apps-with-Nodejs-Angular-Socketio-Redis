'use strict';
/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * Realtime web clients with socketio and redis    
    * ver. 1.0.0
    * 
    * Repo: 
    * https://github.com/ozkary/Realtime-Apps-with-Nodejs-Angular-Socketio-Redis
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
    */
/*
 * require modules
 * use npm init to download all the dependencies
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var device  = require('express-device');

app.configure(function(){
	// I need to access everything in '/public' directly
	app.use(express.static(__dirname + '/public'));
	//set the view engine
	app.set('view engine', 'ejs');
	app.set('views', __dirname +'/views');
	app.use(device.capture());
});

app.use(bodyParser.json());

//include required modules
var $config = require('./modules/config.js');            //configuration
var $headers = require('./modules/headers.js');		      //access-control headers
var $error = require('./modules/error-handler.js');		  //error handler
var $api = require('./modules/telemetry-api.js');		    //apis

//TODO repository dependencies
//var $repository = require('./data_modules/inprocRepository');	  //in-proc repo
// var $repository = require('./data_modules/sqlRepository');    //sql repo
//  var $repository = require('./data_modules/redisRepository');    //redis repo

//TODO message broker
var $repository = require('./modules/message-broker');    //message broker
var $storage = require('./data_modules/sqlRepository');    //sql repo
var $cache = require('./data_modules/redisRepository');    //redis repo
$repository.init($cache,$storage);

//initialize modules
$headers.init(app);
$api.init(app, $repository);                             //api routes
$error.init(app);                                        //enable error handling

//js app to act as a device
app.get("/", function(req, res){
  res.render('index', {}); 
});

//TODO realtime socket integration
var $socket = require('./modules/socketio.js');		      //socketio module
$socket.init(server,$config,$repository);

//start the server app

var APP_PORT = $config.PORT;
var server = app.listen(APP_PORT, function () {
  
  var host = server.address().address;
  var port = server.address().port;

  console.log("Node.js Realtime Data App by ozkary.com listening at http://%s:%s", host, port);
  console.log("Open a browser and type the server address including the port");
  console.log("The angular client runs on localhost:4200");
  console.log("The socket client and server run on localhost:1337");
  console.log("The API server run on localhost:1338");
});