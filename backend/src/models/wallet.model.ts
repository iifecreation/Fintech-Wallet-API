import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  walletId: string;
  balance: number;
  user: mongoose.Types.ObjectId;
}

const walletSchema = new Schema<IWallet>(
  {
    walletId: { type: String, unique: true, required: true },
    balance: { type: Number, default: 0, unique: true, },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);
