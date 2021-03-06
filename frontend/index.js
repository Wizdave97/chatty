import { initializeBlock, useGlobalConfig, useBase, Box, Text, useSession, loadCSSFromURLAsync, loadCSSFromString, useViewport, useLoadable, useWatchable } from '@airtable/blocks/ui';
import { cursor, globalConfig as gConfigStatic } from '@airtable/blocks';
import ChatInput from './components/ChatInput';
import Chat from './components/chat';
import Tabs from './components/tabs';
import ReplyModal from './components/chatReply';
import Polls from './components/polls';
import Sidebar from './components/sideBar';
import CastPoll from './components/castPoll';
import React, { useState, useEffect } from 'react';
import PollChat from './components/pollChat';
import ErrorBoundary from './components/errorBoundary';
import PinnedChats from './components/pinnedChats';
import EmojiPicker from './components/emojiPicker';
loadCSSFromURLAsync('https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css');
loadCSSFromString(".shift { width: calc(100% - 16rem); margin-left: 16rem} .tab-shift{ width: calc(100% - 16rem);}")



function ChattyBlock() {
    // YOUR CODE GOES HERE
    useLoadable(cursor);
    const globalConfig = useGlobalConfig();
    const viewPort = useViewport();
    const newMessageRef = React.useRef(null);
    const scrollingPatch = React.useRef(null);
    const { hasPermission } = globalConfig.checkPermissionsForSet();
    const session = useSession();
    const chats = globalConfig.get('chats');
    chats ? null : hasPermission ? globalConfig.setAsync('chats', []) : null;
    const base = useBase();
    const firstTableName = base.tables[0] ? base.tables[0].name : '';
    const [channel, setChannel] = useState('');
    const [replying, setReplying] = useState(null);
    const [isPollsOpen, setIsPollsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCastPollOpen, setCastPollOpen] = useState(false);
    const [clickedPoll, setClickedPoll] = useState(null);
    const [openPins, setOpenPins] = useState(false);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const toggleEmojiPicker = async (open, chatId) => {
       await setSelectedChatId(chatId);
       setOpenEmojiPicker(open);
    }
    const sidebarRef = React.useRef(null);
    const markAsRead = (channel) => {
        const chatsCopy = chats ? chats : [];
        const lastChatIndex = chatsCopy.length - 1;
        for (let i = 0; i <= lastChatIndex; i++) {
            if (chatsCopy[i].read.indexOf(session.currentUser.id) <= -1 && chatsCopy[i].channel === channel) {
                chatsCopy[i].read.push(session.currentUser.id);
            }
        } 
    }
    useEffect(() => {
        setChannel(firstTableName)
    },[])
    useWatchable(cursor, 'activeTableId', () => {
        const activeTable = base.getTableByIdIfExists(cursor.activeTableId)
        activeTable ? setChannel(activeTable.name) : null;
    })
    useEffect(() => {
        // let table = base.getTableByNameIfExists(channel);
        // if (table && table.id == cursor.activeTableId) return;
        // cursor ? table && cursor.setActiveTable(table.id) : null;
        const unread = countUnreadMessages(channel);
        if (newMessageRef.current) {
            newMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            newMessageRef.current.insertAdjacentHTML('beforebegin', `<span id="new-message" class="w-full bg-gray-100 flex mb-1 text-center justify-center text-green-800 font-bold text-sm">${unread} unread messages</span>`);
            setTimeout(() => {
                document.getElementById('new-message').remove();
            }, 3000)
        }
        else {
            scrollingPatch.current ? scrollingPatch.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }) : null
        }
       gConfigStatic.setAsync('chats', chats);
       return () => (gConfigStatic.setAsync('chats', chats));
    }, [channel])

    useEffect(() => {
        if (isSidebarOpen) {
            sidebarRef.current ? sidebarRef.current.classList.add('w-64', 'p-2') : null;
        }
        else if(!isSidebarOpen && !viewPort.isFullscreen) {
            sidebarRef.current ? sidebarRef.current.classList.remove('w-64', 'p-2') : null;
        }
    }, [isSidebarOpen])
    const countUnreadMessages = (channel) => {
        let count = 0;
        const lastChatIndex = chats.length - 1;
        for (let i = 0; i <= lastChatIndex; i++) {
            if (chats[i].read.indexOf(session.currentUser.id) <= -1 && chats[i].channel === channel) ++count
        }
        return count;
    }
    useWatchable(globalConfig, 'nextChatId', () => {
        const unread = countUnreadMessages(channel)
            if (newMessageRef.current) {
                newMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                // newMessageRef.current.insertAdjacentHTML('beforebegin', 
                // `<span id="new-message" class="w-full bg-gray-100 flex mb-1 text-center justify-center text-green-800 font-bold text-sm">${unread} unread</span>`);
                // setTimeout(() => {
                //     document.getElementById('new-message') ? document.getElementById('new-message').remove() : null;
                // }, 3000)
            }
            else {
                if(unread > 0) scrollingPatch.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
            }
         
    })
    const toggleCastPoll = (poll) => async () => {
        await setClickedPoll(poll);
        setCastPollOpen(!isCastPollOpen);
    }
    const sendChatToChannel = (message) => {
        if(!message.trim()) return;
        let nextChatId = globalConfig.get('nextChatId');
        nextChatId = nextChatId ? nextChatId : 0;
        const chat = {
            type: 'msg',
            id: nextChatId,
            collaborator: session.currentUser,
            message,
            timestamp: Date.now(),
            replies: [],
            likes: [],
            pinned: false,
            channel,
            reactions:{},
            read: []
        }
        if (hasPermission) {
            chats.length >= 500 ? chats.splice(0, 100) : null
            chats.push(chat);
            globalConfig.setAsync('chats', chats);
            globalConfig.setAsync('nextChatId', ++nextChatId);

        }
    }

    const pinChat = (id) => () => {
        for (let chat of chats) {
            if (chat.id === id) {
                chat.pinned = !chat.pinned;
                globalConfig.setAsync('chats', chats);
                break;
            }
        }
    }
    
    const toggleReaction = (chatId, emoji) => {
        for (let chat of chats) {
            if (chat.id === chatId) {
                if (chat.reactions[emoji.id]) {
                    if(chat.reactions[emoji.id].collaborators.indexOf(session.currentUser.id) <= -1) {
                        chat.reactions[emoji.id].count++
                        chat.reactions[emoji.id].collaborators.push(session.currentUser.id);
                    }
                    else {
                        chat.reactions[emoji.id].count--;
                        chat.reactions[emoji.id].collaborators.splice(chat.reactions[emoji.id].collaborators.indexOf(session.currentUser.id), 1)
                    }  
                }
                else {
                    chat.reactions[emoji.id]  = emoji;
                    chat.reactions[emoji.id].count = 1;
                    chat.reactions[emoji.id].collaborators = [session.currentUser.id];
                }
                globalConfig.setAsync('chats', chats);
                break;
            }
        }
    }
    
    
   
    let count = 0;
    const displayedChats = chats ? chats.filter(chat => (chat.channel === channel)).map((chat) => {
        if ((chat.read.indexOf(session.currentUser.id) < 0) && (count < 1)) {
            count++;
        }
        let node;
        switch (chat.type) {
            case 'msg':
                node = <Chat toggleReaction={toggleReaction} toggleEmojiPicker={toggleEmojiPicker} reference={count == 1 ? newMessageRef : null} inreply={false} setReplying={setReplying} chat={chat} pinChat={pinChat} key={chat.id} />
                break;
            case 'poll':
                node = <PollChat toggleReaction={toggleReaction} toggleEmojiPicker={toggleEmojiPicker} reference={count == 1 ? newMessageRef : null} key={chat.id} pinChat={pinChat} pollChat={chat} toggleCastPoll={toggleCastPoll} />
                break;
        }
        if(chat.read.indexOf(session.currentUser.id) < 0) count++
        return node;
    }) : null
    useEffect(() => {
        markAsRead(channel);
    })
    
    return (
        <ErrorBoundary>
            {
                hasPermission ?
                    <React.Fragment>
                        <Sidebar isFullscreen={viewPort.isFullscreen} sidebarRef={sidebarRef} isSidebarOpen={isSidebarOpen} setChannel={setChannel} channel={channel} setIsSidebarOpen={setIsSidebarOpen} />
                        <Box padding={1}
                            className={`w-full bg-white ml-0 ${viewPort.isFullscreen ? 'shift' : ''}`}
                            style={{
                                height: '100%',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                boxSizing: 'border-box'
                            }}>

                            {replying ? <ReplyModal  isFullscreen={viewPort.isFullscreen} chat={replying} pinChat={pinChat} setReplying={setReplying} /> : null}
                            {isPollsOpen ? <Polls isFullscreen={viewPort.isFullscreen} setIsPollsOpen={setIsPollsOpen} channel={channel} /> : null}
                            {openPins ? <PinnedChats isFullscreen={viewPort.isFullscreen} setOpenPins={setOpenPins} pinChat={pinChat} toggleCastPoll={toggleCastPoll} /> : null}
                            <Box className="overflow-y-hidden" style={{ boxSizing: 'border-box', width: '100%', position: 'relative', height: '100%' }}>
                                <Tabs isFullscreen={viewPort.isFullscreen} channel={channel} setOpenPins={setOpenPins} setIsSidebarOpen={setIsSidebarOpen} setChannel={setChannel} setIsPollsOpen={setIsPollsOpen} />
                                <div
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        height: 'calc(100% - 7.5rem)',
                                        marginTop: '2.5rem',
                                        marginBottom: '6rem',
                                        overflowY: 'auto',
                                        boxSizing: 'border-box'
                                    }}>
                                    {displayedChats}
                                    {/* <div className="w-full h-4 bg-transparent invisible"></div> */}
                                </div>
                                <div ref={scrollingPatch} className="w-full h-12 bg-transparent invisible"></div>
                                <ChatInput
                                 isFullscreen={viewPort.isFullscreen}
                                 style={{
                                    display: "flex",
                                    position: "fixed",
                                    height: "5rem",
                                    flexWrap: "wrap",
                                    bottom: 0,
                                    backgroundColor: 'white',
                                    alignItems: "end"
                                }} sendChat={sendChatToChannel} />
                            </Box>
                            {openEmojiPicker ? <EmojiPicker chatId={selectedChatId} toggleReaction={toggleReaction} toggleEmojiPicker={toggleEmojiPicker}/> : null}
                            {isCastPollOpen ? <CastPoll isFullscreen={viewPort.isFullscreen} poll={clickedPoll} toggleCastPoll={toggleCastPoll} /> : null}
                        </Box>
                    </React.Fragment>
                    : <Text className="w-full font-bold text-center text-gray-700 text-xl">Only creators and editors can chat on this medium</Text>
            }
        </ErrorBoundary>
    );
}


initializeBlock(() => <ChattyBlock />);
