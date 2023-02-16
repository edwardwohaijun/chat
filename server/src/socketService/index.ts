import { User, IUserDocument } from "../models/user.model";
import { Chatroom, IChatRoomDocument } from "../models/chatRoom.model";
import { Message, IMessageDocument } from "../models/message.model";

let ALL_USERS: IUserDocument[] = [];
(async () => {
  ALL_USERS = await User.find({});
})();

const socketService = (io: any) => {
  io.on("connection", function (socket: any) {
    (async () => {
      const profile: IUserDocument | null = await User.findOneAndUpdate(
        { isOnline: false },
        { isOnline: true },
        { returnDocument: "after" }
      ).select(["-isOnline"]); // 随机抽取一个没用到的user profile.

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

      socket.data.userId = profile?.userId;
      socket.emit("loginResponse", {
        profile,
        profileList: ALL_USERS,
        chatRoomList,
        messages: [],
      });
    })();

    socket.on("disconnect", async () => {
      console.log("user disconnected: ", socket.data.userId);
      await User.findOneAndUpdate(
        { userId: socket.data.userId },
        { isOnline: false }
      );

      // leave all the rooms
      // search " how to leave room after disconnect
      // how about attach a room list on socket.data.joinedRooms
      // socket.rooms 直接就有, 帅.
      // socket.join(['rom1', 'room2'])
      // socket.leave('room'), // string, not array of string.
    });
  });
};

export default socketService;
