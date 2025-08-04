// models/User.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  cartItems: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
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

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
