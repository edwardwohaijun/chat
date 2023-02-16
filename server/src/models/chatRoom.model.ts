import mongoose, { Schema, Model, Document } from "mongoose";
// import {IUser}

/*
  _id?: string;
  name: string;
  roomId: string;
  members: string[];
  lastMsg?: IMessage;
  draft?: string; 
*/

interface IChatRoomDocument extends Document {
  name: string;
  roomId: number;
  members: number[];
  // lastMsg?:
}
const chatRoomSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: false,
    },
    roomId: {
      type: Schema.Types.Number,
      required: true,
      unique: true,
    },
    members: {
      type: [Schema.Types.Number],
      required: true,
      default: [],
    },
  },
  {
    collection: "chatrooms",
    timestamps: true,
  }
);

const Chatroom: Model<IChatRoomDocument> = mongoose.model<IChatRoomDocument>(
  "Chatroom",
  chatRoomSchema
);

export { Chatroom, IChatRoomDocument };
