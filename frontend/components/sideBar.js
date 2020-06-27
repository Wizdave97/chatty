import React from 'react';
import { useViewport, useBase, Button } from '@airtable/blocks/ui';


const Sidebar = (props) => {
    const {channel, setIsSidebarOpen, setChannel, sidebarRef} = props;
    const base = useBase();
    const tables = base.tables;
    const tabsList = tables ? tables.map((table) => {
        return (
        <Button className={`w-full text-white bg-transparent ${channel === table.name ? 'text-indigo-600 font-bold bg-white' : ''}`}  
        key={table.id} marginLeft={1} onClick={()=> {
            setIsSidebarOpen(false);
            setChannel(table.name)
        }}>{table.name}</Button>)
    }):null
    const viewport = useViewport();

    return (
        <aside ref={sidebarRef} className="w-0 p-0 h-full z-50 bg-gray-800 fixed overflow-y-auto top-0 left-0 flex flex-col justify-center content-center transition-all duration-200">
            <React.Fragment>
                <Button className="w-full font-xl bg-gray-600 mb-1 text-white" icon="x" aria-label="close sidebar" onClick={() => setIsSidebarOpen(false)}/>
                {tabsList}
            </React.Fragment>
        </aside>
    )
}
export default Sidebar;
