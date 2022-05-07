'use strict';
/*!
    * Copyright 2018-2022 ozkary.com
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
    *   ogarcia 04/20/2022 initial implementation
    *
    */

//TODO load the correct data strategy

// repository dependencies
// step 1 use sql server repo
// step 2 add the realtime socket lib
// step 3 add redis cache
// step 4 add message broker
const inProcRepository = require('./inprocRepository');	 //in-proc repo
const sqlRepository = require('./sqlRepository');    //sql repo
const redisRepository = require('./redisRepository');  //redis repo

// TODO message broker
const brokerRepository = require('../modules/message-broker');    //message broker

// export the different providers
module.exports.inProc = inProcRepository;
module.exports.sql = sqlRepository;
module.exports.redis = redisRepository;
module.exports.broker = brokerRepository;