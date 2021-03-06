import React, { useState } from 'react';
import { cursor } from '@airtable/blocks';
import {
    Box,
    FormField,
    Input,
    Button,
    Text,
    Heading,
    Dialog,
    useLoadable,
    useWatchable,
    useBase,
    useRecords,
    RecordCard,
    useSession,
    useGlobalConfig
} from '@airtable/blocks/ui';
import PollRecord from './pollRecord';
import CastPoll from './castPoll';

const Polls = (props) => {
    const { setIsPollsOpen, channel, isFullscreen } = props;
    const base = useBase();
    const session = useSession();
    const table = base.getTableByNameIfExists(channel);
    const tableRecords = useRecords(table);
    const globalConfig = useGlobalConfig();
    const polls = globalConfig.get('polls');
    const [question, setQuestion] = useState('');
    const [records, setRecords] = useState([]);
    const [expiry, setExpiry] = useState('');
    const [isCastPollOpen, setCastPollOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [clickedPoll, setClickedPoll] = useState(null);
    const [pollsAlert, setPollsAlert] = useState(false);
    useLoadable(cursor);
    useWatchable(cursor, 'selectedRecordIds', () => {
        setRecords(tableRecords ? tableRecords.filter(record => (cursor.selectedRecordIds.indexOf(record.id) > -1)) : []);
    })
    const toggleCastPoll = (poll) => async () => {
        await setClickedPoll(poll);
        setCastPollOpen(!isCastPollOpen);
    }
    const publishPoll = () => {
        let pollId = globalConfig.get('pollId') ? globalConfig.get('pollId') : 0;
        const expExploded = expiry.split(':');
        const hour = +expExploded[0];
        const min = +expExploded[1];
        const hourDiff = hour - new Date().getHours();
        const minuteDiff = Math.abs(min - new Date().getMinutes());
        if (hourDiff < 0) {
            alert('Please enter a valid expiry time');
            return;
        }
        const expBigInt = Date.now() + (hourDiff * 60 * 60 * 1000) + (minuteDiff * 60 * 1000);
        const results = {};
        records.map(record => results[record.id] = 0);
        const poll = {
            id: pollId,
            collaborator: session.currentUser,
            channel,
            question,
            recordIds: records.map(record => record.id),
            length: records.length,
            results,
            voters: [],
            timestamp: Date.now(),
            expiresIn: expBigInt
        }
        let nextChatId = globalConfig.get('nextChatId');
        nextChatId = nextChatId ? nextChatId : 0;
        const pollChat = {
            type: 'poll',
            id: nextChatId,
            pollId,
            collaborator: session.currentUser,
            channel,
            question,
            recordIds: records.map(record => record.id),
            length: records.length,
            results,
            voters: [],
            read: [],
            reactions:{},
            timestamp: Date.now(),
            expiresIn: expBigInt,
            pinned: false
        }
        let polls = globalConfig.get('polls') ? globalConfig.get('polls') : [];
        polls = polls.filter(poll => poll.expiresIn > Date.now());
        polls.length >= 10 ? chats.splice(0, 5) : null
        polls.push(poll);
        globalConfig.setAsync('polls', polls);
        globalConfig.setAsync('pollId', ++pollId);
        const chats = globalConfig.get('chats') ? globalConfig.get('chats') : [];
        chats.length >= 500 ? chats.splice(0, 100) : null
        chats.push(pollChat)
        globalConfig.setAsync('chats', chats);
        globalConfig.setAsync('nextChatId', ++nextChatId);
        setIsDialogOpen(false);
    }
    const createNewPoll = () => {
        const polls = globalConfig.get('polls') ? globalConfig.get('polls') : [];
        if (polls.length >= 10) setPollsAlert(true);
        else setIsDialogOpen(true);
    }
    const deletePoll = (id) => {
        const polls = globalConfig.get('polls') ? globalConfig.get('polls') : []; 
        const chats = globalConfig.get('chats') ? globalConfig.get('chats') : [];
        const newPolls = polls.filter(poll => poll.id !== id);
        const newChats = chats.filter(chat => chat.pollId !== id);
        globalConfig.setAsync('polls', newPolls);
        globalConfig.setAsync('chats', newChats);
    }
    return (
        <Dialog className="relative box-border p-0" width={isFullscreen ? '500px' : '100%'} height="400px" onClose={() => setIsPollsOpen(false)}>
            <Box className="w-full absolute top-0 z-30 flex flex-no-wrap justify-end p-0 m-0 box-border">
                <Button className="rounded-full opacity-50" aria-label="close modal" variant="danger" onClick={() => setIsPollsOpen(false)} icon="x" />
            </Box>
            {pollsAlert ? <Dialog onClose={() => setPollsAlert(false)} width="320px">
                <Dialog.CloseButton />
                <Heading>Polls limit reached</Heading>
                <Text variant="paragraph">
                    You have reached your polls limit, delete some polls before you create more polls
                </Text>
                <Button onClick={() => setPollsAlert(false)}>Close</Button>
            </Dialog> : null}
            {isDialogOpen ?
                <Dialog className="relative box-border p-0" width={isFullscreen ? '500px' : '100%'} height="400px" onClose={() => setIsDialogOpen(false)}>
                    <Dialog.CloseButton />
                    <FormField className="w-full mb-2 p-2 box-border" label="Type in your poll question">
                        <Input value={question} onChange={e => setQuestion(e.target.value)} />
                    </FormField>
                    <div className="w-full mb-2 p-2 box-border">
                    <Text className="w-full text-md">Select records to poll from view</Text>
                    </div>
                    <ul className="w-full list none flex flex-wrap overflow-y-auto">
                        {records ? records.map(record => (<li className="w-full bg-gray-100 shadow-inner flex justify-between mb-1 text-md p-2" key={record.id}>
                            <RecordCard record={record} /></li>)) : null}
                    </ul>
                    <FormField className="w-full mb-2 p-2" label="Select poll expiry time">
                        <Input type="time" value={expiry} onChange={(event) => setExpiry(event.target.value)} />
                    </FormField>
                    <div className="w-full mb-2 p-2 box-border">
                    <Button
                        className=" my-2 box-border"
                        onClick={publishPoll}
                        disabled={(records.length <= 1 || expiry.split(':').length !== 2 || !question.trim()) ? true : false} variant="primary">Publish</Button>
                    </div>
                </Dialog>
                : null
            }
            <div className="flex flex-wrap box-border mt-12 p-2">
                <Box className="w-full flex  flex-no-wrap  justify-between p-2">
                    <Text className="text-lg font-bold mr-2">Polls</Text>
                    <Button aria-label="create poll" icon="plus" onClick={createNewPoll} />
                </Box>
                <Box className="w-full flex flex-wrap overflow-y-auto mt-2">
                    {polls && polls.length > 0 ? polls.map(poll => (
                        <Box key={poll.id} onClick={Date.now() < poll.expiresIn && poll.voters.indexOf(session.currentUser.id) <= -1 ? toggleCastPoll(poll) : () => (null)} className="w-full relative flex flex-wrap my-3 bg-gray-200 cursor-pointer rounded-md p-1">
                            <span className={`absolute top-0 right-0 font-semibold lowercase text-xs ${Date.now() > poll.expiresIn ? ' text-red-700' : ' text-green-700'}`}>
                                {Date.now() > poll.expiresIn ? 'Expired' : 'Active'}
                            </span>
                            <Text className="w-full mb-1 text-md font-bold text-gray-800 mr-8">{poll.question}</Text>
                            <ul className="w-full list none flex flex-wrap overflow-y-auto">
                                {poll.recordIds.map(id => (
                                    <PollRecord key={id}
                                        renderingResult={true}
                                        length={poll.length}
                                        expiresIn={poll.expiresIn}
                                        voters={poll.voters}
                                        id={id}
                                        channel={poll.channel}
                                        result={poll.results[id]} />
                                ))}
                            </ul>
                            <Text className="w-full my-1 text-md font-bold text-gray-800 mr-8">{`Number of voters: ${poll.voters.length}`}</Text>
                            <Button className="my-1 text-red-700" icon="trash" aria-label="delete poll" onClick={(event) =>{ event.stopPropagation();deletePoll(poll.id)}}/>
                            {poll.voters.indexOf(session.currentUser.id) >= 0 ? <Text className="w-full my-1 text-sm font-semibold text-gray-600 mr-8">You have already voted in this poll</Text> : null}
                        </Box>
                    )) : null}
                    {isCastPollOpen ? <CastPoll poll={clickedPoll} toggleCastPoll={toggleCastPoll} /> : null}
                </Box>
            </div>

        </Dialog>
    )
}

export default Polls;