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
    const socketio = require('socket.io');
   
    module.exports.init = init;     

    function init (server,config, provider) {  
                       
        const io = socketio.listen(server);        
        io.set('origins', config.SOCKET.whitelist);      //enable CORS support     
        const port = config.SOCKET.port;
        const onConnected = config.SOCKET.onconnect;
        const onCreated = config.SOCKET.oncreate;
        const onAdd = config.SOCKET.onadd;
        const onError = config.SOCKET.onerror;
        var hasSubscribed = false;
        
        server.listen(port);              
       
        io.sockets.on('connection', function (socket) { 
            console.log('Socket is ready', socket.id);
            var data = null;
            provider.get().then(function(data){
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
                provider.add(item).then(function(){                    
                    if ( typeof provider.subscribe === 'undefined' || !provider.subscribe){                        
                        console.log('oncreate', data); 
                        io.sockets.emit(onCreated,data);  //replace with pub/sub
                    }                    
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
            if (provider.subscribe && !hasSubscribed){
                //use below for patter matching mytable:* 
                //provider.subscribe.psubscribe
                hasSubscribed = true;
                
                provider.subscribe.on("message",function onProviderMessage(channel,data){
                    var item = JSON.parse(data);        //message is text
                    console.log('Provider pub message',channel, item);
                    if (item){
                        io.sockets.emit(onCreated,item); 
                    }                    
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

   