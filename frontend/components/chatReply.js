import React, {useRef, useEffect} from 'react';
import { Box, Button} from '@airtable/blocks/ui';
import ChatInput from './ChatInput';
import Chat from './chat';

const ReplyModal = (props) => {
    const { chat, replyChat, pinChat, setReplying } = props;
    const chatWindow = useRef(null);
    useEffect(() => {
        chatWindow ? chatWindow.current.scrollIntoView(false) : null
    })
    return (
        <div
        className="rounded-md overflow-hidden" 
        style={{
            width:'95%',
            height:'400px',
            flexWrap:'wrap',
            backgroundColor:'white',
            position:'fixed', 
            display:'flex', 
            marginLeft:'auto',
            marginRight:'auto', 
            top:'5px',
            boxShadow:'30px 30px 70px 0px rgba(0,0,0,0.75), -6px -6px 70px 0px rgba(0,0,0,0.75)',
            zIndex:100}}>
           <Box width="100%"
           style={{
                    width:'100%',
                    background:'transparent',
                    height:'calc(100% - 4rem)',
                    marginBottom:'4rem',
                    overflowY:'auto',
                    boxSizing:'border-box'
            }} >
                <Box width="100%" style={{display:'flex', flexWrap:'nowrap', justifyContent:'end'}}>
                    <Button aria-label="close modal" variant="danger" onClick={() => setReplying(null)} icon="x"/>
                </Box>
                <Chat pinChat={pinChat} chat={chat} inreply={false}/>
                <div 
                ref={chatWindow}
                style={{
                    width:'100%',
                    marginTop:'3px',
                    paddingLeft:'30px'
                }}>
                    {chat.replies ? chat.replies.map(chat => (<Chat chat={chat} inreply={true} key={chat.id}/>)) : null}
                </div>
           </Box>
           <ChatInput style={{
                        width:'100%',
                        display:"flex",
                        position: "absolute",
                        height:"4rem",
                        flexWrap:"nowrap",
                        bottom:0,
                        backgroundColor:'white',
                        alignItems:"center"}}  sendChat={replyChat(chat.id)} />
        </div>
    )
}

export default ReplyModal;