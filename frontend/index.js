import {initializeBlock, useGlobalConfig, useBase, Box, Text, useSession, loadCSSFromURLAsync, useLoadable, useWatchable} from '@airtable/blocks/ui';
import { cursor, globalConfig as gConfigStatic } from '@airtable/blocks';
import ChatInput from './components/ChatInput';
import Chat from './components/chat';
import Tabs from './components/tabs';
import ReplyModal from './components/chatReply';
import Polls from './components/polls';
import Sidebar from './components/sideBar';
import CastPoll from './components/castPoll';
import React, {useState, useEffect } from 'react';
import PollChat from './components/pollChat';
import ErrorBoundary from './components/errorBoundary';
import PinnedChats from './components/pinnedChats';
loadCSSFromURLAsync('https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css');

function ChattyBlock() {
    // YOUR CODE GOES HERE
    useLoadable(cursor);
    const globalConfig = useGlobalConfig();
    const newMessageRef = React.useRef(null);
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
    const [isCastPollOpen, setCastPollOpen] = useState(false);
    const [clickedPoll, setClickedPoll] = useState(null);
    const [openPins, setOpenPins] = useState(false);
    const sidebarRef = React.useRef(null);
    const prevChannel = usePrevious(channel);
    const markAsRead = (channel) => {
        const chatsCopy = chats ? [...chats] : [];
        const lastChatIndex = chatsCopy.length - 1;
        for (let i = 0; i <= lastChatIndex; i++) {
            if(chatsCopy[i].read.indexOf(session.currentUser.id) <= -1 && chatsCopy[i].channel === channel){
                chatsCopy[i].read.push(session.currentUser.id);
            }     
        }
        gConfigStatic.setAsync('chats', chatsCopy);
    }
    useEffect(() => {
        newMessageRef.current ? newMessageRef.current.scrollIntoView(true) 
        : chatWindow.current ? chatWindow.current.scrollIntoView({behavior: "smooth", block: "end", inline: "end"}) : null;
    }, [])
    useWatchable(cursor, 'activeTableId', () => {
        const activeTable = base.getTableByIdIfExists(cursor.activeTableId)
        activeTable ? setChannel(activeTable.name) : null;
    })
    useEffect(() => {
       let tableId = base.getTableByName(channel).id;
       if(tableId == cursor.activeTableId) return;
       cursor ? cursor.setActiveTable(base.getTableByName(channel).id) : null; 
       newMessageRef.current ? newMessageRef.current.scrollIntoView(true) : null;
       markAsRead(prevChannel);
       return markAsRead(channel);
    },[channel])
    
    useEffect(() => {
        if(isSidebarOpen) {
            sidebarRef.current ? sidebarRef.current.classList.add('w-64', 'p-2') : null;
        }
        else {
            sidebarRef.current ? sidebarRef.current.classList.remove('w-64', 'p-2') : null;
        }
    },[isSidebarOpen])
   
    useWatchable(globalConfig, 'nextChatId', () => {
        console.log(newMessageRef);
        newMessageRef.current ? newMessageRef.current.scrollIntoView(true) 
        : chatWindow.current ? chatWindow.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}) : null;
    })
    const toggleCastPoll = (poll) => async () => {
        await setClickedPoll(poll);
        setCastPollOpen(!isCastPollOpen);
    }
    const sendChatToChannel = (message) => {
        let nextChatId = globalConfig.get('nextChatId');
        nextChatId = nextChatId ? nextChatId : 0;
        const chat = {
            type:'msg',
            id: nextChatId,
            collaborator: session.currentUser,
            message,
            timestamp: Date.now(),
            replies:[],
            likes:[],
            pinned:false,
            channel,
            read:[session.currentUser.id]
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

    let ref = null;
    const displayedChats = visibleChats? visibleChats.map((chat) => {
        if(chat.read.indexOf(session.currentUser.id) <= -1 && !ref) {
            ref = newMessageRef;
        }
        switch (chat.type) {
            case 'msg':
                return <Chat newMessageRef={ref} inreply={false} setReplying={setReplying} chat={chat} pinChat={pinChat} key={chat.id}/>
            case 'poll':
                return <PollChat newMessageRef={ref} key={chat.id} pinChat={pinChat} pollChat={chat} toggleCastPoll={toggleCastPoll}/>
        }   
    }) : null
    
    return (
        <ErrorBoundary>
        {
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
               {openPins ? <PinnedChats setOpenPins={setOpenPins} pinChat={pinChat} toggleCastPoll={toggleCastPoll}/> : null}
            <Box style={{boxSizing:'border-box',width: '100%', position:'relative', height:'100%'}}>
                <Tabs channel={channel} setOpenPins={setOpenPins} setIsSidebarOpen={setIsSidebarOpen} setChannel={setChannel} setIsPollsOpen={setIsPollsOpen}/>
                <div 
                id="chatWindow"
                ref={chatWindow}
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
            {isCastPollOpen ? <CastPoll poll={clickedPoll} toggleCastPoll={toggleCastPoll}/> : null}
        </Box>
        :<Text className="w-full font-bold text-center text-gray-700 text-xl">Only creators and editors can chat on this medium</Text>
         }
        </ErrorBoundary>
    );
}
function usePrevious(value) {

    // The ref object is a generic container whose current property is mutable ...
  
    // ... and can hold any value, similar to an instance property on a class
  
    const ref = React.useRef();
  
    
  
    // Store current value in ref
  
    useEffect(() => {
  
      ref.current = value;
  
    }, [value]); // Only re-run if value changes
  
    
  
    // Return previous value (happens before update in useEffect above)
  
    return ref.current;
  
  }

initializeBlock(() => <ChattyBlock />);
