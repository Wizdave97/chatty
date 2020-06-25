import React from 'react';
import { Button, useBase, Box} from '@airtable/blocks/ui';

const Tabs  = (props) => {
    const { channel, setChannel } = props;
    const base = useBase();
    const tables = base.tables;
    const tabsList = tables ? tables.map((table) => {
        return (<Button className="text-indigo-600" style={channel === table.name ?{
            fontWeight: 700,
        }: {}}  key={table.id} marginLeft={1} onClick={()=> setChannel(table.name)}>{table.name}</Button>)
    }):null
    return (
        <Box  style={{
             width:'100%',
             display:"flex",
             position: "fixed",
             height:"2.5rem",
             paddingBottom:"4px",
             backgroundColor:'white',
             borderBottom: "1px solid rgba(0,0,0,0.5)",
             flexWrap:"nowrap",
             top:0,
             alignItems:"center",
             overflowX:"auto"}}
             >
              {tabsList}   
        </Box>
    )
}

export default Tabs;