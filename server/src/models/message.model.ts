import mongoose, { Schema, Model } from "mongoose";
import { IUserDocument, userSchema } from "./user.model";

interface IMessageDocument {
  roomId: number;
  messageId: string;
  senderProfile: IUserDocument;
  mentions?: [number];
  sentAt: string;
  content: string;
  type: "TEXT" | "PHOTO" | "FILE";
}
const messageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.Number,
      required: true,
      unique: true,
    },
    messageId: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    senderProfile: userSchema,
    sentAt: {
      type: Schema.Types.String,
      required: false,
    },
    content: {
      type: Schema.Types.String,
      required: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: "messages",
    timestamps: true,
  }
);

const Message: Model<IMessageDocument> = mongoose.model<IMessageDocument>(
  "Message",
  messageSchema
);

export { Message, IMessageDocument };
