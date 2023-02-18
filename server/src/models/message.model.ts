import mongoose, { Schema, Model } from "mongoose";
import { IUserDocument, userSchema } from "./user.model";

interface IMessageDocument {
  roomId: number;
  messageId: string;
  senderProfile: IUserDocument;
  mentions?: [number];
  quote?: IMessageDocument;
  sentAt: string;
  content: string;
  type: "TEXT" | "PHOTO" | "FILE";
}
const messageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.Number,
      required: true,
      unique: false,
    },
    messageId: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    senderProfile: {
      type: userSchema,
      required: true,
      unique: false,
    },
    mentions: {
      type: [Schema.Types.Number],
      required: false,
      default: [],
    },
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // embed another msg in current msg.
      required: false,
    },
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
