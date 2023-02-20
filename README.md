# Description

This is a simple chat app, implemented with socket.io as messaging service, MongoDB as storage.

# Prerequisite

Make sure you have MongoDB installed on http://127.0.0.1:27017
load the mock data in mongoDB by running:
This app is using the chat database, make sure your mongo doesn't have the same name DB.

```
cd chat/
mongorestore mongoDump
```

# Installation

```
git clone https://github.com/edwardwohaijun/chat
cd chat/server
npm install
npm run dev

cd chat/client
npm install
npm start
```

open http://localhost:3000/chat in Chrome browser.
