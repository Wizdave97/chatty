import React from 'react';
import { Box, Text, Button} from '@airtable/blocks/ui';

const Chat = (props) => {
    const { collaborator, timestamp, message, replies, pinned, id } = props.chat
    const {pinChat, setReplying, inreply, newMessageRef } = props; 
    let chatTimeStamp = new Date(timestamp).toLocaleString();
    if ((new Date().getDay() - new Date(timestamp).getDay()) === 1) {
        chatTimeStamp = `Yesterday ${new Date(timestamp).toLocaleTimeString()}`
    }
    else chatTimeStamp = `Today ${new Date(timestamp).toLocaleTimeString()}`

    return (
        <div 
        ref={newMessageRef}
        className="hover:bg-blue-100  border-b border-gray-700 shadow-inner"
        style={{
            width:'100%',
            display:'flex',
            flexWrap:'wrap',
            padding:'0.25rem',
            boxSizing:'border-box',
            marginTop:'0.5rem',
            cursor:'pointer'
        }}>
            <div 
            
            onClick = {() => setReplying ? setReplying(props.chat) : null}
            style={{
                display:'flex',
                flexWrap:'nowrap',
                alignItems:'start',
                justifyContent:'start',
                alignContent:'start',
                width:'100%'
            }}>
                <Box id="avatar" className="rounded-full shadow-md"
                style={{
                    overflow:'hidden',
                    width:'32px',
                    height:'32px',
                }}>
                    <img 
                    src={collaborator ? collaborator.profilePicUrl: ''}
                    alt="profile"
                    style={{
                        width:'100%',
                        height:'100%'
                        }}/>
                </Box>
                <Box style={{
                    display: 'flex',
                    boxSizing:'border-box',
                    flexWrap:'wrap',
                    marginLeft:'0.8rem',
                    width:'calc(100% - 32px)'
                    }}>
                    <Box id="name" width="100%"><Text className="text-md font-semibold text-gray-700" variant="default">{collaborator ? collaborator.name : null}</Text></Box>
                    <Box id="timestamp" width="100%"><Text className="text-sm text-gray-500" variant="default">{chatTimeStamp}</Text></Box>
                    <Box id="message">
                    <Text className="text-sm text-gray-800" variant="paragraph">{message}</Text>
                    </Box>
                </Box>
                
            </div>
            {!inreply ?
            <div id="icons" style={{
                display:'flex',
                flexWrap:'nowrap'
            }}>
               <Button 
               onClick = {() => setReplying ? setReplying(props.chat) : null}
               size="small" 
               variant="secondary" 
               icon="team" 
               margin={1} 
               padding={1}
               aria-label="replies" 
               style={{borderRadius:'9999px'}}>{replies.length}</Button>
               <Button 
               size="small" 
               variant="secondary" 
               icon="star" 
               className={`${pinned ? 'fill-current text-yellow-600' : ''}`}
               margin={1} 
               padding={1}
               aria-label="pinned" 
               style={{borderRadius:'9999px'}} 
               onClick={pinChat(id)}>{pinned ? 'pinned' : null}</Button>
            </div>
            : null }
        </div>
    )
}

export default Chat;