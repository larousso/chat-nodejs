import React from 'react'
import ChatForm from './ChatForm.react'
import ChatMessages from './ChatMessages.react'

class Chat extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="container">
				<div className="col-12">
					<h1>Chat</h1>
					<ChatForm />
					<ChatMessages />
				</div>
			</div>
		);
	}
}

export default Chat;