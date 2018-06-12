import React, {Component} from 'react';
import logo from '../images/buffett.png';
import './App.css';

import ChatContainer from "./ChatContainer";
import ExampleQs from "../components/ExampleQs";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Ask Buffett about the stock market!</h1>
                </header>
                <ChatContainer/>
                <ExampleQs />
            </div>
        );
    }
}

export default App;
