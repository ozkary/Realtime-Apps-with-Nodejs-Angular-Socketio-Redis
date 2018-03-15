/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * telemetry api - GET the current data and POST to add new items
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
    */
    module.exports.init = function (app,provider) {
        
        //add the route for login/out handlers    
        app.get('/api/telemetry', getData)
        app.post('/api/telemetry', addData)
    
        //getData
        function getData (req, res){
            console.log("GET Telemetry");
            
            provider.get().done(function(data){
                res.json(data);  
            },
            function(err){
                console.log(err);
                res.status(400).send({ error: err });                
            });
        }  
        
        //addData
        function addData (req, res) {    
                                    
            var data = req.body;
            console.log("POST Telemetry",data); 

            provider.add(item).done(function(result){
                res.json(result);                 
            },
            function(err){
                console.log(err);
                res.status(400).send({ error: err });     
            });                        
        }
     
    };