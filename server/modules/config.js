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
        REDIS:{ 
            host:getEnv('REDISHOST','localhost'), 
            port:getEnv('REDISPORT','6379'), 
            key:getEnv('REDISKEY',''), 
            tablename:'telemetry:data',
            expire:300
        },       
        PORT: getEnv('PORT',1338),
        SOCKET:{
            port:getEnv('SOCKETPORT',1338) ,
            whitelist:getEnv("WHITELIST","http://localhost:*"),
            message:getEnv('SOCKETMSG','telemetry'), 
            onadd:'onadd',onconnect:'onconnect',oncreate:'oncreate', onerror:'onerror'
        }        
    };
      
    function getEnv(key, defaultValue){

        if (process.env[key] === undefined && defaultValue === undefined){
             throw new Error('You must create an environment variable for ' + key);
        }
        
        return process.env[key] || defaultValue;
    };
      
    module.exports = config;
      