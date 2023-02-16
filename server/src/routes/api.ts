import createHttpError from "http-errors";
import { User, IUserDocument } from "../models/user.model";
import express, { Express, Request, Response, NextFunction } from "express";
const router = express.Router();

import {
  createChannel,
  listChannels,
  writeMessage,
  listMessagesInChannel,
} from "../model";

let ALL_USERS: IUserDocument[] = [];

(async () => {
  ALL_USERS = await User.find({});
})();

router.post(
  "/chat/api/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const user: IUserDocument | null = await User.findOneAndUpdate(
      { isOnline: false },
      { isOnline: true },
      { returnDocument: "after" }
    ).select(["-isOnline"]); // 随机抽取一个没用到的user profile.
    console.log("found one in /login: ", ALL_USERS);
    res.send({ profileList: ALL_USERS, profile: user });
  }
);

router.post(
  "/chat/api/logout",
  (req: Request, res: Response, next: NextFunction): void => {
    res.send("ok");
  }
);

/*
router.get(
  "/messages",
  (req: Request, res: Response, next: NextFunction): void => {
    let channelId = req.query.channelId as string;
    let currentPage = req.query.currentPage as string;
    let pageSize = req.query.pageSize as string;

    let [isOk, result] = listMessagesInChannel(
      channelId,
      currentPage,
      pageSize
    );
    if (isOk) {
      res.send(result);
      return;
    }
    const error = createHttpError(400, result);
    next(error);
  }
);

router.get(
  "/channels",
  (req: Request, res: Response, next: NextFunction): void => {
    res.send(listChannels());
  }
);

router.post(
  "/channel",
  (req: Request, res: Response, next: NextFunction): void => {
    let [isOk, result] = createChannel(req.body.name);
    if (isOk) {
      res.send(result);
      return;
    }
    const error = createHttpError(400, result);
    next(error);
  }
);

router.post(
  "/message",
  (req: Request, res: Response, next: NextFunction): any => {
    const { title, content, channel } = req.body;
    let [isOk, msg] = writeMessage(title, content, channel);
    if (isOk) {
      res.send(msg);
      return;
    }
    const error = createHttpError(400, msg);
    next(error);
  }
);
*/

export { router };
