/**
 * Created by Linus on 2018-06-08.
 */

import React, { Component } from 'react';
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";

class ChatContainer extends Component{
    constructor(props){
        super(props);

        this.state = {
            responses: [
                {date: new Date(), message:"Ask the bot something!"},
            ],
            inputs: [
            ],
        }
    }

    addInput(query){
        var newInputs = this.state.inputs;
        newInputs.push({date: new Date(), message: query});
        this.setState({
            inputs: newInputs
        });
    }

    addResponse(response){
        var newResponse = this.state.responses;
        newResponse.push({date: new Date(), message: response});
        this.setState({
            responses: newResponse
        });
    }

    handleInput(query){
        const response = this.props.witApi.getResponse(query);
        this.addInput(query);
        this.addResponse(response);
    }

    orderMessages(){
        var responses = this.state.responses.slice();
        responses.sort((a, b) => b.date.getTime() < a.date.getTime());
        var inputs = this.state.inputs.slice();
        inputs.sort((a, b) => b.date.getTime() < a.date.getTime());

        var messageIndex = 0;

        var messages = inputs.map((input) => {

            if (responses.length > 0 && responses[0].date.getTime() < input.date.getTime()){
                var tempRes = responses[0];
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
                {messages}
            </React.Fragment>
        );
    }

    render() {
        return(
            <div className="chat-container">
                <div className="messages-container">
                    {this.orderMessages()}
                </div>
                <div className="chat-input-container">
                    <ChatInput sendInput={this.handleInput.bind(this)} />
                </div>
            </div>
        );
    }
}

export default ChatContainer;
