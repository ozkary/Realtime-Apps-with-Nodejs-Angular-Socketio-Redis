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
    *   ogarcia 09/07/2024 update to latest dependencies
    *
    */
/*
 * require modules
 * use npm install from the server folder to download all the dependencies
 */

// core modules
// core modules
const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const device = require('express-device');

// app modules
const config = require('./modules/config.js');
const headers = require('./modules/headers.js');
const error = require('./modules/error-handler.js');
const api = require('./modules/telemetry-api.js');
const strategy = require('./data_modules/strategy.js');
const socket = require('./modules/socketio.js');

const app = express();
const server = createServer(app);

// Middleware and Configuration
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname +'/views');
app.use(device.capture());
app.use(bodyParser.json());


//TODO repository strategy
//step 1 use sql server repo
//step 2 add the realtime socket lib
//step 3 add redis cache
//step 4 add message broker
const repository = strategy.broker;

// initialize the repo for the broker only with redis and sql
repository.init(strategy.redis, strategy.sql);
socket.init(server, config, repository);
headers.init(app);
api.init(app, repository);
error.init(app);

// Routes
app.get("/", (req, res) => {
  res.render('index', {});
});

// Start the Server
const APP_PORT = config.PORT;
server.listen(APP_PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Node.js Realtime Data App by ozkary.com listening at http://${host}:${port}`);
  console.log(`Open a browser and type the server address including the port`);
  console.log(`The angular client runs on localhost:4200`);
  console.log(`The socket client and server run on localhost:${config.SOCKET.port}`);
  console.log(`The API server runs on localhost:${config.PORT}`);
  console.log(`The test app runs on localhost:${config.SOCKET.port}`);
  console.log(`Redis server runs on localhost:${config.REDIS.port}`);
  console.log(`Redis channel name: telemetry:data`);
});

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

