/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * redis module for data storage
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
*/    
    var redis = require('redis');
    var q = require('q')
    var $config = require('../modules/config');
    var $dbseed = require('./db-seeding.js');

    //client context
    const client = redis.createClient($config.REDIS.port, $config.REDIS.host); //{auth_pass:$config.REDIS.key} //add for cloud hosted
    const subscribe = redis.createClient($config.REDIS.port, $config.REDIS.host);   //enables pub/sub updates
    
    //export functions      
    module.exports.get = getTelemetry;
    module.exports.add=  addTelemetry;
    module.exports.subscribe= subscribe;
  
    const tableName = $config.REDIS.tablename;  //redis key to use as tablename/key
    subscribe.subscribe(tableName);             //subscribe to the table entries
  
    /**
     * gets the data from redis
     */
    function getTelemetry(){
               
        //async operation - return a promise
        return q.Promise(function(resolve, reject, notify){

            var ts = (new Date);    
            var from  =  ts.setHours(ts.getHours()-1);      //basic date range query
            var to  =  ts.setHours(ts.getHours()+1);       
            var args = [tableName,from,to];    
            
            client.zrevrangebyscore(args,function(err,data){
                
                if (err){
                    reject(err);
                }
                var result = data;

                if (!data || data.length === 0){                   
                    result = seedDatabase(tableName);
                }
                else{
                    result.forEach(function(item,idx){
                        result[idx]= JSON.parse(item);
                    });              
                }
                
                resolve(result);    //send back the promise with data
            });

        });           
    }

    /**
     * adds a record to redis
     * @param {*} item 
     */
    function addTelemetry(item) {
       
        var ts = (new Date());
        item.id = ts.getTime();
        
        if (!item.processed){
            item.processed = ts.toISOString();
        }
        console.log("redis repo add telemetry",item);
        return insertItem(tableName,item);                    
     };



    client.on('error', function(err){
        console.log('Redis error', err);
    });
  
    client.on('ready', function(){              
        console.log('Redis is ready');
    });

    /**
     * initialize the database with some test data
     */
    function seedDatabase(key){
        var data = $dbseed.init();
        
        data.forEach(function(item){            
            insertItem(key,item);
        });

        return data;
    }

    /**
     * Redis insert statement to sorted set zadd
     * @param {*} key 
     * @param {*} item 
     */
    function insertItem(key,item){
        var expire = $config.REDIS.expire;

        return q.Promise(function(resolve, reject, notify){
            var json = JSON.stringify(item);        
            client.multi()
            .zadd(key,item.id,json)
            .expire(key,expire)
            .publish(key,json)
            .exec(function(err){
    
                if (err){
                    reject(err);
                }else{
                    resolve(item);
                }
    
            });
        } );     
    }

  