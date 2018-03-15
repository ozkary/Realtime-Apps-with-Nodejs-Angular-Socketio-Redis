/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * configuration settings    
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
    */

    var config = {
        REDIS:{ host:getEnv('REDISHOST','localhost'), port:getEnv('REDISPORT','6379'), key:getEnv('REDISKEY',''), tablename:'telemetry:data',expire:300},       
        PORT: getEnv('PORT',1338),
        SOCKET:{port:getEnv('SOCKETPORT',1337) , message:getEnv('SOCKETMSG','telemetry'), onadd:'onadd',onconnect:'onconnect',oncreate:'oncreate', onerror:'onerror'}        
    };
      
    function getEnv(key, dflt){

        if (process.env[key] === undefined && dflt === undefined){
             throw new Error('You must create an environment variable for ' + key);
        }
        
        return process.env[key] || dflt;
    };
      
    module.exports = config;
      