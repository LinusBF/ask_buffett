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

        this._handleClick = this._handleClick.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleEnterPress = this._handleEnterPress.bind(this);
    }

    _handleChange({ target }) {
        this.setState({query: target.value});
    }

    _handleEnterPress(event){
        if(event.key === 'Enter'){
            this._handleClick();
        }
    }

    _handleClick(){
        if(this.state.query !== "") {
            this.props.sendInput(this.state.query);
            this.setState({query: ""});
        }
    }

    render() {
        return (
            <React.Fragment>
                <input type="text" name="query" placeholder="Write a message to the bot!" value={this.state.query} onChange={this._handleChange} onKeyPress={this._handleEnterPress} />
                <button className="btn btn-primary" onClick={this._handleClick}>Ask Buffett</button>
            </React.Fragment>
        );
    }
}

export default ChatInput;
