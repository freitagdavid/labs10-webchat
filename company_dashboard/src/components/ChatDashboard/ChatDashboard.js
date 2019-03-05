import React from "react";
import { withRouter } from "react-router-dom";
import axios from 'axios';

import ConvoList from './ConvoList/ConvoList';
import ChatView from './ChatView';
import './ChatDashboard.css';
import './ConvoList/ConvoList.css';

class ChatDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            currentConvoId: null,
            currentConvoSocket: null,
            currentConvoSummary: null
        }
        this.handleQueueConvoSelect = this.handleQueueConvoSelect.bind(this);
        this.handleActiveConvoSelect = this.handleActiveConvoSelect.bind(this);
        this.closeConvo = this.closeConvo.bind(this);
    }


    handleQueueConvoSelect(convo_id, customer_uid, summary) {
        // set rep current convo to selected convo:
        this.setState({
            currentConvoId: convo_id,
            currentConvoSocket: customer_uid,
            currentConvoSummary: summary
        })
        console.log("ChatDashboard state.currentConvoId: ", this.state.currentConvoId);
        const data = { id: convo_id };
        const deQueueRequest = axios.put('/api/chat/dequeue', data);
        deQueueRequest
            .then(response => {
                console.log("Conversation removed from Queue.")
            })
            .catch(error => {
                console.log(error.message);
            })

    }

    handleActiveConvoSelect(convo_id, customer_uid, summary) {
        this.setState({
            currentConvoId: convo_id,
            currentConvoSocket: customer_uid,
            currentConvoSummary: summary
        }, () => {
            console.log("\nActive Convo Selected");
            console.log("ChatDashboard state.currentConvoId: ", this.state.currentConvoId);
            console.log("ChatDashboard state.currentConvoSocket: ", this.state.currentConvoSocket);
        });

    }

    closeConvo() {
        const data = { id: this.state.currentConvoId };
        console.log("close convo data: ", data);
        axios.put('/api/chat/close', data)
        .then(response => {
            console.log("Conversation closed.")
        })
        .catch(error => {
            console.log(error.message);
        })
    }

    render() {
        return (
            <div className="chat-dashboard-container">
                <div className="chat-dash-left-container">
                    <ConvoList 
                        handleQueueConvoSelect={this.handleQueueConvoSelect}
                        handleActiveConvoSelect={this.handleActiveConvoSelect}
                    />
                </div>
                    
                <div className="chat-dash-right-container">
                    <ChatView 
                        currentConvoId={this.state.currentConvoId}
                        currentConvoSocket={this.state.currentConvoSocket}
                        summary={this.state.currentConvoSummary}
                        closeConvo={this.closeConvo}
                    />  
                </div> 
            </div>
        );
    }

}

export default withRouter(ChatDashboard);