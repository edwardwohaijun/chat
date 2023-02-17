import express, { Express, Request, Response, NextFunction } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import { HttpError } from "http-errors";
import * as socketio from "socket.io";
import bodyParser from "body-parser";
import { router } from "./routes/api";
import { User, IUserDocument } from "./models/user.model";
import socketService from "./socketService";

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

/*
app.use((req, res, next) => {
  req.io = io;
  return next();
});
*/

(async function () {
  await mongoose.connect("mongodb://127.0.0.1:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false, // 'true' would cause auto index-generation of subdocument.
    // since indexed fields must be unique, the above option doesn't allow documents with same duplicated subdocument fields
  } as ConnectOptions);
  console.log("connected to mongoDB...");
  // when app start, reset all online to false, otherwise, those fake 'online' users still hold the account.
  await User.updateMany({}, { $set: { isOnline: false } });

  // const u: IUserDocument | null = await User.findOne({});
  // console.log("found one: ", u);
})();

socketService(io);

if (process.env.NODE_ENV !== "test") {
  const server = http.listen(port, function () {
    console.log("port/env: ", port, "//", process.env.NODE_ENV);
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });
}

/*
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });  
}
*/

module.exports = app;
