import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  wallet: mongoose.Types.ObjectId;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallet' },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>('User', userSchema);
