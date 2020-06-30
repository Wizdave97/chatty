import React from 'react';
import { Button, Box, Text, useGlobalConfig } from '@airtable/blocks/ui';
import ButtonWithBadge from './buttonBadge';

const Tabs = (props) => {
    const { channel, setIsPollsOpen, setIsSidebarOpen, setOpenPins, isFullscreen } = props;
    const globalConfig = useGlobalConfig();
    const polls = globalConfig.get('polls');
    const chats = globalConfig.get('chats');
    let pinnedChats = 0;
    let activePollCount = 0;
    polls ? polls.map(poll => {
        poll.expiresIn > Date.now() ? activePollCount++ : null;
    }) : null

    chats ? chats.map(chat => {
        chat.pinned ? pinnedChats++ : null;
    }) : null

    return (
        <Box className={`w-full flex z-10 flex-no-wrap top-0 items-center  justify-between w-full fixed bg-white border-b border-gray-400 ${isFullscreen ? 'tab-shift' : ''}`}
            style={{
                height: "2.5rem",
                paddingBottom: "4px",
            }}
        >
            <div className="flex  flex-no-wrap items-center">
                {isFullscreen ? null : <Button onClick={() => setIsSidebarOpen(true)} className="mx-1 fill-current text-indigo-600" aria-label="menu" icon="menu" />}
                <Text className="mx-1 text-sm text-indigo-600 font-semibold truncate">{channel}</Text>
            </div>
            <Box className="flex  flex-no-wrap items-center">
                <ButtonWithBadge onClick={() => setOpenPins(true)} className="mx-1 fill-current text-yellow-600" aria-label="Starred" icon="star" badge={pinnedChats} />
                <ButtonWithBadge onClick={() => setIsPollsOpen(true)} className="ml-2 fill-current text-blue-600" aria-label="Polls" icon="chart" badge={activePollCount} />
            </Box>
        </Box>
    )
}

export default Tabs;