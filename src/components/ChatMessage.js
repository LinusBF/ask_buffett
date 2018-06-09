/**
 * Created by Linus on 2018-06-08.
 */

import React from 'react';

export default ChatMessage;

function ChatMessage(props) {
    return(
        <div className="chat-message">
            <div className="message-time">
                { props.messageData.date.toISOString().slice(11,19) }:
            </div>
            <div className={(props.messageData.userContent ? "user-input" : "bot-message") + " message-text"}>
                { props.messageData.message }
            </div>
        </div>
    );
}
