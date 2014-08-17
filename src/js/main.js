/** @jsx React.DOM */
(function(){
	var socket = io();
	PageState = React.createClass({displayName: 'PageState',
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
				partial = UsernameSetUp({handleSubmit: this.handleSubmit});
			}
			else if (this.state.currentPage === 'roomSelect') {
				partial = RoomSelect({handleSubmit: this.handleSubmit});
			}
			else if (this.state.currentPage === 'gameBoard') {
				console.log(this.state.username);
				partial = GameBoard({username: this.state.username, room: this.state.room});
			}
			return partial;
		}
	});

	var UsernameSetUp = React.createClass({displayName: 'UsernameSetUp',
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
				React.DOM.div({className: "cah-hero-input"}, 
					React.DOM.h1(null, "Your name?"), 
					React.DOM.input({id: "name-input", value: name, type: "text", onKeyDown: this.checkEnter, onChange: this.handleChange})
				)
			);
		}
	});

	var RoomSelect = React.createClass({displayName: 'RoomSelect',
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
			return (React.DOM.div({className: "cah-hero-input"}, 
						React.DOM.h1(null, "Enter room name"), 
						React.DOM.input({id: "room-input", value: room, type: "text", onKeyDown: this.checkEnter, onChange: this.handleChange})
					)
			);
		}
	});

	var GameBoard = React.createClass({displayName: 'GameBoard',
		render: function(){
			return (React.DOM.div(null, 
						React.DOM.h1(null, "This is room ", this.props.room), 
						React.DOM.h2(null, "Welcome ", this.props.username), 
						WhiteCard({text: "A cooler full of organs"})
					)
			);
		}
	});

	var WhiteCard = React.createClass({displayName: 'WhiteCard',
		render: function(){
			return (React.DOM.div({className: "card white-card"}, 
						React.DOM.p(null, this.props.text), 
						CardFooter(null)
					)
			);
		}
	});

	var CardFooter = React.createClass({displayName: 'CardFooter',
		render: function(){
			return (React.DOM.div({className: "card-footer"}, 
						React.DOM.div({className: "card-logo"}), 
						React.DOM.span(null, "Cards Against Humanity")
					)
			);
		}
	});
	React.renderComponent(
		PageState(null),
		document.getElementById('everything')
	);
})();