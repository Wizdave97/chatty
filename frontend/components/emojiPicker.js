import React from 'react';
import { Dialog, Box, loadCSSFromString } from '@airtable/blocks/ui';
import css from './emoji-mart-css';
import { Picker } from 'emoji-mart';
loadCSSFromString(css);

const EmojiPicker = (props) => {
    const { toggleEmojiPicker, toggleReaction, chatId} = props;
    
    return (
        <Dialog className="box-border p-0" width="360px" height="400px" onClose={() => toggleEmojiPicker(false, null)}>
            <Dialog.CloseButton />
            <Box className="w-full flex flex-wrap h-full overflow-y-auto p-2 box-border">
                <Picker onClick = {(emoji, event) => { toggleReaction(chatId, emoji); toggleEmojiPicker(false, null)}} set="apple" title='Pick your emoji…' emoji='point_up' style={{ }} />
            </Box>
        </Dialog>
    );
}

export default EmojiPicker;