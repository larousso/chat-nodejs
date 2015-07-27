import React from 'react'
import MessageStore from './../store/MessagesStore'


class ChatMessages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: []
		}
	}

	componentDidMount() {
		MessageStore.addChangeListener(this.updateMessage)
	}
	
	updateMessage = () => {
		this.setState({
			messages: MessageStore.getAllMessages()
		});
	}
	
	render() {
		var messages = this.state.messages.map(msg => (
			<div className="list-group-item" key={msg.author+msg.message}>
				<h4 className="list-group-item-heading">{msg.author}</h4>
				<p classNamme="list-group-item-text">{msg.message}</p>
			</div>
		));
		return (
			<div className="list-group">
				{messages}
			</div>
		);
	}
}

export default ChatMessages;