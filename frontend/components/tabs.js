import React from 'react';
import { Button, Box, Text} from '@airtable/blocks/ui';

const Tabs  = (props) => {
    const {  channel, setIsPollsOpen, setIsSidebarOpen } = props;
 
    
    return (
        <Box className="w-full flex  flex-no-wrap top-0 items-center  justify-between w-full fixed bg-white border-b border-gray-400"  
            style={{
             height:"2.5rem",
             paddingBottom:"4px",
             }}
             >
                 <div className="flex  flex-no-wrap items-center ">
                    <Button onClick={() => setIsSidebarOpen(true)} className="mx-1 fill-current text-indigo-600" aria-label="menu" icon="menu"/>
                    <Text className="mx-1 text-sm text-indigo-600 font-semibold truncate">{channel}</Text>
                 </div>
                 <Box>
                <Button className="mx-1 fill-current text-yellow-600" aria-label="Starred" icon="star"/>
               <Button onClick={() => setIsPollsOpen(true)} className="mx-1 fill-current text-blue-600" aria-label="Polls" icon="chart"/>
               </Box>
        </Box>
    )
}

export default Tabs;