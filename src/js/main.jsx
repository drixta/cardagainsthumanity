(function(){
	var PageState = React.createClass({
		getInitialState: function(){
			return {
				currentPage : 'username'
			};
		},
		render: function(){
			var self = this,
				partial;
			
			var handleSubmit = function(state){
				self.setState({currentPage: state})
			};

			if (this.state.currentPage === 'username') {
				partial = <UsernameSetUp handleSubmit={handleSubmit} />;
			}
			else if (this.state.currentPage === 'roomSelect') {
				partial = <RoomSelect handleSubmit={handleSubmit} />;
			}
			else if (this.state.currentPage === 'gameBoard') {
				partial = <GameBoard />;
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
		handleChange: function(event){			
			this.setState({name: event.target.value.trim()})
		},
		handleSubmit : function(){
			this.props.handleSubmit('roomSelect');
		},
		checkEnter: function(event){
			if (event.keyCode === 13){
				this.handleSubmit();
			}
		},
		render: function(){
			var name = this.state.name;
			return (
				<div>
					<h1>Your name?</h1>
					<input id="name-input" value={name} type="text" onKeyDown={this.checkEnter} onChange={this.handleChange} />
					<h1>{name}</h1>
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
		handleSubmit : function(){
			this.props.handleSubmit('gameBoard');
		},
		render: function(){
			return <h1>Choose your Room</h1>;			
		}
	});
	React.renderComponent(
		PageState(null),
		document.getElementById('everything')
	);
})();