/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * message broker - distributes tasks among workers
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2019 initial implementation
    *
    */

   // exports
   module.exports.init = init;
      
   /**
    * initialize the provider with cache and storage    
    */
   function init(cache, storage) {
   
    module.exports.get = getData;
    module.exports.add= addData;   
    module.exports.subscribe= cache.subscribe;         
    
    //getData using the cache aside pattern
    //checks cache if not uses storage
    function getData (){
        console.log("broker get");
              
        return new Promise(function(resolve, reject){
               
            getFromProvider(cache,function(data,err){
               
                if (!data || data.length === 0){                   
                    
                    getFromProvider(storage,function(data, err){
                        if (err){
                            reject(err);
                        }else{
                            resolve(data);
                            //add to the cache
                            addToProvider(cache,data);
                        }                        
                    });

                }else{
                    resolve(data);
                }                
            });
                       
         });       
    }  
    
    //addData write-through writes to cache & database
    //maintains the data in sync
    //SR = System Requirement
    function addData (item) {    
        console.log("broker add");  
        
        return new Promise(function(resolve, reject){
            
            //SR - must be in storage first
            addToProvider(cache,item, function(data, err){
                                
                if (err){
                    reject(err);
                }else{
                    //replace with rabbitmq call 
                    //or use subscriber for the cache and route to storage
                    addToProvider(storage,item, function(data, err){
                       
                        if (err){
                            reject(err);
                        }else{
                            resolve(data);
                        }
                    });                                       
                }     

            });
                         
        });              
    }

    function getFromProvider(provider, callback){
        let result= null;
        let error = null;

        provider.get().then(function(data){
            result = data;
            callback(result,error);
        },
        function(err){
            error = err;    
            callback(result,error);                    
        });

    }

    function addToProvider(provider,item, callback){
        let result= null;
        let error = null;

        provider.add(item).then(function(data){
            result = data;
            callback(result,error);
        },
        function(err){
            error = err;   
            callback(result,error);                     
        });        
    }
 
};