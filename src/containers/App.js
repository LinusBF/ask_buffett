import React, {Component} from 'react';
import logo from '../logo.svg';
import './App.css';

import ChatContainer from "./ChatContainer";
import WitApi from "../integration/wit_api/WitApi";
import WitApiKey from "../utils/secrets";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Ask Buffett about the stock market!</h1>
                </header>
                <ChatContainer witApi={new WitApi(WitApiKey)}/>
            </div>
        );
    }
}

export default App;
