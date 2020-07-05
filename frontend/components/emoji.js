import React from 'react';
import { Emoji } from 'emoji-mart'

const Reaction = (props) => {
    const {emoji, toggleReaction, chatId} = props;
    return (
        <span onClick={(event) => {event.stopPropagation(); toggleReaction(chatId, emoji)}} className="flex flex-no-wrap mx-1 rounded-full w-10 h-8 justify-center items-center border border-blue-400 bg-blue-100">
            <Emoji emoji={emoji} set='apple' size={16} />
            <span className="text-xs">{emoji.count}</span>
        </span>
    );
}

export default Reaction;