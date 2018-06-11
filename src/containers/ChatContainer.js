/**
 * Created by Linus on 2018-06-08.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux'
import {fetchResponse, addInput} from "../actions/index"
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

class ChatContainer extends Component{
    constructor(props){
        super(props);
        this.handleInput = this.handleInput.bind(this);
    }

    orderMessages(){
        let responses = this.props.responses.slice();
        responses.sort((a, b) => b.date.getTime() < a.date.getTime());
        let inputs = this.props.inputs.slice();
        inputs.sort((a, b) => b.date.getTime() < a.date.getTime());

        let messageIndex = 0;

        let messages = inputs.map((input) => {

            if (responses.length > 0 && responses[0].date.getTime() < input.date.getTime()){
                let tempRes = responses[0];
                responses.splice(0, 1);
                messageIndex += 3;
                return <React.Fragment key={messageIndex - 3}><ChatMessage messageData={tempRes} key={messageIndex - 2} /><ChatMessage messageData={input} key={messageIndex - 1} /></React.Fragment>;
            }
            messageIndex++;
            return <ChatMessage messageData={input} key={messageIndex - 1} />;
        });

        if (responses.length > 0){
            messages.push(<ChatMessage messageData={responses[0]} key={messageIndex} />);
        }

        return(
            <React.Fragment>
                <ChatMessage messageData={{content: "", intent: "initial_message", date: new Date(), userContent: false}} />
                {messages}
            </React.Fragment>
        );
    }

    handleInput(query){
        this.props.fetchResponse(query);
        this.props.addInput(query);
    }

    render() {
        return(
            <div className="chat-container">
                <div className="messages-container">
                    {this.orderMessages()}
                </div>
                <div className="chat-input-container">
                    <ChatInput sendInput={this.handleInput} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    responses: state.responses,
    inputs: state.inputs
})

const mapDispatchToProps = dispatch => ({
    addInput: query => dispatch(addInput(query)),
    fetchResponse: query => dispatch(fetchResponse(query))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatContainer)
