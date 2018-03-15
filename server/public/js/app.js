/*************************************
//
// ozkary-realtime app
//
**************************************/

// connect to our socket server
var socket = io.connect('http://127.0.0.1:1337/');

var app = app || {};
var onConnected = 'onconnect';
var onCreated = 'oncreate';
var onAdd = 'onadd';
var deviceId="0ZA-001";


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

	function sendMetrics(){
		var item = {"deviceId":deviceId,"temperature":0,"humidity":0,"sound":0};
		item.processed= (new Date).toISOString();
		item.temperature = getValue(30,40);
		item.humidity = getValue(60,69);
		item.sound = getValue(120,125);		
		var json = JSON.stringify(item);
		$blastField.val(json);

		socket.emit(onAdd, item,function(data){
				$blastField.val('');
			});
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