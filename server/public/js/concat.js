// connect to our socket server
var socket = io.connect('http://127.0.0.1:1338/');

var app = app || {};
var onConnected = 'onconnect';
var onCreated = 'oncreate';
var onAdd = 'onadd';


// shortcut for document.ready
$(function(){
	//setup some common vars
	var $blastField = $('#blast'),
		$allPostsTextArea = $('#allPosts'),
		$clearAllPosts = $('#clearAllPosts'),
		$sendBlastButton = $('#send');


	//SOCKET STUFF
	socket.on(onConnected, function(data){
		updateData(data,true);				
	});

	socket.on(onCreated, function(data){
		updateData(data);		
	});
	
	$clearAllPosts.click(function(e){
		$allPostsTextArea.text('');
	});

	$sendBlastButton.click(function(e){

		var data = $blastField.val();
		if(data.length){
			socket.emit(onAdd, data, 
				function(data){
					$blastField.val('');
				});
		}


	});

	$blastField.keydown(function (e){
	    if(e.keyCode == 13){
	        $sendBlastButton.trigger('click');//lazy, but works
	    }
	})

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
	
});