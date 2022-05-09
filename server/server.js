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
 * use npm isntall from the server folder to download all the dependencies
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
var config = require('./modules/config.js');            //configuration
var headers = require('./modules/headers.js');		      //access-control headers
var error = require('./modules/error-handler.js');		  //error handler
var api = require('./modules/telemetry-api.js');		    //apis

//TODO repository strategy
//step 1 use sql server repo
//step 2 add the realtime socket lib
//step 3 add redis cache
//step 4 add message broker
const strategy = require('./data_modules/strategy');
const repository = strategy.broker;
// initialize the repo for the broker only
repository.init(strategy.redis, strategy.sql); // add params for the broker

//realtime socket integration
const socket = require('./modules/socketio.js');		      //socketio module
socket.init(server, config, repository);

//initialize modules
headers.init(app);
api.init(app, repository);                             //api routes
error.init(app);                                        //enable error handling

//js app to act as a device
app.get("/", function(req, res){
  res.render('index', {}); 
});

//start the server app

const APP_PORT = config.PORT;
app.listen(APP_PORT, function () {
  
  const host = server.address().address;
  const port = server.address().port;

  console.log("Node.js Realtime Data App by ozkary.com listening at http://%s:%s", host, port);
  console.log("Open a browser and type the server address including the port");
  console.log("The angular client runs on localhost:4200");
  console.log("The socket client and server run on localhost:" + `${config.SOCKET.port}`);
  console.log("The API server run on localhost:"+ `${config.PORT}`);
  console.log("The test app runs on localhost:"+ `${config.SOCKET.port}`);
  console.log("Redis server run on localhost:"+ `${config.REDIS.port}`);
});