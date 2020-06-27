import {initializeBlock, useGlobalConfig, useBase, Box, Text, useSession, loadCSSFromURLAsync, useLoadable, useWatchable} from '@airtable/blocks/ui';
import { cursor } from '@airtable/blocks';
import ChatInput from './components/ChatInput';
import Chat from './components/chat';
import Tabs from './components/tabs';
import ReplyModal from './components/chatReply';
import Polls from './components/polls';
import Sidebar from './components/sideBar';
import React, {useState, useEffect } from 'react';
loadCSSFromURLAsync('https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css');

function ChattyBlock() {
    // YOUR CODE GOES HERE
    useLoadable(cursor);
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
    const [isPollsOpen, setIsPollsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = React.useRef();

    useWatchable(cursor, 'activeTableId', () => {
        setChannel(base.getTableByIdIfExists(cursor.activeTableId).name);
    })
    useEffect(() => {
       let tableId = base.getTableByName(channel).id;
       if(tableId == cursor.activeTableId) return;
       cursor ? cursor.setActiveTable(base.getTableByName(channel).id) : null; 
    },[channel])

    useEffect(() => {
        if(isSidebarOpen) {
            sidebarRef.current.classList.add('w-64', 'p-2');
        }
        else {
            sidebarRef.current.classList.remove('w-64', 'p-2');
        }
    },[isSidebarOpen])
    useEffect(() => {
        chatWindow ? chatWindow.current.scrollIntoView(true) : null;
    }, [ ])
    useWatchable(globalConfig, 'nextChatId', () => {
        chatWindow ? chatWindow.current.scrollIntoView(false) : null;
    })
    const sendChatToChannel = (message) => {
        let nextChatId = globalConfig.get('nextChatId');
        nextChatId = nextChatId ? nextChatId : 0;
        const chat = {
            id: nextChatId,
            collaborator: session.currentUser,
            message,
            timestamp: Date.now(),
            replies:[],
            likes:[],
            pinned:false,
            channel,
            read:[]
        }
        if (hasPermission) {
            const chats = globalConfig.get('chats');
            chats.push(chat)
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
                <Sidebar sidebarRef={sidebarRef} isSidebarOpen={isSidebarOpen} setChannel={setChannel} channel={channel}  setIsSidebarOpen={setIsSidebarOpen}/>
               {replying ?<ReplyModal  chat={replying} pinChat={pinChat} setReplying={setReplying}/>: null}
               {isPollsOpen ? <Polls setIsPollsOpen={setIsPollsOpen} channel={channel}/> : null}
            <Box style={{boxSizing:'border-box',width: '100%', position:'relative', height:'100%'}}>
                <Tabs channel={channel} setIsSidebarOpen={setIsSidebarOpen} setChannel={setChannel} setIsPollsOpen={setIsPollsOpen}/>
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
        :<Text className="w-full font-bold text-center text-gray-700 text-xl">Only creators and editors can chat on this medium</Text>
    );
}
 

initializeBlock(() => <ChattyBlock />);
