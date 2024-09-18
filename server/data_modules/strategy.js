'use strict';
/*!
    * Copyright 2018-2022 ozkary.com
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
// module.exports.inProc = inProcRepository;
// module.exports.sql = sqlRepository;
// module.exports.redis = redisRepository;
// module.exports.broker = brokerRepository;

/**
 * service type
 */
const ServiceType = {
    InProc: 'inProc',
    SQL: 'sql',
    REDIS: 'redis',
    BROKER: 'broker'
};

/**
 * Strategy object which provides the different repos
 */
const RepoStrategy = {
    [ServiceType.InProc]: inProcRepository,
    [ServiceType.SQL]: sqlRepository,
    [ServiceType.REDIS]: redisRepository,
    [ServiceType.BROKER]: brokerRepository
};


/**
 * Factory function to create the corresponding strategy services
 * @param {ServiceType} type 
 * @param {server app} server  
 * @returns the repo instance
 */
function createRepository(type, server) {
    
    let repository = RepoStrategy[type];

    if (!repository){
        throw new Error('Invalid repository type');
    }
    
    if (type === ServiceType.BROKER) {
        // initialize the broker strategy with SQL and REDIS
        repository.init(RepoStrategy[ServiceType.SQL], RepoStrategy[ServiceType.REDIS]);
    }       

    return repository;
}

module.exports = {
    ServiceType,
    createRepository
};