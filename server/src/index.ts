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
    // useCreateIndex: true,
  } as ConnectOptions);
  console.log("connected to mongoDB...");

  // const u: IUserDocument | null = await User.findOne({});
  // console.log("found one: ", u);
})();

socketService(io);

/*
mongoose.connect(
  "mongodb://127.0.0.1:27017/chat",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  } as ConnectOptions,
  () => {
    console.log("connected to mongoDB...");

    
    User.findOne({}).then((u: IUserDocument) => {
      console.log("got one: ", u);
    });
    
    // const u: IUserDocument =
    (async function () {
      const u = new User({ userId: 999, avatar: "999", nickname: "edward wo" });
      await u.save();
      // const user = await User.findOne();
      // console.log("newly creatd user: ", user);
    const users: IUserDocument[] = await User.find({});
    console.log("did you find it???");
    console.log("users: ", users);
    })();  
  }
);
*/

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
