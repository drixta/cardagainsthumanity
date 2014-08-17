(function(){
	var socket = io();
	PageState = React.createClass({
		getInitialState: function(){
			return {
				currentPage : 'username',
				username: '',
				room: ''
			};
		},
		handleSubmit: function(state, input){
			if (this.state.currentPage === 'username'){
				this.setState({username:input});
			}
			else if (this.state.currentPage === 'roomSelect') {
				this.setState({room:input});
			}
			this.setState({currentPage: state});
		},
		render: function(){
			var	partial;

			if (this.state.currentPage === 'username') {
				partial = <UsernameSetUp handleSubmit={this.handleSubmit} />;
			}
			else if (this.state.currentPage === 'roomSelect') {
				partial = <RoomSelect handleSubmit={this.handleSubmit} />;
			}
			else if (this.state.currentPage === 'gameBoard') {
				console.log(this.state.username);
				partial = <GameBoard username={this.state.username} room={this.state.room}/>;
			}
			return partial;
		}
	});

	var UsernameSetUp = React.createClass({
		getInitialState: function(){
			return {
				name : ''
			}
		},
		componentDidMount: function(){
			document.getElementsByTagName('input')[0].focus();
		},
		handleChange: function(event){			
			this.setState({name: event.target.value.trim()})
		},
		handleSubmit : function(){
			if (this.state.name.length) {
				socket.emit('create user',this.state.name);
			}
			this.props.handleSubmit('roomSelect',this.state.name);
		},
		checkEnter: function(event){
			if (event.keyCode === 13){
				this.handleSubmit();
			}
		},
		render: function(){
			var name = this.state.name;
			return (
				<div className="cah-hero-input">
					<h1>Your name?</h1>
					<input id="name-input" value={name} type="text" onKeyDown={this.checkEnter} onChange={this.handleChange} />
				</div>
			);
		}
	});

	var RoomSelect = React.createClass({
		getInitialState: function(){
			return {
				room : ''
			}
		},
		handleChange: function(event){			
			this.setState({room: event.target.value.trim()})
		},
		componentDidMount: function(){
			document.getElementsByTagName('input')[0].focus();
		},
		handleSubmit : function(){
			if (this.state.room.length) {
				socket.emit('join room',this.state.room);
			}
			this.props.handleSubmit('gameBoard', this.state.room);
		},
		checkEnter: function(event){
			if (event.keyCode === 13){
				this.handleSubmit();
			}
		},
		render: function(){
			var room = this.state.room;
			return (<div className="cah-hero-input">
						<h1>Enter room name</h1>
						<input id="room-input" value={room} type="text" onKeyDown={this.checkEnter} onChange={this.handleChange} />
					</div>
			);
		}
	});

	var GameBoard = React.createClass({
		render: function(){
			return (<div>
						<h1>This is room {this.props.room}</h1>
						<h2>Welcome {this.props.username}</h2>
						<WhiteCard text='A cooler full of organs'/>
					</div>
			);
		}
	});

	var WhiteCard = React.createClass({
		render: function(){
			return (<div className='card white-card'>
						<p>{this.props.text}</p>
						<CardFooter/>
					</div>
			);
		}
	});

	var CardFooter = React.createClass({
		render: function(){
			return (<div className='card-footer'>
						<div className='card-logo'></div>
						<span>Cards Against Humanity</span>
					</div>
			);
		}
	});
	React.renderComponent(
		PageState(null),
		document.getElementById('everything')
	);
})();