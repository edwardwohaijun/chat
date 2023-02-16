import mongoose, { Schema, Model, Document } from "mongoose";

interface IUserDocument extends Document {
  userId: number; // improvement: use the builtin ObjectId as userId
  nickname: string;
  avatar?: string;
}
const userSchema = new Schema(
  {
    userId: {
      type: Schema.Types.Number,
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
    isOnline: {
      // I need this to assign unused profile to newly logged user. It's not needed in real world app.
      type: Schema.Types.Boolean,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  userSchema
);

export { User, IUserDocument, userSchema };
