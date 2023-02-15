# Description
This simple API server allows users to create channels, and post message into them.

# Installation
## Prerequisite
NodeJS v8 and above for local build. For docker user, just use the latest docker.
```
git clone https://github.com/edwardwohaijun/forum-API
cd forum-API
npm install
npm run dev
```
For production build, `npm run build`, then deploy the **dist/** folder on a web server, then run `node dist/index.js`.

To be implemented: use pm2 or other daemon monitor to manage the server instance.
## Deploy via Docker
```
docker build . -t forum-api
docker run -p 8000:8000 -d forum-api
```
Run `docker ps` to make sure the container is running.

By default, the server runs on port 8000.

# Usage
Use postman or other client tool to make the API calls.
## create a channel
### Request
POST /channel
```
curl -i -H 'Accept: application/json' -d 'name=channelABC' http://localhost:8000/channel
```
### Parameter requirements
**name** should NOT exceed 10 characters long, otherwise 400 bad request is returned.
### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 65
ETag: W/"41-a6N/QRnpaT/X/sEFSE4qJhGedho"
Date: Fri, 11 Nov 2022 08:34:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
    "id":"01c1bf08-4b22-4fae-a6e2-c52e45c10e9e",
    "name":"channelABC"
}
```
## write a message in a channel
### Request
POST /message
```
curl -i -H 'Accept: application/json' -d 'title=titleABC&content=contentABC&channel=channelA' http://localhost:8000/message
```
### Parameter requirements
- **title** should NOT exceed 10 characters long, 
- **content** should NOT exceed 20 characters longs,
- **channel** should be an existing channel Id.
### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 147
ETag: W/"93-RyQHKiQe7LARXUJfaUFZqGsXBGw"
Date: Fri, 11 Nov 2022 08:39:44 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
    "id":"41f4a71d-28c0-48e0-b64a-6c15d951d7da",
    "title":"titleABC",
    "content":"contentABC",
    "channel":"channelA",
    "createdAt":"2022-11-11T08:39:44.513Z"
}
```
## get a list of channels
### Request
GET /channels
```
curl -i -H 'Accept: application/json'  http://localhost:8000/channels
```
### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 178
ETag: W/"b2-bSaVtvA6fWF1vJuRGVDEAvQ8jrk"
Date: Fri, 11 Nov 2022 08:47:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[
    {"id":"channelA","name":"channel A"},
    {"id":"channelB","name":"channel B"},
    {"id":"channelC","name":"channel C"},
    {"id":"01c1bf08-4b22-4fae-a6e2-c52e45c10e9e","name":"channelABC"}
]
```

## get messages in a channel
### Request
GET /messages
```
curl -i -H 'Accept: application/json' http://localhost:8000/messages?channelId=channelA&currentPage=1&pageSize=2
```
### Parameter requirements
**channelId** should be an existing channel Id. The result is paginated by:
- **pageSize**: a number indicating the number of records(default is 2)
- **currentPage**: a number indicating the current page(default is 1)
### Response
```
{
    "recordCount": 8,
    "pageSize": 2,
    "currentPage": 1,
    "result": [
        {
            "id": "41f4a71d-28c0-48e0-b64a-6c15d951d7da",
            "title": "titleABC",
            "content": "contentABC",
            "channel": "channelA",
            "createdAt": "2022-11-11T08:39:44.513Z",
            "channelName": "channel A"
        },
        {
            "id": "6c58978b-4f00-4d10-b1ea-02043b702809",
            "title": "title6",
            "content": "contentAA",
            "channel": "channelA",
            "createdAt": "2022-11-10T00:00:00.000Z",
            "channelName": "channel A"
        }
    ]
}
```
## Test
`npm run test`
