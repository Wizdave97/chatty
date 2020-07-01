import React from 'react';
import { useBase, Button, useGlobalConfig, useSession } from '@airtable/blocks/ui';
import ButtonWithBadge from './buttonBadge';


const Sidebar = (props) => {
    const { channel, setIsSidebarOpen, setChannel, sidebarRef, isFullscreen } = props;
    const base = useBase();
    const session = useSession();
    const tables = base.tables;
    const globalConfig = useGlobalConfig();
    const chats = globalConfig.get('chats') ? globalConfig.get('chats') : [];
    const countUnreadMessages = (channel) => {
        let count = 0;
        const lastChatIndex = chats.length - 1;
        for (let i = 0; i <= lastChatIndex; i++) {
            if (chats[i].read.indexOf(session.currentUser.id) <= -1 && chats[i].channel === channel) ++count
        }
        return count;
    }
   
    const tabsList = tables ? tables.map((table) => {
        const unread = countUnreadMessages(table.name);
        return (
            <ButtonWithBadge badge={unread} className={`w-full text-white bg-transparent ${channel === table.name ? 'text-indigo-600 font-bold bg-white' : ''}`}
                key={table.id} marginLeft={1} onClick={() => {
                    setIsSidebarOpen(false);
                    setChannel(table.name)
                }}>{table.name}</ButtonWithBadge>)
    }) : null

    return (
        <aside ref={sidebarRef} className={`w-0 p-0 h-full z-50 bg-gray-800 fixed overflow-y-auto top-0 left-0 flex flex-col justify-center content-center transition-all duration-200 ${isFullscreen ? 'w-64 p-2' : ''}`}>
            <React.Fragment>
                {!isFullscreen ? <Button className="w-full font-xl bg-gray-700 border-0 rounded-none mb-1 text-white" icon="x" aria-label="close sidebar" onClick={() => setIsSidebarOpen(false)} /> : null }
                {tabsList}
            </React.Fragment>
        </aside>
    )
}
export default Sidebar;
