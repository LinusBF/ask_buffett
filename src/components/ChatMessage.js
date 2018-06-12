/**
 * Created by Linus on 2018-06-08.
 */

import React from 'react';
import { parseIntent } from "./IntentParser";

const ChatMessage = (props) => {
    const data = props.messageData;

    let dateCorrected = new Date(data.date);
    let timeZoneCorrected = dateCorrected.getTime() - dateCorrected.getTimezoneOffset()*(1000*60);
    dateCorrected.setTime(timeZoneCorrected);

    let message = "TEMPLATE";
    if(data.userContent){
        message = data.content;
    } else{
        if(data.content.error === undefined){
            message = parseIntent(data.intent, data.content);
        } else{
            message = parseIntent(data.intent, data.content);
        }
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
