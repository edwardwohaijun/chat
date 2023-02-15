import { channels, messages } from './mockData';
import { v4 as uuidv4 } from 'uuid';

// Channel Model: { id, name }
interface Channel {
    id: string;
    name: string;
}

// Message Model: { id, title, content, channel, createdAt }
interface Message {
    id: string;
    title: string;
    content: string;
    channel: string; // channel ID
    channelName?: string; // channel Name
    createdAt: Date;
}

interface PaginatedResult {
    recordCount: number; // let's say 100 records
    pageSize: number; // let's say 10 records on each page
    currentPage: number; // current page 3 would output 21st ~ 30th
    result: any;
}

function createChannel(name: string | undefined): [boolean, Channel | string]{
    if (name == null || name.length > 10 || name.length == 0) {
        return [false, "Channel name must NOT be empty or exceeds 10 characters."]
    }
    let c:Channel = {id: uuidv4(), name};
    channels.push( c );
    return [true, c];
}

// todo: data validation are better to be refactored into a helper module.
function writeMessage(title: string | undefined, content: string | undefined, channel: string | undefined): [boolean, Message | string] {
    if (title == null || title.length > 10 || title.length == 0) {
        return [false, "Title must not be empty or exceeds 10 characters."]
    }

    if (content == null || content.length > 20 || content.length == 0) {
        return [false, "Content must not be empty or exceeds 20 characters."]
    }

    if (channel == null || channel.length == 0) {
        return [false, "Invalid channel Id."]
    }

    let channelIdx = channels.findIndex(c => c.id == channel);
    if (channelIdx == -1) {
        return [false, "Invalid channel Id."]
    }

    let msg: Message = {id: uuidv4(), title, content, channel, createdAt: new Date()}
    messages.push(msg);
    return [true, msg];
}

// todo: data validation are better to be refactored into a helper fn.
function listMessagesInChannel(channelId: string | undefined, currentPage: string = "1", pageSize: string = "2"): [boolean, PaginatedResult | string ] {
    if (channelId == null) {
        return [false, "channel Id cannot be empty"]
    }

    let currentPageInt: number = parseInt(currentPage);
    if (isNaN(currentPageInt) || currentPageInt <= 0) {
        return [false, "Invalid current page number"]
    }

    let pageSizeInt: number = parseInt(pageSize);
    if (isNaN(pageSizeInt) || pageSizeInt <= 0) {
        return [false, "Invalid page size number"]
    }

    let channelIdx = channels.findIndex( c => c.id == channelId);
    if (channelIdx == -1) {
        return [false, "Invalid channel Id"]
    }
    let channel = channels[channelIdx];
    let msgList = messages.filter(m => m.channel == channelId)
        .map(m => ({...m, channelName: channel.name}));
    let recordCount = msgList.length;
    
    // credit: https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
    msgList.sort((a, b) => {
        return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
    })

    let startIdx = (currentPageInt - 1) * pageSizeInt;
    let endIdx = startIdx + pageSizeInt;
    msgList = msgList.slice(startIdx, endIdx);
    let result: PaginatedResult = {recordCount, pageSize: pageSizeInt, currentPage: currentPageInt, result: msgList}
    return [true, result];
}

function listChannels() {
    return channels;
}

export { Channel, Message, createChannel, listChannels, writeMessage, listMessagesInChannel };
