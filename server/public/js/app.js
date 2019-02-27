'use strict';
/*!
    * Copyright 2018 ozkary.com
    * http://ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *
    * ozkary.realtime.app
    * Realtime web clients with socketio and redis    
    * ver. 1.0.0
    * 
    * Repo: 
    * https://github.com/ozkary/Realtime-Apps-with-Nodejs-Angular-Socketio-Redis
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
    */
// connect to the server on two different ports
var serverUrl = 'http://127.0.0.1:';
var socketPort = '1337';
var apiPort = '1338';

var socketUrl= serverUrl+socketPort;
var apiUrl = serverUrl+socketPort;

var socket = io.connect(socketUrl);

var app = app || {};
var onConnected = 'onconnect';
var onCreated = 'oncreate';
var onAdd = 'onadd';
var deviceId="0ZA-";


// shortcut for document.ready
$(function(){
	//setup some common vars
	var $blastField = $('#blast'),
		$allPostsTextArea = $('#allPosts'),
		$clearAllPosts = $('#clearAllPosts'),
		$sendButton = $('#send');
		$addButton = $('#add');
		
	//SOCKET events
	socket.on(onConnected, function(data){
		updateData(data,true);				
	});

	socket.on(onCreated, function(data){
		updateData(data);		
	});

	socket.on("error", function(err) {
		console.log("error",err);       
	});

	socket.on("connect", function(){
		console.log("connect");       
	});

	//UI events
	$clearAllPosts.click(function(e){
		$allPostsTextArea.text('');
	});

	$addButton.click(function(e){		
		sendMetrics();
	});

	var interval = null;
	$sendButton.click(function(e){
		
		if (interval){
			clearInterval(interval);
			interval =null;
			$sendButton.html('Run');
		}else{
			$sendButton.html('Stop');
			sendMetrics();
			interval = setInterval(function(){
				sendMetrics();
			},2000);
	
		}
		
	});

	$blastField.keydown(function (e){
	    if(e.keyCode == 13){
	        $sendButton.trigger('click');//lazy, but works
	    }
	})

	/***
	 * Sends the telemetry json data.
	 * Determines what channel is selected api or socket
	 * 
	 */
	function sendMetrics(){
		var item = {"deviceId":deviceId,"temperature":0,"humidity":0,"sound":0};
		item.deviceId += getValue(100,150).toString();
		item.processed= (new Date).toISOString();
		item.temperature = getValue(30,40);
		item.humidity = getValue(60,69);
		item.sound = getValue(120,125);		
		var json = JSON.stringify(item);
		$blastField.val(json);

		var channel= $("input:radio[name=channel]:checked").val();

		if (channel === 'api'){
			
			$.post( apiUrl, function( data ) {
				$blastField.val('');
			});			

		}else{
			
			socket.emit(onAdd, item,function(data){
				$blastField.val('');
			});
			
		}

	}

	/**
	 * updates the UI with the new data
	 */
	function updateData(data,reset){
		var copy = $allPostsTextArea.html();
		if (reset){
			copy= '';
		}
		$allPostsTextArea.html('<p>' + copy + JSON.stringify(data) + "</p>");
		$allPostsTextArea.scrollTop($allPostsTextArea[0].scrollHeight - $allPostsTextArea.height());
	}
	
	  //generates a random value
	  function getValue(min, max){
		return  Math.floor(Math.random() * (max - min + 1)) + min;
	}
});