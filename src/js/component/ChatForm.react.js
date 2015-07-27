import React from 'react'
import MessageStore from '../store/MessagesStore'
import ChatActions from '../action/ChatActions'
let {Component} = React;

const ENTER_KEY_CODE = 13;

class ChatForm extends Component {
	
	constructor(args){
		super(args);
		this.state = {
			name: args.name,
            text: ''
		}
	}
	
	componentDidMount() {
		MessageStore.addChangeListener(this.storeChange)
	}
	
	sendMessage = () => {
		var name = React.findDOMNode(this.refs.name).value;
        var text = this.state.text.trim();
		if(name && text){
            ChatActions.createMessage({
				message: text,
				author: name, 
				date: new Date()
			});
            this.setState({text: ''});
		} else {
            var errors = [];
            if(!name) {
                errors.push("Le nom est obligatoire")
            }
            if(!text) {
                errors.push("Le message est obligatoire")
            }
            this.setState({errors: errors});
        }
	};
	
	storeChange = err => {
		this.setState({
			errors: MessageStore.getErrors()
		})
	};

	onChange = (event, value) => {
		this.setState({text: event.target.value});
	};

	onKeyDown = (event) => {
		if (event.keyCode === ENTER_KEY_CODE) {
			event.preventDefault();
			this.sendMessage();
		}
	};

	render() {
		
		var err;
		if(this.state.errors) {
			err = this.state.errors.map( err =>
                (<div className="alert alert-danger" role="alert">{err}</div>)
			);
		}
		
		return (
			<div>
				{err}
				<form>
					<div className="form-group">
						<label htmlFor="user">Nom</label>
						<input type="text" className="form-control" ref="name" id="name" defaultValue={this.state.name} placeholder="nom" ></input>
					</div>
					<div className="form-group">
						<label htmlFor="message">Message</label>
						<textarea className="form-control" value={this.state.text} onChange={this.onChange} onKeyDown={this.onKeyDown}></textarea>
					</div>
				</form>
			</div>
		);
	}
}

export default ChatForm;