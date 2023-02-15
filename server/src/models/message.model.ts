import mongoose, { Schema, Model } from "mongoose";

interface UserDocument {
  userId: string;
  nickname: string;
  avatar: string;
}
const userSchema = new Schema(
  {
    userId: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    nickname: {
      type: Schema.Types.String,
      required: true,
      unique: false,
    },
    avatar: {
      type: Schema.Types.String,
      required: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema
);

export { User, UserDocument };
