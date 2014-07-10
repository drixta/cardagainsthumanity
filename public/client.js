(function(){
	var socket = io(),
		$username = $('#usernameInput'),
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
	function addUser(){
		console.log('adduser');
		username = $username.val().trim();
		if (username){
			socket.emit('create user', username)
		}
	}
})();