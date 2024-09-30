'use strict';
/*!
    *
    * https://www.ozkary.com/ by Oscar Garcia
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
const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const device = require('express-device');
const cors = require('cors');

// app modules
const config = require('./modules/config.js');
const headers = require('./modules/headers.js');
const error = require('./modules/error-handler.js');
const api = require('./modules/telemetry-api.js');
const { createRepository , ServiceType } = require('./data_modules/strategy.js');
const socket = require('./modules/socketio.js');

const app = express();
// const server = createServer(app);

const server = createServer(app, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Real-time app staring\n');
});

// cors configuration
const whitelist = ['http://localhost:4200','http://localhost:1338'];
const corsOptions = {
  origin: function (origin, callback) {    
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Middleware and Configuration
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname +'/views');
app.use(device.capture());
app.use(bodyParser.json());
app.use(cors(corsOptions));

headers.init(app);
error.init(app);

//Repository strategy

// version 1 sql server repo and API integration
// const repository = createRepository(ServiceType.SQL);
// api.init(app, repository);

// version 2 add the realtime socket support
// socket.init(server, config, repository);

// version 3 add redis cache support
// const repository = createRepository(ServiceType.REDIS);
// socket.init(server, config, repository);

// version 4 add message broker with SQL and Redis support
const repository = createRepository(ServiceType.BROKER);
socket.init(server, config, repository);
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

