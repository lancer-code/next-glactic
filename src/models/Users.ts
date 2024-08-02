import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is Required"],
    trim: true,
    minlength: 4,
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Email is Required"],
    trim: true,
    match: [/.+\@.+\..+/, "Enter a valide Email"],
  },

  password: {
    type: String,
    required: [true, "Enter Password"],
  },

  verifyCode: {
    type: String,
    required: [true, "Verify Code is Required"],
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Exipry is Required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },

  messages: [MessageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;