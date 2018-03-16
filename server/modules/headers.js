/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * add access control headers   
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
*/
module.exports.init = function (app) {

    app.use(function (req, res, next) {

            console.log('CORS Origin',req.headers.origin);         
        
            if (req.headers.origin){
               
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
            }
                    
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,Accept');
        
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
        
            if ('OPTIONS' == req.method) {
                res.send(200);
            }
            else {
                next();  // Pass to next layer of middleware
            }
        });
    
}