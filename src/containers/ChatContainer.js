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
        this._handleInput = this._handleInput.bind(this);
    }

    _orderMessages(){
        let responses = this.props.responses.slice();
        responses.sort((a, b) => b.date.getTime() < a.date.getTime());
        let inputs = this.props.inputs.slice();
        inputs.sort((a, b) => b.date.getTime() < a.date.getTime());

        let messageIndex = 0;

        //For each input from the user, check for an earlier response and return the appropriate react elements
        //Could be optimized/redesigned
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

        //Add the latest response, if there is one
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

    _handleInput(query){
        this.props.fetchResponse(query);
        this.props.addInput(query);
    }

    render() {
        return(
            <div className="chat-container">
                <div id="scollbar-style" className="messages-container">
                    <div className="messages-box">
                        {this._orderMessages()}
                    </div>
                </div>
                <div className="chat-input-container">
                    <ChatInput sendInput={this._handleInput} />
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
