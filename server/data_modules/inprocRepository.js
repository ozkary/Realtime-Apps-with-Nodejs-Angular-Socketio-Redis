/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * repository module to manage the data source integration
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
*/    
    var $dbseed = require('../data_modules/db-seeding');

    var data = [];
    
    //export functions
    module.exports.get = getTelemetry;
    module.exports.add= addTelemetry;   
    module.exports.subscribe= null;         //no pubsub support
      
    /**
     * gets the telemetry info
     */
    function getTelemetry() {

        return new Promise(function(resolve){
            
            if (data.length ===0){
                data =$dbseed.init();
            }          
            resolve(data);
        });       
    };

    /**
     * adds a new item
     * @param {*} item 
     */
    function addTelemetry(item) {
        var ts = (new Date());
        item.id = ts.getTime();
        if (!item.processed){
            item.processed = ts.toISOString();
        }
       
        return new Promise(function(resolve){
            data.push(item);                   
            console.log("in-proc repo add telemetry",item);        
            resolve(item);
        });
                
     };