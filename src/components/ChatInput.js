/**
 * Created by Linus on 2018-06-08.
 */

import React, { Component } from 'react';

class ChatInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            query: "",
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnterPress = this.handleEnterPress.bind(this);
    }

    handleChange({ target }) {
        this.setState({query: target.value});
    }

    handleEnterPress(event){
        if(event.key === 'Enter'){
            this.handleClick();
        }
    }

    handleClick(){
        if(this.state.query !== "") {
            this.props.sendInput(this.state.query);
            this.setState({query: ""});
        }
    }

    render() {
        return (
            <React.Fragment>
                <input type="text" name="query" placeholder="Write a message to the bot!" value={this.state.query} onChange={this.handleChange} onKeyPress={this.handleEnterPress} />
                <button className="btn btn-primary" onClick={this.handleClick}>Ask Buffett</button>
            </React.Fragment>
        );
    }
}

export default ChatInput;
