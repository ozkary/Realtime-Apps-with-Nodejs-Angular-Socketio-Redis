'use strict';
/*!
    *
    * https://www.ozkary.com/ by Oscar Garcia
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
var serverUrl = 'http://localhost:';
var socketPort = '1338';
var apiPort = '1338';

var socketUrl= serverUrl+socketPort;
var apiUrl = serverUrl+apiPort;

var socket=null;
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
		$sendButton = $('#send'),
		$addButton = $('#add');

	$('#radioBtn a').on('click', function(){
		var sel = $(this).data('title');
		var tog = $(this).data('toggle');
		
		$('#'+tog).prop('value', sel);		
		$('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
		$('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
		
		let useSocket = sel === 'socket';
		$sendButton.prop('disabled', useSocket);

		if (useSocket){
			$sendButton.removeAttr('disabled');
			$addButton.attr('disabled','true');
		}else{
			$addButton.removeAttr('disabled');
			$sendButton.attr('disabled','true');
		}
		//lazy load sockets
		if (useSocket && socket === null) {												
			socket = initSocket(updateData,showMessage);			
		} else if (!useSocket && socket) {
			closeSocket();
		}
	})

	$.ajaxSetup({
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
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
			$sendButton.html('Run Realtime');
		}else{
			$sendButton.html('Stop');
			sendMetrics();
			interval = setInterval(function(){
				sendMetrics();
			},2500);
	
		}
		
	});

	$blastField.keydown(function (e){
	    if(e.keyCode == 13){
	        $sendButton.trigger('click');
	    }
	})

	/***
	 * Sends the telemetry json data.
	 * Determines what channel is selected api or socket
	 * 
	 */
	function sendMetrics(){
		const item = {"deviceId":deviceId,"temperature":0,"humidity":0,"sound":0};
		item.deviceId += getValue(100,150).toString();
		item.processed= (new Date).toISOString();
		item.temperature = getValue(30,40);
		item.humidity = getValue(60,69);
		item.sound = getValue(120,125);		
		const json = JSON.stringify(item);
		$blastField.val(json);

		var channel= $("#channel").val();

		if (channel === 'api'){
			const route = '/api/telemetry';
			$.post( apiUrl+route,
				json, 
				function( data ) {
				$blastField.val('');
				updateData(data);
				});			

		}else{			
			socket.emit(onAdd, item,function(data){
				$blastField.val('');
				updateData(data);
			});
			
		}

	}

	
	/**
	 * updates the UI with the new data
	 */
	function updateData(data,reset=false){
		
		if (typeof(data) !== "undefined"){
			let copy = $allPostsTextArea.html();
			
			if (reset){
				copy= '';
			}

			$allPostsTextArea.html('<p>' + copy + JSON.stringify(data) + "</p>");
			$allPostsTextArea.scrollTop($allPostsTextArea[0].scrollHeight - $allPostsTextArea.height());
		}		
	}
	
	  //generates a random value
	  function getValue(min, max){
		return  Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function showMessage(msg){
		console.log(msg);
	}

	function initSocket(fnStatus, fnConsole){

		if (typeof io === "undefined"){
			updateData('Socket is not available',false);
			return;
		}
		const socket = io.connect(socketUrl);

		//SOCKET events
		socket.on(onConnected, function(data){
			fnStatus(data,true);				
		});

		socket.on(onCreated, function(data){
			if (data){
				fnStatus(data);
			}			
		});

		socket.on("error", function(err) {
			fnConsole(err);       
		});

		socket.on("connect", function(){
			fnConsole("connect");       
		});

		return socket;
	}

	/**
	 * disconect the socket
	 */
	function closeSocket(){

		if (typeof socket !== "undefined" && socket){			
			socket.removeAllListeners();
			socket.disconnect(true);		
			socket = null;	
		}
	}
});