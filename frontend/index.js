import {initializeBlock, useGlobalConfig, useBase, Box, Text, useSession, loadCSSFromURLAsync} from '@airtable/blocks/ui';
import ChatInput from './components/ChatInput';
import Chat from './components/chat';
import Tabs from './components/tabs';
import ReplyModal from './components/chatReply';
import React, {useState, useEffect } from 'react';
loadCSSFromURLAsync('https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css');
function ChattyBlock() {
    // YOUR CODE GOES HERE
    const globalConfig = useGlobalConfig();
    const chatWindow = React.useRef(null);
    const { hasPermission } = globalConfig.checkPermissionsForSet();
    const session = useSession();
    const chats = globalConfig.get('chats');
    chats ? null : hasPermission ? globalConfig.setAsync('chats',[]) : null;
    const base = useBase();
    const firstTableName = base.tables[0] ? base.tables[0].name : '';
    const [channel, setChannel] = useState(firstTableName);
    const [replying, setReplying] = useState(null);

    useEffect(() => {
        chatWindow ? chatWindow.current.scrollIntoView(false) : null;
    })
    const sendChatToChannel = (message) => {
        let nextChatId = globalConfig.get('nextChatId');
        nextChatId = nextChatId ? nextChatId : 0;
        const chat = {
            id: nextChatId,
            collaborator: session.currentUser,
            message,
            timestamp: new Date().toLocaleString(),
            replies:[],
            likes:[],
            pinned:false,
            channel
        }
        if (hasPermission) {
            const chats = globalConfig.get('chats');
            chats.push(chat)
            globalConfig.setAsync('chats', chats);
            globalConfig.setAsync('nextChatId', ++nextChatId);
            
        }
    }
    const replyChat =(id)=> (message) => {
        let nextChatId = globalConfig.get('nextChatId');
        nextChatId = nextChatId ? nextChatId : 0;
        const chat = {
            id: nextChatId,
            collaborator: session.currentUser,
            message,
            timestamp: new Date().toLocaleString(),
            replies:[],
            likes:[],
            pinned:false,
            channel
        }
        if(hasPermission) {
            const chats = globalConfig.get('chats');
            for(let item of chats){
                if(id == item.id) {
                    item.replies.push(chat);
                    break;
                }
            }
            globalConfig.setAsync('chats', chats);
            globalConfig.setAsync('nextChatId', ++nextChatId);  
            
        }
    }
    const pinChat = (id) => () => {
        for(let chat of chats) {
            if(chat.id === id) {
                chat.pinned = !chat.pinned;
                globalConfig.setAsync('chats', chats);
                break;
            }
        }
    }
    const visibleChats = chats ? chats.filter(chat => (chat.channel === channel)) : null;
    const displayedChats = visibleChats? visibleChats.map(chat => (<Chat inreply={false} setReplying={setReplying} chat={chat} pinChat={pinChat} key={chat.id}/>)) : null
    return (
        hasPermission?
        <Box padding={1} 
        className="bg-white"
        style={{
            width:'100%',
            height: '100%',
            position: 'relative',
            display:'flex',
            justifyContent:'center',
            boxSizing:'border-box'
        }}>
            {replying ? <ReplyModal chat={replying} pinChat={pinChat} setReplying={setReplying} replyChat={replyChat} /> : null}
            <Box style={{boxSizing:'border-box',width: '100%', position:'relative', height:'100%'}}>
                <Tabs channel={channel} setChannel={setChannel}/>
                <div ref={chatWindow}
                id="chatWindow"
                style={{
                    width:'100%',
                    background:'transparent',
                    height:'calc(100% - 6.5rem)',
                    marginTop: '2.5rem',
                    marginBottom:'4rem',
                    overflowY:'auto',
                    boxSizing:'border-box'
                    }}>
                    {displayedChats}
                </div>
                <ChatInput style={{
                        width:'100%',
                        display:"flex",
                        position: "fixed",
                        height:"4rem",
                        flexWrap:"nowrap",
                        bottom:0,
                        backgroundColor:'white',
                        alignItems:"center"}} sendChat={sendChatToChannel} />
            </Box>
        </Box>
        :<Text>Only creators and editors can chat on this medium</Text>
    );
}

initializeBlock(() => <ChattyBlock />);
