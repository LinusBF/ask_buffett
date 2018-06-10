/**
 * Created by Linus on 2018-06-08.
 */

import React from 'react';
import { parseIntent } from "./IntentParser";

const ChatMessage = (props) => {
    console.log(props);
    const data = props.messageData;

    var dateCorrected = new Date(data.date);
    var timeZoneCorrected = dateCorrected.getTime() - dateCorrected.getTimezoneOffset()*(1000*60);
    dateCorrected.setTime(timeZoneCorrected);

    let message = "TEMPLATE";
    if(data.userContent || data.content.responseData === undefined){
        message = data.content;
    } else{
        //Calc message from intent
        message = parseIntent(data.content);
    }

    return(
        <div className="chat-message">
            <div className="message-time">
                { dateCorrected.toISOString().slice(11,19) }:
            </div>
            <div className={(data.userContent ? "user-input" : "bot-message") + " message-text"}>
                { message }
            </div>
        </div>
    );
}

export default ChatMessage;
