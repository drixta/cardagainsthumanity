/** @jsx React.DOM */
(function(){
	var socket = io();
	var getAngle = function(index){
		var initialAngle = -15;
		var delta = index * Math.abs(initialAngle / 5);
		return initialAngle + delta;
	};
	var getLeft = function(index){
		var initialLeft = 15;
		return initialLeft + (5*index);
	};
	var getHeight = function(index,delta){
		var initialHeight = delta;
		var height;
		height = (Math.abs(Math.abs(initialHeight - (index* (delta/5))) - delta) - (1*index)) - 10;
		return height;
	};

	var spreadCard = function(){
		var hand = document.getElementsByClassName('player-hand')[0];
		var positions = getPosition();
		var i;
		for (i = 0; i < positions.length; i++){
			hand.children[i].style.cssText = 'transform: rotate(' + positions[i].angle + 'deg);left:' + positions[i].left + '%;bottom:' + positions[i].bottom +'%;';
		}
	};
	var getPosition = function(){
		var hand = document.getElementsByClassName('player-hand')[0];
		var cardsPosition = [];
		var position;
		for (var i = 0; i < 10; i++){
			position = {};
			position.angle = getAngle(i);
			position.bottom = getHeight(i,10) ;
			position.left = getLeft(i);
			cardsPosition.push(position);
		}
		return cardsPosition;
	};

	PageState = React.createClass({displayName: 'PageState',
		getInitialState: function(){
			return {
				currentPage : 'username',
				username: '',
				room: ''
			};
		},

		/*	CAHInitInfo = {
			username: "abc",
			room: "a1b2c3",
		}
		*/
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
						React.DOM.h1(null, "Room ", this.props.room), 
						React.DOM.h2(null, "Welcome ", this.props.username), 
						PlayerHand({cardsPosition: getPosition()})
					)
			);
		}
	});

	var RoomPopulation = React.createClass({displayName: 'RoomPopulation',
		render: function(){
			return (React.DOM.div(null
					)
					)
		}
	});

	var PlayerHand = React.createClass({displayName: 'PlayerHand',
		getInitialState: function(){
			return {cards: []}
		},
		componentDidMount: function(){
			var self = this;
			socket.emit('requestInitialCards', this.props.room);
			socket.on('responseInitialCards', function(data){
				if (self.isMounted()){
					console.log(data);
					self.setState({
						cards: data.ACards
					})
				}
			});
		},
		componentDidUpdate: function(){
			setTimeout(spreadCard,2);
		},
		render: function(){
			var self = this;
			var cards = this.state.cards.map(function(card, index){
				return ACard({key: card.id, onClick: self.attachCard, position: self.props.cardsPosition[index], text: card.text});
			});
			return React.DOM.div({className: "player-hand"}, 
					cards
				   )
		}

	});

	var ACard = React.createClass({displayName: 'ACard',
		getInitialState: function(){
			return {
				attached: false,
			}
		},
		handleClick: function(evt){
			var target = evt.currentTarget,
				self = this;

			if (this.state.attached) {
				target.style.cssText = 'transition: left 0.3s, bottom 0.3s; left:' + this.props.position.left + '%; top: "";bottom:' + this.props.position.bottom +'%; transform: rotate(' + this.props.position.angle + 'deg)';
				this.setState({attached: false});
				window.onmousemove = null;
				return;
			}
			target.style.transform = 'rotate(0deg)';
			target.style.bottom = '';
			this.setState({attached: true});
			window.onmousemove = function(evt) {
				target.style.cssText = 'transition: left 0s, top 0s; left:'+ (evt.clientX - 105) +'px;top:' + (evt.clientY- 145)  + 'px';
			}
		},
		render: function(){
			return (React.DOM.div({onClick: this.handleClick, className: "card a-card"}, 
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