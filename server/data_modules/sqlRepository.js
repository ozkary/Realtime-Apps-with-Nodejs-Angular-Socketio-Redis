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
    //const q = require('q')
    const orm =  require("typeorm");

    const $dbseed = require('./db-seeding.js');
    
    //export functions
    module.exports.get = getTelemetry;
    module.exports.add= addTelemetry;   
    module.exports.subscribe= null;         //no pubsub support
      
    /**
     * gets the telemetry info
     */
    function getTelemetry() {

        return new Promise(async function(resolve, reject){
           let context = init();
           context.then( async function(conn){
               let repository = conn.getRepository("telemetry");  
               let ts = (new Date);               
               let timeRange = new Date(ts.setHours(ts.getHours()-1));
               let dateFilter = timeRange.toLocaleDateString() + ' ' + timeRange.toLocaleTimeString();

               let data = await repository.createQueryBuilder()
                                .where("telemetry.processed >= :dt", { dt: dateFilter})
                                .getMany();

                if (data.length ===0){
                    data =$dbseed.init();
                   await seedTable(repository, data);
                   resolve(data);
                   await conn.close(); 
                }else{
                    resolve(data);
                    await conn.close();     
                }
           })
           .catch(function(err){
                handleError(err);
                reject(err);              
           });
                      
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
       
        return new Promise(async function(resolve, reject){

           let context = init();
           context.then(async function(conn){
                let repository = conn.getRepository("telemetry");
                await repository.save(item).then(function(savedItem){
                    resolve(savedItem);
                }).catch(function(err){
                    handleError(err);
                });                      
                conn.close();

           })
           .catch(function(err){               
                handleError(err);
                reject(err);
                
           });
                        
        });
                
     };


     function init(){
        var context =  orm.createConnection(
            {"type": "mssql",
        "host": "localhost",
        "port": 1433,
        "username": "appuser",
        "password": "testing",
        "database": "Dataimport",
        "synchronize": false,  //true update table
        "logging": false, 
        "entities":[
            new orm.EntitySchema(require("../models/entity/telemetry"))
        ]
    });        
          
        return context;
    }

    function handleError(err){
        console.log(err);
    }

    async function seedTable(repo, data){

        if (data != null){

            return repo.createQueryBuilder("telemetry batch insert")
            .insert()
            .into("telemetry")
            .values(data)
            .execute();      
        }        
    }