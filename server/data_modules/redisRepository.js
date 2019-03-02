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
        return q.Promise(async function(resolve, reject, notify){

            let ts = (new Date);    
            let from  =  ts.setHours(ts.getHours()-1);      //basic date range query
            let to  =  ts.setHours(ts.getHours()+1);       
            let args = [tableName,from,to];    
            
            await client.zrangebyscore(args,function(err,data){
                               
                let result = data;

                if (!data || data.length === 0){                   
                    result = seedDatabase(tableName);
                }
                else{
                    result.forEach(function(item,idx){
                        result[idx]= JSON.parse(item);
                    });              
                }

                let promise = (err) ? reject : resolve;
                let response = err || result;
                
                promise(response);    //send back the promise with data
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



    client.on('error', (err) => {
        console.log('Redis error', err);
    });
  
    client.on('ready', () => {              
        console.log('Redis is ready');
    });

    client.on('end', () => {
        console.log(tag,'Redis closed')
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

        return q.Promise( async function(resolve, reject, notify){
            var json = JSON.stringify(item);        
            await client.multi()
            .zadd(key,item.id,json)
            .expire(key,expire)
            .publish(key,json)
            .exec((err)=>{
               
                let promise = (err) ? reject : resolve;
                let response = err || item;
                
                promise(response);   

            });
        } );     
    }
 