import React, { useState } from 'react';
import { Button, loadCSSFromString} from '@airtable/blocks/ui';
loadCSSFromString('#chatInput:focus {outline:none;backgroundColor:#ddd !important}');

const ChatInput  = (props) => {
    const { sendChat, style } = props;
    const [message, setMessage] = useState('');
    return (
        <div  style={{...style}}
             >
            <textarea id="chatInput" style={{
                border:"1px solid rgba(0,0,0,0.5)",
                borderRadius:'4px',
                flexGrow:1,
                padding: '15px',
                background: '#f1f1f1',
                resize: 'none',
                height: '100%',
            }}
            onKeyDown = {e => {
                if(e.key === 'Enter') {
                     sendChat(message) 
                     setMessage('')
                    }
                }}
            value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message" ></textarea>
            <Button
                variant="primary"
                style={{
                    borderRadius:"9999px",
                    border:"1px solid rgba(0,0,0,0.5)",
                    alignSelf:'center', 
                }}
                padding={1}
                onClick={() => {sendChat(message);setMessage('')}}
                icon="chevronRight"
                aria-label="Send Message"
                margin={1}
            />
        </div>
    )
}

export default ChatInput;