(function(){
	var socket = io(),
		$username = $('#username-input'),
		$room = $('#room-input'),
		room,
		username;
	var app = angular.module('cahApp', []);

	app.controller('MainController', function($scope) {
		$scope.message = 'Hi';
	});

	$username.keyup(function() {
		if (event.keyCode===13){
			addUser();
		}		
	});
	$room.keyup(function() {
		if (event.keyCode===13){
			joinRoom();
		}		
	});
	function addUser(){
		console.log('adduser');
		username = $username.val().trim();
		if (username){
			$('#name').fadeOut();
			$('#room').show();
			socket.emit('create user', username)
		}
	}
	function joinRoom(){
		console.log('Join Roomed');
		room = $room.val().trim();
		if (room){
			$('#room').fadeOut();
			socket.emit('join room', room);
		}
	}
})();