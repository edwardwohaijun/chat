import createHttpError from "http-errors";
import { User, IUserDocument } from "../models/user.model";
import express, { Express, Request, Response, NextFunction } from "express";
const router = express.Router();

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

export { router };
