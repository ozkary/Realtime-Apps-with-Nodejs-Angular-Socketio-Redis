/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * socket.io middleware to enable the realtime integration with client applications.
    * ver. 1.0.0
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
    */
    var socketio = require('socket.io');
   
    module.exports.init = init;     

    function init (server,config, provider) {  
                       
        var io = socketio.listen(server);
        io.set( 'origins', 'http://localhost:* http://localhost:4200' );      //enable CORS support      
        var port = config.SOCKET.port;
        var onConnected = config.SOCKET.onconnect;
        var onCreated = config.SOCKET.oncreate;
        var onAdd = config.SOCKET.onadd;
        var onError = config.SOCKET.onerror;
        
        server.listen(port);              
       
        io.sockets.on('connection', function (socket) { 
            console.log('Socket is ready', socket.id);
            var data = null;
            provider.get().done(function(data){
                io.sockets.emit(onConnected, data);       //send full load
            },
            function(err){
                console.log(err);
                io.sockets.emit(onError, err);       //send error
            });

          
            /**
             * message to add a record
             */
            socket.on(onAdd, function(data, ack){  

                var item =data;                                
                provider.add(item).done(function(){
                    console.log('oncreate', data);
                    //io.sockets.emit(onCreated,data);  
                    ack();//acknowledge the client 
                },
                function(err){
                    console.log(err);
                    io.sockets.emit(onError, err);       //send error
                    ack();//acknowledge the client 
                }); 
                          
            });

            /**
             * checks to see if provider support pub/sub messaging
             */
            if (provider.subscribe){
                provider.subscribe.on("message",function(channel,data){
                    var item = JSON.parse(data);        //message is text
                    console.log('Provider pub message',channel, item);
                    io.sockets.emit(onCreated,item); 
                });
            }
           

            /**
             * tracks the session disconnect
             */
            socket.on('disconnect', function(){                      
                console.log('Socket disconnect');            
            });
        
        });                         

    }

   