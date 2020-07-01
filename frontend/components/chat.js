import React from 'react';
import { Box, Text, Button } from '@airtable/blocks/ui';

const Chat = (props) => {
    const { collaborator, timestamp, message, replies, pinned, id } = props.chat
    const { pinChat, setReplying, inreply, newMessageRef } = props;
    let chatTimeStamp = new Date(timestamp).toLocaleString();
    if ((new Date().getDay() - new Date(timestamp).getDay()) === 1) {
        chatTimeStamp = `Yesterday ${new Date(timestamp).toLocaleTimeString()}`
    }
    else chatTimeStamp = `Today ${new Date(timestamp).toLocaleTimeString()}`

    return (
        <div
            onClick={() => setReplying ? setReplying(props.chat) : null}
            ref={newMessageRef}
            className="hover:bg-gray-300 border-0 my-6"
            style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                padding: '0.25rem',
                boxSizing: 'border-box',
                cursor: 'pointer'
            }}>
            <div

                
                style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'start',
                    justifyContent: 'start',
                    alignContent: 'start',
                    width: '100%'
                }}>
                <Box id="avatar" className="rounded-full shadow-md my-1"
                    style={{
                        overflow: 'hidden',
                        width: '32px',
                        height: '32px',
                    }}>
                    <img
                        src={collaborator ? collaborator.profilePicUrl : ''}
                        alt="profile"
                        style={{
                            width: '100%',
                            height: '100%'
                        }} />
                </Box>
                <Box style={{
                    display: 'flex',
                    boxSizing: 'border-box',
                    flexWrap: 'wrap',
                    marginLeft: '0.8rem',
                    width: 'calc(100% - 32px)'
                }}>
                    <Box id="name" width="100%" className="mb-1"><Text className="text-md font-bold text-gray-800" variant="default">{collaborator ? collaborator.name : null}</Text></Box>
                    <Box id="timestamp" width="100%" className="mb-1"><Text className="text-xs text-gray-600" variant="default">{chatTimeStamp}</Text></Box>
                    
                </Box>
            </div>
            <Box id="message" className="w-full my-2">
                        <Text className="text-sm font-medium leading-relaxed text-gray-800" variant="paragraph">{message}</Text>
            </Box>
            {!inreply ?
                <div id="icons" style={{
                    display: 'flex',
                    flexWrap: 'nowrap'
                }}>
                    {setReplying ? <Button
                        onClick={(event) => { event.stopPropagation(); setReplying ? setReplying(props.chat) : null}}
                        size="small"
                        variant="secondary"
                        icon="team"
                        margin={1}
                        padding={1}
                        aria-label="replies"
                        style={{ borderRadius: '9999px' }}>{replies.length}</Button> : null}
                    <Button
                        size="small"
                        variant="secondary"
                        icon="star"
                        className={`${pinned ? 'fill-current text-yellow-600' : ''}`}
                        margin={1}
                        padding={1}
                        aria-label="pinned"
                        style={{ borderRadius: '9999px' }}
                        onClick={(event) => {event.stopPropagation(); pinChat(id)()}}>{pinned ? 'pinned' : null}</Button>
                </div>
                : null}
        </div>
    )
}

export default Chat;