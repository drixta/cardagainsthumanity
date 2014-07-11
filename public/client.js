(function(){
	var socket = io(),
		room,
		username;
	var app = angular.module('cahApp', []);

	app.controller('MainController', function() {
		this.template = 'username';
		this.username = '';
		this.room = '';
		this.getTemplate = function(e){
			if (e.keyCode === 13) {
				switch (this.template){
					case 'username':
						this.addUser();
						this.template = 'room';
						break;
					case 'room':
						this.joinRoom();
						this.template = 'game';
						break;
				}
			}
		};
		this.isTemplate = function(template){
			return this.template === template;
		};
		this.addUser = function(){
			var $username = $('#name-input');
			username = $username.val().trim();
			if (username){
				socket.emit('create user', username)
			}
		}
		this.joinRoom = function(){
			var $room = $('#room-input');
			room = $room.val().trim();
			if (room){
				socket.emit('join room', room);
			}
		}
	});
})();