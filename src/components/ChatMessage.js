/**
 * Created by Linus on 2018-06-08.
 */

import React from 'react';

export default ChatMessage;

function ChatMessage(props) {
    return(
        <div className="chat-message">
            <p className="message-time">{ props.messageData.date.toISOString().slice(11,19) }:</p>
            <p className="message-text">{ props.messageData.message }</p>
        </div>
    );
}
