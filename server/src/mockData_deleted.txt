import { Channel, Message } from "./model";
import { v4 as uuidv4 } from 'uuid';

const channels: Channel[] = [
    {id: "channelA", name: "channel A"},
    {id: "channelB", name: "channel B"},
    {id: "channelC", name: "channel C"},
];

const messages: Message[] = [
    {id: uuidv4(), title: "titleA", content: "contentA", channel: "channelA", createdAt: new Date(2022, 10, 1)},
    {id: uuidv4(), title: "title1", content: "contentAA", channel: "channelA", createdAt: new Date(2022, 10, 3)},
    {id: uuidv4(), title: "title2", content: "contentAA", channel: "channelA", createdAt: new Date(2022, 9, 30)},
    {id: uuidv4(), title: "title3", content: "contentAA", channel: "channelA", createdAt: new Date(2022, 10, 8)},
    {id: uuidv4(), title: "title4", content: "contentAA", channel: "channelA", createdAt: new Date(2022, 8, 3)},
    {id: uuidv4(), title: "title5", content: "contentAA", channel: "channelA", createdAt: new Date(2022, 7, 5)},
    {id: uuidv4(), title: "title6", content: "contentAA", channel: "channelA", createdAt: new Date(2022, 10, 10)},
    {id: uuidv4(), title: "titleB", content: "contentB", channel: "channelB", createdAt: new Date(2022, 6, 3)},
    {id: uuidv4(), title: "titleC", content: "contentC", channel: "channelC", createdAt: new Date(2022, 10, 11)},
];

export { channels, messages }
