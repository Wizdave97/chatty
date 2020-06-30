import React, { useState } from 'react';
import { useRecordById, expandRecord, Text, TextButton, Icon, useBase, Button } from '@airtable/blocks/ui';

const PollRecord = (props) => {
    const { id, channel, result, renderingResult, clickStar } = props;
    const [clickedStar, setClickedStar] = useState(null);
    const table = useBase().getTableByNameIfExists(channel)
    const record = useRecordById(table, id);
    const numStars = 5;
    let stars = [];
    const clickHandler = (i) => () => {
        setClickedStar(i);
        clickStar(id, i);
    }
    if (renderingResult) {
        for (let i = 0; i < numStars; i++) {
            if (result >= i + 1) {
                stars.push(<Icon key={i} name="star" size={16} className="text-yellow-600 mx-1" />)
            }
            else {
                stars.push(<Icon key={i} name="star" size={16} className="text-gray-500 mx-1" />);
            }
        }
    }
    else {
        for (let i = 0; i < numStars; i++) {
            if ((clickedStar !== null) && clickedStar >= i) {
                stars.push(<Button key={i} onClick={clickHandler(i)} aria-label="star" icon="star" size="large" className="bg-transparent text-yellow-600 mx-1 p-0" />)
            }
            else {
                stars.push(<Button key={i} onClick={clickHandler(i)} aria-label="star" icon="star" size="large" className="bg-transparent text-gray-500 mx-1 p-0" />);
            }
        }
    }

    return (
        <li className="w-full flex flex-no-wrap justify-between p-1 items-center">
            <span className="w-1/2 flex flex-no-wrap justify-between">
                <Text className="text-sm text-gray-600 truncate">{record.name}</Text>
                <TextButton aria-label="expand record" className="ml-2" icon="collapse" onClick={() => expandRecord(record)} />
            </span>
            <span className="p-1 mr-1 flex flex-no-wrap">
                {stars.length > 0 ? stars : null}
            </span>
        </li>
    )
}

export default PollRecord;