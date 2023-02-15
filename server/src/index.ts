import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { HttpError } from "http-errors";
import * as socketio from "socket.io";
import bodyParser from "body-parser";
import { router } from "./routes/api";
import dotenv from "dotenv";
dotenv.config();

const options: cors.CorsOptions = {
  origin: ["http://localhost:3000"],
};
const app: Express = express();
app.use(cors(options));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(router);

const jsonErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode).send(err.message);
};
app.use(jsonErrorHandler);

var http = require("http").Server(app);
let io = require("socket.io")(http, {
  path: "/chat/socket.io/",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3030;

io.on("connection", function (socket: any) {
  console.log("a user connected");
  /*
  socket.on("message", (uid, gid) => {
    for (const user of userList) {
      if (gid === user.gid) io.to(user.sid).emit("fetch messages", gid);
    }
  });

  socket.on("disconnect", () => {
    for (let i = 0; i < userList.length; i++) {
      if (socket.id === userList[i].sid) userList.splice(i, 1);
    }
  });
  */
});

if (process.env.NODE_ENV !== "test") {
  const server = http.listen(port, function () {
    console.log("port/env: ", port, "//", process.env.NODE_ENV);
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });
}

mongoose.connect("mongodb://localhost:27017/chat", () => {
  console.log("connected to mongoDB");
});

/*
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });  
}
*/

module.exports = app;
