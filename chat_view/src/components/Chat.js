import React, {Component} from 'react';
import io from 'socket.io-client';

class Chat extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			message: '',
			messages: []
        };
        this.socket = io('localhost:5000');

				this.sendMessage = (ev) => {
					ev.preventDefault();
					if(this.state.username && this.state.message) {
						this.socket.emit('SEND_MESSAGE', {
								author: this.state.username,
								message: this.state.message
						});
					} else alert('You are missing one of the following(s): Username, Message');
					this.setState({message: ''});
				}

        this.socket.on('RECEIVE_MESSAGE', function(data) {
					addMessage(data);
        });

        const addMessage = (data) => {
					console.log(data);
					this.setState({messages: [...this.state.messages, data]});
					console.log(this.state.messages);
        }
        
	}
	render() {
		return(
			<div>
				<div className="container">
					<div className="row">
						<div className="col-4">
							<div className="card">
								<div className="card-body">
									<div className="card-title">
									Global Chat
									</div>
									<hr/>
									<div className="messages">
										{this.state.messages.map((message, index) => {
											return(
												<div key={index}>{message.author} : {message.message}</div>
											);
										})}
									</div>
									<div className="footer">
										<input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
										<br/>
										<input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({message: ev.target.value})}/>
										<br/>
										<button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Chat;