/** @jsx React.DOM */
(function(){
	var PageState = React.createClass({displayName: 'PageState',
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
				partial = UsernameSetUp({handleSubmit: handleSubmit});
			}
			else if (this.state.currentPage === 'roomSelect') {
				partial = RoomSelect({handleSubmit: handleSubmit});
			}
			else if (this.state.currentPage === 'gameBoard') {
				partial = GameBoard(null);
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
				React.DOM.div(null, 
					React.DOM.h1(null, "Your name?"), 
					React.DOM.input({id: "name-input", value: name, type: "text", onKeyDown: this.checkEnter, onChange: this.handleChange}), 
					React.DOM.h1(null, name)
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
		handleSubmit : function(){
			this.props.handleSubmit('gameBoard');
		},
		render: function(){
			return React.DOM.h1(null, "Choose your Room");			
		}
	});
	React.renderComponent(
		PageState(null),
		document.getElementById('everything')
	);
})();