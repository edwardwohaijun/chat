import mongoose from "mongoose";
import { User, IUserDocument } from "../models/user.model";
import { Chatroom, IChatRoomDocument } from "../models/chatRoom.model";
import { Message, IMessageDocument } from "../models/message.model";

let ALL_USERS: IUserDocument[] = [];
(async () => {
  ALL_USERS = await User.find({});
})();

const socketService = (io: any) => {
  io.on("connection", function (socket: any) {
    console.log("socket connected: ");
    (async () => {
      const profile: IUserDocument | null = await User.findOneAndUpdate(
        { isOnline: false },
        { isOnline: true },
        { returnDocument: "after" }
      ).select(["-isOnline"]); // 随机抽取一个没用到的user profile.

      console.log("profile: ", profile);

      if (profile == null) {
        socket.emit("loginResponse", null);
        return;
      }

      console.log(
        "a user connected with assigned name/id: ",
        profile?.nickname,
        "//",
        profile?.userId
      );

      // get list of chatRooms this user belongs to
      const chatRoomList: IChatRoomDocument[] = await Chatroom.find({
        members: { $in: [profile.userId] },
      });
      // join the new user in these chatRooms(roomId as room name)
      socket.join(chatRoomList.map((r) => r.roomId.toString()));
      console.log("joined room by this socket: ", socket.rooms);

      // get the latest 100 message, sorted by submission,
      /*
      let msgList: IMessageDocument[] = await Message.find({}).sort({
        createdAt: 1,
      });
      */

      const msgList = await Message.find({}).populate("quote").exec();

      socket.data.userId = profile?.userId;
      socket.emit("loginResponse", {
        profile,
        profileList: ALL_USERS,
        chatRoomList,
        messages: msgList,
      });
    })();

    socket.on("newMessage", async (m: any) => {
      console.log("new msg: ", m);
      let _id = new mongoose.Types.ObjectId();
      console.log("i created a _id: ", _id);
      m._id = _id;
      socket.emit("newMessageId", { old: "messageId", new: _id });
      socket.to(m.roomId.toString()).emit("newMessage", m);
      if (m.quote != null) {
        m.quote = m.quote._id;
      }
      let msg = new Message(m);
      await msg.save();
    });

    socket.on("disconnect", async () => {
      // disconnected socket will auto leave rooms.
      console.log("user disconnected: ", socket.data.userId);
      await User.findOneAndUpdate(
        { userId: socket.data.userId },
        { isOnline: false }
      );
    });
  });
};

export default socketService;
