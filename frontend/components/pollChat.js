import React from 'react';
import { Box, Text, Button, useSession } from '@airtable/blocks/ui';
import PollRecord from './pollRecord';
import Reaction from './emoji';

const PollChat = (props) => {

    const { pinChat, pollChat, toggleCastPoll, newMessageRef, toggleReaction, toggleEmojiPicker } = props;
    const poll = { ...pollChat }
    const session = useSession();
    poll.id = poll.pollId;
    let chatTimeStamp = new Date(pollChat.timestamp).toLocaleString();
    if ((new Date().getDay() - new Date(pollChat.timestamp).getDay()) === 1) {
        chatTimeStamp = `Yesterday ${new Date(pollChat.timestamp).toLocaleTimeString()}`
    }
    else chatTimeStamp = `Today ${new Date(pollChat.timestamp).toLocaleTimeString()}`

    return (
        <Box
            className="hover:bg-gray-300  border-0"
            style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                padding: '0.25rem',
                boxSizing: 'border-box',
                marginTop: '0.5rem',
                cursor: 'pointer'
            }}>
            <div
                ref={newMessageRef}
                onClick={Date.now() < pollChat.expiresIn && pollChat.voters.indexOf(session.currentUser.id) <= -1 ? toggleCastPoll(poll) : () => (null)}
                style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'start',
                    justifyContent: 'start',
                    alignContent: 'start',
                    width: '100%'
                }}>
                <Box id="avatar" className="rounded-md shadow-md"
                    style={{
                        overflow: 'hidden',
                        width: '48px',
                        height: '48px',
                    }}>
                    <img
                        src={pollChat.collaborator ? pollChat.collaborator.profilePicUrl : ''}
                        alt="profile"
                        style={{
                            width: '100%',
                            height: '100%'
                        }} />
                </Box>
                <Box className="pl-2" 
                style={{
                    display: 'flex',
                    boxSizing: 'border-box',
                    flexWrap: 'wrap',
                    width: 'calc(100% - 48px)'
                }}>
                    <Box className="w-full flex flex-no-wrap mb-1">
                        <Box id="name" className="mr-3"><Text className="text-md font-bold text-gray-800" variant="default">{pollChat.collaborator ? pollChat.collaborator.name : null}</Text></Box>
                        <Box id="timestamp" className="mr-3"><Text className="text-xs text-gray-600" variant="default">{chatTimeStamp}</Text></Box>
                    </Box>
                    <Box id="name" width="100%" className="mb-1"><Text className="text-xs font-semibold text-gray-700" variant="default">New Poll</Text></Box>
                    <Box className="w-full relative flex flex-wrap mt-2 bg-gray-200 rounded-md p-1">
                        <span className={`absolute top-0 right-0 font-semibold lowercase text-xs ${Date.now() > pollChat.expiresIn ? ' text-red-700' : ' text-green-700'}`}>
                            {Date.now() > pollChat.expiresIn ? 'Expired' : 'Active'}
                        </span>
                        <Text className="w-full mb-1 text-md font-bold text-gray-800 mr-8">{pollChat.question}</Text>
                        <ul className="w-full list none flex flex-wrap">
                            {pollChat.recordIds.map(id => (
                                <PollRecord key={id}
                                    renderingResult={true}
                                    length={pollChat.length}
                                    expiresIn={pollChat.expiresIn}
                                    voters={pollChat.voters}
                                    id={id}
                                    channel={pollChat.channel}
                                    result={pollChat.results[id]} />
                            ))}
                        </ul>
                        <Text className="w-full my-1 text-md font-bold text-gray-800 mr-8">{`Number of voters: ${poll.voters.length}`}</Text>
                        {poll.voters.indexOf(session.currentUser.id) >= 0 ? <Text className="w-full my-1 text-sm font-semibold text-gray-600 mr-8">You have already voted in this poll</Text> : null}
                    </Box>
                </Box>

            </div>
            <div id="icons" className="mt-1" style={{
                display: 'flex',
                flexWrap: 'wrap'
            }}>

                <Button
                    size="small"
                    variant="secondary"
                    icon="star"
                    className={`${pollChat.pinned ? 'fill-current text-yellow-600' : ''}`}
                    margin={1}
                    padding={1}
                    aria-label="pinned"
                    style={{ borderRadius: '9999px' }}
                    onClick={(event) => { event.stopPropagation(); pinChat(pollChat.id)() }}>{pollChat.pinned ? 'starred' : null}</Button>
                     {Object.values(pollChat.reactions).map(obj => {
                        return obj.count > 0 ? <Reaction key={obj.id} emoji={obj} toggleReaction={toggleReaction} chatId={pollChat.id}/> : null;
                    })}
                    <Button
                        size="small"
                        variant="secondary"
                        icon="smiley"
                        margin={1}
                        padding={1}
                        aria-label="pinned"
                        style={{ borderRadius: '9999px' }}
                        onClick={(event) => { event.stopPropagation(); toggleEmojiPicker(true, pollChat.id)}}/>
            </div>
        </Box>
    )
}

export default PollChat;