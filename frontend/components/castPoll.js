import React from 'react';
import { Box, Dialog, Text, Button, useGlobalConfig, useSession } from '@airtable/blocks/ui';
import PollRecord from './pollRecord';


const CastPoll = (props) => {
    const { poll, toggleCastPoll, isFullscreen } = props;
    const [vote, setVote] = React.useState({});
    const globalConfig = useGlobalConfig();
    const session = useSession();
    const clickStar = (id, i) => {
        const newVote = { ...vote };
        newVote[id] = ++i;
        setVote(newVote)

    }
    const castVote = () => {
        const polls = globalConfig.get('polls');
        const chats = globalConfig.get('chats');
        const pollCopy = { ...poll };
        let totalVoters = pollCopy.voters.length + 1;
        if (pollCopy.voters.indexOf(session.currentUser.id) > -1) --totalVoters;
        else pollCopy.voters.push(session.currentUser.id)
        const { results } = pollCopy;
        pollCopy.recordIds.map(id => {
            let sum = results[id] + vote[id] ? vote[id] : 0;
            results[id] = Math.round(sum / totalVoters);
        })
        for (let index in polls) {
            if (polls[index].id === pollCopy.id) {
                polls[index] = pollCopy;
                break;
            }
        }
        for (let chat of chats) {
            if (chat.pollId === pollCopy.id) {
                chat.results = pollCopy.results;
                chat.voters = pollCopy.voters;
                break;
            }
        }
        globalConfig.setAsync('polls', polls);
        globalConfig.setAsync('chats', chats);
        toggleCastPoll(null)();
    }
    return (
        <Dialog className="relative box-border p-0" width={isFullscreen ? '500px' : '100%'} style={{ maxHeight: '400px' }} onClose={toggleCastPoll(null)}>
            <Box className="w-full absolute top-0 z-30 flex flex-no-wrap justify-end p-0 m-0 box-border">
                <Button className="rounded-full opacity-50" aria-label="close modal" variant="danger" onClick={toggleCastPoll(null)} icon="x" />
            </Box>
            <div className="flex flex-wrap box-border mt-12 p-2">
                <Box className="w-full relative flex flex-wrap mt-2 bg-gray-200 shadow-inner rounded-md p-1">
                    <Text className="w-full mb-1 text-md font-bold text-gray-800">{poll && poll.question}</Text>
                    <ul className="w-full list none flex flex-wrap overflow-y-auto">
                        {poll && poll.recordIds.map(id => (
                            <PollRecord key={id}
                                renderingResult={false}
                                clickStar={clickStar}
                                id={id}
                                channel={poll.channel}
                                result={poll.results[id]} />
                        ))}
                    </ul>
                </Box>
                <Button
                    onClick={castVote}
                    disabled={(poll && poll.recordIds.length) !== Object.values(vote).length}
                    className="mt-2"
                    variant="primary">Poll</Button>
            </div>

        </Dialog>
    )
}

export default CastPoll;