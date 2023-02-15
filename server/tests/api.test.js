const request = require("supertest");
const app = require("../dist/index");
const { messages } = require("../dist/mockData");

let server, agent;

beforeEach((done) => {
    server = app.listen(4000, (err) => {
      if (err) return done(err);
       agent = request.agent(server);
       done();
    });
});

afterEach((done) => {
  return  server && server.close(done);
});

// POST /channel
describe('create a channel with valid input', () => {
    it('return created channel(name/id)', async () => {
        let channelName = "Channel001";
        const res = await agent.post('/channel').send({name: channelName});
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual(channelName);
    })
})

// POST /channel
describe('create a channel with invalid input(longer than maximum allowed 10 characters)', () => {
    it('return 400 bad request', async () => {
        let channelName = "long channel name";
        const res = await agent.post('/channel').send({name: channelName});
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("Channel name must NOT be empty or exceeds 10 characters.");
    })
})

// POST /channel, POST /message
describe('create a channel, then post a valid msg to it', () => {
    it('return newly created msg', async () => {
        let channelName = "Channel002";
        const res = await agent.post('/channel').send({name: channelName});
        expect(res.statusCode).toEqual(200);
        
        let newChannelId = res.body.id;
        let msgTitle = 'new msg';
        let msgContent = 'new content';
        const res2 = await agent.post('/message').send({title: msgTitle, content: msgContent, channel: newChannelId});
        expect(res2.statusCode).toEqual(200);
        let msg = res2.body;
        expect(msg.title).toEqual(msgTitle);
        expect(msg.content).toEqual(msgContent);
        expect(msg.channel).toEqual(newChannelId);
    })
})

// POST /channel, POST /message
describe('create a channel, then post an invalid msg to it', () => {
    it('return 400 bad request', async () => {
        let channelName = "Channel003";
        const res = await agent.post('/channel').send({name: channelName});
        expect(res.statusCode).toEqual(200);
        
        let newChannelId = res.body.id;
        let msgTitle = 'a very long message title'; // exceeded 10 characters
        let msgContent = 'a very long message content'; // exceeded 20 characters
        const res2 = await agent.post('/message').send({title: msgTitle, content: msgContent, channel: newChannelId});
        expect(res2.statusCode).toEqual(400);
    })
})

// GET /messages: test pagination
describe('post a msg to a known channel, then get a list of all paginated msg in that channel', () => {
    it('return a list of all paginated msg in that channel', async () => {
        let channelId = "channelA"; // channelA is an existing data in mock data.
        let msgTitle = 'titleZ';
        let msgContent = 'contentZ';
        const res = await agent.post('/message').send({title: msgTitle, content: msgContent, channel: channelId});
        expect(res.statusCode).toEqual(200);

        let msgInChannelA = messages.filter(m => m.channel == channelId);
        let pageSize = 3;
        const res2 = await agent.get(`/messages?channelId=${channelId}&pageSize=${pageSize}&currentPage=1`);
        expect(res2.body.recordCount).toEqual( msgInChannelA.length );
        expect(res2.body.result.length).toEqual(pageSize);

        // currengPage exceeded the record count, should return empty
        const res3 = await agent.get(`/messages?channelId=${channelId}&pageSize=3&currentPage=${msgInChannelA.length}`);
        expect(res3.body.recordCount).toEqual( msgInChannelA.length );
        expect(res3.body.result.length).toEqual(0);
    })
})
