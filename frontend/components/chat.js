import React from 'react';
import { Box, Text, Button } from '@airtable/blocks/ui';
import Reaction from './emoji';

const Chat = (props) => {
    const { collaborator, timestamp, message, replies, reactions, pinned, id } = props.chat
    const { pinChat, setReplying, inreply, reference, toggleEmojiPicker, toggleReaction} = props;
    let chatTimeStamp = new Date(timestamp).toLocaleString();
    if ((new Date().getDay() - new Date(timestamp).getDay()) === 1) {
        chatTimeStamp = `Yesterday ${new Date(timestamp).toLocaleTimeString()}`
    }
    else chatTimeStamp = `Today ${new Date(timestamp).toLocaleTimeString()}`

    return (
        <div
            onClick={() => setReplying ? setReplying(props.chat) : null}
            ref={reference}
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
                <Box id="avatar" className="rounded-md shadow-md my-1"
                    style={{
                        overflow: 'hidden',
                        width: '48px',
                        height: '48px',
                    }}>
                    <img
                        src={collaborator ? collaborator.profilePicUrl : ''}
                        alt="profile"
                        style={{
                            width: '100%',
                            height: '100%'
                        }} />
                </Box>
                <Box

                    style={{
                        display: 'flex',
                        boxSizing: 'border-box',
                        flexWrap: 'wrap',
                        marginLeft: '0.8rem',
                        width: 'calc(100% - 48px)'
                    }}>
                    <Box className="w-full flex flex-no-wrap mb-1">
                        <Box id="name" className="mr-3"><Text className="text-md font-bold text-gray-800" variant="default">{collaborator ? collaborator.name : null}</Text></Box>
                        <Box id="timestamp" className="mr-3"><Text className="text-xs text-gray-600" variant="default">{chatTimeStamp}</Text></Box>
                    </Box>
                    <Box id="message" className="w-full mb-2">
                        <Text className="text-sm font-medium leading-relaxed text-gray-800" variant="paragraph">{message}</Text>
                    </Box>
                </Box>
            </div>

            {!inreply ?
                <div id="icons" className="mt-1" style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    {setReplying ? <Button
                        onClick={(event) => { event.stopPropagation(); setReplying ? setReplying(props.chat) : null }}
                        size="small"
                        variant="secondary"
                        icon="chat"
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
                        onClick={(event) => { event.stopPropagation(); pinChat(id)() }}>{pinned ? 'starred' : null}</Button>
                    {Object.values(reactions).map(obj => {
                        return obj.count > 0 ? <Reaction key={obj.id} emoji={obj} toggleReaction={toggleReaction} chatId={id}/> : null;
                    })}
                    <Button
                        size="small"
                        variant="secondary"
                        icon="smiley"
                        margin={1}
                        padding={1}
                        aria-label="pinned"
                        style={{ borderRadius: '9999px' }}
                        onClick={(event) => { event.stopPropagation(); toggleEmojiPicker(true, id)}}/>
                    
                </div>
                : null}
        </div>
    )
}

export default Chat;