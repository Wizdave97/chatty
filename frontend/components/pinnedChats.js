import React from 'react';
import { Box, Button, useGlobalConfig, Dialog} from '@airtable/blocks/ui';
import Chat from './chat';
import PollChat from './pollChat'

const PinnedChats = (props) => {
    const { pinChat, setOpenPins, toggleCastPoll } = props;
    const globalConfig = useGlobalConfig();
    const chats = globalConfig.get('chats') ;
    const displayedChats = chats ? chats.filter(chat => chat.pinned).map((chat) => {
        switch (chat.type) {
            case 'msg':
                return <Chat inreply={true}  chat={chat} pinChat={pinChat} key={chat.id}/>
            case 'poll':
                return <PollChat key={chat.id} pinChat={pinChat} pollChat={chat} toggleCastPoll={toggleCastPoll} />
        }   
    }) : null
    
    return (
        <Dialog className="w-full flex relative box-border p-0" height="400px"  onClose={() => setOpenPins(false)}> 
            <Box  className="w-full absolute top-0 z-30 flex flex-no-wrap justify-end p-1 box-border">
                <Button className="rounded-full opacity-50" aria-label="close modal" variant="danger" onClick={() => setOpenPins(false)} icon="x"/>
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
                <div 
                style={{
                    width:'100%',
                    background:'transparent',
                    overflowY:'auto',
                    boxSizing:'border-box'
                    }}>
                    {displayedChats}
                </div>
           </Box>
        </Dialog>
    )
}

export default PinnedChats;