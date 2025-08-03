// models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  cartItems: Record<string, number>;
}

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItems: { type: Object, default: {} },
  },
  { 
    minimize: false,
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
