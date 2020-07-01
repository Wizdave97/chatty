import React, { useState } from 'react';
import { Button, loadCSSFromString } from '@airtable/blocks/ui';
loadCSSFromString('#chatInput:focus {outline:none;backgroundColor:#ddd !important}');

const ChatInput = (props) => {
    const { sendChat, style, isFullscreen } = props;
    const [message, setMessage] = useState('');
    return (
        <div className={`w-full justify-between ${isFullscreen ? 'tab-shift' : ''}`} style={{ ...style }}
        >
            <textarea id="chatInput" className="flex-grow h-full bg-gray-100 border border-gray-500 resize-none p-4 rounded-md" 
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendChat(message)
                        setMessage('')
                    }
                }}
                value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message" ></textarea>
            <Button
                variant="primary"
                padding={1}
                onClick={() => { sendChat(message); setMessage('') }}
                icon="chevronRight"
                aria-label="Send Message"
                margin={1}
            >Send</Button>
        </div>
    )
}

export default ChatInput;