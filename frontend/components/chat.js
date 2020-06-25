import React from 'react';
import { Box, Text, Button, colors} from '@airtable/blocks/ui';

const Chat = (props) => {
    const { collaborator, timestamp, message, replies, likes, pinned, id } = props.chat
    const {pinChat, setReplying, inreply } = props; 
    return (
        <Box 
        className={`hover:bg-blue-100 ${pinned ? 'bg-yellow-400' : ''}`}
        style={{
            width:'100%',
            display:'flex',
            flexWrap:'wrap',
            padding:'0.25rem',
            boxSizing:'border-box',
            borderBottom:'1px solid rgba(0,0,0,0.3)',
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
                    <Box id="name" width="100%"><Text variant="default" style={{fontWeight:700}}>{collaborator ? collaborator.name : null}</Text></Box>
                    <Box id="timestamp" width="100%"><Text variant="default">{timestamp}</Text></Box>
                    <Box id="message">
                    <Text variant="paragraph">{message}</Text>
                    </Box>
                </Box>
                
            </div>
            {!inreply ?
            <div id="icons" style={{
                display:'flex',
                flexWrap:'nowrap'
            }}>
               <Button size="small" 
               variant="secondary" 
               icon="heart" 
               margin={1} 
               padding={1} 
               aria-label="likes"
               style={{borderRadius:'9999px'}}>{likes.length}</Button>
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
               margin={1} 
               padding={1}
               aria-label="pinned" 
               style={{borderRadius:'9999px'}} 
               onClick={pinChat(id)}>{pinned ? 'pinned' : null}</Button>
            </div>
            : null }
        </Box>
    )
}

export default Chat;