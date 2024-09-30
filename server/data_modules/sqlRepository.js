/*!
    *
    * https://www.ozkary.com/ by Oscar Garcia
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
    const { DataSource } = require('typeorm');
    const connConfig = require('../ormconfig.json');
    const seedData  = require('./db-seeding.js');
      
    //export functions
    module.exports = {
        get: getTelemetry,
        add: addTelemetry,
        subscribe: null         //no pubsub support
    }
      
    let dataSource = null;

    /**
     * gets the telemetry info
     */
    async function getTelemetry() {

        const conn = await init();   
        try {
            
            const repository = conn.getRepository("telemetry");        
            const ts = new Date();
            const timeRange = new Date(ts.setHours(ts.getHours() - 1));
            const dateFilter = timeRange.toLocaleDateString() + ' ' + timeRange.toLocaleTimeString();
        
            let data = await repository.createQueryBuilder()
              .where("telemetry.processed >= :dt", { dt: dateFilter })
              .getMany();
        
            if (data.length === 0) {
              data = seedData.init();
              await seedTable(repository, data);              
            }
            
            return data;
            
        } catch (error) {
            handleError(error);
            throw error; // Re-throw the error to propagate it to the caller
        } finally {
            await conn.release();         
        }
        
    };

    /**
     * adds a new item
     * @param {*} item 
     */
    async function addTelemetry(item) {
        var ts = new Date();
        item.id = ts.getTime();

        if (!item.processed){
            item.processed = ts.toISOString();
        }
        const conn = await init();        

        try {
            
            const repository = conn.getRepository("telemetry");        
            const savedItem = await repository.save(item);
            console.log("sql repo add telemetry",item);
            return savedItem;
        
        } catch (error) {
            handleError(error);
            throw error; // Re-throw the error to propagate it to the caller
        } finally {
            await conn.release();            
        }                        
     };


    //  const connConfig2 = {
    //     "type": "mssql",
    //     "host": "localhost",
    //     "port": 1433,
    //     "username": "appuser",
    //     "password": "testing",
    //     "database": "Dataimport",
    //     "synchronize": false,  //true update table
    //     "logging": false, 
    //     "connectionIsolationLevel": "READ_UNCOMMITTED",
    //     "entities":[
    //         new orm.EntitySchema(require("../models/entity/telemetry"))
    //     ],
    //     "extra": {
    //         "encrypt": false, 
    //         "trustServerCertificate": true
    //     }
    // }

    async function init(){
                
        if (!dataSource){
            dataSource = new DataSource(connConfig);
            await dataSource.initialize();     
        }
        
        const conn = dataSource.createQueryRunner();
        return conn.manager;
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