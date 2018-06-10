/**
 * Created by Linus on 2018-06-08.
 */

import React from 'react';

export default ChatMessage;

function ChatMessage(props) {
    var dateCorrected = new Date(props.messageData.date);
    var timeZoneCorrected = dateCorrected.getTime() - dateCorrected.getTimezoneOffset()*(1000*60);
    dateCorrected.setTime(timeZoneCorrected);

    return(
        <div className="chat-message">
            <div className="message-time">
                { dateCorrected.toISOString().slice(11,19) }:
            </div>
            <div className={(props.messageData.userContent ? "user-input" : "bot-message") + " message-text"}>
                { props.messageData.message }
            </div>
        </div>
    );
}
