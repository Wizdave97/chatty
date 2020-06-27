import React, {useRef} from 'react';
import { Box, Button, useGlobalConfig, useSession, useWatchable, Dialog} from '@airtable/blocks/ui';
import ChatInput from './ChatInput';
import Chat from './chat';

const ReplyModal = (props) => {
    const { chat, pinChat, setReplying } = props;
    const chatWindow = useRef(null);
    const globalConfig = useGlobalConfig();
    const session = useSession();
    const { hasPermission } = globalConfig.checkPermissionsForSet();
    
    useWatchable(globalConfig, 'nextChatId', () => {
        chatWindow ? chatWindow.current.scrollIntoView(false) : null
    })

    const replyChat =(id)=> (message) => {
        let nextChatId = globalConfig.get('nextChatId');
        nextChatId = nextChatId ? nextChatId : 0;
        const newChat = {
            id: nextChatId,
            collaborator: session.currentUser,
            message,
            timestamp: Date.now(),
            replies:[],
            likes:[],
            pinned:false,
            channel: chat.channel,
            read:[]
        }
        if(hasPermission) {
            const chats = globalConfig.get('chats');
            for(let item of chats){
                if(id == item.id) {
                    item.replies.push(newChat);
                    break;
                }
            }
            globalConfig.setAsync('chats', chats);
            globalConfig.setAsync('nextChatId', ++nextChatId);  
            
        }
    }
    return (
        <Dialog className="w-full flex relative box-border p-0" height="400px"  onClose={() => setReplying(false)}> 
            <Box  className="w-full absolute top-0 z-30 flex flex-no-wrap justify-end p-1 box-border">
                <Button className="rounded-full opacity-50" aria-label="close modal" variant="danger" onClick={() => setReplying(null)} icon="x"/>
            </Box>
           <Box className="p-2 box-border" 
           style={{
                    width:'100%',
                    background:'transparent',
                    height:'calc(100% - 4rem)',
                    marginBottom:'4rem',
                    overflowY:'auto',
                    boxSizing:'border-box'
            }} >
                
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
        </Dialog>
    )
}

export default ReplyModal;